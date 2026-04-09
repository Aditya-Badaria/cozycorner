import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }
      await login(formData.email, formData.password);
      navigate("/");
    } catch (err) {
      setError(err.error || "Login failed. Please check your credentials.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --lav: #CDB4DB;
          --lav-light: #f0e8f7;
          --lav-mid: #dcc8ea;
          --lav-dark: #a78cb5;
          --ink: #0e0e0e;
          --muted: #666;
        }

        .login-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.25rem;
          position: relative;
          overflow: hidden;
        }

        .login-orb-a {
          position: fixed; width: 520px; height: 520px;
          top: -160px; right: -130px;
          background: radial-gradient(circle at 40% 40%, #ede3f5, #CDB4DB 55%, transparent 75%);
          border-radius: 50%; filter: blur(72px); opacity: 0.3;
          animation: orbFloat 10s ease-in-out infinite;
          pointer-events: none; z-index: 0;
        }
        .login-orb-b {
          position: fixed; width: 360px; height: 360px;
          bottom: -100px; left: -80px;
          background: radial-gradient(circle, #e8d5f5, transparent 70%);
          border-radius: 50%; filter: blur(60px); opacity: 0.22;
          animation: orbFloat 13s ease-in-out infinite reverse;
          pointer-events: none; z-index: 0;
        }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-20px) rotate(5deg); }
        }

        .login-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(205,180,219,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(205,180,219,0.08) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none; z-index: 0;
        }

        /* card */
        .login-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 420px;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(205,180,219,0.3);
          border-radius: 28px;
          padding: 2.75rem 2.25rem;
          box-shadow: 0 24px 80px rgba(205,180,219,0.18), 0 2px 12px rgba(0,0,0,0.04);
          animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(28px) scale(0.98); }
          to   { opacity:1; transform:none; }
        }

        /* brand */
        .login-brand {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-bottom: 1.5rem;
          animation: fadeD 0.6s ease 0.1s both;
        }
        .login-brand-icon { font-size: 2.2rem; filter: drop-shadow(0 2px 8px rgba(205,180,219,0.4)); }
        .login-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem; font-weight: 600;
          color: var(--ink); letter-spacing: -0.02em;
        }

        .login-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.1rem; font-weight: 600;
          color: var(--ink); text-align: center;
          margin: 0 0 0.3rem; line-height: 1.1;
          animation: fadeD 0.6s ease 0.15s both;
        }
        .login-sub {
          text-align: center; font-size: 0.9rem;
          color: var(--muted); font-weight: 300;
          margin: 0 0 2rem;
          animation: fadeD 0.6s ease 0.2s both;
        }

        @keyframes fadeD {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:none; }
        }

        /* error */
        .login-error {
          background: #fff5f5;
          border: 1px solid rgba(239,68,68,0.3);
          color: #c53030;
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 13.5px;
          margin-bottom: 1.5rem;
          animation: shake 0.35s ease;
        }
        @keyframes shake {
          0%,100%{ transform:translateX(0); }
          25%    { transform:translateX(-5px); }
          75%    { transform:translateX(5px); }
        }

        /* form */
        .login-form { display:flex; flex-direction:column; gap:1.2rem; }

        .field-wrap { display:flex; flex-direction:column; gap:6px; }
        .field-label { font-size: 12.5px; font-weight: 500; color: var(--ink); letter-spacing: 0.02em; }

        .login-input {
          width: 100%;
          padding: 11px 16px;
          border: 1.5px solid rgba(205,180,219,0.3);
          border-radius: 14px;
          font-size: 14.5px;
          font-family: 'DM Sans', sans-serif;
          color: var(--ink);
          background: rgba(255,255,255,0.8);
          outline: none;
          transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
          box-sizing: border-box;
        }
        .login-input::placeholder { color: #c0b8c8; }
        .login-input:focus {
          border-color: var(--lav);
          box-shadow: 0 0 0 4px rgba(205,180,219,0.15);
          background: #fff;
        }
        .login-input:hover:not(:focus) { border-color: rgba(205,180,219,0.55); }

        /* password wrapper */
        .pw-wrap { position: relative; }
        .pw-wrap .login-input { padding-right: 44px; }
        .pw-toggle {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 16px; padding: 4px; opacity: 0.5;
          display: flex; align-items: center;
          transition: opacity 0.2s, transform 0.2s;
        }
        .pw-toggle:hover { opacity: 1; transform: translateY(-50%) scale(1.15); }

        /* submit */
        .login-submit {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 14px;
          font-size: 15px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          margin-top: 0.4rem;
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, var(--lav), var(--lav-dark));
          color: #fff;
          transition: transform 0.22s, box-shadow 0.22s, opacity 0.22s;
        }
        .login-submit::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.22s;
        }
        .login-submit:hover:not(:disabled)::before { background: rgba(255,255,255,0.08); }
        .login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(205,180,219,0.4);
        }
        .login-submit:active:not(:disabled) { transform: scale(0.99); }
        .login-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* divider */
        .login-divider {
          display: flex; align-items: center; gap: 12px; margin-top: 1.5rem;
        }
        .login-divider span { flex:1; height:1px; background:rgba(205,180,219,0.25); }
        .login-divider p { font-size: 12px; color: #bbb; white-space: nowrap; }

        /* signup link */
        .login-signup {
          text-align: center; font-size: 14px;
          color: var(--muted); margin-top: 1.25rem;
        }
        .login-signup a {
          color: var(--lav-dark); font-weight: 500;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .login-signup a:hover { color: var(--ink); border-bottom-color: var(--ink); }

        /* welcome back decorative pill */
        .login-welcome-pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--lav-light);
          border: 1px solid var(--lav-mid);
          border-radius: 999px;
          padding: 5px 16px;
          font-size: 12px; font-weight: 500; color: #7a4fa0;
          letter-spacing: 0.06em;
          margin: 0 auto 1.25rem;
          animation: fadeD 0.6s ease 0.05s both;
        }
        .pill-dot {
          width: 6px; height: 6px; background: var(--lav-dark);
          border-radius: 50%; animation: dotPulse 2s ease infinite;
        }
        @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
      `}</style>

      <div className="login-root">
        <div className="login-grid" />
        <div className="login-orb-a" />
        <div className="login-orb-b" />

        <div className="login-card">

          {/* Brand
          <div className="login-brand">
            <span className="login-brand-icon">🏠</span>
            <span className="login-brand-name">Cozy Corner</span>
          </div> */}

          {/* Welcome pill */}
          <div style={{ textAlign: 'center' }}>
            <div className="login-welcome-pill">
              <span className="pill-dot" /> Welcome back
            </div>
          </div>

          <h2 className="login-title">Sign In</h2>
          <p className="login-sub">Enter your credentials to continue</p>

          {/* Error */}
          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">

            {/* Email */}
            <div className="field-wrap">
              <label htmlFor="email" className="field-label">Email Address</label>
              <input
                id="email" name="email" type="email"
                autoComplete="email" required
                value={formData.email} onChange={handleChange}
                className="login-input" placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="field-wrap">
              <label htmlFor="password" className="field-label">Password</label>
              <div className="pw-wrap">
                <input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password" required
                  value={formData.password} onChange={handleChange}
                  className="login-input" placeholder="••••••••"
                />
                <button type="button" className="pw-toggle" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="login-submit">
              {loading && <span className="btn-spinner" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="login-divider">
            <span /><p>new here?</p><span />
          </div>

          <p className="login-signup">
            Don't have an account?{' '}
            <Link to="/signup">Sign up here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;