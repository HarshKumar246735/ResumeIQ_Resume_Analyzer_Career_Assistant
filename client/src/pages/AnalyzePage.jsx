import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, X, Loader2 } from 'lucide-react';
import { createAnalysis, listResumes, uploadResume } from '../services/dataService.js';
import ErrorState from '../components/common/ErrorState.jsx';
import '../css/analysis.css';

const MAX_MB = 5;
const fmt = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default function AnalyzePage() {
  const navigate = useNavigate();
  const input = useRef(null);
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [drag, setDrag] = useState(false);
  const [job, setJob] = useState({ jobTitle: '', companyName: '', jobDescription: '' });
  const [errors, setErrors] = useState({});
  const [stage, setStage] = useState('idle'); // idle | uploading | analyzing
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => { listResumes({ limit: 50 }).then((d) => { setResumes(d.items); if (d.items[0]) setResumeId(d.items[0]._id); }).catch(() => {}); }, []);

  function pick(f) {
    setFileError('');
    if (!f) return;
    if (!/\.(pdf|docx)$/i.test(f.name)) return setFileError('Only PDF and DOCX files are supported.');
    if (f.size > MAX_MB * 1048576) return setFileError(`File is too large. Maximum size is ${MAX_MB} MB.`);
    if (f.size === 0) return setFileError('This file is empty.');
    setFile(f);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    const found = {};
    if (!file && !resumeId) found.resume = 'Upload a resume or choose a saved one.';
    if (job.jobDescription.trim().length < 50) found.jobDescription = 'Paste the full job description (at least 50 characters) so the match is meaningful.';
    setErrors(found);
    if (Object.keys(found).length) return;
    try {
      let id = resumeId;
      if (file) {
        setStage('uploading'); setProgress(0);
        id = (await uploadResume(file, setProgress)).resume._id;
      }
      setStage('analyzing');
      const { analysis } = await createAnalysis({ resumeId: id, ...job });
      navigate(`/dashboard/history/${analysis._id}`);
    } catch (err) {
      setError(err.message);
      setStage('idle');
    }
  }
  const busy = stage !== 'idle';
  const set = (k) => (e) => setJob((j) => ({ ...j, [k]: e.target.value }));

  return (
    <main className="main">
      <header className="topbar"><h1>Analyze Resume</h1></header>
      <form className="analyze-grid" onSubmit={onSubmit} noValidate>
        <section className="card">
          <h2>1. Your resume</h2>
          {!file ? (
            <div className={`dropzone${drag ? ' is-drag' : ''}`} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}>
              <UploadCloud size={30} aria-hidden="true" />
              <p><b>Drag and drop</b> your resume here</p>
              <button type="button" className="btn btn-outline" onClick={() => input.current.click()}>Browse files</button>
              <small>PDF or DOCX, up to {MAX_MB} MB. Scanned PDFs are not supported (no OCR).</small>
              <input ref={input} type="file" hidden accept=".pdf,.docx" aria-label="Choose resume file" onChange={(e) => { pick(e.target.files[0]); e.target.value = ''; }} />
            </div>
          ) : (
            <div className="file-chip"><FileText size={20} aria-hidden="true" /><span>{file.name}<small>{fmt(file.size)}</small></span>
              <button type="button" className="icon-btn" aria-label="Remove file" onClick={() => setFile(null)} disabled={busy}><X size={18} aria-hidden="true" /></button></div>
          )}
          {fileError && <p className="field-error" role="alert">{fileError}</p>}
          {!file && resumes.length > 0 && (
            <div className="field">
              <label htmlFor="saved">Or use a saved resume</label>
              <select id="saved" value={resumeId} onChange={(e) => setResumeId(e.target.value)}>
                {resumes.map((r) => <option key={r._id} value={r._id}>{r.title}</option>)}
              </select>
            </div>
          )}
          {errors.resume && <p className="field-error">{errors.resume}</p>}
        </section>
        <section className="card">
          <h2>2. Target job</h2>
          <div className="field"><label htmlFor="jt">Job title (optional)</label><input id="jt" value={job.jobTitle} onChange={set('jobTitle')} maxLength={120} /></div>
          <div className="field"><label htmlFor="co">Company (optional)</label><input id="co" value={job.companyName} onChange={set('companyName')} maxLength={120} /></div>
          <div className="field">
            <label htmlFor="jd">Job description</label>
            <textarea id="jd" rows={9} value={job.jobDescription} onChange={set('jobDescription')} maxLength={15000} aria-invalid={!!errors.jobDescription} aria-describedby={errors.jobDescription ? 'jd-err' : undefined} />
            {errors.jobDescription && <p id="jd-err" className="field-error">{errors.jobDescription}</p>}
          </div>
        </section>
        <div className="analyze-actions">
          {error && <ErrorState message={error} />}
          <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
            {stage === 'uploading' ? <><Loader2 className="spin" size={18} aria-hidden="true" /> Uploading and reading… {progress}%</>
              : stage === 'analyzing' ? <><Loader2 className="spin" size={18} aria-hidden="true" /> Analyzing…</> : 'Run analysis'}
          </button>
        </div>
      </form>
    </main>
  );
}
