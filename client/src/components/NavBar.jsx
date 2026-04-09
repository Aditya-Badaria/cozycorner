import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logo from "../assets/logo.png";

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const toggleMobile = () => setMobileOpen(v => !v);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');

        .nav-root {
          font-family: 'DM Sans', sans-serif;
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          transition: background 0.35s ease, box-shadow 0.35s ease, backdrop-filter 0.35s ease;
          background: rgba(255,255,255,${scrolled ? '0.92' : '0.75'});
          backdrop-filter: blur(${scrolled ? '18px' : '8px'});
          border-bottom: 1px solid rgba(205,180,219,${scrolled ? '0.25' : '0.1'});
          box-shadow: ${scrolled ? '0 4px 32px rgba(205,180,219,0.12)' : 'none'};
        }
        .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: ${scrolled ? '62px' : '72px'};
          transition: height 0.35s ease;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          group: true;
        }
        .nav-logo img {
          width: ${scrolled ? '34px' : '40px'};
          height: ${scrolled ? '34px' : '40px'};
          object-fit: contain;
          transition: all 0.35s ease;
          filter: drop-shadow(0 2px 8px rgba(205,180,219,0.3));
        }
        .nav-logo-text {
          font-size: 1.15rem;
          font-weight: 500;
          color: #111;
          letter-spacing: -0.02em;
          transition: color 0.2s;
        }
        .nav-logo:hover .nav-logo-text { color: #a78cb5; }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }
        @media (max-width: 768px) { .nav-links { display: none; } }

        .nav-link {
          position: relative;
          font-size: 0.95rem;
          font-weight: 400;
          color: #444;
          text-decoration: none;
          padding: 4px 0;
          transition: color 0.2s;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1.5px;
          background: #CDB4DB;
          transition: width 0.28s ease;
          border-radius: 999px;
        }
        .nav-link:hover { color: #111; }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        .nav-link.active { color: #111; font-weight: 500; }

        .nav-user-chip {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 6px 14px 6px 6px;
          border-radius: 999px;
          border: 1px solid rgba(205,180,219,0.35);
          background: rgba(205,180,219,0.07);
          transition: all 0.25s ease;
          cursor: default;
        }
        .nav-user-chip:hover {
          background: rgba(205,180,219,0.15);
          border-color: rgba(205,180,219,0.6);
          box-shadow: 0 4px 20px rgba(205,180,219,0.18);
        }
        .nav-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #CDB4DB, #a78cb5);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 500;
          font-size: 13px;
          flex-shrink: 0;
        }
        .nav-user-name { font-size: 13px; font-weight: 500; color: #111; }
        .nav-user-role { font-size: 11px; color: #888; }

        .nav-btn {
          padding: 9px 22px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          cursor: pointer;
          border: none;
        }
        .nav-btn:hover { transform: translateY(-2px); }
        .nav-btn-lavender {
          background: rgba(205,180,219,0.18);
          color: #6b4e83;
          border: 1px solid rgba(205,180,219,0.5);
        }
        .nav-btn-lavender:hover {
          background: rgba(205,180,219,0.35);
          box-shadow: 0 8px 24px rgba(205,180,219,0.25);
        }
        .nav-btn-dark {
          background: #111;
          color: #fff;
        }
        .nav-btn-dark:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.2); background: #333; }
        .nav-btn-outline {
          background: transparent;
          color: #111;
          border: 1.5px solid #111;
        }
        .nav-btn-outline:hover { background: #111; color: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .nav-btn-ghost {
          background: transparent;
          color: #dc3545;
          border: 1px solid rgba(220,53,69,0.25);
        }
        .nav-btn-ghost:hover { background: #dc3545; color: #fff; box-shadow: 0 8px 24px rgba(220,53,69,0.2); }

        /* signup pulsing ring */
        .nav-btn-signup {
          background: linear-gradient(135deg, #CDB4DB, #a78cb5);
          color: #fff;
          position: relative;
          overflow: visible;
        }
        .nav-btn-signup::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 999px;
          background: linear-gradient(135deg, #CDB4DB, #a78cb5);
          opacity: 0;
          animation: signupPulse 2.5s ease infinite;
          z-index: -1;
        }
        .nav-btn-signup:hover { box-shadow: 0 8px 28px rgba(205,180,219,0.5); }
        @keyframes signupPulse {
          0%,100% { opacity:0; transform:scale(1); }
          50% { opacity:0.35; transform:scale(1.12); }
        }

        /* Mobile toggle */
        .mobile-toggle {
          display: none;
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #333;
          border-radius: 10px;
          transition: background 0.2s;
        }
        .mobile-toggle:hover { background: rgba(205,180,219,0.12); }
        @media (max-width: 768px) { .mobile-toggle { display: flex; align-items: center; } }

        /* Mobile drawer */
        .mobile-drawer {
          display: none;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease;
          opacity: 0;
          border-top: 1px solid rgba(205,180,219,0.15);
        }
        .mobile-drawer.open {
          max-height: 600px;
          opacity: 1;
        }
        @media (max-width: 768px) { .mobile-drawer { display: block; } }

        .mobile-menu-inner {
          padding: 1rem 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .mobile-link {
          display: block;
          padding: 11px 16px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 400;
          color: #333;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }
        .mobile-link:hover, .mobile-link.active { background: rgba(205,180,219,0.12); color: #6b4e83; }
        .mobile-divider { height: 1px; background: rgba(205,180,219,0.2); margin: 4px 0; }
        .mobile-btn-full {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: transform 0.2s, opacity 0.2s;
          display: block;
        }
        .mobile-btn-full:hover { opacity: 0.88; transform: scale(0.99); }
        .mbtn-lavender { background: rgba(205,180,219,0.18); color: #6b4e83; border: 1px solid rgba(205,180,219,0.4); }
        .mbtn-dark { background: #111; color: #fff; }
        .mbtn-outline { background: transparent; border: 1.5px solid #111; color: #111; }
        .mbtn-danger { background: linear-gradient(135deg,#ef4444,#dc2626); color: #fff; }
        .mbtn-signup { background: linear-gradient(135deg,#CDB4DB,#a78cb5); color: #fff; }
      `}</style>

      <nav className="nav-root">
        <div className="nav-inner">

          {/* Logo */}
          <Link to="/" className="nav-logo">
            <img src={logo} alt="Cozy Corner Logo" />
            <span className="nav-logo-text">Cozy Corner</span>
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/architects" className={`nav-link ${isActive('/architects') ? 'active' : ''}`}>Browse Architects</Link>

            {!loading && (
              <>
                {isAuthenticated ? (
                  <>
                    {/* User chip */}
                    <div className="nav-user-chip">
                      <div className="nav-avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
                      <div>
                        <div className="nav-user-name">{user?.name}</div>
                        <div className="nav-user-role" style={{ textTransform: 'capitalize' }}>{user?.role}</div>
                      </div>
                    </div>

                    {user?.role === 'architect' ? (
                      <>
                        <Link to="/architect/my-profile" className="nav-btn nav-btn-lavender">Profile</Link>
                        <Link to="/architect/requests" className="nav-btn nav-btn-dark">Requests</Link>
                      </>
                    ) : (
                      <Link to="/my-requests" className="nav-btn nav-btn-dark">My Requests</Link>
                    )}

                    <button onClick={handleLogout} className="nav-btn nav-btn-ghost">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/signup" className="nav-btn nav-btn-signup">Sign Up</Link>
                    <Link to="/login" className="nav-btn nav-btn-outline">Login</Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile toggle */}
          {!loading && (
            <button onClick={toggleMobile} className="mobile-toggle" aria-label="Toggle menu">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ transition: 'transform 0.3s ease', transform: mobileOpen ? 'rotate(90deg)' : 'none' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile drawer */}
        <div className={`mobile-drawer ${mobileOpen ? 'open' : ''}`}>
          <div className="mobile-menu-inner">
            <Link to="/" className={`mobile-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Home</Link>
            <Link to="/architects" className={`mobile-link ${isActive('/architects') ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>Browse Architects</Link>

            {!loading && isAuthenticated && (
              <>
                <div className="mobile-divider" />
                {user?.role === 'architect' ? (
                  <>
                    <Link to="/architect/my-profile" className="mobile-btn-full mbtn-lavender" onClick={() => setMobileOpen(false)}>My Profile</Link>
                    <Link to="/architect/requests" className="mobile-btn-full mbtn-dark" onClick={() => setMobileOpen(false)}>Requests</Link>
                  </>
                ) : (
                  <Link to="/my-requests" className="mobile-btn-full mbtn-dark" onClick={() => setMobileOpen(false)}>My Requests</Link>
                )}
                <button onClick={handleLogout} className="mobile-btn-full mbtn-danger">Logout</button>
              </>
            )}

            {!loading && !isAuthenticated && (
              <>
                <div className="mobile-divider" />
                <Link to="/signup" className="mobile-btn-full mbtn-signup" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                <Link to="/login" className="mobile-btn-full mbtn-outline" onClick={() => setMobileOpen(false)}>Login</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;