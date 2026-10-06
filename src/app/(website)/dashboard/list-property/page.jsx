'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Marcellus } from 'next/font/google';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Minus,
  Plus,
} from 'lucide-react';
import ImageUpload from '@/component/ImageUploads';
import TagInput from '@/component/TagInput';

const marcellus = Marcellus({ subsets: ['latin'], weight: '400', display: 'swap' });

const goldBg = 'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';

/* ── Option lists ─────────────────────────────────────────── */
const LISTING_TYPES = [
  { value: 'sell', label: 'Sell' },
  { value: 'rent', label: 'Rent' },
  { value: 'buy', label: 'Buy' },
];
const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'plot', 'commercial'].map((v) => ({
  value: v,
  label: v.charAt(0).toUpperCase() + v.slice(1),
}));

const FURNISHING = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi-furnished', label: 'Semi-furnished' },
  { value: 'furnished', label: 'Furnished' },
];
const PARKING = [
  { value: 'none', label: 'None' },
  { value: 'bike', label: 'Bike' },
  { value: 'car', label: 'Car' },
  { value: 'both', label: 'Car + Bike' },
];
const TRANSACTION = [
  { value: 'new', label: 'New' },
  { value: 'resale', label: 'Resale' },
];
const FACING = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map((v) => ({
  value: v,
  label: v,
}));

const AMENITY_SUGGESTIONS = ['Lift', 'Power Backup', 'Gym', 'Swimming Pool', 'Security', 'CCTV', 'Club House', 'Park', 'Play Area', 'Gated Society'];
const HIGHLIGHT_SUGGESTIONS = ['Corner Property', 'Park Facing', 'Main Road', 'Vastu Compliant', 'Ready to Move', 'Newly Built', 'Prime Location'];
const LANDMARK_SUGGESTIONS = ['Metro Station', 'School', 'Hospital', 'Shopping Mall', 'Market', 'Bus Stand', 'Highway'];

const toNum = (v) => (v === '' || v == null ? null : Number(v));

const EMPTY_FORM = {
  title: '',
  description: '',
  price: '',
  type: 'sell',
  property_type: 'apartment',
  location: '',
  city: '',
  area: '',
  bedrooms: '',
  bathrooms: '',
  balcony: '',
  total_floors: '',
  age_of_property: '',
  furnishing: '',
  transaction_type: '',
  parking: '',
  facing: '',
  construction_type: '',
  amenities: [],
  nearby_landmarks: [],
  property_highlights: [],
  status: 'active',
  images: [],
};

/* ── Helpers ──────────────────────────────────────────────── */
const priceWords = (v) => {
  const n = Number(v);
  if (!n || n <= 0) return '';
  if (n >= 1e7) return `${+(n / 1e7).toFixed(2)} Crore`;
  if (n >= 1e5) return `${+(n / 1e5).toFixed(2)} Lakh`;
  if (n >= 1e3) return `${+(n / 1e3).toFixed(1)} Thousand`;
  return '';
};

/* ── Shared styles ────────────────────────────────────────── */
const inputCls = (invalid) =>
  `w-full rounded-xl border bg-[#F3F0E8]/60 px-4 py-3 font-sans text-[15px] text-[#0f2645] outline-none transition placeholder:text-[#52685B]/60 hover:border-[#0f2645]/30 focus:bg-white focus:ring-4 disabled:opacity-60 ${
    invalid
      ? 'border-[#9C3B2B] focus:border-[#9C3B2B] focus:ring-[#9C3B2B]/15'
      : 'border-[#0f2645]/15 focus:border-[#D4AF37] focus:ring-[#FFCD39]/30'
  }`;

