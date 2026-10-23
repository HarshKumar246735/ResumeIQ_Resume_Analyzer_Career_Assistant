import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

// Generic repeatable-entry editor. fields: [key, label, 'text' | 'area']
export default function EntryList({ id, items, fields, onChange, addLabel, max = 20 }) {
  const empty = Object.fromEntries(fields.map(([k]) => [k, '']));
  const update = (i, k, v) => onChange(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  const move = (i, d) => { const n = [...items]; const [x] = n.splice(i, 1); n.splice(i + d, 0, x); onChange(n); };
  return (
    <div>
      {items.map((it, i) => (
        <fieldset className="entry-box" key={i}>
          <legend>Entry {i + 1}</legend>
          <div className="entry-grid">
            {fields.map(([k, label, type]) => (
              <div className={`field${type === 'area' ? ' wide' : ''}`} key={k}>
                <label htmlFor={`${id}-${i}-${k}`}>{label}</label>
                {type === 'area'
                  ? <textarea id={`${id}-${i}-${k}`} rows={4} value={it[k] || ''} onChange={(e) => update(i, k, e.target.value)} />
                  : <input id={`${id}-${i}-${k}`} value={it[k] || ''} onChange={(e) => update(i, k, e.target.value)} />}
              </div>
            ))}
          </div>
          <div className="entry-tools">
            <button type="button" className="icon-btn" aria-label={`Move entry ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp size={16} aria-hidden="true" /></button>
            <button type="button" className="icon-btn" aria-label={`Move entry ${i + 1} down`} disabled={i === items.length - 1} onClick={() => move(i, 1)}><ArrowDown size={16} aria-hidden="true" /></button>
            <button type="button" className="icon-btn" aria-label={`Remove entry ${i + 1}`} onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 size={16} aria-hidden="true" /></button>
          </div>
        </fieldset>
      ))}
      {items.length < max && <button type="button" className="btn btn-outline" onClick={() => onChange([...items, empty])}><Plus size={16} aria-hidden="true" /> {addLabel}</button>}
    </div>
  );
}
