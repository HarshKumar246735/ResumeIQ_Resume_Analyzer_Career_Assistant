import '../../css/resume-builder.css';

const lines = (t) => String(t || '').split('\n').map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
const csv = (t) => String(t || '').split(',').map((x) => x.trim()).filter(Boolean);
const dates = (a, b) => [a, b].filter(Boolean).join(' – ');
const has = (c, k) => (Array.isArray(c[k]) ? c[k].some((e) => Object.values(e).some(Boolean)) : Boolean(c[k]));

const Bullets = ({ text }) => { const l = lines(text); return l.length ? <ul>{l.map((x, i) => <li key={i}>{x}</li>)}</ul> : null; };

// Renders one section's body. Empty sections render nothing, so the page never shows blank headings.
function body(key, c) {
  switch (key) {
    case 'summary': return <p>{c.summary}</p>;
    case 'skills': return <p className="skill-line">{csv(c.skills).join(' · ')}</p>;
    case 'experience': return c.experience.map((e, i) => (
      <div className="entry" key={i}><div className="entry-top"><b>{e.role}{e.company && `, ${e.company}`}</b><span>{dates(e.start, e.end)}</span></div>{e.location && <em>{e.location}</em>}<Bullets text={e.bullets} /></div>));
    case 'projects': return c.projects.map((p, i) => (
      <div className="entry" key={i}><div className="entry-top"><b>{p.name}</b><span>{p.link}</span></div>{p.tech && <em>{p.tech}</em>}<Bullets text={p.bullets} /></div>));
    case 'education': return c.education.map((e, i) => (
      <div className="entry" key={i}><div className="entry-top"><b>{e.degree}{e.school && `, ${e.school}`}</b><span>{dates(e.start, e.end)}</span></div>{e.details && <p>{e.details}</p>}</div>));
    case 'certifications': return c.certifications.map((x, i) => (
      <div className="entry" key={i}><div className="entry-top"><b>{x.name}</b><span>{[x.issuer, x.year].filter(Boolean).join(', ')}</span></div></div>));
    default: return null;
  }
}
const TITLES = { summary: 'Summary', skills: 'Skills', experience: 'Experience', projects: 'Projects', education: 'Education', certifications: 'Certifications' };
const section = (key, c, hidden) => (hidden.includes(key) || !has(c, key) ? null : <section className="rs-section" key={key}><h3>{TITLES[key]}</h3>{body(key, c)}</section>);
const contact = (p) => [p.email, p.phone, p.location, p.links].filter(Boolean);

export default function ResumeSheet({ resume }) {
  const { template, accent, fontSize, hidden, content: c } = resume;
  const p = c.personal;
  const S = (keys) => keys.map((k) => section(k, c, hidden));
  const head = (
    <header className="rs-head"><h1>{p.name || 'Your name'}</h1>{p.headline && <p className="rs-headline">{p.headline}</p>}<p className="rs-contact">{contact(p).join('  |  ')}</p></header>
  );
  let inner;
  if (template === 'modern') {
    inner = (<><aside className="rs-side"><h1>{p.name || 'Your name'}</h1>{p.headline && <p className="rs-headline">{p.headline}</p>}<div className="rs-contact-col">{contact(p).map((x) => <p key={x}>{x}</p>)}</div>{S(['skills', 'education', 'certifications'])}</aside><div className="rs-main">{S(['summary', 'experience', 'projects'])}</div></>);
  } else if (template === 'compact') {
    inner = (<>{head}<div className="rs-cols"><div>{S(['summary', 'experience'])}</div><div>{S(['skills', 'projects', 'education', 'certifications'])}</div></div></>);
  } else {
    inner = (<>{head}{S(['summary', 'skills', 'experience', 'projects', 'education', 'certifications'])}</>);
  }
  return <div className={`resume-sheet rs-${template} rs-${fontSize}`} style={{ '--rs-accent': accent }}>{inner}</div>;
}
