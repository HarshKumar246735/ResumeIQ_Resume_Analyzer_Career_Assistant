'use strict';
const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    resumeTitle: { type: String, maxlength: 120 }, // snapshot, so history survives resume deletion
    jobTitle: { type: String, trim: true, maxlength: 120, default: '' },
    companyName: { type: String, trim: true, maxlength: 120, default: '' },
    jobDescription: { type: String, required: true, maxlength: 15000 },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    scoreBreakdown: { type: mongoose.Schema.Types.Mixed, required: true },
    matchedSkills: [String],
    missingSkills: [String],
    matchedKeywords: [String],
    missingKeywords: [String],
    strengths: [String],
    recommendations: [String],
    analysisMethod: { type: String, enum: ['rule-based', 'ai-assisted'], default: 'rule-based' },
  },
  { timestamps: true }
);
analysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ResumeAnalysis', analysisSchema);
