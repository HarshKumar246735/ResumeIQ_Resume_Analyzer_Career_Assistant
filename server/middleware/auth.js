'use strict';
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.token;
  if (!token) throw new AppError('Please log in to continue.', 401);
  let payload;
  try { payload = jwt.verify(token, env.jwtSecret); } catch { throw new AppError('Your session has expired. Please log in again.', 401); }
  const user = await User.findById(payload.sub);
  if (!user || user.status !== 'active') throw new AppError('Your session is no longer valid.', 401);
  req.user = user;
  next();
});

// Role always comes from the database record, never from the request.
exports.requireRole = (...roles) => (req, _res, next) =>
  roles.includes(req.user?.role) ? next() : next(new AppError('You do not have permission to do that.', 403));
