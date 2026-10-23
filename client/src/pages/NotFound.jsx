import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import EmptyState from '../components/common/EmptyState.jsx';

export default function NotFound({ inApp = false }) {
  return (
    <main className={inApp ? 'main' : 'notfound'}>
      <EmptyState icon={Compass} title="Page not found" actionLabel={inApp ? 'Back to overview' : 'Go to home page'} actionTo={inApp ? '/dashboard' : '/'}>
        The page you are looking for does not exist or has moved.
      </EmptyState>
      {!inApp && <p className="center-note"><Link to="/login">Log in</Link></p>}
    </main>
  );
}
