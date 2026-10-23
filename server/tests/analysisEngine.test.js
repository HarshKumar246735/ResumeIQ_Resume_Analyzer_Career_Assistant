const test = require('node:test');
const assert = require('node:assert');
const { analyze, findSkills } = require('../services/analysisEngine');

const resume = `Jane Doe jane@x.com\nSummary\nFull stack dev\nSkills\nJavaScript, ReactJS, NodeJS, MongoDB, Git\nExperience\n- Built REST APIs serving 10000 users\n- Reduced load time by 40%\n- Shipped features weekly\nProjects\nPortfolio\nEducation\nB.Tech`;
const jd = 'We need a developer with JavaScript, React, Node.js, MongoDB, Docker and Kubernetes experience building APIs.';

test('aliases match', () => {
  const s = findSkills('ReactJS and NodeJS and JS');
  assert.ok(s.includes('react') && s.includes('node.js') && s.includes('javascript'));
});
test('java does not match javascript', () => {
  assert.deepStrictEqual(findSkills('I know javascript'), ['javascript']);
});
test('partial match finds missing skills', () => {
  const r = analyze({ resumeText: resume, jobDescription: jd });
  assert.deepStrictEqual(r.missingSkills.sort(), ['docker', 'kubernetes']);
  assert.ok(r.overallScore > 0 && r.overallScore <= 100);
  assert.strictEqual(r.analysisMethod, 'rule-based');
});
test('scores differ by resume', () => {
  const a = analyze({ resumeText: resume, jobDescription: jd }).overallScore;
  const b = analyze({ resumeText: 'Bob with cooking and gardening hobbies and nothing else relevant at all here.', jobDescription: jd }).overallScore;
  assert.ok(a > b);
});
test('empty inputs rejected', () => {
  assert.throws(() => analyze({ resumeText: '', jobDescription: jd }), /too short/);
  assert.throws(() => analyze({ resumeText: resume, jobDescription: '' }), /too short/);
});
