import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { checkHealth } from '../services/api';
import Footer from './Footer.jsx';

/* ── Animated counting number ── */
const Counter = ({ value }) => {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const isFloat = value.includes('.');
        const num = parseFloat(value.replace(/[^0-9.]/g, ''));
        const suffix = value.replace(/[0-9.]/g, '');
        let start = 0;
        const dur = 1600;
        const step = num / (dur / 16);
        const t = setInterval(() => {
          start += step;
          if (start >= num) {
            setDisplay(`${isFloat ? num.toFixed(1) : num}${suffix}`);
            clearInterval(t);
          } else {
            setDisplay(`${isFloat ? start.toFixed(1) : Math.floor(start)}${suffix}`);
          }
        }, 16);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
};

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [serverStatus, setServerStatus] = useState('checking');
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    checkHealth?.()
      .then(() => setServerStatus('running'))
      .catch(() => setServerStatus('offline'));
  }, []);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.sr').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const handleSearch = () => {
    if (searchVal.trim()) navigate(`/architects?search=${encodeURIComponent(searchVal)}`);
    else navigate('/architects');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --lav: #CDB4DB;
          --lav-light: #f0e8f7;
          --lav-mid: #dcc8ea;
          --lav-dark: #a78cb5;
          --ink: #0e0e0e;
          --muted: #666;
          --surface: #f8f5fc;
        }

        .home-wrap {
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          background: #fff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .sr {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.72s ease, transform 0.72s ease;
        }
        .sr.in { opacity: 1; transform: none; }
        .sr-d1 { transition-delay: 0.1s; }
        .sr-d2 { transition-delay: 0.2s; }
        .sr-d3 { transition-delay: 0.3s; }

        /* ── HERO ── */
        .hero {
          position: relative;
          width: 100%;
          padding: 5rem 2rem 4rem;
          overflow: hidden;
          flex-grow: 1;
          display: flex;
          align-items: center;
        }
        .hero-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(205,180,219,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(205,180,219,0.1) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none;
        }
        .hero-orb-a {
          position: absolute; width: 540px; height: 540px;
          top: -180px; right: -120px;
          background: radial-gradient(circle at 40% 40%, #ede3f5, #CDB4DB 55%, transparent 75%);
          border-radius: 50%; filter: blur(64px); opacity: 0.35;
          animation: floatA 9s ease-in-out infinite; pointer-events: none;
        }
        .hero-orb-b {
          position: absolute; width: 340px; height: 340px;
          bottom: -60px; left: -60px;
          background: radial-gradient(circle, #e8d5f5, transparent 70%);
          border-radius: 50%; filter: blur(52px); opacity: 0.25;
          animation: floatA 12s ease-in-out infinite reverse; pointer-events: none;
        }
        @keyframes floatA {
          0%,100%{ transform:translateY(0) rotate(0deg); }
          50%{ transform:translateY(-20px) rotate(5deg); }
        }

        .hero-content {
          position: relative; z-index: 2;
          max-width: 1100px; margin: 0 auto; width: 100%;
          text-align: center;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--lav-light);
          border: 1px solid var(--lav-mid);
          border-radius: 999px;
          padding: 6px 18px;
          font-size: 12px; font-weight: 500; color: #7a4fa0;
          letter-spacing: 0.06em;
          margin-bottom: 1.8rem;
          animation: fadeD 0.7s ease both;
        }
        .badge-dot {
          width: 6px; height: 6px; background: var(--lav-dark);
          border-radius: 50%; animation: dotPulse 2s ease infinite;
        }
        @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
        @keyframes fadeD { from{opacity:0;transform:translateY(-14px)} to{opacity:1;transform:none} }
        @keyframes fadeU { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }

        .hero-h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.4rem, 7.5vw, 6rem);
          font-weight: 600; line-height: 1.06;
          letter-spacing: -0.025em;
          margin: 0 0 1.4rem;
          animation: fadeU 0.8s ease 0.1s both;
        }
        .hero-h1 .accent { color: var(--lav-dark); font-style: italic; }

        .hero-p {
          font-size: clamp(1rem, 2vw, 1.18rem);
          color: var(--muted); font-weight: 300; line-height: 1.75;
          max-width: 540px; margin: 0 auto 2.25rem;
          animation: fadeU 0.8s ease 0.2s both;
        }

        .search-wrap {
          max-width: 520px; margin: 0 auto 1.75rem;
          animation: fadeU 0.8s ease 0.28s both;
        }
        .search-box {
          display: flex; align-items: center;
          background: #fff;
          border: 1.5px solid rgba(205,180,219,0.45);
          border-radius: 999px;
          padding: 5px 5px 5px 20px;
          box-shadow: 0 4px 24px rgba(205,180,219,0.14);
          transition: border-color 0.25s, box-shadow 0.25s;
        }
        .search-box:focus-within {
          border-color: var(--lav);
          box-shadow: 0 4px 32px rgba(205,180,219,0.3), 0 0 0 4px rgba(205,180,219,0.1);
        }
        .search-input {
          flex:1; border:none; outline:none;
          font-size:0.95rem; color:var(--ink);
          background:transparent; font-family:'DM Sans',sans-serif;
        }
        .search-input::placeholder { color:#bbb; }
        .search-submit {
          padding: 10px 26px;
          background: var(--ink); color:#fff;
          border:none; border-radius:999px;
          font-size:14px; font-weight:500;
          font-family:'DM Sans',sans-serif;
          cursor:pointer; flex-shrink:0;
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }
        .search-submit:hover {
          background:#333; transform:scale(1.03);
          box-shadow:0 6px 20px rgba(0,0,0,0.2);
        }

        .hero-ctas {
          display:flex; gap:12px; justify-content:center; flex-wrap:wrap;
          animation: fadeU 0.8s ease 0.36s both;
        }
        .btn-dark {
          padding:13px 32px; background:var(--ink); color:#fff;
          border:none; border-radius:999px; font-size:15px; font-weight:500;
          font-family:'DM Sans',sans-serif; cursor:pointer;
          text-decoration:none; display:inline-block;
          transition: transform 0.25s, box-shadow 0.25s, background 0.2s;
        }
        .btn-dark:hover { transform:translateY(-3px); box-shadow:0 14px 40px rgba(0,0,0,0.2); background:#2a2a2a; }
        .btn-lav {
          padding:13px 32px; background:var(--lav-light);
          color:#6b4e83; border:1.5px solid var(--lav);
          border-radius:999px; font-size:15px; font-weight:500;
          font-family:'DM Sans',sans-serif; text-decoration:none; display:inline-block;
          transition: transform 0.25s, box-shadow 0.25s, background 0.2s, color 0.2s;
        }
        .btn-lav:hover {
          transform:translateY(-3px); background:var(--lav); color:#fff;
          box-shadow:0 14px 40px rgba(205,180,219,0.35);
        }

        /* ── Stats ── */
        .stats-band {
          background: var(--ink); padding:3.5rem 1.5rem;
        }
        .stats-inner {
          max-width:900px; margin:0 auto;
          display:grid; grid-template-columns:repeat(3,1fr); gap:1rem;
        }
        @media(max-width:600px){ .stats-inner{grid-template-columns:1fr;gap:2rem;} }
        .stat-cell { text-align:center; }
        .stat-num {
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(2.8rem,5vw,3.8rem); font-weight:600;
          color:var(--lav); line-height:1; display:block;
        }
        .stat-lbl {
          font-size:12px; letter-spacing:0.14em;
          text-transform:uppercase; color:#777;
          margin-top:6px; display:block;
        }

        /* ── Features ── */
        .features-section {
          padding:6rem 1.5rem; max-width:1100px; margin:0 auto;
        }
        .features-card {
          background:var(--surface); border-radius:28px; padding:3.5rem 2.5rem;
        }
        @media(max-width:600px){ .features-card{padding:2rem 1.25rem;} }
        .features-h2 {
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(2rem,4vw,2.8rem); font-weight:600;
          text-align:center; margin:0 0 3rem;
        }
        .features-grid {
            display: grid;
            gap: 1.5rem;
            grid-template-columns: repeat(3, 1fr);
          }

          @media (max-width: 768px) {
            .features-grid {
              grid-template-columns: 1fr;
            }
          }
        .feat-card {
          text-align:center; padding:2rem 1.25rem;
          background:#fff; border-radius:20px;
          border:1px solid rgba(205,180,219,0.22);
          transition:transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s;
        }
        .feat-card:hover {
          transform:translateY(-8px);
          box-shadow:0 24px 60px rgba(205,180,219,0.22);
          border-color:var(--lav-mid);
        }
        .feat-icon {
          width:58px; height:58px;
          background:var(--lav-light); border-radius:16px;
          display:flex; align-items:center; justify-content:center;
          font-size:1.8rem; margin:0 auto 1.25rem;
          transition:transform 0.3s ease;
        }
        .feat-card:hover .feat-icon { transform:scale(1.1) rotate(-5deg); }
        .feat-card h3 { font-size:1.05rem; font-weight:500; margin:0 0 0.5rem; }
        .feat-card p { font-size:0.88rem; color:var(--muted); line-height:1.65; margin:0; }

        /* ── Status ── */
        .status-wrap { margin-top:4rem; text-align:center; }
        .status-chip {
          display:inline-flex; align-items:center; gap:7px;
          font-size:13px; color:var(--muted);
          padding:6px 14px; border-radius:999px;
          border:1px solid rgba(205,180,219,0.25);
          background:var(--lav-light);
        }
        .sdot { width:7px; height:7px; border-radius:50%; transition:background 0.4s; }
        .sdot-check { background:#f59e0b; animation:dotPulse 1.2s ease infinite; }
        .sdot-on  { background:#22c55e; }
        .sdot-off { background:#ef4444; }
      `}</style>

      <div className="home-wrap">

        {/* ═══ HERO ═══ */}
        <section className="hero">
          <div className="hero-grid" />
          <div className="hero-orb-a" />
          <div className="hero-orb-b" />

          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-dot" />
              Curated Architecture Marketplace
            </div>

            <h1 className="hero-h1">
              Find Your Perfect<br />
              <span className="accent">Architect</span>
            </h1>

            <p className="hero-p">
              Connect with talented architects and designers. Transform your space into something extraordinary.
            </p>

            {/* Search bar — same navigate('/architects') */}
            <div className="search-wrap">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search by location, specialty..."
                  className="search-input"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button className="search-submit" onClick={handleSearch}>Search</button>
              </div>
            </div>

            {/* CTA — same buttons, same routes */}
            <div className="hero-ctas">
              <button onClick={() => navigate('/architects')} className="btn-dark">Browse Architects →</button>
              <Link to="/signup" className="btn-lav">Get Started Free</Link>
            </div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <div className="stats-band">
          <div className="stats-inner sr">
            {[['500+','Architects'],['1000+','Projects Completed'],['4.9★','Average Rating']].map(([v,l]) => (
              <div key={l} className="stat-cell">
                <span className="stat-num"><Counter value={v} /></span>
                <span className="stat-lbl">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ FEATURES ═══ */}
        <div className="features-section">
          <div className="features-card sr">
            <h2 className="features-h2">Why Choose Cozy Corner?</h2>
            <div className="features-grid">
              {[
                { icon:'✨', title:'Verified Professionals', desc:'All architects are verified and have proven track records.' },
                { icon:'🎯', title:'Easy Booking',           desc:'Request quotes and manage projects all in one place.' },
                { icon:'🛡️', title:'Secure & Safe',          desc:'Your projects and data are protected with industry-leading security.' },
              ].map((f,i) => (
                <div key={f.title} className={`feat-card sr sr-d${i+1}`}>
                  <div className="feat-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Server Status — same logic */}
          <div className="status-wrap sr">
            <div className="status-chip">
              <span className={`sdot ${
                serverStatus === 'checking' ? 'sdot-check'
                : serverStatus === 'running' ? 'sdot-on'
                : 'sdot-off'
              }`} />
              <span>
                {serverStatus === 'checking'
                  ? 'Checking system…'
                  : `System ${serverStatus === 'offline' ? 'Offline' : 'Online'}`}
              </span>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}