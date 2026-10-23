'use strict';
const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { extractText } = require('../services/resumeParser');
const { extract } = require('../services/resumeExtractor');

const owned = async (req) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError('Invalid resume ID.', 400);
  const doc = await Resume.findOne({ _id: req.params.id, userId: req.user._id }); // ownership enforced in the query
  if (!doc) throw new AppError('Resume not found.', 404);
  return doc;
};

exports.upload = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Please choose a PDF or DOCX file to upload.', 400);
  const name = req.file.originalname.replace(/[^\w.\- ]/g, '_').slice(0, 150);
  const text = await extractText(req.file.buffer, name);
  const resume = await Resume.create({
    userId: req.user._id,
    title: String(req.body.title || name.replace(/\.[^.]+$/, '')).slice(0, 120),
    sourceFileName: name,
    extractedText: text.slice(0, 60000),
    structuredContent: extract(text),
  });
  res.status(201).json({ success: true, resume });
});

exports.list = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const filter = { userId: req.user._id };
  const [items, total] = await Promise.all([
    Resume.find(filter).select('-extractedText').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Resume.countDocuments(filter),
  ]);
  res.json({ success: true, items, page, total, pages: Math.ceil(total / limit) });
});

exports.get = asyncHandler(async (req, res) => res.json({ success: true, resume: await owned(req) }));

exports.update = asyncHandler(async (req, res) => {
  const doc = await owned(req);
  if (typeof req.body.title === 'string' && req.body.title.trim()) doc.title = req.body.title.trim().slice(0, 120);
  if (req.body.structuredContent && typeof req.body.structuredContent === 'object') {
    doc.structuredContent = { ...doc.structuredContent, ...req.body.structuredContent };
    doc.markModified('structuredContent');
  }
  await doc.save();
  res.json({ success: true, resume: doc });
});

exports.remove = asyncHandler(async (req, res) => {
  const doc = await owned(req);
  await doc.deleteOne();
  res.json({ success: true });
});
