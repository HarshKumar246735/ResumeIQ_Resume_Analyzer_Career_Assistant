'use strict';
const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { analyze } = require('../services/analysisEngine');
const { createAnalysisSchema } = require('../validators/analysisSchemas');

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.create = asyncHandler(async (req, res) => {
  const input = createAnalysisSchema.parse(req.body);
  const resume = await Resume.findOne({ _id: input.resumeId, userId: req.user._id });
  if (!resume) throw new AppError('Resume not found.', 404);
  const result = analyze({ resumeText: resume.extractedText, jobDescription: input.jobDescription, jobTitle: input.jobTitle });
  const doc = await ResumeAnalysis.create({
    userId: req.user._id, resumeId: resume._id, resumeTitle: resume.title,
    jobTitle: input.jobTitle, companyName: input.companyName, jobDescription: input.jobDescription,
    overallScore: result.overallScore, scoreBreakdown: result.scoreBreakdown,
    matchedSkills: result.matchedSkills, missingSkills: result.missingSkills,
    matchedKeywords: result.matchedKeywords, missingKeywords: result.missingKeywords,
    strengths: result.strengths, recommendations: result.recommendations, analysisMethod: result.analysisMethod,
  });
  res.status(201).json({ success: true, analysis: doc });
});

exports.list = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const filter = { userId: req.user._id };
  const q = String(req.query.q || '').trim().slice(0, 80);
  if (q) { const re = new RegExp(escapeRe(q), 'i'); filter.$or = [{ jobTitle: re }, { companyName: re }, { resumeTitle: re }]; }
  const sort = { score: { overallScore: -1 }, oldest: { createdAt: 1 } }[req.query.sort] || { createdAt: -1 };
  const [items, total] = await Promise.all([
    ResumeAnalysis.find(filter).select('-jobDescription').sort(sort).skip((page - 1) * limit).limit(limit),
    ResumeAnalysis.countDocuments(filter),
  ]);
  res.json({ success: true, items, page, total, pages: Math.ceil(total / limit) });
});

const owned = async (req) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError('Invalid analysis ID.', 400);
  const doc = await ResumeAnalysis.findOne({ _id: req.params.id, userId: req.user._id });
  if (!doc) throw new AppError('Analysis not found.', 404);
  return doc;
};
exports.get = asyncHandler(async (req, res) => res.json({ success: true, analysis: await owned(req) }));
exports.remove = asyncHandler(async (req, res) => { await (await owned(req)).deleteOne(); res.json({ success: true }); });

exports.overview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const [totalResumes, totalAnalyses, avg, latest] = await Promise.all([
    Resume.countDocuments({ userId }),
    ResumeAnalysis.countDocuments({ userId }),
    ResumeAnalysis.aggregate([{ $match: { userId } }, { $group: { _id: null, avg: { $avg: '$overallScore' } } }]),
    ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 }).select('-jobDescription'),
  ]);
  res.json({ success: true, data: { totalResumes, totalAnalyses, averageScore: avg[0] ? Math.round(avg[0].avg) : 0, latest } });
});
