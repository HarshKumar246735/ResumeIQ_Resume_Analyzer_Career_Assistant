import { Link } from 'react-router-dom';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { NAV_ITEMS as NAV } from '../components/layout/navItems.js';
import '../css/variables.css';
import '../css/dashboard.css';

// `data` comes from GET /api/dashboard/overview (real saved data). null = no analyses yet.
export default function Overview({ user = { name: 'there' }, data = null, active = '/dashboard', embedded = false }) {
  const latest = data?.latest;
  const score = latest?.overallScore ?? 0;
  const matched = latest?.matchedSkills ?? [];
  const missing = latest?.missingSkills ?? [];
  const sidebar = (
      <aside className="sidebar" aria-label="Main navigation">
        <div className="logo">Resume<span>IQ</span></div>
        {NAV.map(([to, label, Icon]) => (
          <Link key={to} to={to} className={`nav-item${active === to ? ' active' : ''}`} aria-current={active === to ? 'page' : undefined}>
            <Icon size={18} aria-hidden="true" />{label}
          </Link>
        ))}
        <div className="promo"><b>ResumeIQ</b><p>Match your resume to any job description.</p><Link to="/dashboard/analyze">Analyze now</Link></div>
      </aside>
  );
  const content = (
      <main className="main">
        <header className="topbar">
          <h1>Welcome back, {user.name}</h1>
          <Link className="btn" to="/dashboard/analyze">Analyze Resume</Link>
        </header>
        {!latest ? (
          <section className="card empty"><h2>No analyses yet</h2><p>Upload a resume and add a job description to see your score here.</p><Link className="btn" to="/dashboard/analyze">Get started</Link></section>
        ) : (
          <div className="grid">
            <section className="card">
              <h2>Compatibility score <small>({latest.analysisMethod})</small></h2>
              <div className="donut" role="img" aria-label={`Score ${score} out of 100`} style={{ background: `conic-gradient(var(--color-primary) ${score * 3.6}deg, #eeeaf9 0)` }}>
                <div className="donut-inner"><div><b>{score}</b><small>/100</small></div></div>
              </div>
              <div className="stats">
                <div className="stat"><b>{data.totalResumes}</b>Resumes</div>
                <div className="stat"><b>{data.totalAnalyses}</b>Analyses</div>
                <div className="stat"><b>{data.averageScore}</b>Avg score</div>
              </div>
            </section>
            <section className="card">
              <h2>Recommendations</h2>
              {latest.recommendations.slice(0, 4).map((r, i) => (
                <div key={i} className="row warn"><AlertTriangle size={16} aria-hidden="true" /><span>{r}</span></div>
              ))}
              {latest.strengths.map((s, i) => (
                <div key={i} className="row ok"><CheckCircle2 size={16} aria-hidden="true" /><span>{s}</span></div>
              ))}
            </section>
            <section className="card"><h2>Matched skills</h2><div className="chips">{matched.map((s) => <span key={s} className="chip">{s}</span>)}</div></section>
            <section className="card"><h2>Missing high-value skills</h2><div className="chips">{missing.map((s) => <span key={s} className="chip missing">+ {s}</span>)}</div></section>
          </div>
        )}
      </main>
  );
  if (embedded) return content;
  return <div className="app">{sidebar}{content}</div>;
}
