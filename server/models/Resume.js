'use strict';
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    sourceFileName: { type: String, maxlength: 200 },
    extractedText: { type: String, required: true, maxlength: 60000 },
    structuredContent: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);
resumeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
