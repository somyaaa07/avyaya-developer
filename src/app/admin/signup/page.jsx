'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Marcellus } from 'next/font/google';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const goldBg = 'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';

const inputClass =
  'w-full rounded-xl border border-[#1A2A22]/15 bg-[#F3F0E8]/60 py-3.5 pl-11 pr-4 font-sans text-[15px] text-[#1A2A22] outline-none transition placeholder:text-[#52685B]/60 hover:border-[#1A2A22]/30 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#FFCD39]/30 disabled:opacity-60';

const iconClass =
  'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#52685B]';

/* ---------- Architectural line drawing (brand panel) ---------- */
const windows = (x, y, cols, rows, w, h, gx, gy) => {
  let d = '';
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      d += `M${x + c * (w + gx)} ${y + r * (h + gy)}h${w}v${h}h-${w}z`;
  return d;
};

const drawing = [
  ['M0 340H420', 1.5, 0.9],
  ['M40 340V110H140V340M40 110L90 76L140 110', 1.5, 0.9],
  ['M140 340V180H240V340', 1.5, 0.7],
  ['M240 340V130H350V340M240 130L295 96L350 130', 1.5, 0.9],
  ['M350 340V220H400V340', 1.5, 0.5],
  [windows(56, 130, 4, 6, 12, 16, 8, 14), 1, 0.55],
  [windows(156, 198, 3, 4, 14, 18, 12, 14), 1, 0.4],
  [windows(258, 152, 4, 5, 14, 18, 8, 16), 1, 0.55],
  ['M80 340V312a10 10 0 0 1 20 0V340', 1.2, 0.9],
  ['M290 340V310a12 12 0 0 1 24 0V340', 1.2, 0.9],
  ['M295 96V60M295 60h14', 1, 0.7],
];

function Elevation({ reduce }) {
  return (
    <svg
      viewBox="0 0 420 360"
      fill="none"
      stroke="#D4AF37"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-auto w-full"
    >
      {drawing.map(([d, sw, op], i) => (
        <motion.path
          key={i}
          d={d}
          strokeWidth={sw}
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: op }}
          transition={{ duration: 1.4, delay: 0.2 + i * 0.12, ease: 'easeInOut' }}
        />
      ))}
    </svg>
  );
}

/* ---------- Stepper ---------- */
const STEPS = ['Details', 'Verify', 'Done'];

