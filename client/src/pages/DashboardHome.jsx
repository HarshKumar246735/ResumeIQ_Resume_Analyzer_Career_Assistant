import Overview from './Overview.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getOverview } from '../services/dataService.js';
import useAsync from '../hooks/useAsync.js';
import ErrorState from '../components/common/ErrorState.jsx';

export default function DashboardHome() {
  const { user } = useAuth();
  const { data, error, loading, reload } = useAsync(getOverview, []);
  if (loading) return <main className="main"><div className="page-loading" role="status"><span className="spinner" aria-hidden="true" /> Loading…</div></main>;
  if (error) return <main className="main"><ErrorState message={error} onRetry={reload} /></main>;
  const stats = data.data;
  return <Overview embedded data={stats.latest ? stats : null} user={{ name: user?.name?.split(' ')[0] || 'there' }} />;
}
