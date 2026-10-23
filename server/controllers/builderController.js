'use strict';
const mongoose = require('mongoose');
const BuilderResume = require('../models/BuilderResume');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { createBuilderSchema, updateBuilderSchema } = require('../validators/builderSchemas');

const owned = async (req) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new AppError('Invalid resume ID.', 400);
  const doc = await BuilderResume.findOne({ _id: req.params.id, userId: req.user._id });
  if (!doc) throw new AppError('Resume not found.', 404);
  return doc;
};

exports.create = asyncHandler(async (req, res) => {
  const data = createBuilderSchema.parse(req.body);
  // Pre-fill only the user's own account details.
  data.content.personal.name = data.content.personal.name || req.user.name;
  data.content.personal.email = data.content.personal.email || req.user.email;
  const doc = await BuilderResume.create({ ...data, userId: req.user._id });
  res.status(201).json({ success: true, resume: doc });
});

exports.list = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
  const filter = { userId: req.user._id };
  const [items, total] = await Promise.all([
    BuilderResume.find(filter).select('title template accent updatedAt createdAt').sort({ updatedAt: -1 }).skip((page - 1) * limit).limit(limit),
    BuilderResume.countDocuments(filter),
  ]);
  res.json({ success: true, items, page, total, pages: Math.ceil(total / limit) });
});

exports.get = asyncHandler(async (req, res) => res.json({ success: true, resume: await owned(req) }));

exports.update = asyncHandler(async (req, res) => {
  const doc = await owned(req);
  const data = updateBuilderSchema.parse(req.body);
  Object.assign(doc, data);
  if (data.content) doc.markModified('content');
  await doc.save();
  res.json({ success: true, resume: doc });
});

exports.remove = asyncHandler(async (req, res) => { await (await owned(req)).deleteOne(); res.json({ success: true }); });
