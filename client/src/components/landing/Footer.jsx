import { Link } from 'react-router-dom';
import Logo from '../common/Logo.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p className="footer-note">Understand your resume, match the right opportunities, and take the next step in your career.</p>
        </div>
        <nav aria-label="Product">
          <h3>Product</h3>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#templates">Templates</a>
        </nav>
        <nav aria-label="Account">
          <h3>Account</h3>
          <Link to="/login">Log in</Link>
          <Link to="/register">Get Started Free</Link>
        </nav>
      </div>
      <div className="container footer-bottom">© {new Date().getFullYear()} ResumeIQ. Scores are guidance from a rule-based tool, not hiring predictions.</div>
    </footer>
  );
}
