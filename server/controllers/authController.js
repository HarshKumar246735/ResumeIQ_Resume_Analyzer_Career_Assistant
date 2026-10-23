'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { registerSchema, loginSchema } = require('../validators/authSchemas');

// Cross-site (Vercel -> Render) cookies need SameSite=None + Secure in production.
const cookieOptions = () => ({
  httpOnly: true,
  secure: env.isProd,
  sameSite: env.isProd ? 'none' : 'lax',
  path: '/',
});
const DAY = 24 * 60 * 60 * 1000;
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 12);

function issue(res, user) {
  const token = jwt.sign({ sub: user._id.toString() }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  res.cookie('token', token, { ...cookieOptions(), maxAge: 7 * DAY });
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body);
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12) });
  issue(res, user);
  res.status(201).json({ success: true, user: user.toPublic() });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email }).select('+passwordHash');
  const ok = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  if (!user || !ok) throw new AppError('Incorrect email or password.', 401);
  if (user.status !== 'active') throw new AppError('This account is suspended.', 403);
  issue(res, user);
  res.json({ success: true, user: user.toPublic() });
});

exports.logout = (_req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ success: true });
};

exports.me = (req, res) => res.json({ success: true, user: req.user.toPublic() });
