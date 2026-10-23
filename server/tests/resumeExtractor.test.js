const test = require('node:test');
const assert = require('node:assert');
const { extract } = require('../services/resumeExtractor');
const { isPdf, isZip } = require('../services/resumeParser');

const text = `Jane Doe\njane.doe@example.com | +91 98765 43210\nSummary\nFull stack developer.\nSkills\nJavaScript, ReactJS, MongoDB\nProjects\nPortfolio site\nEducation\nB.Tech Computer Science`;

test('extracts contact details and sections', () => {
  const r = extract(text);
  assert.strictEqual(r.name, 'Jane Doe');
  assert.strictEqual(r.email, 'jane.doe@example.com');
  assert.ok(r.phone && r.phone.replace(/\D/g, '').length >= 10);
  assert.ok(r.skills.includes('react') && r.skills.includes('mongodb'));
  assert.strictEqual(r.education, 'B.Tech Computer Science');
});
test('missing information stays null, not invented', () => {
  const r = extract('Some random text without any structure at all, just a sentence.');
  assert.strictEqual(r.email, null);
  assert.strictEqual(r.experience, null);
  assert.strictEqual(r.certifications, null);
});
test('file signatures', () => {
  assert.ok(isPdf(Buffer.from('%PDF-1.7 ...')));
  assert.ok(!isPdf(Buffer.from('MZ not a pdf')));
  assert.ok(isZip(Buffer.from([0x50, 0x4b, 0x03, 0x04, 0])));
  assert.ok(!isZip(Buffer.from('plain text')));
});