/* ── Small UI pieces ──────────────────────────────────────── */
function FormField({ name, label, htmlFor, required, hint, error, span = false, children }) {
  return (
    <div id={name ? `field-${name}` : undefined} className={span ? 'sm:col-span-full' : undefined}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm">
          {label}
          {required && <span aria-hidden="true" className="ml-1 text-[#9C3B2B]">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={name ? `${name}-err` : undefined} className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-[#9C3B2B]">
          <AlertCircle size={13} aria-hidden="true" /> {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 font-sans text-xs text-[#52685B]">{hint}</p>
      ) : null}
    </div>
  );
}

function Input({ id, prefix, suffix, invalid, describedBy, className = '', ...props }) {
  return (
    <div className="relative">
      {prefix && (
        <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-sans text-[15px] text-[#52685B]">
          {prefix}
        </span>
      )}
      <input
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? describedBy : undefined}
        className={`${inputCls(invalid)} ${prefix ? 'pl-9' : ''} ${suffix ? 'pr-16' : ''} ${className}`}
        {...props}
      />
      {suffix && (
        <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-sans text-[13px] text-[#52685B]">
          {suffix}
        </span>
      )}
    </div>
  );
}

/* Pill-style single choice */
function ChoiceGroup({ value, onChange, options, label, allowClear = false }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(active && allowClear ? '' : o.value)}
            className={`rounded-full border px-5 py-2 font-sans text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
              active
                ? 'border-[#0f2645] bg-[#0f2645] text-[#FAF9F6] shadow-[0_4px_12px_rgba(15,38,69,0.22)]'
                : 'border-[#0f2645]/15 bg-white text-[#0f2645] hover:border-[#D4AF37] hover:bg-[#F3F0E8]'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* +/- counter. Empty value shows an en dash. */
function Stepper({ value, onChange, label, min = 0, max = 20 }) {
  const n = value === '' || value == null ? null : Number(value);
  const btn =
    'flex h-10 w-10 items-center justify-center rounded-xl border border-[#0f2645]/15 bg-white text-[#0f2645] transition hover:border-[#D4AF37] hover:bg-[#F3F0E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:text-[#0f2645]/25 disabled:hover:border-[#0f2645]/15 disabled:hover:bg-white';
  return (
    <div role="group" aria-label={label} className="inline-flex items-center gap-3">
      <button type="button" className={btn} disabled={n == null} aria-label={`Decrease ${label}`} onClick={() => onChange(n <= min ? '' : String(n - 1))}>
        <Minus size={16} aria-hidden="true" />
      </button>
      <span aria-live="polite" className={`min-w-[28px] text-center text-2xl ${n == null ? 'text-[#0f2645]/25' : 'text-[#0f2645]'}`}>
        {n == null ? '–' : n}
      </span>
      <button type="button" className={btn} disabled={n != null && n >= max} aria-label={`Increase ${label}`} onClick={() => onChange(String(n == null ? min : Math.min(max, n + 1)))}>
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

function Section({ step, title, subtitle, children }) {
  return (
    <section className="relative mb-5 overflow-hidden rounded-3xl border border-[#0f2645]/10 bg-white">
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
      <div className="flex items-center gap-4 border-b border-[#0f2645]/10 px-6 py-4 sm:px-8">
        <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f2645] text-base text-[#F5D77A]">
          {step}
        </span>
        <div>
          <h2 className="text-lg leading-tight sm:text-xl">{title}</h2>
          {subtitle && <p className="mt-0.5 font-sans text-xs text-[#52685B]">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </section>
  );
}

const grid2 = 'grid grid-cols-1 gap-5 sm:grid-cols-2';
const grid3 = 'grid grid-cols-1 gap-5 sm:grid-cols-3';

/* ── Page ─────────────────────────────────────────────────── */
export default function ListPropertyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dirty, setDirty] = useState(false);

  /* Login required: login ke baad wapas isi page par aayega */
  useEffect(() => {
    if (status === 'unauthenticated') router.replace(`/login?callbackUrl=${encodeURIComponent(pathname || '/')}`);
  }, [status, router, pathname]);

  /* Unsaved changes warning */
  useEffect(() => {
    if (!dirty || success || loading) return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, success, loading]);

  /* Success ke baad dashboard par bhejo */
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => router.push('/dashboard'), 5000);
    return () => clearTimeout(t);
  }, [success, router]);

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));
    setDirty(true);
    if (error) setError('');
  };
  const set = (key) => (e) => update(key, e.target.value);

  /* Plot me rooms / floors / furnishing ka matlab nahi, isliye chhupa dete hain */
  const isPlot = form.property_type === 'plot';
  const showBeds = !isPlot && form.property_type !== 'commercial';
  const showBaths = !isPlot;
  const showBalcony = !isPlot;
  const showFloors = !isPlot;
  const showFurnishing = !isPlot;

  /* Required-field progress for the sticky bar */
  const checks = [
    !!form.title.trim(),
    Number(form.price) > 0,
    !!form.location.trim(),
    !!form.city.trim(),
  ];
  const done = checks.filter(Boolean).length;
  const pct = (done / checks.length) * 100;

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Give your property a title.';
    if (!(Number(form.price) > 0)) e.price = 'Enter a valid price.';
    if (!form.location.trim()) e.location = 'Enter the address or locality.';
    if (!form.city.trim()) e.city = 'Enter the city.';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev?.preventDefault();
    if (loading) return;
    setError('');
    const e = validate();
    setErrors(e);
    const first = ['title', 'price', 'location', 'city'].find((k) => e[k]);
    if (first) {
      const wrap = document.getElementById(`field-${first}`);
      wrap?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      wrap?.querySelector('input')?.focus({ preventScroll: true });
      return;
    }

    setLoading(true);
    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      city: form.city.trim(),
      area: toNum(form.area),
      bedrooms: showBeds ? toNum(form.bedrooms) : null,
      bathrooms: showBaths ? toNum(form.bathrooms) : null,
      balcony: showBalcony ? toNum(form.balcony) : null,
      total_floors: showFloors ? toNum(form.total_floors) : null,
      furnishing: showFurnishing ? form.furnishing : '',
    };

    try {
      const res = await fetch('/api/user/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setDirty(false);
        setSuccess(true);
        window.scrollTo({ top: 0 });
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      }
    } catch {
      setError('Couldn’t reach the server. Check your connection and try again.');
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    }
    setLoading(false);
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setError('');
    setDirty(false);
    setSuccess(false);
  };

  const words = priceWords(form.price);
  const email = session?.user?.email;
  const shell = `${marcellus.className} min-h-screen bg-[#FAF9F6] font-normal text-[#0f2645]`;

  /* Session load ho rahi hai / redirect ho raha hai */
  if (status !== 'authenticated') {
    return (
      <div className={`${shell} flex items-center justify-center`}>
        <Loader2 className="animate-spin text-[#52685B]" size={22} aria-label="Loading" />
      </div>
    );
  }

  /* ===== Success ===== */
  if (success) {
    return (
      <div className={`${shell} flex items-center justify-center px-5`}>
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#0f2645]/10 bg-white p-8 text-center sm:p-10">
          <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A] ring-4 ring-[#D4AF37]/30">
            <Check size={30} aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-3xl leading-tight">Property listed</h1>
          <span aria-hidden="true" className={`mx-auto mt-4 block h-[3px] w-14 rounded-full ${goldBg}`} />
          <p className="mt-4 font-sans text-[15px] text-[#52685B]">
            Your property is now live. We’ll email <strong className="font-semibold text-[#0f2645]">{email}</strong> when someone inquires.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex flex-1 items-center justify-center rounded-full bg-[#0f2645] px-6 py-3 font-sans text-sm text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition hover:bg-[#16345c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              Go to dashboard
            </Link>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-[#0f2645]/20 px-6 py-3 font-sans text-sm text-[#52685B] transition hover:border-[#0f2645]/40 hover:text-[#0f2645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              List another
            </button>
          </div>
          <p className="mt-5 font-sans text-xs text-[#52685B]">Taking you to your dashboard in a few seconds…</p>
        </div>
      </div>
    );
  }

  /* ===== Form ===== */
  return (
    <div className={`${shell} px-4 py-8 sm:px-6 sm:py-12`}>
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {/* Header */}
          <header className="mb-8">
            <Link
              href="/dashboard"
              className="mb-5 inline-flex items-center gap-2 font-sans text-sm text-[#52685B] transition hover:text-[#0f2645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Back to dashboard
            </Link>
            <h1 className="text-3xl leading-tight sm:text-4xl">List your property</h1>
            <span aria-hidden="true" className={`mt-4 block h-[3px] w-14 rounded-full ${goldBg}`} />
            <p className="mt-4 font-sans text-sm text-[#52685B]">
              Fill in the details below. Fields marked * are required. We’ll email{' '}
              <strong className="font-semibold text-[#0f2645]">{email}</strong> when someone inquires.
            </p>
          </header>

          {/* Server error */}
          {error && (
            <p role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#9C3B2B]/25 bg-[#F6E3DF] px-4 py-3 font-sans text-sm text-[#9C3B2B]">
              <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> {error}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate aria-busy={loading}>
            {/* 1. Basics */}
            <Section step={1} title="Basic information" subtitle="What are you listing, and for how much?">
              <div className={grid2}>
                <FormField name="title" label="Property title" htmlFor="title" required span error={errors.title}>
                  <Input id="title" placeholder="e.g. 3 BHK apartment in Sector 45" maxLength={120} value={form.title} onChange={set('title')} invalid={!!errors.title} describedBy="title-err" />
                </FormField>

                <FormField label="Description" htmlFor="description" span hint={`${form.description.length} characters`}>
                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Mention floor, facing, parking, nearby landmarks…"
                    value={form.description}
                    onChange={set('description')}
                    className={`${inputCls(false)} resize-y leading-relaxed`}
                  />
                </FormField>

                <FormField name="price" label={form.type === 'rent' ? 'Monthly rent' : 'Price'} htmlFor="price" required error={errors.price} hint={words ? `≈ ₹${words}` : 'Enter the full amount'}>
                  <Input id="price" type="number" min="0" prefix="₹" placeholder="5000000" value={form.price} onChange={set('price')} invalid={!!errors.price} describedBy="price-err" />
                </FormField>

                <FormField label="Listing type">
                  <ChoiceGroup label="Listing type" value={form.type} onChange={(v) => update('type', v)} options={LISTING_TYPES} />
                </FormField>

                <FormField label="Property type" span>
                  <ChoiceGroup label="Property type" value={form.property_type} onChange={(v) => update('property_type', v)} options={PROPERTY_TYPES} />
                </FormField>
              </div>
            </Section>

            {/* 2. Location */}
            <Section step={2} title="Location" subtitle="Where is it located?">
              <div className={grid2}>
                <FormField name="location" label="Full address / locality" htmlFor="location" required span error={errors.location}>
                  <Input id="location" placeholder="Sector 45, Noida, Uttar Pradesh" value={form.location} onChange={set('location')} invalid={!!errors.location} describedBy="location-err" />
                </FormField>
                <FormField name="city" label="City" htmlFor="city" required error={errors.city}>
                  <Input id="city" placeholder="Noida" autoComplete="address-level2" value={form.city} onChange={set('city')} invalid={!!errors.city} describedBy="city-err" />
                </FormField>
                <FormField label="Area" htmlFor="area">
                  <Input id="area" type="number" min="0" suffix="sq ft" placeholder="1200" value={form.area} onChange={set('area')} />
                </FormField>
              </div>
            </Section>

            {/* 3. Specs */}
            <Section step={3} title="Specifications" subtitle="Rooms, building details and extras">
              {(showBeds || showBaths || showBalcony) && (
                <div className={`${grid3} mb-7`}>
                  {showBeds && (
                    <FormField label="Bedrooms">
                      <Stepper label="bedrooms" value={form.bedrooms} onChange={(v) => update('bedrooms', v)} />
                    </FormField>
                  )}
                  {showBaths && (
                    <FormField label="Bathrooms">
                      <Stepper label="bathrooms" value={form.bathrooms} onChange={(v) => update('bathrooms', v)} />
                    </FormField>
                  )}
                  {showBalcony && (
                    <FormField label="Balconies">
                      <Stepper label="balconies" value={form.balcony} onChange={(v) => update('balcony', v)} />
                    </FormField>
                  )}
                </div>
              )}

              <div className={`${grid3} mb-7`}>
                {showFloors && (
                  <FormField label="Total floors" htmlFor="total_floors">
                    <Input id="total_floors" type="number" min="0" placeholder="10" value={form.total_floors} onChange={set('total_floors')} />
                  </FormField>
                )}
                <FormField label="Age of property" htmlFor="age_of_property">
                  <Input id="age_of_property" placeholder="e.g. 2 years" value={form.age_of_property} onChange={set('age_of_property')} />
                </FormField>
                <FormField label="Construction type" htmlFor="construction_type">
                  <Input id="construction_type" placeholder="e.g. RCC, Brick" value={form.construction_type} onChange={set('construction_type')} />
                </FormField>
              </div>

              <div className="grid gap-6">
                {showFurnishing && (
                  <FormField label="Furnishing">
                    <ChoiceGroup label="Furnishing" value={form.furnishing} onChange={(v) => update('furnishing', v)} options={FURNISHING} allowClear />
                  </FormField>
                )}
                <FormField label="Parking">
                  <ChoiceGroup label="Parking" value={form.parking} onChange={(v) => update('parking', v)} options={PARKING} allowClear />
                </FormField>
                <FormField label="Facing">
                  <ChoiceGroup label="Facing" value={form.facing} onChange={(v) => update('facing', v)} options={FACING} allowClear />
                </FormField>
                <FormField label="Transaction type">
                  <ChoiceGroup label="Transaction type" value={form.transaction_type} onChange={(v) => update('transaction_type', v)} options={TRANSACTION} allowClear />
                </FormField>
              </div>
            </Section>

            {/* 4. Features */}
            <Section step={4} title="Amenities and highlights" subtitle="Help buyers see the value at a glance">
              <div className="grid gap-7">
                <FormField label="Amenities">
                  <TagInput value={form.amenities} onChange={(v) => update('amenities', v)} placeholder="Gym, Lift, Power Backup…" suggestions={AMENITY_SUGGESTIONS} />
                </FormField>
                <FormField label="Property highlights">
                  <TagInput value={form.property_highlights} onChange={(v) => update('property_highlights', v)} placeholder="Corner plot, Park facing…" suggestions={HIGHLIGHT_SUGGESTIONS} />
                </FormField>
                <FormField label="Nearby landmarks">
                  <TagInput value={form.nearby_landmarks} onChange={(v) => update('nearby_landmarks', v)} placeholder="Metro Station, City Mall…" suggestions={LANDMARK_SUGGESTIONS} />
                </FormField>
              </div>
            </Section>

            {/* 5. Images */}
            <Section step={5} title="Property images" subtitle="The first image is used as the cover photo. Clear photos get noticed first.">
              <ImageUpload value={form.images} onChange={(urls) => update('images', urls)} />
            </Section>

            {/* Sticky action bar */}
            <div className="sticky bottom-4 z-20 mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[#0f2645]/10 bg-white/90 px-5 py-3.5 shadow-[0_10px_34px_rgba(15,38,69,0.18)] backdrop-blur">
              <div className="min-w-[180px] flex-1">
                <p className="mb-2 font-sans text-[13px]">
                  <strong className="font-semibold">{done}</strong> of {checks.length} required fields complete
                </p>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#0f2645]/10" role="progressbar" aria-valuemin={0} aria-valuemax={checks.length} aria-valuenow={done} aria-label="Required fields completed">
                  <motion.div
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: reduce ? 0 : 0.4 }}
                    className={`h-full rounded-full ${goldBg}`}
                  />
                </div>
              </div>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-[#0f2645]/20 px-6 py-3 font-sans text-sm text-[#52685B] transition hover:border-[#0f2645]/40 hover:text-[#0f2645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="group relative inline-flex min-w-[200px] items-center justify-between overflow-hidden rounded-full bg-[#0f2645] py-2 pl-6 pr-2 text-base text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#0f2645] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <span className="relative z-10">{loading ? 'Listing…' : 'List property'}</span>
                <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#0f2645] transition-all duration-500 group-hover:bg-none group-hover:bg-[#0f2645] group-hover:text-[#F5D77A]">
                  {loading ? (
                    <Loader2 size={17} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight size={15} className="transition-transform duration-500 group-hover:-rotate-45" aria-hidden="true" />
                  )}
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}