import { useState } from 'react';

// Two-step delete: first click asks for confirmation inline (no browser alert dialogs).
export default function ConfirmButton({ onConfirm, label = 'Delete', busy = false }) {
  const [asking, setAsking] = useState(false);
  if (!asking) return <button type="button" className="btn-link danger" onClick={() => setAsking(true)}>{label}</button>;
  return (
    <span className="confirm" role="group" aria-label="Confirm deletion">
      <button type="button" className="btn-link danger" disabled={busy} onClick={onConfirm}>{busy ? 'Deleting…' : 'Confirm delete'}</button>
      <button type="button" className="btn-link" onClick={() => setAsking(false)}>Cancel</button>
    </span>
  );
}
