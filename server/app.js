'use strict';
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const env = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiters');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('env.isProd:', env.isProd);

// Render runs behind a reverse proxy.
if (env.isProd) {
  app.set('trust proxy', 1);
} // Render sits behind a proxy
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) =>
  res.json({ success: true, status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

app.use('/api', apiLimiter);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/builder', require('./routes/builderRoutes'));
app.use('/api/analysis', require('./routes/analysisRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.use(notFound);
app.use(errorHandler);
module.exports = app;
