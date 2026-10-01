'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Marcellus } from 'next/font/google';
import {
  AlertCircle,
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  ImageOff,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Ruler,
  Tag,
  SearchX,
} from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
});

const goldBg = 'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';

const fieldBase =
  'w-full rounded-xl border border-[#1A2A22]/15 bg-[#F3F0E8]/60 px-4 py-3 text-sm text-[#1A2A22] outline-none transition placeholder:text-[#52685B]/60 focus:border-[#D4AF37] focus:bg-[#FAF9F6] focus:ring-4 focus:ring-[#FFCD39]/30 disabled:opacity-60';
const labelBase = 'mb-1.5 block text-sm text-[#1A2A22]';

/* ---------------------------------------------------------------
   IMAGE GALLERY
---------------------------------------------------------------- */
function ImageGallery({ images = [], title }) {
  const [current, setCurrent] = useState(0);
  const total = images.length;

  const go = useCallback(
    (dir) => setCurrent((p) => (p + dir + total) % total),
    [total]
  );

  if (!total) {
    return (
      <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-2 rounded-3xl bg-[#F3F0E8] text-[#52685B]">
        <ImageOff size={32} strokeWidth={1.4} />
        <span className="text-sm">No images available</span>
      </div>
    );
  }

  const arrow =
    'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#FAF9F6]/90 text-[#1A2A22] shadow-md backdrop-blur transition hover:bg-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]';

  return (
    <div
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
      }}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-[#1A2A22] shadow-[0_20px_50px_-25px_rgba(26,42,34,0.5)]">
        <img
          key={current}
          src={images[current].url}
          alt={`${title || 'Property'} – image ${current + 1}`}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#1A2A22]/40 to-transparent" />

        {total > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${arrow} left-4`}>
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${arrow} right-4`}>
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-4 right-4 rounded-full bg-[#1A2A22]/65 px-3 py-1 text-xs text-[#FAF9F6] backdrop-blur">
              {current + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === current}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                i === current
                  ? 'border-[#D4AF37] opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   SAVE BUTTON
---------------------------------------------------------------- */
function SaveButton({ propertyId }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/saved?property_id=${propertyId}`)
      .then((r) => r.json())
      .then((d) => setSaved(!!d.saved))
      .catch(() => {});
  }, [session, propertyId]);

  const toggle = async () => {
    if (!session) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: propertyId }),
      });
      const data = await res.json();
      setSaved(!!data.saved);
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-60 ${
        saved
          ? 'border-red-300 bg-red-50 text-red-500'
          : 'border-[#1A2A22]/20 bg-[#FAF9F6] text-[#52685B] hover:border-[#D4AF37] hover:text-[#1A2A22]'
      }`}
    >
      <Heart size={16} className={saved ? 'fill-red-500' : ''} aria-hidden="true" />
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}

/* ---------------------------------------------------------------
   AGENT CARD
---------------------------------------------------------------- */
function AgentCard({ agent }) {
  if (!agent) return null;
  const digits = agent.phone ? agent.phone.replace(/\D/g, '') : '';
  const wa = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent("Hi, I'm interested in your property listing.")}`
    : null;

  const btn =
    'inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]';

  return (
    <div className="rounded-3xl border border-[#1A2A22]/10 bg-[#FAF9F6] p-6">
      <h3 className={`${marcellus.className} text-xl text-[#1A2A22]`}>Listed by</h3>

      <div className="mt-5 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1A2A22] text-xl text-[#F5D77A] ring-2 ring-[#D4AF37]/40">
          {agent.photo ? (
            <img src={agent.photo} alt={agent.name} className="h-full w-full object-cover" />
          ) : (
            <span className={marcellus.className}>{agent.name?.[0]?.toUpperCase() || '?'}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-base font-medium text-[#1A2A22]">{agent.name}</p>
          {agent.email && <p className="break-all text-[13px] text-[#52685B]">{agent.email}</p>}
          {agent.description && (
            <p className="mt-2 text-[13px] leading-relaxed text-[#52685B]">{agent.description}</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {agent.phone && (
          <a href={`tel:${agent.phone}`} className={`${btn} bg-[#1A2A22] text-[#FAF9F6] hover:bg-[#52685B]`}>
            <Phone size={15} aria-hidden="true" /> Call
          </a>
        )}
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btn} bg-[#25D366] text-white hover:brightness-95`}
          >
            <MessageCircle size={15} aria-hidden="true" /> WhatsApp
          </a>
        )}
        {agent.email && (
          <a
            href={`mailto:${agent.email}`}
            className={`${btn} border border-[#1A2A22]/20 bg-[#FAF9F6] text-[#1A2A22] hover:border-[#D4AF37]`}
          >
            <Mail size={15} aria-hidden="true" /> Email
          </a>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   INQUIRY FORM
---------------------------------------------------------------- */
function InquiryForm({ propertyId }) {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (session?.user) {
      setForm((p) => ({
        ...p,
        name: session.user.name || p.name,
        email: session.user.email || p.email,
      }));
    }
  }, [session]);

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrorMsg('Name, email and message are required.');
      setStatus('error');
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
      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setForm((p) => ({ ...p, phone: '', message: '' }));
      } else {
        setErrorMsg(data.error || 'Something went wrong.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div aria-live="polite" className="rounded-3xl border border-[#1A2A22]/10 bg-[#FAF9F6] p-8 text-center">
        <span className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-[#1A2A22] ${goldBg}`}>
          <CheckCircle2 size={26} aria-hidden="true" />
        </span>
        <p className={`${marcellus.className} mt-5 text-2xl text-[#1A2A22]`}>Inquiry sent</p>
        <p className="mt-2 text-sm text-[#52685B]">The agent will contact you shortly.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-5 text-sm text-[#52685B] underline underline-offset-4 transition hover:text-[#1A2A22]"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const loading = status === 'loading';

  return (
    <div className="rounded-3xl border border-[#1A2A22]/10 bg-[#FAF9F6] p-6">
      <h3 className={`${marcellus.className} text-xl text-[#1A2A22]`}>Send an inquiry</h3>
      {!session && (
        <p className="mt-1.5 text-[13px] text-[#52685B]">
          Send as a guest, or{' '}
          <Link href="/login" className="text-[#1A2A22] underline underline-offset-4">
            log in
          </Link>{' '}
          to use your account.
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
        <div>
          <label htmlFor="inq-name" className={labelBase}>Your name *</label>
          <input id="inq-name" type="text" autoComplete="name" placeholder="e.g. John Smith" value={form.name} onChange={set('name')} disabled={loading} className={fieldBase} />
        </div>
        <div>
          <label htmlFor="inq-email" className={labelBase}>Email *</label>
          <input id="inq-email" type="email" autoComplete="email" placeholder="john@example.com" value={form.email} onChange={set('email')} disabled={loading} className={fieldBase} />
        </div>
        <div>
          <label htmlFor="inq-phone" className={labelBase}>Phone (optional)</label>
          <input id="inq-phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} disabled={loading} className={fieldBase} />
        </div>
        <div>
          <label htmlFor="inq-msg" className={labelBase}>Message *</label>
          <textarea
            id="inq-msg"
            rows={4}
            placeholder="I'm interested in this property, please contact me."
            value={form.message}
            onChange={set('message')}
            disabled={loading}
            className={`${fieldBase} resize-y`}
          />
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
          className="group relative inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-6 pr-2.5 text-sm text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100" />
          <span className="relative z-10">{loading ? 'Sending…' : 'Send inquiry'}</span>
          <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
            {loading ? (
              <Loader2 size={17} className="animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRight size={16} className="transition-transform duration-500 group-hover:-rotate-45" aria-hidden="true" />
            )}
          </span>
        </button>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------
   SMALL PIECES
---------------------------------------------------------------- */
const TYPE_BADGE = {
  buy: 'bg-[#1A2A22] text-[#F5D77A]',
  sell: `${goldBg} text-[#1A2A22]`,
  rent: 'bg-[#F3F0E8] text-[#1A2A22] ring-1 ring-[#1A2A22]/15',
};

function Fact({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#1A2A22]/10 bg-[#FAF9F6] p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1A2A22] text-[#F5D77A]">
        <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-[#52685B]">{label}</p>
        <p className="truncate text-[15px] capitalize text-[#1A2A22]">{value}</p>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl animate-pulse gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_380px]">
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

function NotFound() {
  return (
    <div className="flex flex-col items-center px-6 py-28 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F3F0E8] text-[#B8902F]">
        <SearchX size={34} strokeWidth={1.3} aria-hidden="true" />
      </span>
      <h1 className={`${marcellus.className} mt-6 text-3xl text-[#1A2A22]`}>Property not found</h1>
      <p className="mt-2 max-w-sm text-sm text-[#52685B]">
        This property does not exist or has been removed.
      </p>
      <Link
        href="/properties"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1A2A22] px-6 py-3 text-sm text-[#FAF9F6] transition hover:bg-[#52685B]"
      >
        <ChevronLeft size={16} aria-hidden="true" /> Back to properties
      </Link>
    </div>
  );
}

/* ---------------------------------------------------------------
   PAGE
---------------------------------------------------------------- */
export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/properties/${id}`)
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setProperty(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const shell = `${marcellus.variable} min-h-screen bg-[#F3F0E8] font-[family-name:var(--font-marcellus)] font-normal text-[#1A2A22]`;

  if (loading) return <div className={shell}><LoadingSkeleton /></div>;
  if (notFound || !property) return <div className={shell}><NotFound /></div>;

  const priceNum = Number(property.price);
  const price = Number.isFinite(priceNum) ? priceNum.toLocaleString('en-IN') : property.price;
  const perSqft =
    property.area && Number.isFinite(priceNum)
      ? Math.round(priceNum / Number(property.area)).toLocaleString('en-IN')
      : null;
  const images = property.images || [];
  const isActive = property.status === 'active';

  const facts = [
    property.bedrooms && { icon: BedDouble, label: 'Bedrooms', value: property.bedrooms },
    property.bathrooms && { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
    property.area && { icon: Ruler, label: 'Area', value: `${property.area} sq ft` },
    property.property_type && { icon: Building2, label: 'Property type', value: property.property_type },
    property.type && { icon: Tag, label: 'Listing', value: `For ${property.type}` },
  ].filter(Boolean);

  return (
    <div className={shell}>
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-[#52685B]">
          <Link href="/" className="transition hover:text-[#1A2A22]">Home</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <Link href="/properties" className="transition hover:text-[#1A2A22]">Properties</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="line-clamp-1 text-[#1A2A22]">{property.title}</span>
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
                  {property.location}
                  {property.city ? `, ${property.city}` : ''}
                </p>
              </div>

              <div className="shrink-0 sm:text-right">
                <p className="text-3xl text-[#1A2A22] sm:text-4xl">
                  ₹{price}
                  {property.type === 'rent' && <span className="font-sans text-base text-[#52685B]"> /mo</span>}
                </p>
                {perSqft && <p className="mt-1 text-[13px] text-[#52685B]">₹{perSqft} / sq ft</p>}
                <div className="mt-3 sm:flex sm:justify-end">
                  <SaveButton propertyId={id} />
                </div>
              </div>
            </div>

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

            {/* Description */}
            {property.description && (
              <div className="mt-8 rounded-3xl border border-[#1A2A22]/10 bg-[#FAF9F6] p-6 sm:p-8">
                <h2 className="text-2xl">About this property</h2>
                <span aria-hidden="true" className={`mt-3 block h-[3px] w-14 rounded-full ${goldBg}`} />
                <p className="mt-5 whitespace-pre-line font-sans text-[15px] leading-[1.8] text-[#1A2A22]/85">
                  {property.description}
                </p>
              </div>
            )}
          </div>

          {/* ===== RIGHT ===== */}
          <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
            <AgentCard agent={property.agent} />
            <InquiryForm propertyId={id} />
          </aside>
        </div>
      </div>
    </div>
  );
}