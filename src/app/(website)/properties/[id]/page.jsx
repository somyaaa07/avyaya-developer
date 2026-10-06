'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Marcellus } from 'next/font/google';
import {
  AlertCircle,
  ArrowRight,
  Armchair,
  Bath,
  BedDouble,
  Building2,
  Calendar,
  Car,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Expand,
  Hammer,
  Heart,
  ImageOff,
  Layers,
  LayoutGrid,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  RefreshCw,
  Repeat,
  Ruler,
  SearchX,
  Share2,
  Sparkles,
  Tag,
  WifiOff,
  X,
} from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
});

const goldBg = 'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';
const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]';

const fieldBase =
  'w-full rounded-xl border border-[#0f2645]/15 bg-[#F3F0E8]/60 px-4 py-3 text-sm text-[#0f2645] outline-none transition placeholder:text-[#52685B]/60 focus:border-[#D4AF37] focus:bg-[#FAF9F6] focus:ring-4 focus:ring-[#FFCD39]/30 disabled:opacity-60 aria-[invalid=true]:border-red-300';
const labelBase = 'mb-1.5 block text-sm text-[#0f2645]';

const fullPrice = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? `₹${n.toLocaleString('en-IN')}` : `₹${v}`;
};

/* ---------------------------------------------------------------
   IMAGE GALLERY (swipe, keyboard, fullscreen)
---------------------------------------------------------------- */
function ImageGallery({ images = [], title }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [failed, setFailed] = useState({});
  const touchX = useRef(null);
  const thumbsRef = useRef(null);
  const total = images.length;

  const go = useCallback(
    (dir) => setCurrent((p) => (p + dir + total) % total),
    [total]
  );

  // Lightbox: Esc / arrows + body scroll lock
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, go]);

  // Active thumbnail hamesha visible rahe
  useEffect(() => {
    thumbsRef.current?.children[current]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [current]);

  // Agli image pehle se load kar lo
  useEffect(() => {
    if (total < 2) return;
    const next = new window.Image();
    next.src = images[(current + 1) % total].url;
  }, [current, images, total]);

  if (!total) {
    return (
      <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-3xl bg-[#F3F0E8] text-[#52685B]">
        <ImageOff size={32} strokeWidth={1.4} />
        <span className="text-sm">No images available</span>
      </div>
    );
  }

  const arrow = `absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#FAF9F6]/90 text-[#0f2645] shadow-md backdrop-blur transition hover:bg-[#F5D77A] ${focusRing}`;
  const onTouchStart = (e) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50 && total > 1) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const MainImage = ({ className }) =>
    failed[current] ? (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#FAF9F6]/70">
        <ImageOff size={32} strokeWidth={1.4} />
        <span className="text-sm">Image unavailable</span>
      </div>
    ) : (
      <img
        key={current}
        src={images[current].url}
        alt={`${title || 'Property'} – image ${current + 1}`}
        onError={() => setFailed((f) => ({ ...f, [current]: true }))}
        className={className}
      />
    );

  return (
    <div
      tabIndex={0}
      aria-label="Image gallery. Use left and right arrow keys to browse."
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      }}
      className="rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F3F0E8]"
    >
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#0f2645] shadow-[0_20px_50px_-25px_rgba(26,42,34,0.5)]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Open image fullscreen"
          className="block h-full w-full cursor-zoom-in"
        >
          <MainImage className="h-full w-full object-cover" />
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0f2645]/40 to-transparent" />

        <span className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-[#0f2645]/65 px-3 py-1.5 text-xs text-[#FAF9F6] backdrop-blur">
          <Expand size={12} aria-hidden="true" /> View
        </span>

        {total > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${arrow} left-4`}>
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${arrow} right-4`}>
              <ChevronRight size={20} />
            </button>
            <span aria-live="polite" className="absolute bottom-4 right-4 rounded-full bg-[#0f2645]/65 px-3 py-1 text-xs text-[#FAF9F6] backdrop-blur">
              {current + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div ref={thumbsRef} className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === current}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${focusRing} ${
                i === current
                  ? 'border-[#D4AF37] opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen viewer */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[70] flex flex-col bg-[#0f2645]/95 backdrop-blur-sm"
          onClick={() => setLightbox(false)}
        >
          <div className="flex items-center justify-between px-5 py-4 text-[#FAF9F6]" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm">{current + 1} / {total}</span>
            <button
              type="button"
              autoFocus
              onClick={() => setLightbox(false)}
              aria-label="Close viewer"
              className={`flex h-11 w-11 items-center justify-center rounded-full bg-[#FAF9F6]/10 transition hover:bg-[#F5D77A] hover:text-[#0f2645] ${focusRing}`}
            >
              <X size={20} />
            </button>
          </div>
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="h-full w-full" onClick={(e) => e.stopPropagation()}>
              <MainImage className="h-full w-full object-contain" />
            </div>
            {total > 1 && (
              <>
                <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous image" className={`${arrow} left-4`}>
                  <ChevronLeft size={20} />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next image" className={`${arrow} right-4`}>
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   SAVE + SHARE
---------------------------------------------------------------- */
function SaveButton({ propertyId }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/saved?property_id=${propertyId}`)
      .then((r) => r.json())
      .then((d) => setSaved(!!d.saved))
      .catch(() => {});
  }, [session, propertyId]);

  const toggle = async () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    // optimistic update, fail hone par wapas
    const prev = saved;
    setSaved(!prev);
    setFailed(false);
    setLoading(true);
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: propertyId }),
      });
      if (!res.ok) throw new Error('fail');
      const data = await res.json();
      setSaved(!!data.saved);
    } catch {
      setSaved(prev);
      setFailed(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-start sm:items-end">
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-pressed={saved}
        className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition ${focusRing} disabled:cursor-not-allowed disabled:opacity-60 ${
          saved
            ? 'border-red-300 bg-red-50 text-red-500'
            : 'border-[#0f2645]/20 bg-[#FAF9F6] text-[#52685B] hover:border-[#D4AF37] hover:text-[#0f2645]'
        }`}
      >
        <Heart size={16} className={saved ? 'fill-red-500' : ''} aria-hidden="true" />
        {saved ? 'Saved' : 'Save'}
      </button>
      {failed && (
        <p role="status" className="mt-1.5 text-xs text-red-600">
          Could not update. Try again.
        </p>
      )}
    </div>
  );
}

function ShareButton({ title }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user ne cancel kiya */
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex items-center gap-2 rounded-full border border-[#0f2645]/20 bg-[#FAF9F6] px-5 py-2.5 text-sm text-[#52685B] transition hover:border-[#D4AF37] hover:text-[#0f2645] ${focusRing}`}
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Link copied' : 'Share'}</span>
    </button>
  );
}

/* ---------------------------------------------------------------
   AGENT CARD
---------------------------------------------------------------- */
const waLink = (phone) => {
  const digits = phone ? phone.replace(/\D/g, '') : '';
  return digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent("Hi, I'm interested in your property listing.")}`
    : null;
};

function AgentCard({ agent }) {
  if (!agent) return null;
  const wa = waLink(agent.phone);

  const btn = `inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm transition ${focusRing}`;

  return (
    <div className="rounded-3xl border border-[#0f2645]/10 bg-[#FAF9F6] p-6">
      <h3 className={`${marcellus.className} text-xl text-[#0f2645]`}>Listed by</h3>

      <div className="mt-5 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0f2645] text-xl text-[#F5D77A] ring-2 ring-[#D4AF37]/40">
          {agent.photo ? (
            <img src={agent.photo} alt={agent.name} className="h-full w-full object-cover" />
          ) : (
            <span className={marcellus.className}>{agent.name?.[0]?.toUpperCase() || '?'}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-base font-medium text-[#0f2645]">{agent.name}</p>
          {agent.email && <p className="break-all text-[13px] text-[#52685B]">{agent.email}</p>}
          {agent.description && (
            <p className="mt-2 text-[13px] leading-relaxed text-[#52685B]">{agent.description}</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {agent.phone && (
          <a href={`tel:${agent.phone}`} className={`${btn} bg-[#0f2645] text-[#FAF9F6] hover:bg-[#52685B]`}>
            <Phone size={15} aria-hidden="true" /> Call
          </a>
        )}
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btn} bg-[#25D366] text-white hover:brightness-95`}>
            <MessageCircle size={15} aria-hidden="true" /> WhatsApp
          </a>
        )}
        {agent.email && (
          <a href={`mailto:${agent.email}`} className={`${btn} border border-[#0f2645]/20 bg-[#FAF9F6] text-[#0f2645] hover:border-[#D4AF37]`}>
            <Mail size={15} aria-hidden="true" /> Email
          </a>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   INQUIRY FORM (field-level validation)
---------------------------------------------------------------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (f) => {
  const e = {};
  if (!f.name.trim()) e.name = 'Please enter your name.';
  if (!f.email.trim()) e.email = 'Please enter your email.';
  else if (!EMAIL_RE.test(f.email.trim())) e.email = 'Enter a valid email address.';
  if (f.phone.trim() && f.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a valid phone number.';
  if (!f.message.trim()) e.message = 'Please write a short message.';
  return e;
};

function InquiryForm({ propertyId }) {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (session?.user) {
      setForm((p) => ({
        ...p,
        name: p.name || session.user.name || '',
        email: p.email || session.user.email || '',
      }));
    }
  }, [session]);

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  // blur par us field ko validate karo
  const onBlur = (key) => () => {
    const msg = validate(form)[key];
    setErrors((p) => ({ ...p, [key]: msg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`inq-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, property_id: propertyId }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setStatus('success');
        setForm((p) => ({ ...p, phone: '', message: '' }));
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Check your connection and try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div id="inquiry" aria-live="polite" className="scroll-mt-24 rounded-3xl border border-[#0f2645]/10 bg-[#FAF9F6] p-8 text-center">
        <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-[#0f2645] ${goldBg}`}>
          <CheckCircle2 size={26} aria-hidden="true" />
        </span>
        <p className={`${marcellus.className} mt-5 text-2xl text-[#0f2645]`}>Inquiry sent</p>
        <p className="mt-2 text-sm text-[#52685B]">The agent will contact you shortly.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className={`mt-5 rounded text-sm text-[#52685B] underline underline-offset-4 transition hover:text-[#0f2645] ${focusRing}`}
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const loading = status === 'loading';
  const err = (key) => errors[key] && (
    <p id={`inq-${key}-err`} className="mt-1.5 text-xs text-red-600">{errors[key]}</p>
  );
  const aria = (key) => ({
    'aria-invalid': !!errors[key],
    'aria-describedby': errors[key] ? `inq-${key}-err` : undefined,
  });

  return (
    <div id="inquiry" className="scroll-mt-24 rounded-3xl border border-[#0f2645]/10 bg-[#FAF9F6] p-6">
      <h3 className={`${marcellus.className} text-xl text-[#0f2645]`}>Send an inquiry</h3>
      {!session && (
        <p className="mt-1.5 text-[13px] text-[#52685B]">
          Send as a guest, or{' '}
          <Link href="/login" className="text-[#0f2645] underline underline-offset-4">
            log in
          </Link>{' '}
          to use your account.
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="inq-name" className={labelBase}>Your name *</label>
          <input id="inq-name" type="text" autoComplete="name" placeholder="e.g. John Smith" value={form.name} onChange={set('name')} onBlur={onBlur('name')} disabled={loading} className={fieldBase} {...aria('name')} />
          {err('name')}
        </div>
        <div>
          <label htmlFor="inq-email" className={labelBase}>Email *</label>
          <input id="inq-email" type="email" autoComplete="email" placeholder="john@example.com" value={form.email} onChange={set('email')} onBlur={onBlur('email')} disabled={loading} className={fieldBase} {...aria('email')} />
          {err('email')}
        </div>
        <div>
          <label htmlFor="inq-phone" className={labelBase}>Phone (optional)</label>
          <input id="inq-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} onBlur={onBlur('phone')} disabled={loading} className={fieldBase} {...aria('phone')} />
          {err('phone')}
        </div>
        <div>
          <label htmlFor="inq-message" className={labelBase}>Message *</label>
          <textarea
            id="inq-message"
            rows={4}
            maxLength={1000}
            placeholder="I'm interested in this property, please contact me."
            value={form.message}
            onChange={set('message')}
            onBlur={onBlur('message')}
            disabled={loading}
            className={`${fieldBase} resize-y`}
            {...aria('message')}
          />
          <div className="mt-1.5 flex items-start justify-between gap-3">
            <div>{err('message')}</div>
            <span className="ml-auto text-[11px] text-[#52685B]">{form.message.length}/1000</span>
          </div>
        </div>

        {status === 'error' && (
          <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`group relative inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-[#0f2645] py-2.5 pl-6 pr-2.5 text-sm text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#0f2645] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] ${focusRing} disabled:cursor-not-allowed disabled:opacity-70`}
        >
          <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100" />
          <span className="relative z-10">{loading ? 'Sending…' : 'Send inquiry'}</span>
          <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#0f2645] transition-all duration-500 group-hover:bg-none group-hover:bg-[#0f2645] group-hover:text-[#F5D77A]">
            {loading ? (
              <Loader2 size={17} className="animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRight size={16} className="transition-transform duration-500 group-hover:-rotate-45 motion-reduce:group-hover:rotate-0" aria-hidden="true" />
            )}
          </span>
        </button>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------
   MOBILE STICKY CONTACT BAR
---------------------------------------------------------------- */
function MobileContactBar({ agent }) {
  const wa = waLink(agent?.phone);
  const btn = `inline-flex h-12 items-center justify-center gap-2 rounded-full text-sm transition ${focusRing}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#0f2645]/10 bg-[#FAF9F6]/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(15,38,69,0.12)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-2">
        {agent?.phone && (
          <a href={`tel:${agent.phone}`} aria-label="Call agent" className={`${btn} w-12 shrink-0 bg-[#0f2645] text-[#F5D77A]`}>
            <Phone size={18} aria-hidden="true" />
          </a>
        )}
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp agent" className={`${btn} w-12 shrink-0 bg-[#25D366] text-white`}>
            <MessageCircle size={18} aria-hidden="true" />
          </a>
        )}
        <a
          href="#inquiry"
          className={`${btn} flex-1 ${goldBg} text-[#0f2645] shadow-[0_8px_20px_rgba(166,124,30,0.3)]`}
        >
          Send inquiry
        </a>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   SMALL PIECES
---------------------------------------------------------------- */
const TYPE_BADGE = {
  buy: 'bg-[#0f2645] text-[#F5D77A]',
  sell: `${goldBg} text-[#0f2645]`,
  rent: 'bg-[#F3F0E8] text-[#0f2645] ring-1 ring-[#0f2645]/15',
};

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#0f2645]/10 bg-[#FAF9F6] p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0f2645] text-[#F5D77A]">
        <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-[#52685B]">{label}</p>
        <p className="truncate text-[15px] capitalize text-[#0f2645]">{value}</p>
      </div>
    </div>
  );
}

/* Amenities / Highlights / Landmarks ke liye reusable section */
function TagSection({ title, icon: Icon, items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className="mt-8 rounded-3xl border border-[#0f2645]/10 bg-[#FAF9F6] p-6 sm:p-8">
      <h2 className="text-2xl">{title}</h2>
      <span aria-hidden="true" className={`mt-3 block h-[3px] w-14 rounded-full ${goldBg}`} />
      <ul className="mt-5 flex flex-wrap gap-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#F3F0E8] px-4 py-2 text-[13px] text-[#0f2645]"
          >
            <Icon size={14} className="text-[#B8902F]" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Lambi description ke liye Read more / Show less */
function Description({ text }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 450;

  return (
    <div className="mt-8 rounded-3xl border border-[#0f2645]/10 bg-[#FAF9F6] p-6 sm:p-8">
      <h2 className="text-2xl">About this property</h2>
      <span aria-hidden="true" className={`mt-3 block h-[3px] w-14 rounded-full ${goldBg}`} />
      <p
        className={`mt-5 whitespace-pre-line font-sans text-[15px] leading-[1.8] text-[#0f2645]/85 ${
          long && !open ? 'line-clamp-6' : ''
        }`}
      >
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`mt-4 rounded text-sm text-[#0f2645] underline underline-offset-4 transition hover:text-[#B8902F] ${focusRing}`}
        >
          {open ? 'Show less' : 'Read more'}
        </button>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl animate-pulse gap-8 px-5 py-10 sm:px-8 motion-reduce:animate-none lg:grid-cols-[1fr_380px]">
      <div>
        <div className="aspect-[16/10] rounded-3xl bg-[#52685B]/15" />
        <div className="mt-6 h-8 w-2/3 rounded-full bg-[#52685B]/15" />
        <div className="mt-3 h-4 w-1/3 rounded-full bg-[#52685B]/10" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 rounded-2xl bg-[#52685B]/10" />
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-40 rounded-3xl bg-[#52685B]/10" />
        <div className="h-96 rounded-3xl bg-[#52685B]/10" />
      </div>
    </div>
  );
}

function StateScreen({ icon: Icon, title, text, children }) {
  return (
    <div className="flex flex-col items-center px-6 py-28 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F3F0E8] text-[#B8902F]">
        <Icon size={34} strokeWidth={1.3} aria-hidden="true" />
      </span>
      <h1 className={`${marcellus.className} mt-6 text-3xl text-[#0f2645]`}>{title}</h1>
      <p className="mt-2 max-w-sm text-sm text-[#52685B]">{text}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  );
}

const darkPill = `inline-flex items-center gap-2 rounded-full bg-[#0f2645] px-6 py-3 text-sm text-[#FAF9F6] transition hover:bg-[#52685B] ${focusRing}`;

/* ---------------------------------------------------------------
   PAGE
---------------------------------------------------------------- */
export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setNotFound(false);
    setError(false);

    // NOTE: agent card ke liye ye route use ho raha hai (jaisa pehle tha).
    // Agar yahan se /api/properties/${id} karoge to GET me agent include karna padega.
    fetch(`/api/admin/properties/${id}`, { signal: controller.signal })
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        if (!r.ok) throw new Error('Request failed');
        return r.json();
      })
      .then((data) => {
        if (data) setProperty(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, [id, reloadKey]);

  const shell = `${marcellus.variable} min-h-screen bg-[#FAF9F6] font-[family-name:var(--font-marcellus)] font-normal text-[#0f2645]`;

  if (loading) return <div className={shell}><LoadingSkeleton /></div>;

  if (error)
    return (
      <div className={shell}>
        <StateScreen icon={WifiOff} title="Something went wrong" text="We couldn't load this property. Check your connection and try again.">
          <button type="button" onClick={() => setReloadKey((k) => k + 1)} className={darkPill}>
            <RefreshCw size={15} aria-hidden="true" /> Try again
          </button>
          <Link href="/properties" className={`${darkPill} !bg-[#FAF9F6] !text-[#0f2645] ring-1 ring-[#0f2645]/15 hover:!ring-[#D4AF37]`}>
            Back to properties
          </Link>
        </StateScreen>
      </div>
    );

  if (notFound || !property)
    return (
      <div className={shell}>
        <StateScreen icon={SearchX} title="Property not found" text="This property does not exist or has been removed.">
          <Link href="/properties" className={darkPill}>
            <ChevronLeft size={16} aria-hidden="true" /> Back to properties
          </Link>
        </StateScreen>
      </div>
    );

  const priceNum = Number(property.price);
  const perSqft =
    property.area && Number(property.area) > 0 && Number.isFinite(priceNum)
      ? Math.round(priceNum / Number(property.area)).toLocaleString('en-IN')
      : null;
  const images = property.images || [];
  const isActive = property.status === 'active';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [property.title, property.location, property.city].filter(Boolean).join(', ')
  )}`;

  const facts = [
    property.bedrooms && { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms },
    property.bathrooms && { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
    property.balcony != null && { icon: LayoutGrid, label: 'Balconies', value: property.balcony },
    property.area && { icon: Ruler, label: 'Area', value: `${property.area} sq ft` },
    property.property_type && { icon: Building2, label: 'Property type', value: property.property_type },
    property.type && { icon: Tag, label: 'Listing', value: `For ${property.type}` },
    property.transaction_type && { icon: Repeat, label: 'Transaction', value: property.transaction_type },
    property.furnishing && { icon: Armchair, label: 'Furnishing', value: property.furnishing },
    property.parking && { icon: Car, label: 'Parking', value: property.parking },
    property.facing && { icon: Compass, label: 'Facing', value: property.facing },
    property.age_of_property && { icon: Calendar, label: 'Age of property', value: property.age_of_property },
    property.construction_type && { icon: Hammer, label: 'Construction', value: property.construction_type },
    property.total_floors != null && { icon: Layers, label: 'Total floors', value: property.total_floors },
  ].filter(Boolean);

  return (
    <div className={shell}>
      <div className="mx-auto max-w-7xl px-5 pb-28 pt-8 sm:px-8 lg:pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-[#52685B]">
          <Link href="/" className="transition hover:text-[#0f2645]">Home</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <Link href="/properties" className="transition hover:text-[#0f2645]">Properties</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span aria-current="page" className="line-clamp-1 text-[#0f2645]">{property.title}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
          {/* ===== LEFT ===== */}
          <div className="min-w-0">
            <ImageGallery images={images} title={property.title} />

            {/* Title + price */}
            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {property.type && (
                    <span className={`rounded-full px-3.5 py-1 text-xs capitalize ${TYPE_BADGE[property.type] || TYPE_BADGE.rent}`}>
                      For {property.type}
                    </span>
                  )}
                  {property.status && (
                    <span
                      className={`rounded-full px-3.5 py-1 text-xs capitalize ${
                        isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {property.status}
                    </span>
                  )}
                </div>
                <h1 className="mt-3 text-3xl leading-tight sm:text-4xl">{property.title}</h1>
                <p className="mt-2 flex items-start gap-1.5 text-[15px] text-[#52685B]">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-[#B8902F]" aria-hidden="true" />
                  <span>
                    {property.location}
                    {property.city ? `, ${property.city}` : ''}
                    {property.location && (
                      <>
                        {' '}
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`ml-1 rounded text-[13px] text-[#0f2645] underline underline-offset-4 transition hover:text-[#B8902F] ${focusRing}`}
                        >
                          View on map
                        </a>
                      </>
                    )}
                  </span>
                </p>
              </div>

              <div className="shrink-0 sm:text-right">
                <p className="text-3xl text-[#0f2645] sm:text-4xl">
                  {fullPrice(property.price)}
                  {property.type === 'rent' && <span className="font-sans text-base text-[#52685B]"> /mo</span>}
                </p>
                {perSqft && <p className="mt-1 text-[13px] text-[#52685B]">₹{perSqft} / sq ft</p>}
                <div className="mt-3 flex flex-wrap items-start gap-2 sm:justify-end">
                  <SaveButton propertyId={id} />
                  <ShareButton title={property.title} />
                </div>
              </div>
            </div>

            {!isActive && property.status && (
              <p role="status" className="mt-6 flex items-start gap-2 rounded-2xl border border-[#D4AF37]/40 bg-[#FAF9F6] px-4 py-3 text-sm text-[#0f2645]">
                <AlertCircle size={17} className="mt-0.5 shrink-0 text-[#B8902F]" aria-hidden="true" />
                This listing is currently {property.status}. Details may be out of date, so confirm with the agent.
              </p>
            )}

            {/* Key facts */}
            {facts.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl">Overview</h2>
                <span aria-hidden="true" className={`mt-3 block h-[3px] w-14 rounded-full ${goldBg}`} />
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {facts.map((f) => (
                    <Fact key={f.label} {...f} />
                  ))}
                </div>
              </div>
            )}

            {property.description && <Description text={property.description} />}

            <TagSection title="Amenities" icon={CheckCircle2} items={property.amenities} />
            <TagSection title="Property highlights" icon={Sparkles} items={property.property_highlights} />
            <TagSection title="Nearby landmarks" icon={Navigation} items={property.nearby_landmarks} />
          </div>

          {/* ===== RIGHT ===== */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
            <AgentCard agent={property.agent} />
            <InquiryForm propertyId={id} />
          </aside>
        </div>
      </div>

      <MobileContactBar agent={property.agent} />
    </div>
  );
}