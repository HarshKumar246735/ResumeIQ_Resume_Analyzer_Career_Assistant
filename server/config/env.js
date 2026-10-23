'use strict';
require('dotenv').config();

const missing = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}. Copy server/.env.example to server/.env and fill them in.`);
  process.exit(1);
}
if (process.env.JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be at least 32 characters.');
  process.exit(1);
}

module.exports = {
  port: Number(process.env.PORT) || 5000,
  isProd: process.env.NODE_ENV === 'production',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL.replace(/\/$/, ''),
  maxFileMb: Number(process.env.MAX_FILE_SIZE_MB) || 5,
};
