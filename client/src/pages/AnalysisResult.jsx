import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { getAnalysis } from '../services/dataService.js';
import useAsync from '../hooks/useAsync.js';
import ScoreDonut from '../components/analysis/ScoreDonut.jsx';
import BreakdownBars from '../components/analysis/BreakdownBars.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import Badge from '../components/common/Badge.jsx';
import '../css/analysis.css';

const Chips = ({ items, missing, empty }) => (items.length
  ? <div className="chips">{items.map((s) => <span key={s} className={`chip${missing ? ' missing' : ''}`}>{missing ? '+ ' : ''}{s}</span>)}</div>
  : <p className="muted">{empty}</p>);

export default function AnalysisResult() {
  const { id } = useParams();
  const { data, error, loading, reload } = useAsync(() => getAnalysis(id), [id]);
  if (loading) return <main className="main"><div className="page-loading" role="status"><span className="spinner" aria-hidden="true" /> Loading analysis…</div></main>;
  if (error) return <main className="main"><ErrorState message={error} onRetry={reload} /></main>;
  const a = data.analysis;
  return (
    <main className="main">
      <header className="topbar">
        <div>
          <h1>{a.jobTitle || 'Resume analysis'}{a.companyName ? ` · ${a.companyName}` : ''}</h1>
          <p className="muted">{a.resumeTitle} · {new Date(a.createdAt).toLocaleString()}</p>
        </div>
        <Badge tone="violet">{a.analysisMethod === 'rule-based' ? 'Rule-based analysis' : 'AI-assisted analysis'}</Badge>
      </header>
      <div className="grid">
        <section className="card center">
          <h2>Compatibility score</h2>
          <ScoreDonut score={a.overallScore} />
          <p className="note"><Info size={16} aria-hidden="true" /> A guide to how well your resume text matches this job description. It is not a real ATS score or a hiring prediction.</p>
        </section>
        <section className="card"><h2>Score breakdown</h2><BreakdownBars breakdown={a.scoreBreakdown} /></section>
        <section className="card"><h2>Matched skills</h2><Chips items={a.matchedSkills} empty="No skills from the job description were found in your resume text." /></section>
        <section className="card">
          <h2>Missing skills</h2>
          <Chips items={a.missingSkills} missing empty="Every recognised skill in the job description appears in your resume." />
          <p className="muted small">Absent from the extracted text does not mean you lack the skill. If you have it, say so explicitly.</p>
        </section>
        <section className="card">
          <h2>Strengths</h2>
          {a.strengths.length ? a.strengths.map((s) => <div key={s} className="row ok"><CheckCircle2 size={16} aria-hidden="true" /><span>{s}</span></div>) : <p className="muted">No clear strengths were detected for this job.</p>}
        </section>
        <section className="card">
          <h2>Improvement recommendations</h2>
          {a.recommendations.length ? a.recommendations.map((r) => <div key={r} className="row warn"><AlertTriangle size={16} aria-hidden="true" /><span>{r}</span></div>) : <p className="muted">No major gaps found.</p>}
        </section>
        <section className="card"><h2>Keywords found</h2><Chips items={a.matchedKeywords} empty="None found." /></section>
        <section className="card"><h2>Keywords not found</h2><Chips items={a.missingKeywords} missing empty="None." /></section>
      </div>
      <div className="result-actions">
        <Link className="btn btn-primary" to="/dashboard/analyze">Analyze another resume or job</Link>
        <Link className="btn btn-outline" to="/dashboard/history">View analysis history</Link>
      </div>
    </main>
  );
}
