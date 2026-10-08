'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Marcellus } from 'next/font/google';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  Loader2,
  Lock,
  Mail,
  MessageSquare,
  User,
} from 'lucide-react';

const marcellus = Marcellus({ subsets: ['latin'], weight: '400', display: 'swap' });

const goldBg = 'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Sirf apni site ke andar ka callback allow karo (open redirect se bachne ke liye) */
const safeCallback = (raw) =>
  raw && raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/login') && !raw.startsWith('/signup')
    ? raw
    : null;

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

const perks = [
  { icon: Heart, text: 'Save properties you like and find them later' },
  { icon: MessageSquare, text: 'Track every inquiry you send in one place' },
  { icon: Building2, text: 'Get updates on new projects from avyaya developer' },
];

/* ---------- Password strength ---------- */
const getStrength = (val) => {
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return score;
};

const strengthMeta = (score) => {
  if (score <= 1) return { label: 'Weak password', color: '#9C3B2B' };
  if (score === 2) return { label: 'Fair password', color: '#E2A10D' };
  if (score === 3) return { label: 'Good password', color: '#B8902F' };
  return { label: 'Strong password', color: '#52685B' };
};

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();
  const callbackUrl = safeCallback(searchParams.get('callbackUrl'));

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passRef = useRef(null);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsOn, setCapsOn] = useState(false);
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  /* Field-level validation */
  const fieldErrors = {
    name: !form.name.trim() ? 'Enter your full name.' : '',
    email: !form.email.trim()
      ? 'Enter your email address.'
      : !EMAIL_RE.test(form.email.trim())
      ? 'That doesn’t look like a valid email.'
      : '',
    password: !form.password
      ? 'Create a password.'
      : form.password.length < 8
      ? 'Use at least 8 characters.'
      : '',
    terms: !terms ? 'Accept the Terms of Service and Privacy Policy to continue.' : '',
  };
  const show = (k) => touched[k] && fieldErrors[k];

  const strengthScore = getStrength(form.password);
  const { label: strengthLabel, color: strengthColor } = strengthMeta(strengthScore);

  const loginHref = callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : '/login';

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (loading || success) return;
    setTouched({ name: true, email: true, password: true, terms: true });
    setError('');

    if (fieldErrors.name) return nameRef.current?.focus();
    if (fieldErrors.email) return emailRef.current?.focus();
    if (fieldErrors.password) return passRef.current?.focus();
    if (fieldErrors.terms) return;

    setLoading(true);

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      let data = {};
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        setLoading(false);
        setError(data?.error || 'Couldn’t create your account. Please try again.');
        return;
      }

      setSuccess('Account created. Taking you to sign in…');
      setTimeout(() => router.push(loginHref), 1800);
      // loading true hi rehne do, page change hone tak button disabled rahe
    } catch {
      setLoading(false);
      setError('Couldn’t reach the server. Check your connection and try again.');
    }
  };

  const busy = loading || !!success;

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
          <h2 className="text-5xl leading-[1.1] xl:text-6xl">avyaya developer</h2>
          <span aria-hidden="true" className={`mt-6 block h-[3px] w-16 rounded-full ${goldBg}`} />
          <p className="mt-6 max-w-sm font-sans text-base leading-relaxed text-[#FAF9F6]/70">
            Create your free account and keep your property search in one place.
          </p>

          <ul className="mt-8 space-y-4 font-sans text-[15px] text-[#FAF9F6]/80">
            {perks.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-[#F5D77A] ring-1 ring-[#D4AF37]/40">
                  <Icon size={16} aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="mx-auto w-full max-w-md"><Elevation reduce={reduce} /></div>
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

            <h1 className="text-4xl leading-tight">Create your account</h1>
            <span aria-hidden="true" className={`mt-4 block h-[3px] w-14 rounded-full ${goldBg}`} />
            <p className="mt-4 font-sans text-[15px] text-[#52685B]">
              Sign up to save properties and track your inquiries.
            </p>

            <form onSubmit={handleSubmit} noValidate aria-busy={busy} className="mt-8 space-y-5">
              {/* Form-level error */}
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
                </motion.div>
              )}

              {/* Success */}
              {success && (
                <motion.div
                  role="status"
                  initial={reduce ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-[#D4AF37]/50 bg-[#F3F0E8] px-4 py-3 font-sans text-sm text-[#0f2645]"
                >
                  <p className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#B8902F]" aria-hidden="true" /> {success}
                  </p>
                </motion.div>
              )}

              {/* Name */}
              <div>
                <label htmlFor="signup-name" className="mb-1.5 block text-sm">Full name</label>
                <div className="relative">
                  <User size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#52685B]" />
                  <input
                    ref={nameRef}
                    id="signup-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => { setForm({ ...form, name: e.target.value }); if (error) setError(''); }}
                    onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                    disabled={busy}
                    aria-invalid={!!show('name')}
                    aria-describedby={show('name') ? 'name-err' : undefined}
                    className={inputClass(!!show('name'))}
                  />
                  {touched.name && !fieldErrors.name && (
                    <Check size={17} aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4A62A]" />
                  )}
                </div>
                <FieldError id="name-err">{show('name')}</FieldError>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="mb-1.5 block text-sm">Email address</label>
                <div className="relative">
                  <Mail size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#52685B]" />
                  <input
                    ref={emailRef}
                    id="signup-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
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
                <label htmlFor="signup-password" className="mb-1.5 block text-sm">Password</label>
                <div className="relative">
                  <Lock size={17} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#52685B]" />
                  <input
                    ref={passRef}
                    id="signup-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={(e) => { setForm({ ...form, password: e.target.value }); if (error) setError(''); }}
                    onBlur={() => { setTouched((t) => ({ ...t, password: true })); setCapsOn(false); }}
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

                {/* Strength meter */}
                {form.password && (
                  <div className="mt-2.5" aria-live="polite">
                    <div className="flex gap-1.5" aria-hidden="true">
                      {[1, 2, 3, 4].map((i) => (
                        <span
                          key={i}
                          className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                          style={{ background: i <= strengthScore ? strengthColor : 'rgba(15,38,69,0.1)' }}
                        />
                      ))}
                    </div>
                    <p className="mt-1.5 font-sans text-xs" style={{ color: strengthColor }}>{strengthLabel}</p>
                  </div>
                )}

                {capsOn && (
                  <p id="caps-hint" role="status" className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-[#8A6A14]">
                    <AlertCircle size={13} aria-hidden="true" /> Caps Lock is on.
                  </p>
                )}
                <FieldError id="pass-err">{show('password')}</FieldError>
              </div>

              {/* Terms */}
              <div>
                <label className="flex cursor-pointer items-start gap-2.5 font-sans text-sm leading-relaxed text-[#52685B]">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => { setTerms(e.target.checked); setTouched((t) => ({ ...t, terms: true })); }}
                    disabled={busy}
                    aria-invalid={!!show('terms')}
                    aria-describedby={show('terms') ? 'terms-err' : undefined}
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-[#0f2645]/30 accent-[#0f2645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
                  />
                  <span>
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#0f2645] underline underline-offset-4 hover:text-[#B8902F]">Terms of Service</Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-[#0f2645] underline underline-offset-4 hover:text-[#B8902F]">Privacy Policy</Link>
                  </span>
                </label>
                <FieldError id="terms-err">{show('terms')}</FieldError>
              </div>

              <button
                type="submit"
                disabled={busy}
                aria-busy={busy}
                className="group relative mt-2 inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-[#0f2645] py-2.5 pl-7 pr-2.5 text-base text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#0f2645] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <span className="relative z-10">
                  {success ? 'Taking you to sign in…' : loading ? 'Creating account…' : 'Create account'}
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

            {/* Sign in */}
            <div className="mt-8 rounded-2xl border border-[#D4AF37]/40 bg-[#F3F0E8] p-5 text-center font-sans text-sm text-[#52685B]">
              Already have an account?{' '}
              <Link href={loginHref} className="text-[#0f2645] underline underline-offset-4 transition hover:text-[#B8902F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]">
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

/* useSearchParams ke liye Suspense zaroori hai */
export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6]" />}>
      <SignupForm />
    </Suspense>
  );
}