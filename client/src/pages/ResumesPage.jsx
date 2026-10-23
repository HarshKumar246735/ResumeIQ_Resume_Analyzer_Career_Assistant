import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Files } from 'lucide-react';
import { deleteResume, listResumes } from '../services/dataService.js';
import useAsync from '../hooks/useAsync.js';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import ConfirmButton from '../components/common/ConfirmButton.jsx';
import '../css/analysis.css';

export default function ResumesPage() {
  const { data, error, loading, reload } = useAsync(() => listResumes({ limit: 50 }), []);
  const [busyId, setBusyId] = useState('');
  const [actionError, setActionError] = useState('');
  async function remove(id) {
    setBusyId(id); setActionError('');
    try { await deleteResume(id); reload(); } catch (e) { setActionError(e.message); } finally { setBusyId(''); }
  }
  return (
    <main className="main">
      <header className="topbar"><h1>My Resumes</h1><Link className="btn btn-primary" to="/dashboard/analyze">Upload and analyze</Link></header>
      <section className="card">
        {actionError && <ErrorState message={actionError} />}
        {loading && <div className="page-loading" role="status"><span className="spinner" aria-hidden="true" /> Loading…</div>}
        {error && <ErrorState message={error} onRetry={reload} />}
        {data && data.items.length === 0 && <EmptyState icon={Files} title="No resumes yet" actionLabel="Upload a resume" actionTo="/dashboard/analyze">Upload a PDF or DOCX to get started.</EmptyState>}
        {data && data.items.length > 0 && (
          <div className="table-wrap"><table>
            <thead><tr><th>Title</th><th>File</th><th>Skills found</th><th>Uploaded</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>{data.items.map((r) => (
              <tr key={r._id}><td>{r.title}</td><td>{r.sourceFileName}</td><td>{r.structuredContent?.skills?.length ?? 0}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td><ConfirmButton busy={busyId === r._id} onConfirm={() => remove(r._id)} /></td></tr>
            ))}</tbody>
          </table></div>
        )}
        <p className="muted small">Deleting a resume keeps past analyses in your history.</p>
      </section>
    </main>
  );
}
