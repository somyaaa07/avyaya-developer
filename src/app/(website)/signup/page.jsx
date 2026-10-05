'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const getStrength = (val) => {
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const strengthMeta = (score) => {
    if (!score) return { label: '', color: 'transparent', fill: 0 };
    if (score <= 1) return { label: 'Weak password', color: '#ef4444', fill: 1 };
    if (score <= 2) return { label: 'Fair password', color: '#f59e0b', fill: 2 };
    if (score === 3) return { label: 'Good password', color: '#22c55e', fill: 3 };
    return { label: 'Strong password', color: '#22c55e', fill: 4 };
  };

  const strength = getStrength(form.password);
  const { label: strengthLabel, color: strengthColor, fill: strengthFill } = strengthMeta(strength);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields to continue.'); return;
    }
    if (!terms) {
      setError('Please agree to the Terms of Service to proceed.'); return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.'); return;
    }

    setLoading(true);
    setStep(2);

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setStep(1);
      setError(data.error);
    } else {
      setStep(3);
      setSuccess('Account created! Redirecting you to login…');
      setTimeout(() => router.push('/login'), 2000);
    }
  };

  const StepDot = ({ n, label }) => {
    const isDone = step > n;
    const isActive = step === n;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600, fontFamily: "'Jost', sans-serif",
          background: isActive ? '#fff' : isDone ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)',
          color: isActive ? '#2e5d42' : isDone ? '#fff' : 'rgba(255,255,255,0.5)',
          transition: 'all 0.3s',
        }}>
          {isDone ? '✓' : n}
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginTop: 3, fontFamily: "'Jost', sans-serif" }}>
          {label}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .signup-input {
          width: 100%; padding: 11px 36px 11px 36px;
          border: 1.5px solid rgba(46,93,66,0.18); border-radius: 12px;
          font-family: 'Jost', sans-serif; font-size: 14px; color: #1a1a1a;
          background: #fafaef; outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .signup-input:focus { border-color: #2e5d42; background: #fff; box-shadow: 0 0 0 3px rgba(46,93,66,0.1); }
        .signup-input::placeholder { color: #b0b0a0; }
        .signup-btn {
          width: 100%; padding: 13px;
          background: #2e5d42; color: #fff; border: none; border-radius: 13px;
          font-family: 'Jost', sans-serif; font-size: 15px; font-weight: 500;
          letter-spacing: 0.5px; cursor: pointer; margin-top: 1.2rem;
          transition: background 0.25s, transform 0.15s, box-shadow 0.25s;
        }
        .signup-btn:hover:not(:disabled) { background: #244c36; box-shadow: 0 6px 20px rgba(46,93,66,0.28); transform: translateY(-1px); }
        .signup-btn:active:not(:disabled) { transform: scale(0.985); box-shadow: none; }
        .signup-btn:disabled { background: #8fac9a; cursor: not-allowed; }
        .login-link { color: #2e5d42; font-weight: 600; text-decoration: none; border-bottom: 1.5px solid transparent; transition: border-color 0.2s; }
        .login-link:hover { border-color: #2e5d42; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width:18px;height:18px;border:2px solid rgba(255,255,255,0.35);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite;margin:0 auto; }
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }
        .bg-c1{position:absolute;width:420px;height:420px;border-radius:50%;background:rgba(46,93,66,0.06);top:-110px;right:-110px;animation:floatA 8s ease-in-out infinite;}
        .bg-c2{position:absolute;width:260px;height:260px;border-radius:50%;background:rgba(46,93,66,0.04);bottom:-60px;left:-60px;animation:floatB 10s ease-in-out infinite;}
        .bg-c3{position:absolute;width:160px;height:160px;border-radius:50%;background:rgba(46,93,66,0.05);top:35%;left:6%;animation:floatA 12s ease-in-out infinite 2s;}
      `}</style>

      <div style={{ minHeight: '100vh', background: '#fafaef', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: "'Jost', sans-serif", position: 'relative', overflow: 'hidden' }}>
        <div className="bg-c1" /><div className="bg-c2" /><div className="bg-c3" />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ background: '#fff', borderRadius: 24, border: '1px solid rgba(46,93,66,0.12)', width: '100%', maxWidth: 440, overflow: 'hidden', position: 'relative' }}
        >
          {/* Header */}
          <div style={{ background: '#2e5d42', padding: '1.8rem 2.2rem 1.7rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: -80, right: -60 }} />
            <div style={{ position: 'absolute', width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', bottom: -30, left: 40 }} />

            <motion.div initial={{ opacity: 0, scale: 0.5, rotate: -15 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              style={{ width: 46, height: 46, background: 'rgba(255,255,255,0.15)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.9rem' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff">
                <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              style={{ fontFamily: "'Marcellus', serif", color: '#fff', fontSize: 27, fontWeight: 400, margin: 0 }}>
              Create Account
            </motion.h1>
            <motion.p initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              style={{ color: 'rgba(255,255,255,0.62)', fontSize: 13, fontWeight: 300, marginTop: 3, marginBottom: 0 }}>
              Join us and start your journey today
            </motion.p>

            {/* Step indicator */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              style={{ display: 'flex', alignItems: 'center', marginTop: '1.1rem', position: 'relative', zIndex: 1 }}>
              <StepDot n={1} label="Details" />
              <div style={{ flex: 1, height: 1.5, background: 'rgba(255,255,255,0.2)', maxWidth: 28 }} />
              <StepDot n={2} label="Verify" />
              <div style={{ flex: 1, height: 1.5, background: 'rgba(255,255,255,0.2)', maxWidth: 28 }} />
              <StepDot n={3} label="Done" />
            </motion.div>
          </div>

          {/* Body */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ padding: '1.8rem 2.2rem 2rem' }}>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{ background: '#fff5f5', border: '1px solid #fca5a5', borderLeft: '3px solid #ef4444', borderRadius: 10, padding: '10px 14px', marginBottom: '1.1rem', fontSize: 13.5, color: '#b91c1c' }}>
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ background: '#f0fdf4', border: '1px solid #86efac', borderLeft: '3px solid #22c55e', borderRadius: 10, padding: '10px 14px', marginBottom: '1.1rem', fontSize: 13.5, color: '#166534' }}>
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Name */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#2e5d42', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 6 }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <input type="text" className="signup-input" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#9ca3af" strokeWidth="1.8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7"/>
                </svg>
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#2e5d42', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 6 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input type="email" className="signup-input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#9ca3af" strokeWidth="1.8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                </svg>
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '0.6rem' }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#2e5d42', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} className="signup-input" placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#9ca3af" strokeWidth="1.8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <button onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#9ca3af" strokeWidth="1.8">
                    {showPass
                      ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                      : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    }
                  </svg>
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6, height: 3 }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ flex: 1, borderRadius: 2, background: i <= strengthFill ? strengthColor : 'rgba(46,93,66,0.1)', transition: 'background 0.3s' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: strengthColor, marginTop: 3 }}>{strengthLabel}</div>
                </motion.div>
              )}
            </div>

            {/* Terms */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: '0.6rem' }}>
              <input type="checkbox" id="terms" checked={terms} onChange={e => setTerms(e.target.checked)} style={{ accentColor: '#2e5d42', marginTop: 2, cursor: 'pointer', flexShrink: 0 }} />
              <label htmlFor="terms" style={{ fontSize: 12.5, color: '#6b7280', cursor: 'pointer', lineHeight: 1.5 }}>
                I agree to the <a href="#" style={{ color: '#2e5d42', fontWeight: 500 }}>Terms of Service</a> and <a href="/privacy" style={{ color: '#2e5d42', fontWeight: 500 }}>Privacy Policy</a>
              </label>
            </div>

            <motion.button className="signup-btn" onClick={handleSubmit} disabled={loading} whileTap={{ scale: loading ? 1 : 0.985 }}>
              {loading ? <div className="spinner" /> : 'Create Account'}
            </motion.button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '1.3rem 0 1.1rem' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(46,93,66,0.12)' }} />
              <span style={{ fontSize: 12, color: '#9ca3af' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(46,93,66,0.12)' }} />
            </div>

            <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', margin: 0 }}>
              Already have an account? <a href="/login" className="login-link">Sign in</a>
            </p>

            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: '1.2rem' }}>
              {[0.18, 0.35, 0.18].map((op, i) => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: `rgba(46,93,66,${op})`, display: 'block' }} />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}