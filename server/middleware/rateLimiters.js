'use strict';
const rateLimit = require('express-rate-limit');

const make = (windowMin, max, message) =>
  rateLimit({ windowMs: windowMin * 60 * 1000, max, standardHeaders: true, legacyHeaders: false, message: { success: false, message } });

exports.authLimiter = make(15, 20, 'Too many attempts. Please try again in a few minutes.');
exports.apiLimiter = make(15, 300, 'Too many requests. Please slow down.');
