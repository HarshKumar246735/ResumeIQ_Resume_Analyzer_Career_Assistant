import { useParams } from 'react-router-dom';
import { Briefcase, MessageSquare, Route, Settings } from 'lucide-react';
import EmptyState from '../components/common/EmptyState.jsx';
import Badge from '../components/common/Badge.jsx';
import NotFound from './NotFound.jsx';

const SECTIONS = {
  jobs: { title: 'Job Matches', icon: Briefcase, step: 'a later step', text: 'Save job descriptions and compare them with your resumes. Not built yet.' },
  interviews: { title: 'Interview Prep', icon: MessageSquare, step: 'a later step', text: 'Practice questions based on your resume and target role. Not built yet.' },
  roadmap: { title: 'Skill Roadmap', icon: Route, step: 'a later step', text: 'Track missing skills for a target job. Not built yet.' },
  settings: { title: 'Settings', icon: Settings, step: 'a later step', text: 'Profile and password settings are not built yet.' },
};

export default function FeaturePage() {
  const { section } = useParams();
  const info = SECTIONS[section];
  if (!info) return <NotFound inApp />;
  return (
    <main className="main">
      <header className="topbar">
        <h1>{info.title}</h1>
        <Badge tone="amber">Not built yet · planned for {info.step}</Badge>
      </header>
      <section className="card">
        <EmptyState icon={info.icon} title={`${info.title} is not available yet`} actionLabel="Back to overview" actionTo="/dashboard">
          {info.text}
        </EmptyState>
      </section>
    </main>
  );
}
