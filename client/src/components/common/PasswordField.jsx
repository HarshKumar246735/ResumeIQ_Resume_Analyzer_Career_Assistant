import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordField({ id, label, error, hint, ...rest }) {
  const [shown, setShown] = useState(false);
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <input id={id} type={shown ? 'text' : 'password'} aria-invalid={!!error} aria-describedby={describedBy} {...rest} />
        <button type="button" className="input-action" onClick={() => setShown((s) => !s)} aria-label={shown ? 'Hide password' : 'Show password'} aria-pressed={shown}>
          {shown ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
      {hint && !error && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {error && <p id={`${id}-error`} className="field-error">{error}</p>}
    </div>
  );
}
