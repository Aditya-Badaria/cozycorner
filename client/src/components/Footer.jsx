import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

        .footer-root {
          font-family: 'DM Sans', sans-serif;
          background: #0a0a0a;
          color: #aaa;
          padding: 4rem 1.5rem 2rem;
          position: relative;
          overflow: hidden;
        }
        .footer-glow {
          position: absolute;
          top: 0; left: 50%; transform: translateX(-50%);
          width: 600px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(205,180,219,0.6), transparent);
          pointer-events: none;
        }
        .footer-orb {
          position: absolute; width: 400px; height: 300px;
          top: -120px; right: -80px;
          background: radial-gradient(circle, rgba(205,180,219,0.07), transparent 70%);
          border-radius: 50%; pointer-events: none;
        }

        .footer-inner {
          max-width: 1100px; margin: 0 auto; position: relative; z-index: 1;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        @media (max-width:900px) { .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; } }
        @media (max-width:540px) { .footer-grid { grid-template-columns: 1fr; } }

        /* Brand column */
        .footer-brand h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 600;
          color: #fff; margin: 0 0 0.75rem;
          display: flex; align-items: center; gap: 8px;
        }
        .footer-brand p {
          font-size: 0.88rem; line-height: 1.7; color: #666;
          margin: 0;
        }

        /* Nav columns */
        .footer-col h4 {
          font-size: 11px; letter-spacing: 0.16em;
          text-transform: uppercase; color: #fff;
          font-weight: 500; margin: 0 0 1.25rem;
        }
        .footer-col ul {
          list-style: none; padding: 0; margin: 0;
          display: flex; flex-direction: column; gap: 0.65rem;
        }
        .footer-col li { font-size: 0.88rem; color: #666; }
        .footer-col a {
          color: #666; text-decoration: none;
          transition: color 0.2s, padding-left 0.2s;
          display: inline-block;
        }
        .footer-col a:hover { color: #CDB4DB; padding-left: 4px; }

        /* Divider */
        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(205,180,219,0.2), transparent);
          margin-bottom: 2rem;
        }

        /* Bottom row */
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-copy { font-size: 13px; color: #555; }

        /* Social links */
        .footer-socials {
          display: flex; gap: 10px;
        }
        .social-btn {
          width: 36px; height: 36px;
          border-radius: 10px;
          border: 1px solid rgba(205,180,219,0.2);
          background: rgba(205,180,219,0.04);
          display: flex; align-items: center; justify-content: center;
          color: #666; text-decoration: none; font-size: 14px; font-weight: 500;
          transition: border-color 0.22s, background 0.22s, color 0.22s, transform 0.22s;
        }
        .social-btn:hover {
          border-color: rgba(205,180,219,0.55);
          background: rgba(205,180,219,0.12);
          color: #CDB4DB;
          transform: translateY(-3px);
        }

        /* Legal */
        .footer-legal {
          display: flex; gap: 1.25rem;
        }
        .footer-legal a {
          font-size: 12px; color: #555; text-decoration: none;
          transition: color 0.2s;
        }
        .footer-legal a:hover { color: #CDB4DB; }

        @media (max-width:640px) {
          .footer-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-glow" />
        <div className="footer-orb" />

        <div className="footer-inner">
          <div className="footer-grid">

            {/* Brand */}
            <div className="footer-brand">
              <h3>
                <span>🏠</span>
                Cozy Corner
              </h3>
              <p>Your comfortable space for connecting with talented interior architects.</p>
            </div>

            {/* Quick Links — same routes */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/architects">Find Architects</Link></li>
                <li><Link to="/architect/create-profile">Create Profile</Link></li>
              </ul>
            </div>

            {/* Features — same static list */}
            <div className="footer-col">
              <h4>Features</h4>
              <ul>
                <li>Interior Design Services</li>
                <li>Portfolio Showcase</li>
                <li>Professional Network</li>
                <li>Secure Messaging</li>
              </ul>
            </div>

            {/* Contact — same info */}
            <div className="footer-col">
              <h4>Get in Touch</h4>
              <ul>
                <li>📧 info@cozycorner.com</li>
                <li>📱 +1 (555) 123-4567</li>
                <li>📍 San Francisco, CA</li>
              </ul>
            </div>
          </div>

          <div className="footer-divider" />

          <div className="footer-bottom">
            <p className="footer-copy">© {currentYear} Cozy Corner. All rights reserved.</p>

            {/* Social links — same hrefs */}
            <div className="footer-socials">
              {[['f','Facebook'],['𝕏','Twitter'],['in','LinkedIn'],['📷','Instagram']].map(([icon, title]) => (
                <a key={title} href="#" className="social-btn" title={title}>{icon}</a>
              ))}
            </div>

            {/* Legal — same hrefs */}
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}