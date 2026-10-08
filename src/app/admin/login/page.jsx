'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { signIn, signOut, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Marcellus } from 'next/font/google';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';

const marcellus = Marcellus({ subsets: ['latin'], weight: '400', display: 'swap' });

const goldBg = 'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';
const EMAIL_KEY = 'Avyaya_admin_email';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass = (invalid) =>
  `w-full rounded-xl border bg-[#F3F0E8]/60 py-3.5 pl-11 pr-4 font-sans text-[15px] text-[#0f2645] outline-none transition placeholder:text-[#52685B]/60 hover:border-[#0f2645]/30 focus:bg-white focus:ring-4 disabled:opacity-60 ${
    invalid
      ? 'border-[#9C3B2B] focus:border-[#9C3B2B] focus:ring-[#9C3B2B]/15'
      : 'border-[#0f2645]/15 focus:border-[#D4AF37] focus:ring-[#FFCD39]/30'
  }`;

/* ---------- Architectural line drawing (brand panel) ---------- */
const windows = (x, y, cols, rows, w, h, gx, gy) => {
  let d = '';
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) d += `M${x + c * (w + gx)} ${y + r * (h + gy)}h${w}v${h}h-${w}z`;
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
    <svg viewBox="0 0 420 360" fill="none" stroke="#D4AF37" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-auto w-full">
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

