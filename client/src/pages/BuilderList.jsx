import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FilePen, Plus } from 'lucide-react';
import { createBuilder, deleteBuilder, listBuilder } from '../services/dataService.js';
import useAsync from '../hooks/useAsync.js';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import ConfirmButton from '../components/common/ConfirmButton.jsx';
import '../css/analysis.css';

export default function BuilderList() {
  const navigate = useNavigate();
  const { data, error, loading, reload } = useAsync(() => listBuilder({ limit: 50 }), []);
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');

  async function create() {
    setBusy('new'); setErr('');
    try { const d = await createBuilder({ title: 'Untitled resume' }); navigate(`/dashboard/builder/${d.resume._id}`); }
    catch (e) { setErr(e.message); setBusy(''); }
  }
  async function remove(id) {
    setBusy(id); setErr('');
    try { await deleteBuilder(id); reload(); } catch (e) { setErr(e.message); } finally { setBusy(''); }
  }
  return (
    <main className="main">
      <header className="topbar"><h1>Resume Builder</h1>
        <button type="button" className="btn btn-primary" onClick={create} disabled={busy === 'new'}><Plus size={16} aria-hidden="true" /> New resume</button></header>
      <section className="card">
        {err && <ErrorState message={err} />}
        {loading && <div className="page-loading" role="status"><span className="spinner" aria-hidden="true" /> Loading…</div>}
        {error && <ErrorState message={error} onRetry={reload} />}
        {data && data.items.length === 0 && <EmptyState icon={FilePen} title="No built resumes yet">Create a resume, pick a template, and download it as a PDF.</EmptyState>}
        {data && data.items.length > 0 && (
          <div className="table-wrap"><table>
            <thead><tr><th>Title</th><th>Template</th><th>Last edited</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{data.items.map((r) => (
              <tr key={r._id}><td><Link to={`/dashboard/builder/${r._id}`}>{r.title}</Link></td><td style={{ textTransform: 'capitalize' }}>{r.template}</td>
                <td>{new Date(r.updatedAt).toLocaleDateString()}</td>
                <td><ConfirmButton busy={busy === r._id} onConfirm={() => remove(r._id)} /></td></tr>
            ))}</tbody>
          </table></div>
        )}
      </section>
    </main>
  );
}
