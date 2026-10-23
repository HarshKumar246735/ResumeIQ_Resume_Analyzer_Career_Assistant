const LABELS = { skills: 'Skill coverage', keywords: 'Keyword relevance', sections: 'Section completeness', experience: 'Experience signals', formatting: 'Formatting basics' };

export default function BreakdownBars({ breakdown }) {
  return (
    <ul className="breakdown">
      {Object.entries(breakdown).map(([k, v]) => (
        <li key={k}>
          <div className="breakdown-top"><span>{LABELS[k] || k}</span><b>{v.score}/{v.max}</b></div>
          <div className="bar" role="progressbar" aria-valuemin="0" aria-valuemax={v.max} aria-valuenow={v.score} aria-label={LABELS[k] || k}><i style={{ width: `${(v.score / v.max) * 100}%` }} /></div>
          <p>{v.note}</p>
        </li>
      ))}
    </ul>
  );
}
