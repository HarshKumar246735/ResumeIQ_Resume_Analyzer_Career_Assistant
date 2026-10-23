import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import DashboardPreview from './DashboardPreview.jsx';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">Your resume. Your next opportunity.</span>
          <h1>Make your resume work as hard as you do.</h1>
          <p className="lead">Get actionable resume insights, uncover missing job skills, and build a resume that communicates your strengths with confidence.</p>
          <div className="hero-cta">
            <Link className="btn btn-primary btn-lg" to="/register">Analyze My Resume <ArrowRight size={18} aria-hidden="true" /></Link>
            <a className="btn btn-outline btn-lg" href="#features">Explore Features</a>
          </div>
          <p className="trust"><ShieldCheck size={16} aria-hidden="true" /> Built for students, freshers, and professionals.</p>
        </div>
        <DashboardPreview />
      </div>
    </section>
  );
}
