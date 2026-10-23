'use strict';
// Deterministic, explainable resume-vs-job scoring. Not a real ATS score.
const WEIGHTS = { skills: 35, keywords: 25, sections: 15, experience: 15, formatting: 10 };

const SKILLS = {
  javascript: ['javascript', 'js', 'ecmascript'],
  typescript: ['typescript', 'ts'],
  react: ['react', 'reactjs', 'react.js'],
  'node.js': ['node.js', 'nodejs', 'node js', 'node'],
  express: ['express', 'expressjs', 'express.js'],
  mongodb: ['mongodb', 'mongo db', 'mongo'],
  sql: ['sql', 'mysql', 'postgresql', 'postgres'],
  python: ['python'],
  java: ['java'],
  git: ['git', 'github'],
  docker: ['docker'],
  kubernetes: ['kubernetes', 'k8s'],
  aws: ['aws', 'amazon web services'],
  'rest apis': ['rest', 'rest api', 'rest apis', 'restful'],
  graphql: ['graphql'],
  html: ['html', 'html5'],
  css: ['css', 'css3'],
  'ci/cd': ['ci/cd', 'cicd', 'continuous integration'],
  agile: ['agile', 'scrum'],
};

const SECTIONS = {
  summary: /\b(summary|profile|objective)\b/i,
  experience: /\b(experience|employment|internship)\b/i,
  education: /\b(education|university|b\.?tech|bachelor|master)\b/i,
  skills: /\bskills?\b/i,
  projects: /\bprojects?\b/i,
};

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
const norm = (t) => String(t || '').toLowerCase().replace(/\s+/g, ' ').trim();
// Boundary match: "java" must not match "javascript", "go" not "google".
const has = (text, term) =>
  new RegExp(`(?<![a-z0-9+#])${esc(term)}(?![a-z0-9+#])`, 'i').test(text);
const findSkills = (text) => {
  const t = norm(text);
  return Object.keys(SKILLS).filter((k) => SKILLS[k].some((a) => has(t, a)));
};

function analyze({ resumeText, jobDescription, jobTitle = '' }) {
  const resume = norm(resumeText);
  const jd = norm(jobDescription);
  if (resume.length < 50) throw Object.assign(new Error('Resume text is empty or too short.'), { status: 422 });
  if (jd.length < 50) throw Object.assign(new Error('Job description is too short (min 50 chars).'), { status: 422 });

  const jdSkills = findSkills(jd);
  const resSkills = findSkills(resume);
  const matched = jdSkills.filter((s) => resSkills.includes(s));
  const missing = jdSkills.filter((s) => !resSkills.includes(s));
  // If the JD names no known skills, the category can't be assessed: award neutral credit.
  const skillRatio = jdSkills.length ? matched.length / jdSkills.length : null;

  const stop = new Set('the and for with you will our are this that have from your able work team years year experience about their they who can all any more such into'.split(' '));
  const kw = [...new Set(jd.match(/[a-z][a-z+#.]{3,}/g) || [])].filter((w) => !stop.has(w));
  const kwFound = kw.filter((w) => has(resume, w));
  const kwMissing = kw.filter((w) => !has(resume, w)).slice(0, 15);
  const kwRatio = kw.length ? kwFound.length / kw.length : null;

  const present = Object.entries(SECTIONS).filter(([, re]) => re.test(resumeText)).map(([k]) => k);
  const sectionRatio = present.length / Object.keys(SECTIONS).length;

  const bullets = (String(resumeText).match(/^\s*[-•*]/gm) || []).length;
  const hasNumbers = /\d+\s*(%|\+|users|x|k\b)/i.test(resume);
  const titleHit = jobTitle && norm(jobTitle).split(' ').some((w) => w.length > 3 && has(resume, w));
  const expRatio = (Number(bullets >= 3) * 0.4) + (Number(hasNumbers) * 0.3) + (Number(!!titleHit || !jobTitle) * 0.3);

  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.]+/.test(resumeText);
  const fmtRatio = (Number(hasEmail) * 0.4) + (Number(bullets > 0) * 0.3) + (Number(resume.length > 300 && resume.length < 12000) * 0.3);

  const part = (ratio, w) => (ratio === null ? Math.round(w * 0.5) : Math.round(ratio * w));
  const breakdown = {
    skills: { score: part(skillRatio, WEIGHTS.skills), max: WEIGHTS.skills, note: skillRatio === null ? 'No recognised skills in job description; neutral credit.' : `${matched.length}/${jdSkills.length} job skills found.` },
    keywords: { score: part(kwRatio, WEIGHTS.keywords), max: WEIGHTS.keywords, note: `${kwFound.length}/${kw.length} job keywords found.` },
    sections: { score: part(sectionRatio, WEIGHTS.sections), max: WEIGHTS.sections, note: `Sections detected: ${present.join(', ') || 'none'}.` },
    experience: { score: part(expRatio, WEIGHTS.experience), max: WEIGHTS.experience, note: `Bullets: ${bullets}; quantified results: ${hasNumbers ? 'yes' : 'no'}.` },
    formatting: { score: part(fmtRatio, WEIGHTS.formatting), max: WEIGHTS.formatting, note: hasEmail ? 'Contact email detected.' : 'No email detected.' },
  };
  const overall = Object.values(breakdown).reduce((a, b) => a + b.score, 0);
  const recommendations = [];
  if (missing.length) recommendations.push(`If you have experience with ${missing.join(', ')}, state it explicitly. Missing from extracted text does not mean you lack the skill.`);
  if (!hasNumbers) recommendations.push('Add measurable results you can verify to your bullets.');
  Object.keys(SECTIONS).filter((s) => !present.includes(s)).forEach((s) => recommendations.push(`Add a clear "${s}" section.`));

  return {
    overallScore: overall, scoreBreakdown: breakdown,
    matchedSkills: matched, missingSkills: missing,
    matchedKeywords: kwFound.slice(0, 30), missingKeywords: kwMissing,
    strengths: matched.length ? [`Resume mentions ${matched.join(', ')}, which the job asks for.`] : [],
    recommendations, analysisMethod: 'rule-based', analyzedAt: new Date().toISOString(),
  };
}
module.exports = { analyze, findSkills, WEIGHTS };
