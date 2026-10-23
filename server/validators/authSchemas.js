'use strict';
const { z } = require('zod');

const email = z.string().trim().toLowerCase().email().max(254);
const password = z.string().min(8).max(128).regex(/[a-zA-Z]/, 'Needs a letter').regex(/\d/, 'Needs a number');

// Unknown keys (such as "role") are stripped by default, so users cannot set their own role.
exports.registerSchema = z.object({ name: z.string().trim().min(2).max(80), email, password });
exports.loginSchema = z.object({ email, password: z.string().min(1).max(128) });
