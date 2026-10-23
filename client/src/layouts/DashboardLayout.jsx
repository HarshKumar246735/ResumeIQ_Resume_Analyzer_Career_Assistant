import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from '../components/common/Logo.jsx';
import { NAV_ITEMS } from '../components/layout/navItems.js';
import '../css/dashboard.css';
import '../css/layout.css';

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const onLogout = async () => { await signOut(); navigate('/login', { replace: true }); };

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="app">
      <header className="mobile-bar">
        <Logo to="/dashboard" />
        <button type="button" className="icon-btn" onClick={() => setOpen(true)} aria-label="Open navigation menu" aria-expanded={open} aria-controls="app-sidebar">
          <Menu size={22} aria-hidden="true" />
        </button>
      </header>
      {open && <button type="button" className="drawer-backdrop" aria-label="Close navigation menu" onClick={() => setOpen(false)} />}
      <aside id="app-sidebar" className={`sidebar${open ? ' is-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-head">
          <Logo to="/dashboard" />
          <button type="button" className="icon-btn drawer-close" onClick={() => setOpen(false)} aria-label="Close navigation menu">
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end={to === '/dashboard'} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <Icon size={18} aria-hidden="true" />{label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user"><span>{user?.name}</span><small>{user?.email}</small></div>
        <button type="button" className="nav-item logout" onClick={onLogout}><LogOut size={18} aria-hidden="true" />Log out</button>
        <div className="promo"><b>ResumeIQ</b><p>Match your resume to any job description.</p><Link to="/dashboard/analyze">Analyze now</Link></div>
      </aside>
      <Outlet />
    </div>
  );
}
