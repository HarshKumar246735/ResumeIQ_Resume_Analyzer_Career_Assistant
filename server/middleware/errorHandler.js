'use strict';
const { ZodError } = require('zod');
const env = require('../config/env');

exports.notFound = (req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, _next) => {
  let status = err.status || 500;
  let message = err.message;
  let details = err.details;
  if (err instanceof ZodError) {
    status = 400; message = 'Please check the highlighted fields.';
    details = Object.fromEntries(err.issues.map((i) => [i.path.join('.') || 'form', i.message]));
  } else if (err.code === 11000) { status = 409; message = 'An account with this email already exists.'; }
  else if (err.code === 'LIMIT_FILE_SIZE') { status = 413; message = `File is too large. Maximum size is ${env.maxFileMb} MB.`; }
  else if (err.name === 'CastError') { status = 400; message = 'Invalid ID.'; }
  if (status >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err.message); // never log bodies or tokens
    if (env.isProd) message = 'Something went wrong on our side.';
  }
  res.status(status).json({ success: false, message, ...(details && { details }) });
};
