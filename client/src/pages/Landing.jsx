import Navbar from '../components/landing/Navbar.jsx';
import Hero from '../components/landing/Hero.jsx';
import Features from '../components/landing/Features.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import Templates from '../components/landing/Templates.jsx';
import FinalCta from '../components/landing/FinalCta.jsx';
import Footer from '../components/landing/Footer.jsx';
import '../css/dashboard.css';
import '../css/landing.css';

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Templates />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
