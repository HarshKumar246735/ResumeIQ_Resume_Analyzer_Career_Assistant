import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, Save } from 'lucide-react';
import { getBuilder, updateBuilder } from '../services/dataService.js';
import useAsync from '../hooks/useAsync.js';
import ResumeSheet from '../components/resume/ResumeSheet.jsx';
import EntryList from '../components/resume/EntryList.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import '../css/analysis.css';
import '../css/resume-builder.css';

const TEMPLATES = [['minimal', 'Minimal Professional'], ['modern', 'Modern Tech'], ['classic', 'Classic ATS-Friendly'], ['compact', 'Compact One-Page']];
const ACCENTS = ['#7c4dff', '#2563eb', '#0f766e', '#be123c', '#334155', '#b45309'];
const SECTIONS = [['summary', 'Summary'], ['skills', 'Skills'], ['experience', 'Experience'], ['projects', 'Projects'], ['education', 'Education'], ['certifications', 'Certifications']];
const F = {
  experience: [['role', 'Role'], ['company', 'Company'], ['location', 'Location'], ['start', 'Start'], ['end', 'End'], ['bullets', 'Achievements (one per line)', 'area']],
  projects: [['name', 'Project name'], ['link', 'Link'], ['tech', 'Technologies'], ['bullets', 'Description (one point per line)', 'area']],
  education: [['school', 'School'], ['degree', 'Degree'], ['start', 'Start'], ['end', 'End'], ['details', 'Details', 'area']],
  certifications: [['name', 'Certification'], ['issuer', 'Issuer'], ['year', 'Year']],
};
const PERSONAL = [['name', 'Full name'], ['headline', 'Headline'], ['email', 'Email'], ['phone', 'Phone'], ['location', 'Location'], ['links', 'Links (portfolio, LinkedIn, GitHub)']];

export default function BuilderEditor() {
  const { id } = useParams();
  const { data, error, loading, reload } = useAsync(() => getBuilder(id), [id]);
  const [doc, setDoc] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState('');
  const [saveError, setSaveError] = useState('');
  const [tab, setTab] = useState('edit');

  useEffect(() => { if (data) { setDoc(data.resume); setDirty(false); } }, [data]);
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (loading || (!doc && !error)) return <main className="main"><div className="page-loading" role="status"><span className="spinner" aria-hidden="true" /> Loading…</div></main>;
  if (error) return <main className="main"><ErrorState message={error} onRetry={reload} /></main>;

  const patch = (p) => { setDoc((d) => ({ ...d, ...p })); setDirty(true); setStatus(''); };
  const setContent = (p) => patch({ content: { ...doc.content, ...p } });
  const toggle = (k) => patch({ hidden: doc.hidden.includes(k) ? doc.hidden.filter((x) => x !== k) : [...doc.hidden, k] });

  async function save() {
    setStatus('saving'); setSaveError('');
    try {
      const { title, template, accent, fontSize, hidden, content } = doc;
      const d = await updateBuilder(id, { title, template, accent, fontSize, hidden, content });
      setDoc(d.resume); setDirty(false); setStatus('saved');
    } catch (e) { setSaveError(e.message); setStatus(''); }
  }
  const c = doc.content;

  return (
    <main className="main builder">
      <header className="topbar">
        <div><Link to="/dashboard/builder" className="back"><ArrowLeft size={16} aria-hidden="true" /> All resumes</Link></div>
        <div className="builder-actions">
          <span className="muted" role="status">{status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : dirty ? 'Unsaved changes' : ''}</span>
          <button type="button" className="btn btn-outline" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> Download PDF</button>
          <button type="button" className="btn btn-primary" onClick={save} disabled={status === 'saving' || !dirty}><Save size={16} aria-hidden="true" /> Save</button>
        </div>
      </header>
      {saveError && <ErrorState message={saveError} />}
      <div className="tabs" role="tablist" aria-label="Builder view">
        <button role="tab" aria-selected={tab === 'edit'} className={tab === 'edit' ? 'on' : ''} onClick={() => setTab('edit')}>Edit</button>
        <button role="tab" aria-selected={tab === 'preview'} className={tab === 'preview' ? 'on' : ''} onClick={() => setTab('preview')}>Preview</button>
      </div>
      <div className="builder-grid">
        <div className={`builder-form${tab === 'edit' ? '' : ' hide-narrow'}`}>
          <section className="card">
            <h2>Design</h2>
            <div className="field"><label htmlFor="bt">Resume title (only you see this)</label><input id="bt" value={doc.title} maxLength={120} onChange={(e) => patch({ title: e.target.value })} /></div>
            <div className="field"><label htmlFor="tpl">Template</label>
              <select id="tpl" value={doc.template} onChange={(e) => patch({ template: e.target.value })}>{TEMPLATES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
            <div className="field"><span className="label">Accent color</span>
              <div className="swatches" role="radiogroup" aria-label="Accent color">{ACCENTS.map((a) => (
                <button key={a} type="button" role="radio" aria-checked={doc.accent === a} aria-label={a} className={doc.accent === a ? 'on' : ''} style={{ background: a }} onClick={() => patch({ accent: a })} />))}</div></div>
            <div className="field"><label htmlFor="fs">Text size</label>
              <select id="fs" value={doc.fontSize} onChange={(e) => patch({ fontSize: e.target.value })}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></div>
            <div className="field"><span className="label">Show sections</span>
              <div className="checks">{SECTIONS.map(([k, l]) => <label key={k}><input type="checkbox" checked={!doc.hidden.includes(k)} onChange={() => toggle(k)} /> {l}</label>)}</div></div>
          </section>
          <section className="card"><h2>Personal information</h2>
            <div className="entry-grid">{PERSONAL.map(([k, l]) => (
              <div className="field" key={k}><label htmlFor={`p-${k}`}>{l}</label><input id={`p-${k}`} value={c.personal[k] || ''} onChange={(e) => setContent({ personal: { ...c.personal, [k]: e.target.value } })} /></div>))}</div></section>
          <section className="card"><h2>Summary</h2><div className="field"><label htmlFor="sum">Professional summary</label>
            <textarea id="sum" rows={4} maxLength={1200} value={c.summary} onChange={(e) => setContent({ summary: e.target.value })} /></div></section>
          <section className="card"><h2>Skills</h2><div className="field"><label htmlFor="sk">Skills, separated by commas</label>
            <textarea id="sk" rows={3} maxLength={800} value={c.skills} onChange={(e) => setContent({ skills: e.target.value })} /></div></section>
          {[['experience', 'Experience', 'Add experience'], ['projects', 'Projects', 'Add project'], ['education', 'Education', 'Add education'], ['certifications', 'Certifications', 'Add certification']].map(([k, t, add]) => (
            <section className="card" key={k}><h2>{t}</h2><EntryList id={k} items={c[k]} fields={F[k]} addLabel={add} onChange={(items) => setContent({ [k]: items })} /></section>))}
          <p className="muted small">Only add information that is true. ResumeIQ never fills in details for you.</p>
        </div>
        <div className={`builder-preview${tab === 'preview' ? '' : ' hide-narrow'}`}><ResumeSheet resume={doc} /></div>
      </div>
    </main>
  );
}
