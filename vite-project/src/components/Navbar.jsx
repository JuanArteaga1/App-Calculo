import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/saberes-previos', label: 'Saberes Previos' },
    { path: '/calculo1', label: 'Cálculo I' },
    { path: '/biblioteca', label: 'Biblioteca Multimedia' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          <img
            src="/LogoUniversidad.png"
            alt="Logo Universidad"
            style={styles.logoImg}
          />
          <div style={styles.brand}>
            <span style={styles.brandTitle}>LimitsHub</span>
            <span style={styles.brandSubtitle}>Plataforma Educativa</span>
          </div>
        </Link>

        <button
          className="navbar-menu-btn"
          style={styles.menuBtn}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        <ul className={`navbar-links ${mobileOpen ? 'open' : ''}`} style={{ ...styles.navLinks, ...(mobileOpen ? styles.navLinksMobileOpen : {}) }}>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                style={{
                  ...styles.link,
                  ...(isActive(link.path) ? styles.linkActive : {}),
                }}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/calculo1" style={styles.ctaBtn} onClick={() => setMobileOpen(false)}>
              Comenzar
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #E2E8F0',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '12px 24px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  logoImg: {
    height: '44px',
    width: 'auto',
    objectFit: 'contain',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
  },
  brandTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '18px',
    fontWeight: 700,
    color: '#0047CC',
    lineHeight: 1.2,
  },
  brandSubtitle: {
    fontSize: '11px',
    color: '#64748B',
    fontWeight: 500,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  menuBtn: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#1E293B',
    cursor: 'pointer',
    padding: '4px',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLinksMobileOpen: {
    // handled via media query in CSS; inline fallback here
  },
  link: {
    display: 'block',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 500,
    color: '#1E293B',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  linkActive: {
    background: 'rgba(0,71,204,0.08)',
    color: '#0047CC',
  },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 20px',
    background: '#F4B400',
    color: '#1a1a1a',
    fontWeight: 700,
    fontSize: '14px',
    borderRadius: '10px',
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(244,180,0,0.35)',
    transition: 'all 0.2s ease',
  },
};

const mq = `
@media (max-width: 768px) {
  nav [data-navlinks] {
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    background: #fff;
    flex-direction: column;
    padding: 16px 24px;
    border-bottom: 1px solid #E2E8F0;
    box-shadow: 0 10px 15px rgba(0,0,0,0.05);
    display: none !important;
  }
  nav [data-navlinks].open {
    display: flex !important;
  }
}
`;

// Se añade el CSS de media queries por script para no depender de archivos externos
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .navbar-menu-btn { display: inline-flex !important; }
      .navbar-links { display: none; position: absolute; top: 72px; left: 0; right: 0; background: #fff; flex-direction: column; padding: 16px 24px; border-bottom: 1px solid #E2E8F0; box-shadow: 0 10px 15px rgba(0,0,0,0.05); }
      .navbar-links.open { display: flex !important; }
    }
    @media (min-width: 769px) {
      .navbar-menu-btn { display: none !important; }
    }
  `;
  document.head.appendChild(style);
}
