'use strict';
const { z } = require('zod');

const s = (n) => z.string().trim().max(n).default('');
const list = (shape) => z.array(z.object(shape)).max(20).default([]);

const content = z.object({
  personal: z.object({ name: s(80), headline: s(120), email: s(120), phone: s(40), location: s(80), links: s(300) }).default({}),
  summary: s(1200),
  skills: s(800),
  experience: list({ role: s(100), company: s(100), location: s(80), start: s(30), end: s(30), bullets: s(2000) }),
  projects: list({ name: s(100), link: s(200), tech: s(200), bullets: s(1500) }),
  education: list({ school: s(120), degree: s(120), start: s(30), end: s(30), details: s(500) }),
  certifications: list({ name: s(120), issuer: s(100), year: s(10) }),
});

const base = z.object({
  title: z.string().trim().min(1).max(120),
  template: z.enum(['minimal', 'modern', 'classic', 'compact']),
  accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  fontSize: z.enum(['small', 'medium', 'large']),
  hidden: z.array(z.enum(['summary', 'skills', 'experience', 'projects', 'education', 'certifications'])).max(6),
  content,
});

exports.createBuilderSchema = base.partial({ template: true, accent: true, fontSize: true, hidden: true, content: true })
  .transform((v) => ({ template: 'minimal', accent: '#7c4dff', fontSize: 'medium', hidden: [], content: content.parse({}), ...v }));
exports.updateBuilderSchema = base.partial();