const FieldError = ({ id, children }) =>
  children ? (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-[#9C3B2B]">
      <AlertCircle size={13} aria-hidden="true" /> {children}
    </p>
  ) : null;

export default function LoginPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const emailRef = useRef(null);
  const passRef = useRef(null);

  const [form, setForm] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  /* Field-level validation */
  const fieldErrors = {
    email: !form.email.trim()
      ? 'Enter your email address.'
      : !EMAIL_RE.test(form.email.trim())
      ? 'That doesn’t look like a valid email.'
      : '',
    password: !form.password ? 'Enter your password.' : '',
  };
  const show = (k) => touched[k] && fieldErrors[k];

  useEffect(() => {
    // Restore remembered email, focus the right field
    let saved = '';
    try { saved = localStorage.getItem(EMAIL_KEY) || ''; } catch {}
    if (saved) setForm((f) => ({ ...f, email: saved }));
    (saved ? passRef : emailRef).current?.focus();

    // Already signed in as admin? Skip the form.
    getSession().then((s) => {
      if (s?.user?.role?.toLowerCase() === 'admin') {
        setRedirecting(true);
        router.replace('/admin');
      }
    });

    fetch('/api/signup')
      .then((r) => r.json())
      .then((d) => setNeedsSetup(!!d.needsSetup))
      .catch(() => {});
  }, [router]);

  const fail = (msg, { clearPassword = true } = {}) => {
    setLoading(false);
    setError(msg);
    setAttempts((a) => a + 1);
    if (clearPassword) setForm((f) => ({ ...f, password: '' }));
    requestAnimationFrame(() => passRef.current?.focus());
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (loading) return;
    setTouched({ email: true, password: true });
    setError('');

    if (fieldErrors.email) return emailRef.current?.focus();
    if (fieldErrors.password) return passRef.current?.focus();

    setLoading(true);
    const email = form.email.trim();

    try {
      const res = await signIn('credentials', { email, password: form.password, redirect: false });

      if (res?.error) return fail('Email or password is incorrect. Please check and try again.');

      const session = await getSession();
      if (session?.user?.role?.toLowerCase() !== 'admin') {
        await signOut({ redirect: false });
        return fail('This account doesn’t have admin access.', { clearPassword: true });
      }

      try {
        remember ? localStorage.setItem(EMAIL_KEY, email) : localStorage.removeItem(EMAIL_KEY);
      } catch {}

      // Go back to the page the admin was trying to open (same-site /admin paths only)
      const cb = new URLSearchParams(window.location.search).get('callbackUrl');
      const safe = cb && cb.startsWith('/admin') && !cb.startsWith('//') ? cb : '/admin';
      setRedirecting(true);
      router.push(safe);
    } catch {
      fail('Couldn’t reach the server. Check your connection and try again.', { clearPassword: false });
    }
  };

  const busy = loading || redirecting;

  return (
    <div className={`${marcellus.className} grid min-h-screen bg-[#FAF9F6] font-normal text-[#0f2645] lg:grid-cols-[1.05fr_1fr]`}>
      {/* ===== Brand panel (desktop) ===== */}
      <aside className="relative hidden overflow-hidden bg-[#0f2645] p-12 text-[#FAF9F6] lg:flex lg:flex-col lg:justify-between">
        <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
        <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <Link href="/" className="relative inline-flex w-fit items-center gap-2 font-sans text-sm text-[#FAF9F6]/70 transition hover:text-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]">
          <ArrowLeft size={16} aria-hidden="true" /> Back to website
        </Link>

        <div className="relative">
          <h2 className="mt-3 text-5xl leading-[1.1] xl:text-6xl">avyaya developer</h2>
          <span aria-hidden="true" className={`mt-6 block h-[3px] w-16 rounded-full ${goldBg}`} />
          <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-[#FAF9F6]/70">
            Manage properties and inquiries from one place.
          </p>
        </div>

        <div className="relative">
          <div className="mx-auto mb-8 w-full max-w-md"><Elevation reduce={reduce} /></div>
          <p className="flex items-center gap-2 border-t border-[#D4AF37]/25 pt-5 font-sans text-sm text-[#FAF9F6]/50">
            <ShieldCheck size={16} className="text-[#F5D77A]" aria-hidden="true" /> Authorised admin access only
          </p>
        </div>
      </aside>

      {/* ===== Form side ===== */}
      <main className="relative flex items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F3F0E8] blur-2xl" />

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-full max-w-md"
        >
          <Link href="/" className="mb-6 inline-flex items-center gap-2 font-sans text-sm text-[#52685B] transition hover:text-[#0f2645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] lg:hidden">
            <ArrowLeft size={16} aria-hidden="true" /> Back to website
          </Link>

          <div className="relative overflow-hidden rounded-3xl border border-[#0f2645]/10 bg-white p-7 shadow-[0_24px_60px_-20px_rgba(26,42,34,0.25)] sm:p-10">
            <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />

            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A] ring-1 ring-[#D4AF37]/50">
              <ShieldCheck size={22} aria-hidden="true" />
            </span>

            <h1 className="mt-6 text-4xl leading-tight">Admin login</h1>
            <span aria-hidden="true" className={`mt-4 block h-[3px] w-14 rounded-full ${goldBg}`} />
            <p className="mt-4 font-sans text-[15px] text-[#52685B]">Sign in to manage properties and inquiries.</p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              {/* Form-level error (wrong password, no access, network) */}
              {error && (
                <motion.div
                  role="alert"
                  initial={reduce ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-[#9C3B2B]/25 bg-[#F6E3DF] px-4 py-3 font-sans text-sm text-[#9C3B2B]"
                >
                  <p className="flex items-start gap-2.5">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> {error}
                  </p>
                  {attempts >= 3 && (
                    <p className="mt-2 pl-[26px] text-xs text-[#9C3B2B]/85">
                      Still stuck? Make sure Caps Lock is off, or ask the site owner to reset your password.
                    </p>
                  )}
                </motion.div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-sm">Email address</label>
                <div className="relative">
                  <Mail size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#52685B]" />
                  <input
                    ref={emailRef}
                    id="login-email"
                    type="email"
                    inputMode="email"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); if (error) setError(''); }}
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    disabled={busy}
                    aria-invalid={!!show('email')}
                    aria-describedby={show('email') ? 'email-err' : undefined}
                    className={inputClass(!!show('email'))}
                  />
                  {touched.email && !fieldErrors.email && (
                    <Check size={17} aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4A62A]" />
                  )}
                </div>
                <FieldError id="email-err">{show('email')}</FieldError>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-sm">Password</label>
                <div className="relative">
                  <Lock size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#52685B]" />
                  <input
                    ref={passRef}
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => { setForm({ ...form, password: e.target.value }); if (error) setError(''); }}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    onKeyUp={(e) => setCapsOn(e.getModifierState?.('CapsLock') ?? false)}
                    onKeyDown={(e) => setCapsOn(e.getModifierState?.('CapsLock') ?? false)}
                    disabled={busy}
                    aria-invalid={!!show('password')}
                    aria-describedby={[show('password') && 'pass-err', capsOn && 'caps-hint'].filter(Boolean).join(' ') || undefined}
                    className={`${inputClass(!!show('password'))} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#52685B] transition hover:bg-[#0f2645]/5 hover:text-[#0f2645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                  >
                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>
                {capsOn && (
                  <p id="caps-hint" className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-[#8A6A14]">
                    <AlertCircle size={13} aria-hidden="true" /> Caps Lock is on.
                  </p>
                )}
                <FieldError id="pass-err">{show('password')}</FieldError>
              </div>

              {/* Remember email */}
              <label className="flex w-fit cursor-pointer items-center gap-2.5 font-sans text-sm text-[#52685B]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={busy}
                  className="h-4 w-4 cursor-pointer rounded border-[#0f2645]/30 accent-[#0f2645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                />
                Remember my email on this device
              </label>

              <button
                type="submit"
                disabled={busy}
                aria-busy={busy}
                className="group relative mt-2 inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-[#0f2645] py-2.5 pl-7 pr-2.5 text-base text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#0f2645] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <span className="relative z-10">
                  {redirecting ? 'Opening dashboard…' : loading ? 'Signing in…' : 'Sign in'}
                </span>
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#0f2645] transition-all duration-500 group-hover:bg-none group-hover:bg-[#0f2645] group-hover:text-[#F5D77A]">
                  {busy ? (
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight size={16} className="transition-transform duration-500 group-hover:-rotate-45" aria-hidden="true" />
                  )}
                </span>
              </button>
            </form>

            {needsSetup && (
              <div className="mt-8 rounded-2xl border border-[#D4AF37]/40 bg-[#F3F0E8] p-5 text-center font-sans text-sm text-[#52685B]">
                No admin account exists yet.{' '}
                <Link href="/admin/signup" className="text-[#0f2645] underline underline-offset-4 transition hover:text-[#B8902F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]">
                  Register the first admin
                </Link>
              </div>
            )}
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 font-sans text-xs text-[#52685B] lg:hidden">
            <ShieldCheck size={14} aria-hidden="true" /> Authorised admin access only
          </p>
        </motion.div>
      </main>
    </div>
  );
}