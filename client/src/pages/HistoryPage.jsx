import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History } from 'lucide-react';
import { deleteAnalysis, listAnalyses } from '../services/dataService.js';
import useAsync from '../hooks/useAsync.js';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import ConfirmButton from '../components/common/ConfirmButton.jsx';
import '../css/analysis.css';

export default function HistoryPage() {
  const [q, setQ] = useState('');
  const [term, setTerm] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => { const t = setTimeout(() => { setTerm(q); setPage(1); }, 300); return () => clearTimeout(t); }, [q]);
  const { data, error, loading, reload } = useAsync(() => listAnalyses({ q: term, sort, page, limit: 10 }), [term, sort, page]);

  async function remove(id) {
    setBusyId(id); setActionError('');
    try { await deleteAnalysis(id); reload(); } catch (e) { setActionError(e.message); } finally { setBusyId(''); }
  }

  return (
    <main className="main">
      <header className="topbar"><h1>Analysis History</h1><Link className="btn btn-primary" to="/dashboard/analyze">New analysis</Link></header>
      <section className="card">
        <div className="toolbar">
          <div className="field"><label htmlFor="q">Search</label><input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job, company or resume" /></div>
          <div className="field"><label htmlFor="sort">Sort by</label>
            <select id="sort" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="score">Highest score</option></select></div>
        </div>
        {actionError && <ErrorState message={actionError} />}
        {loading && <div className="page-loading" role="status"><span className="spinner" aria-hidden="true" /> Loading…</div>}
        {error && <ErrorState message={error} onRetry={reload} />}
        {data && data.items.length === 0 && (term
          ? <EmptyState icon={History} title="No matching analyses">Try a different search.</EmptyState>
          : <EmptyState icon={History} title="No analyses yet" actionLabel="Analyze a resume" actionTo="/dashboard/analyze">Your saved analyses will appear here.</EmptyState>)}
        {data && data.items.length > 0 && (
          <>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Job</th><th>Resume</th><th>Score</th><th>Method</th><th>Date</th><th><span className="sr-only">Actions</span></th></tr></thead>
                <tbody>
                  {data.items.map((a) => (
                    <tr key={a._id}>
                      <td><Link to={`/dashboard/history/${a._id}`}>{a.jobTitle || 'Untitled job'}</Link>{a.companyName && <small className="muted"> · {a.companyName}</small>}</td>
                      <td>{a.resumeTitle}</td><td><b>{a.overallScore}</b>/100</td>
                      <td>{a.analysisMethod === 'rule-based' ? 'Rule-based' : 'AI-assisted'}</td>
                      <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                      <td><ConfirmButton busy={busyId === a._id} onConfirm={() => remove(a._id)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pager">
              <button type="button" className="btn btn-outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <span>Page {data.page} of {data.pages}</span>
              <button type="button" className="btn btn-outline" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
