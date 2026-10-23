'use strict';
const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    template: { type: String, enum: ['minimal', 'modern', 'classic', 'compact'], default: 'minimal' },
    accent: { type: String, default: '#7c4dff' },
    fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
    hidden: [String],
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);
schema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('BuilderResume', schema);