function Stepper({ step }) {
  return (
    <ol className="flex items-center font-sans" aria-label="Progress">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = step > n;
        const active = step === n;
        return (
          <li
            key={label}
            className="flex flex-1 items-center last:flex-none"
            aria-current={active ? 'step' : undefined}
          >
            <span className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300 ${
                  done
                    ? 'bg-[#1A2A22] text-[#F5D77A]'
                    : active
                    ? 'bg-white text-[#1A2A22] ring-2 ring-[#D4AF37]'
                    : 'bg-[#1A2A22]/8 text-[#52685B]'
                }`}
              >
                {done ? '✓' : n}
              </span>
              <span className={`text-sm ${active || done ? 'text-[#1A2A22]' : 'text-[#52685B]'}`}>
                {label}
              </span>
            </span>
            {n < STEPS.length && (
              <span className="mx-3 h-[2px] flex-1 overflow-hidden rounded bg-[#1A2A22]/10">
                <span
                  className={`block h-full transition-all duration-500 ${goldBg}`}
                  style={{ width: done ? '100%' : '0%' }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [checking, setChecking] = useState(true);

  // If an admin already exists, signup is closed — send to login
  useEffect(() => {
    fetch('/api/signup')
      .then((r) => r.json())
      .then((d) => {
        if (!d.needsSetup) router.replace('/admin/login');
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

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
      setError('Please fill in all fields to continue.');
      return;
    }
    if (!terms) {
      setError('Please agree to the Terms of Service to proceed.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    setStep(2);

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setStep(1);
      setError(data.error || 'Something went wrong.');
    } else {
      setStep(3);
      setSuccess('Admin account created! Redirecting to login…');
      setTimeout(() => router.push('/admin/login'), 1500);
    }
  };

  if (checking) return null;

  return (
    <div
      className={`${marcellus.className} grid min-h-screen bg-[#FAF9F6] font-normal text-[#1A2A22] lg:grid-cols-[1.05fr_1fr]`}
    >
      {/* ===== Brand panel (desktop) ===== */}
      <aside className="relative hidden overflow-hidden bg-[#1A2A22] p-12 text-[#FAF9F6] lg:flex lg:flex-col lg:justify-between">
        <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
    

        <Link
          href="/"
          className="relative inline-flex w-fit items-center gap-2 font-sans text-sm text-[#FAF9F6]/70 transition hover:text-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to website
        </Link>

        <div className="relative">
          <h2 className="text-5xl leading-[1.1] xl:text-6xl">Avyaya Developer</h2>
          <span aria-hidden="true" className={`mt-6 block h-[3px] w-16 rounded-full ${goldBg}`} />
          <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-[#FAF9F6]/70">
            One-time setup. This account will manage all properties and inquiries.
          </p>
        </div>

        <div className="relative">
          <div className="mx-auto mb-8 w-full max-w-lg">
            <Elevation reduce={reduce} />
          </div>
          <p className="flex items-center gap-2 border-t border-[#D4AF37]/25 pt-5 font-sans text-sm text-[#FAF9F6]/50">
            <ShieldCheck size={16} className="text-[#F5D77A]" aria-hidden="true" />
            Authorised admin access only
          </p>
        </div>
      </aside>

      {/* ===== Form side ===== */}
      <main className="relative flex items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F3F0E8] blur-2xl"
        />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full max-w-md"
        >
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 font-sans text-sm text-[#52685B] transition hover:text-[#1A2A22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] lg:hidden"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to website
          </Link>

          <div className="relative overflow-hidden rounded-3xl border border-[#1A2A22]/10 bg-white p-7 shadow-[0_24px_60px_-20px_rgba(26,42,34,0.25)] sm:p-10">
            <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />

            <h1 className="text-4xl leading-tight">Create admin account</h1>
            <span aria-hidden="true" className={`mt-4 block h-[3px] w-14 rounded-full ${goldBg}`} />
            <p className="mt-4 font-sans text-[15px] text-[#52685B]">
              Set up the first admin to manage properties and inquiries.
            </p>

            <div className="mt-6 border-y border-[#1A2A22]/10 py-4">
              <Stepper step={step} />
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              <div aria-live="polite">
                <AnimatePresence>
                  {error && (
                    <motion.p
                      role="alert"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700"
                    >
                      <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {error}
                    </motion.p>
                  )}
                  {success && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2.5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 font-sans text-sm text-green-800"
                    >
                      <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                      {success}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="signup-name" className="mb-1.5 block text-sm">
                  Full name
                </label>
                <div className="relative">
                  <User size={17} aria-hidden="true" className={iconClass} />
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="mb-1.5 block text-sm">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={17} aria-hidden="true" className={iconClass} />
                  <input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={loading}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="mb-1.5 block text-sm">
                  Password
                </label>
                <div className="relative">
                  <Lock size={17} aria-hidden="true" className={iconClass} />
                  <input
                    id="signup-password"
                    type={showPass ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    disabled={loading}
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                    aria-pressed={showPass}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#52685B] transition hover:bg-[#1A2A22]/5 hover:text-[#1A2A22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                  >
                    {showPass ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>

                {/* Strength bar */}
                {form.password && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-live="polite">
                    <div className="mt-2.5 flex h-[3px] gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm transition-colors duration-300"
                          style={{ background: i <= strengthFill ? strengthColor : 'rgba(26,42,34,0.1)' }}
                        />
                      ))}
                    </div>
                    <p className="mt-1.5 font-sans text-xs" style={{ color: strengthColor }}>
                      {strengthLabel}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="terms"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  disabled={loading}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#1A2A22]"
                />
                <label htmlFor="terms" className="cursor-pointer font-sans text-[13px] leading-relaxed text-[#52685B]">
                  I agree to the{' '}
                  <a href="#" className="text-[#1A2A22] underline underline-offset-4 transition hover:text-[#B8902F]">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-[#1A2A22] underline underline-offset-4 transition hover:text-[#B8902F]">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative mt-2 inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-7 pr-2.5 text-base text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                <span className="relative z-10">{loading ? 'Creating account…' : 'Create account'}</span>
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-500 group-hover:-rotate-45"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </button>
            </form>

            <p className="mt-6 text-center font-sans text-sm text-[#52685B]">
              Already registered?{' '}
              <a
                href="/admin/login"
                className="text-[#1A2A22] underline underline-offset-4 transition hover:text-[#B8902F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
              >
                Admin login
              </a>
            </p>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 font-sans text-xs text-[#52685B] lg:hidden">
            <ShieldCheck size={14} aria-hidden="true" /> Authorised admin access only
          </p>
        </motion.div>
      </main>
    </div>
  );
}