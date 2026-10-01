'use client';
import { useState, useEffect } from 'react';
import { signIn, signOut, getSession } from 'next-auth/react'; // import line update karo
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';


export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (res?.error) {
      setLoading(false);
      setError('Email or password might be wrong. Please try again.');
      return;
    }

    const session = await getSession();

    if (session?.user?.role?.toLowerCase() !== 'admin') {
      await signOut({ redirect: false });
      setLoading(false);
      setError('Only admin can sign in here.');
      return;
    }

    setLoading(false);
    router.push('/admin');
  };
  if (!mounted) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .login-input {
          width: 100%;
          padding: 11px 14px 11px 38px;
          border: 1.5px solid rgba(46,93,66,0.18);
          border-radius: 12px;
          font-family: 'Jost', sans-serif;
          font-size: 14.5px;
          color: #1a1a1a;
          background: #fafaef;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .login-input:focus {
          border-color: #2e5d42;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(46,93,66,0.1);
        }
        .login-input::placeholder { color: #9ca3af; }
        .login-btn {
          width: 100%;
          padding: 13px;
          background: #2e5d42;
          color: #fff;
          border: none;
          border-radius: 13px;
          font-family: 'Jost', sans-serif;
          font-size: 15.5px;
          font-weight: 500;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: background 0.25s, transform 0.15s, box-shadow 0.25s;
        }
        .login-btn:hover:not(:disabled) {
          background: #244c36;
          box-shadow: 0 6px 20px rgba(46,93,66,0.28);
          transform: translateY(-1px);
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0) scale(0.985);
          box-shadow: none;
        }
        .login-btn:disabled {
          background: #8fac9a;
          cursor: not-allowed;
        }
        .forgot-link {
          display: block;
          text-align: right;
          font-size: 12px;
          color: #2e5d42;
          text-decoration: none;
          margin-top: 5px;
          font-weight: 500;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .forgot-link:hover { opacity: 1; }
        .signup-link {
          color: #2e5d42;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1.5px solid transparent;
          transition: border-color 0.2s;
        }
        .signup-link:hover { border-color: #2e5d42; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin: 0 auto;
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(14px); }
        }
        .bg-circle-1 {
          position: absolute; width: 400px; height: 400px;
          border-radius: 50%; background: rgba(46,93,66,0.06);
          top: -100px; right: -100px;
          animation: floatA 8s ease-in-out infinite;
        }
        .bg-circle-2 {
          position: absolute; width: 280px; height: 280px;
          border-radius: 50%; background: rgba(46,93,66,0.04);
          bottom: -60px; left: -60px;
          animation: floatB 10s ease-in-out infinite;
        }
        .bg-circle-3 {
          position: absolute; width: 180px; height: 180px;
          border-radius: 50%; background: rgba(46,93,66,0.05);
          top: 40%; left: 8%;
          animation: floatA 12s ease-in-out infinite 2s;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#fafaef',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: "'Jost', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="bg-circle-1" />
        <div className="bg-circle-2" />
        <div className="bg-circle-3" />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: '#fff',
            borderRadius: '24px',
            border: '1px solid rgba(46,93,66,0.12)',
            width: '100%',
            maxWidth: '420px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Green Header */}
          <div style={{
            background: '#2e5d42',
            padding: '2.2rem 2.2rem 2rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', width: 200, height: 200,
              borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
              top: -70, right: -50,
            }} />
            <div style={{
              position: 'absolute', width: 120, height: 120,
              borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
              bottom: -30, left: 30,
            }} />

            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 200 }}
              style={{
                width: 48, height: 48,
                background: 'rgba(255,255,255,0.15)',
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff">
                <path d="M17 8C8 10 5.9 16.17 3.82 21h1.93c.55-1.53 1.34-3.08 2.54-4.38C9.95 14.71 13.2 13 17 13v3.38l5-5L17 6v2z" />
              </svg>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{
                fontFamily: "'Marcellus', serif",
                color: '#fff',
                fontSize: 28,
                fontWeight: 400,
                letterSpacing: '0.3px',
                margin: 0,
              }}
            >
              Welcome Back
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontSize: 13.5,
                fontWeight: 300,
                marginTop: 4,
                marginBottom: 0,
              }}
            >
              Sign in to continue your journey
            </motion.p>
          </div>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{ padding: '2rem 2.2rem 2.2rem' }}
          >
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: '#fff5f5',
                    border: '1px solid #fca5a5',
                    borderLeft: '3px solid #ef4444',
                    borderRadius: 10,
                    padding: '10px 14px',
                    marginBottom: '1.2rem',
                    fontSize: 13.5,
                    color: '#b91c1c',
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div style={{ marginBottom: '1.1rem' }}>
              <label style={{
                display: 'block',
                fontSize: 12.5,
                fontWeight: 500,
                color: '#2e5d42',
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                marginBottom: 7,
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="login-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && document.getElementById('pass-input')?.focus()}
                />
                <svg
                  viewBox="0 0 24 24" width="16" height="16"
                  fill="none" stroke="#9ca3af" strokeWidth="1.8"
                  style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m2 7 10 7 10-7" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '0.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: 12.5,
                fontWeight: 500,
                color: '#2e5d42',
                letterSpacing: '0.6px',
                textTransform: 'uppercase',
                marginBottom: 7,
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="pass-input"
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
                <svg
                  viewBox="0 0 24 24" width="16" height="16"
                  fill="none" stroke="#9ca3af" strokeWidth="1.8"
                  style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              {/* <a href="/forgot-password" className="forgot-link">Forgot password?</a> */}
            </div>

            {/* Submit Button */}
            <motion.button
              className="login-btn"
              onClick={handleSubmit}
              disabled={loading}
              whileTap={{ scale: loading ? 1 : 0.985 }}
              style={{ marginTop: '1.4rem' }}
            >
              {loading ? <div className="spinner" /> : 'Sign In'}
            </motion.button>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              margin: '1.5rem 0 1.2rem',
            }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(46,93,66,0.12)' }} />
              <span style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(46,93,66,0.12)' }} />
            </div>

            {/* Sign Up */}
            <p style={{ textAlign: 'center', fontSize: 13.5, color: '#6b7280', margin: 0 }}>
              Don&apos;t have an account?{' '}
              <a href="/admin/signup" className="signup-link">Create one</a>            </p>

            {/* Decorative dots */}
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: '1.4rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(46,93,66,0.18)', display: 'block' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(46,93,66,0.35)', display: 'block' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(46,93,66,0.18)', display: 'block' }} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}