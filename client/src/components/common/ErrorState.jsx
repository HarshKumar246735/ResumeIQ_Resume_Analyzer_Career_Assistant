import { AlertCircle } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <AlertCircle size={22} aria-hidden="true" />
      <p>{message}</p>
      {onRetry && <button type="button" className="btn btn-outline" onClick={onRetry}>Try again</button>}
    </div>
  );
}
