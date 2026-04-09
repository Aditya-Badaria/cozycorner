import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Eye, EyeOff } from "lucide-react";
const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields"); return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long"); return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match"); return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address"); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!validateForm()) { setLoading(false); return; }
    try {
      await register(formData.name, formData.email, formData.password, formData.confirmPassword, formData.role);
      navigate("/");
    } catch (err) {
      console.error("Full error object:", err);
      const errorMsg = err?.message || err?.error || "Registration failed. Please try again.";
      setError(errorMsg);
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

        .signup-root {
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

        /* background orbs */
        .signup-orb-a {
          position: fixed; width: 500px; height: 500px;
          top: -160px; right: -120px;
          background: radial-gradient(circle at 40% 40%, #ede3f5, #CDB4DB 55%, transparent 75%);
          border-radius: 50%; filter: blur(72px); opacity: 0.3;
          animation: orbFloat 10s ease-in-out infinite;
          pointer-events: none; z-index: 0;
        }
        .signup-orb-b {
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

        /* grid bg */
        .signup-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(205,180,219,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(205,180,219,0.08) 1px, transparent 1px);
          background-size: 52px 52px;
          pointer-events: none; z-index: 0;
        }

        /* card */
        .signup-card {
          position: relative; z-index: 1;
          width: 100%; max-width: 440px;
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

        /* header */
        .signup-brand {
          display: flex; align-items: center; justify-content: center;
          gap: 10px; margin-bottom: 1.5rem;
          animation: fadeD 0.6s ease 0.1s both;
        }
        .signup-brand-icon {
          font-size: 2.2rem;
          filter: drop-shadow(0 2px 8px rgba(205,180,219,0.4));
        }
        .signup-brand-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem; font-weight: 600;
          color: var(--ink); letter-spacing: -0.02em;
        }
        .signup-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 600;
          color: var(--ink); text-align: center;
          margin: 0 0 0.3rem; line-height: 1.1;
          animation: fadeD 0.6s ease 0.15s both;
        }
        .signup-sub {
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
        .signup-error {
          background: #fff5f5;
          border: 1px solid rgba(239,68,68,0.3);
          color: #c53030;
          border-radius: 14px;
          padding: 12px 16px;
          font-size: 13.5px;
          font-weight: 400;
          margin-bottom: 1.5rem;
          animation: shake 0.35s ease;
        }
        @keyframes shake {
          0%,100%{ transform:translateX(0); }
          25%    { transform:translateX(-5px); }
          75%    { transform:translateX(5px); }
        }

        /* form */
        .signup-form { display:flex; flex-direction:column; gap:1.1rem; }

        .field-wrap { display:flex; flex-direction:column; gap:6px; }
        .field-label {
          font-size: 12.5px; font-weight: 500;
          color: var(--ink); letter-spacing: 0.02em;
        }

        /* inputs */
        .signup-input, .signup-select {
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
        .signup-input::placeholder { color: #c0b8c8; }
        .signup-input:focus, .signup-select:focus {
          border-color: var(--lav);
          box-shadow: 0 0 0 4px rgba(205,180,219,0.15);
          background: #fff;
        }
        .signup-input:hover:not(:focus), .signup-select:hover:not(:focus) {
          border-color: rgba(205,180,219,0.55);
        }

        /* password wrapper */
        .pw-wrap { position: relative; }
        .pw-wrap .signup-input { padding-right: 44px; }
        .pw-toggle {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 16px; padding: 4px;
          transition: transform 0.2s, opacity 0.2s;
          opacity: 0.5;
          display: flex; align-items: center;
        }
        .pw-toggle:hover { opacity: 1; transform: translateY(-50%) scale(1.15); }

        .field-hint {
          font-size: 11.5px; color: #aaa; margin: 0;
        }

        /* role selector */
        .role-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
        }
        .role-option {
          position: relative;
        }
        .role-option input[type="radio"] {
          position: absolute; opacity: 0; width:0; height:0;
        }
        .role-label {
          display: flex; flex-direction: column; align-items: center;
          gap: 4px; padding: 12px 8px;
          border: 1.5px solid rgba(205,180,219,0.3);
          border-radius: 14px;
          cursor: pointer;
          font-size: 13px; font-weight: 400; color: var(--muted);
          transition: border-color 0.22s, background 0.22s, color 0.22s, transform 0.2s;
          background: rgba(255,255,255,0.7);
          text-align: center;
        }
        .role-label:hover {
          border-color: var(--lav-mid);
          background: var(--lav-light);
          transform: translateY(-2px);
        }
        .role-icon { font-size: 1.4rem; }
        .role-option input:checked + .role-label {
          border-color: var(--lav);
          background: var(--lav-light);
          color: #6b4e83;
          box-shadow: 0 4px 16px rgba(205,180,219,0.2);
        }
        .role-name { font-weight: 500; }
        .role-desc { font-size: 11px; color: inherit; opacity: 0.75; }

        /* submit */
        .signup-submit {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          margin-top: 0.4rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.22s, box-shadow 0.22s, opacity 0.22s;
          background: linear-gradient(135deg, var(--lav), var(--lav-dark));
          color: #fff;
        }
        .signup-submit::before {
          content: '';
          position: absolute; inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.22s;
        }
        .signup-submit:hover:not(:disabled)::before { background: rgba(255,255,255,0.08); }
        .signup-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 36px rgba(205,180,219,0.4);
        }
        .signup-submit:active:not(:disabled) { transform: scale(0.99); }
        .signup-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* spinner inside button */
        .btn-spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* divider */
        .signup-divider {
          display: flex; align-items: center; gap: 12px;
          margin-top: 1.5rem;
        }
        .signup-divider span { flex:1; height:1px; background:rgba(205,180,219,0.25); }
        .signup-divider p { font-size: 12px; color: #bbb; white-space: nowrap; }

        /* signin link */
        .signup-signin {
          text-align: center; font-size: 14px;
          color: var(--muted); margin-top: 1.25rem;
        }
        .signup-signin a {
          color: var(--lav-dark); font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
          border-bottom: 1px solid transparent;
        }
        .signup-signin a:hover {
          color: var(--ink);
          border-bottom-color: var(--ink);
        }
          .pw-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);

  font-size: 13px;
  font-weight: 500;

  color: #8b5cf6; /* lavender vibe */
  background: transparent;
  border: none;

  cursor: pointer;
  transition: opacity 0.2s ease;
}

.pw-toggle:hover {
  opacity: 0.7;
}
      `}</style>

      <div className="signup-root">
        <div className="signup-grid" />
        <div className="signup-orb-a" />
        <div className="signup-orb-b" />

        <div className="signup-card">

          {/* Brand */}
          {/* <div className="signup-brand">
            <span className="signup-brand-icon">🏠</span>
            <span className="signup-brand-name">Cozy Corner</span>
          </div> */}

          <h2 className="signup-title">Create Account</h2>
          <p className="signup-sub">Join our community</p>

          {/* Error */}
          {error && <div className="signup-error">{error}</div>}

          <form onSubmit={handleSubmit} className="signup-form">

            {/* Full Name */}
            <div className="field-wrap">
              <label htmlFor="name" className="field-label">Full Name</label>
              <input
                id="name" name="name" type="text" autoComplete="name" required
                value={formData.name} onChange={handleChange}
                className="signup-input" placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div className="field-wrap">
              <label htmlFor="email" className="field-label">Email Address</label>
              <input
                id="email" name="email" type="email" autoComplete="email" required
                value={formData.email} onChange={handleChange}
                className="signup-input" placeholder="you@example.com"
              />
            </div>

            {/* Role — replaced select with styled radio cards */}
            <div className="field-wrap">
              <label className="field-label">I am a…</label>
              <div className="role-grid">
                <div className="role-option">
                  <input
                    type="radio" id="role-user" name="role"
                    value="user" checked={formData.role === 'user'} onChange={handleChange}
                  />
                  <label htmlFor="role-user" className="role-label">
                    <span className="role-icon">🏡</span>
                    <span className="role-name">Client</span>
                    <span className="role-desc">Looking for an architect</span>
                  </label>
                </div>
                <div className="role-option">
                  <input
                    type="radio" id="role-architect" name="role"
                    value="architect" checked={formData.role === 'architect'} onChange={handleChange}
                  />
                  <label htmlFor="role-architect" className="role-label">
                    <span className="role-icon">📐</span>
                    <span className="role-name">Architect</span>
                    <span className="role-desc">Offering my services</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="field-wrap">
              <label htmlFor="password" className="field-label">Password</label>
              <div className="pw-wrap">
                <input
                  id="password" name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password" required
                  value={formData.password} onChange={handleChange}
                  className="signup-input" placeholder="••••••••"
                />
                <button
                  type="button"
                  className="pw-toggle"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="field-hint">At least 6 characters</p>
            </div>

            {/* Confirm Password */}
<div className="field-wrap">
  <label htmlFor="confirmPassword" className="field-label">
    Confirm Password
  </label>

  <div className="pw-wrap">
    <input
      id="confirmPassword"
      name="confirmPassword"
      type={showConfirmPassword ? "text" : "password"}
      autoComplete="new-password"
      required
      value={formData.confirmPassword}
      onChange={handleChange}
      className="signup-input"
      placeholder="••••••••"
    />

    <button
      type="button"
      className="pw-toggle"
      onClick={() => setShowConfirmPassword(v => !v)}
    >
      {showConfirmPassword ? "Hide" : "Show"}
    </button>
  </div>
</div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="signup-submit">
              {loading && <span className="btn-spinner" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="signup-divider">
            <span /><p>already a member?</p><span />
          </div>

          <p className="signup-signin">
            Already have an account?{' '}
            <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignupPage;