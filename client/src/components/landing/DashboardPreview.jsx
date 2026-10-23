import { CheckCircle2, AlertTriangle } from 'lucide-react';

// Built from real components and CSS. All values are labelled sample data.
const BREAKDOWN = [['Skills', 28, 35], ['Keywords', 17, 25], ['Sections', 13, 15], ['Experience', 10, 15], ['Formatting', 8, 10]];

export default function DashboardPreview() {
  return (
    <div className="preview" role="img" aria-label="Sample preview of the ResumeIQ analysis dashboard">
      <div className="preview-bar"><i /><i /><i /><span>Sample preview · not real user data</span></div>
      <div className="preview-body">
        <div className="preview-score">
          <div className="donut donut-sm" style={{ background: 'conic-gradient(var(--color-primary) 276deg, #eeeaf9 0)' }}>
            <div className="donut-inner"><div><b>76</b><small>/100</small></div></div>
          </div>
          <p>Compatibility<br /><small>Rule-based analysis</small></p>
        </div>
        <div className="preview-bars">
          {BREAKDOWN.map(([k, v, max]) => (
            <div key={k} className="pbar"><span>{k}</span><div><i style={{ width: `${(v / max) * 100}%` }} /></div><em>{v}/{max}</em></div>
          ))}
        </div>
        <div className="preview-chips">
          <p>Matched skills</p>
          <div className="chips"><span className="chip">react</span><span className="chip">node.js</span><span className="chip">mongodb</span><span className="chip">git</span></div>
          <p>Missing skills</p>
          <div className="chips"><span className="chip missing">+ docker</span><span className="chip missing">+ ci/cd</span></div>
        </div>
        <div className="preview-tips">
          <div className="row ok"><CheckCircle2 size={16} aria-hidden="true" /><span>Standard section headings found</span></div>
          <div className="row warn"><AlertTriangle size={16} aria-hidden="true" /><span>Add results you can verify to your bullets</span></div>
        </div>
      </div>
    </div>
  );
}
