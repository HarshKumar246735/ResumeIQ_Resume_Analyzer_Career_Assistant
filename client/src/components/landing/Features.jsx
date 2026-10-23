import { FileSearch, Target, SearchX, Sparkles, FilePen, MessagesSquare } from 'lucide-react';

const FEATURES = [
  [FileSearch, 'Resume Analysis', 'An explainable score with a breakdown, so you see exactly what drives it.'],
  [Target, 'Job Description Matching', 'Compare your resume with a target role and see how well they line up.'],
  [SearchX, 'Missing Skills Detection', 'Spot skills a job asks for that your resume does not mention yet.'],
  [Sparkles, 'AI Resume Improvement', 'Sharper bullets and summaries from your own content, never invented facts.'],
  [FilePen, 'Resume Builder', 'Build clean, ATS-friendly resumes from several distinct templates.'],
  [MessagesSquare, 'Interview Preparation', 'Practice questions drawn from your resume and the role you want.'],
];

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section-head">
          <h2>Everything you need to sharpen your resume</h2>
          <p>Practical tools that explain their results instead of hiding behind a mystery score.</p>
        </div>
        <ul className="feature-grid">
          {FEATURES.map(([Icon, title, text]) => (
            <li key={title} className="feature-card">
              <span className="feature-icon"><Icon size={22} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
