'use strict';
const { z } = require('zod');

exports.createAnalysisSchema = z.object({
  resumeId: z.string().regex(/^[a-f\d]{24}$/i, 'Choose a valid resume'),
  jobTitle: z.string().trim().max(120).optional().default(''),
  companyName: z.string().trim().max(120).optional().default(''),
  jobDescription: z.string().trim().min(50, 'Paste the full job description (at least 50 characters).').max(15000),
});
