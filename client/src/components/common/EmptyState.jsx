import { Link } from 'react-router-dom';

export default function EmptyState({ icon: Icon, title, children, actionLabel, actionTo }) {
  return (
    <div className="empty-state">
      {Icon && <span className="empty-icon"><Icon size={26} aria-hidden="true" /></span>}
      <h2>{title}</h2>
      <p>{children}</p>
      {actionTo && <Link className="btn btn-primary" to={actionTo}>{actionLabel}</Link>}
    </div>
  );
}
