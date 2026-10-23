import Badge from '../common/Badge.jsx';

const Lines = ({ n = 3 }) => <>{Array.from({ length: n }, (_, i) => <i key={i} className="ln" style={{ width: `${92 - ((i * 13) % 40)}%` }} />)}</>;

const TEMPLATES = [
  ['Minimal Professional', 'tpl-minimal', <><div className="t-name" /><div className="t-sub" /><b className="t-h" /><Lines n={3} /><b className="t-h" /><Lines n={3} /></>],
  ['Modern Tech', 'tpl-modern', <><div className="t-side"><div className="t-name" /><Lines n={4} /></div><div className="t-main"><b className="t-h" /><Lines n={3} /><b className="t-h" /><Lines n={4} /></div></>],
  ['Classic ATS-Friendly', 'tpl-classic', <><div className="t-name" /><div className="t-rule" /><b className="t-h" /><Lines n={3} /><div className="t-rule" /><b className="t-h" /><Lines n={3} /></>],
  ['Compact One-Page', 'tpl-compact', <><div className="t-band"><div className="t-name" /></div><div className="t-cols"><div><b className="t-h" /><Lines n={4} /></div><div><b className="t-h" /><Lines n={4} /></div></div></>],
];

export default function Templates() {
  return (
    <section id="templates" className="section">
      <div className="container">
        <div className="section-head">
          <h2>Resume templates, built for readability</h2>
          <p>Four distinct layouts designed to be clean and ATS-friendly.</p>
          <Badge tone="amber">Layout previews · the builder is not available yet</Badge>
        </div>
        <ul className="tpl-grid">
          {TEMPLATES.map(([name, cls, body]) => (
            <li key={name}>
              <div className={`tpl ${cls}`} aria-hidden="true">{body}</div>
              <p className="tpl-name">{name}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
