import { Upload, ClipboardList, LineChart } from 'lucide-react';

const STEPS = [
  [Upload, 'Upload your resume', 'Add a PDF or DOCX and we extract the text for analysis.'],
  [ClipboardList, 'Add a target job description', 'Paste the posting for the role you want to apply for.'],
  [LineChart, 'Review and improve', 'See your matches, gaps and suggested next actions.'],
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section section-tint">
      <div className="container">
        <div className="section-head">
          <h2>How it works</h2>
          <p>Three simple steps from upload to a stronger resume.</p>
        </div>
        <ol className="steps">
          {STEPS.map(([Icon, title, text], i) => (
            <li key={title} className="step">
              <span className="step-num" aria-hidden="true">{i + 1}</span>
              <span className="feature-icon"><Icon size={22} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
