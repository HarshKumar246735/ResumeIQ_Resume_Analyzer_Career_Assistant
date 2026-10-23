import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../common/Logo.jsx';

const LINKS = [['#features', 'Features'], ['#how-it-works', 'How It Works'], ['#templates', 'Templates']];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);
  const close = () => setOpen(false);
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Logo />
        <nav id="site-menu" className={`nav-menu${open ? ' is-open' : ''}`} aria-label="Primary">
          {LINKS.map(([href, label]) => <a key={href} href={href} onClick={close}>{label}</a>)}
          <div className="nav-actions">
            <Link className="btn btn-ghost" to="/login" onClick={close}>Log in</Link>
            <Link className="btn btn-primary" to="/register" onClick={close}>Get Started Free</Link>
          </div>
        </nav>
        <button type="button" className="icon-btn nav-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="site-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>
    </header>
  );
}
