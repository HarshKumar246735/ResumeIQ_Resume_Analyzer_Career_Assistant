import { CheckCircle2 } from 'lucide-react';
import Logo from '../components/common/Logo.jsx';
import '../css/auth.css';

const POINTS = [
  'See how well your resume matches a job description',
  'Find skills the job asks for that your resume does not mention',
  'Get clear, explainable suggestions you can act on',
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth">
      <aside className="auth-aside">
        <Logo light />
        <h2>Your resume. Your next opportunity.</h2>
        <ul>{POINTS.map((p) => <li key={p}><CheckCircle2 size={18} aria-hidden="true" />{p}</li>)}</ul>
      </aside>
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-mobile-logo"><Logo /></div>
          <h1>{title}</h1>
          <p className="auth-sub">{subtitle}</p>
          {children}
          <p className="auth-footer">{footer}</p>
        </div>
      </main>
    </div>
  );
}
