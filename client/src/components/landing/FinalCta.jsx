import { Link } from 'react-router-dom';

export default function FinalCta() {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-band">
          <h2>Ready to see how your resume measures up?</h2>
          <p>Create a free account and analyze your resume against the job you want.</p>
          <Link className="btn btn-white btn-lg" to="/register">Get Started Free</Link>
        </div>
      </div>
    </section>
  );
}
