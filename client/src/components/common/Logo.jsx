import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function Logo({ to = '/', light = false }) {
  return (
    <Link to={to} className={`brand${light ? ' brand-light' : ''}`} aria-label="ResumeIQ home">
      <span className="brand-mark"><FileText size={18} aria-hidden="true" /></span>
      <span className="brand-name">Resume<span>IQ</span></span>
    </Link>
  );
}
