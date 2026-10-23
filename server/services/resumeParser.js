'use strict';
const AppError = require('../utils/AppError');

const isPdf = (b) => b.length > 5 && b.subarray(0, 5).toString('latin1') === '%PDF-';
const isZip = (b) => b.length > 4 && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;

// Validates the real file signature (never trusts client MIME) and extracts text. Files are never written to disk.
async function extractText(buffer, originalName) {
  const ext = (originalName.split('.').pop() || '').toLowerCase();
  let text = '';
  try {
    if (ext === 'pdf') {
      if (!isPdf(buffer)) throw new AppError('This file is not a valid PDF.', 415);
      text = (await require('pdf-parse')(buffer)).text;
    } else if (ext === 'docx') {
      if (!isZip(buffer)) throw new AppError('This file is not a valid DOCX.', 415);
      text = (await require('mammoth').extractRawText({ buffer })).value;
    } else {
      throw new AppError('Only PDF and DOCX files are supported.', 415);
    }
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError('We could not read this document. It may be corrupted or password-protected.', 422);
  }
  text = text.replace(/\u0000/g, '').trim();
  if (text.length < 50) {
    throw new AppError('No readable text was found. If this is a scanned PDF, note that OCR is not supported. Please upload a text-based PDF or DOCX.', 422);
  }
  return text;
}
module.exports = { extractText, isPdf, isZip };
