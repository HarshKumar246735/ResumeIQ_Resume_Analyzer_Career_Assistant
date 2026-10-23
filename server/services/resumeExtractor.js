'use strict';
// Pure, best-effort structured extraction. Anything not found stays null/empty; nothing is invented.
const { findSkills } = require('./analysisEngine');

const HEADINGS = {
  summary: /^(professional\s+)?(summary|profile|objective|about( me)?)$/i,
  experience: /^(work\s+|professional\s+)?(experience|employment( history)?)$|^internships?$/i,
  education: /^education( and training)?$|^academics?$/i,
  projects: /^(personal\s+|academic\s+)?projects?$/i,
  certifications: /^(certifications?|licenses?( & certifications?)?|courses)$/i,
  skills: /^(technical\s+)?skills?$|^core competencies$/i,
};

const email = (t) => (t.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/) || [null])[0];
const phone = (t) => {
  const m = t.match(/\+?\d[\d\s().-]{8,}\d/g) || [];
  const isDateRange = (x) => /^(19|20)\d{2}\s*[-\u2013]\s*(19|20)\d{2}/.test(x.trim());
  return m.map((x) => x.trim()).find((x) => { const n = x.replace(/\D/g, '').length; return n >= 10 && n <= 13 && !isDateRange(x); }) || null;
};

function guessName(lines) {
  const line = lines.slice(0, 5).find((l) => /^[A-Za-z][A-Za-z.'-]*(\s+[A-Za-z][A-Za-z.'-]*){1,3}$/.test(l) && !Object.values(HEADINGS).some((re) => re.test(l)));
  return line || null;
}

function splitSections(lines) {
  const out = {};
  let current = null;
  for (const l of lines) {
    const key = Object.keys(HEADINGS).find((k) => HEADINGS[k].test(l.replace(/:$/, '')));
    if (key) { current = key; out[key] = out[key] || []; continue; }
    if (current) out[current].push(l);
  }
  return Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.join('\n').trim()]).filter(([, v]) => v));
}

function extract(text) {
  const lines = String(text).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const sections = splitSections(lines);
  return {
    name: guessName(lines),
    email: email(text),
    phone: phone(text),
    skills: findSkills(text),
    summary: sections.summary || null,
    experience: sections.experience || null,
    education: sections.education || null,
    projects: sections.projects || null,
    certifications: sections.certifications || null,
    sectionsFound: Object.keys(sections),
  };
}
module.exports = { extract };
