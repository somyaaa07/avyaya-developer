'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Marcellus } from 'next/font/google';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Loader2,
  MapPin,
  Ruler,
  Sparkles,
  UserCog,
} from 'lucide-react';
import TagInput from '@/component/TagInput';

const marcellus = Marcellus({ subsets: ['latin'], weight: '400', display: 'swap' });

const goldBg = 'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';

const FACING = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];

const toNum = (v) => (v === '' || v == null ? null : Number(v));

// API se aayi null values ko form ke liye '' / [] me badalna (controlled inputs ke liye)
const normalize = (p) => ({
  title: p.title ?? '',
  description: p.description ?? '',
  price: p.price ?? '',
  type: p.type ?? 'buy',
  property_type: p.property_type ?? 'apartment',
  location: p.location ?? '',
  city: p.city ?? '',
  area: p.area ?? '',
  bedrooms: p.bedrooms ?? '',
  bathrooms: p.bathrooms ?? '',
  balcony: p.balcony ?? '',
  total_floors: p.total_floors ?? '',
  age_of_property: p.age_of_property ?? '',
  furnishing: p.furnishing ?? '',
  transaction_type: p.transaction_type ?? '',
  parking: p.parking ?? '',
  facing: p.facing ?? '',
  construction_type: p.construction_type ?? '',
  amenities: Array.isArray(p.amenities) ? p.amenities : [],
  nearby_landmarks: Array.isArray(p.nearby_landmarks) ? p.nearby_landmarks : [],
  property_highlights: Array.isArray(p.property_highlights) ? p.property_highlights : [],
  agent_id: p.agent_id ?? '',
  status: p.status ?? 'active',
});

/* ---------- Shared styles (login page ke inputs jaise) ---------- */
const inputCls =
  'w-full rounded-xl border border-[#0f2645]/15 bg-[#F3F0E8]/60 px-4 py-3 font-sans text-[15px] text-[#0f2645] outline-none transition placeholder:text-[#52685B]/60 hover:border-[#0f2645]/30 focus:border-[#D4AF37] focus:bg-white focus:ring-4 focus:ring-[#FFCD39]/30 disabled:opacity-60';

function Field({ label, htmlFor, span = false, children }) {
  return (
    <div className={span ? 'sm:col-span-full' : undefined}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm">
        {label}
      </label>
      {children}
    </div>
  );
}

function Select({ id, value, onChange, children }) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={onChange} className={`${inputCls} cursor-pointer appearance-none pr-10`}>
        {children}
      </select>
      <ChevronDown
        size={17}
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#52685B]"
      />
    </div>
  );
}

function Section({ title, icon: Icon, cols = 'sm:grid-cols-2', children }) {
  return (
    <section className="relative mb-5 overflow-hidden rounded-3xl border border-[#0f2645]/10 bg-white">
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
      <div className="flex items-center gap-3 border-b border-[#0f2645]/10 px-6 py-4 sm:px-8">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f2645] text-[#F5D77A]">
          <Icon size={17} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <h2 className="text-lg sm:text-xl">{title}</h2>
      </div>
      <div className={`grid grid-cols-1 gap-5 p-6 sm:p-8 ${cols}`}>{children}</div>
    </section>
  );
}

export default function EditPropertyPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const { id } = useParams();

  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/properties/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      })
      .then((p) => setForm(normalize(p)))
      .catch(() => setLoadError('Could not load this property. Go back and try again.'));

    fetch('/api/admin/agents')
      .then((r) => r.json())
      .then((a) => setAgents(Array.isArray(a) ? a : []))
      .catch(() => setAgents([]));
  }, [id]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setList = (key) => (list) => setForm((f) => ({ ...f, [key]: list }));

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (loading || saved) return;
    setError('');
    setLoading(true);

    const payload = {
      ...form,
      area: toNum(form.area),
      bedrooms: toNum(form.bedrooms),
      bathrooms: toNum(form.bathrooms),
      balcony: toNum(form.balcony),
      total_floors: toNum(form.total_floors),
      agent_id: form.agent_id === '' ? null : Number(form.agent_id),
    };

    try {
      const res = await fetch(`/api/admin/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaved(true);
        setLoading(false);
        setTimeout(() => router.push('/admin/properties'), 1200);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Could not update this property. Please try again.');
    } catch {
      setError('Couldn’t reach the server. Check your connection and try again.');
    }
    setLoading(false);
  };

  /* ---------- Loading / load error ---------- */
  if (!form) {
    return (
      <div className={`${marcellus.className} flex min-h-[60vh] items-center justify-center text-[#0f2645]`}>
        {loadError ? (
          <div role="alert" className="max-w-sm rounded-xl border border-[#9C3B2B]/25 bg-[#F6E3DF] px-4 py-3 font-sans text-sm text-[#9C3B2B]">
            <p className="flex items-start gap-2.5">
              <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> {loadError}
            </p>
            <Link href="/admin/properties" className="mt-2 block pl-[26px] text-xs underline underline-offset-2">
              Back to properties
            </Link>
          </div>
        ) : (
          <div role="status" className="flex items-center gap-3 font-sans text-sm text-[#52685B]">
            <Loader2 size={20} className="animate-spin text-[#B8902F]" aria-hidden="true" />
            Loading property…
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`${marcellus.className} mx-auto max-w-5xl font-normal text-[#0f2645]`}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* ── Header ── */}
        <header className="mb-8">
          <Link
            href="/admin/properties"
            className="mb-5 inline-flex items-center gap-2 font-sans text-sm text-[#52685B] transition hover:text-[#0f2645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back to properties
          </Link>
          <h1 className="text-3xl leading-tight sm:text-4xl">Edit property</h1>
          <span aria-hidden="true" className={`mt-4 block h-[3px] w-14 rounded-full ${goldBg}`} />
          <p className="mt-4 font-sans text-sm text-[#52685B]">
            Property #{id}. Changes go live as soon as you save.
          </p>
        </header>

        {/* ── Alerts ── */}
        {error && (
          <p role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#9C3B2B]/25 bg-[#F6E3DF] px-4 py-3 font-sans text-sm text-[#9C3B2B]">
            <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> {error}
          </p>
        )}
        {saved && (
          <p role="status" className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#D4AF37]/50 bg-[#F3F0E8] px-4 py-3 font-sans text-sm text-[#0f2645]">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#B8902F]" aria-hidden="true" />
            Property updated. Taking you back to the list…
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate aria-busy={loading}>
          {/* ── Core ── */}
          <Section title="Core details" icon={Building2}>
            <Field label="Property title" htmlFor="title" span>
              <input id="title" className={inputCls} value={form.title} onChange={set('title')} placeholder="Property title" />
            </Field>
            <Field label="Description" htmlFor="description" span>
              <textarea id="description" rows={4} className={`${inputCls} resize-y`} value={form.description} onChange={set('description')} placeholder="Describe the property…" />
            </Field>
            <Field label="Price (₹)" htmlFor="price">
              <input id="price" type="number" min="0" className={inputCls} value={form.price} onChange={set('price')} placeholder="5000000" />
            </Field>
            <Field label="Listing type" htmlFor="type">
              <Select id="type" value={form.type} onChange={set('type')}>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
                <option value="rent">Rent</option>
              </Select>
            </Field>
            <Field label="Property type" htmlFor="property_type">
              <Select id="property_type" value={form.property_type} onChange={set('property_type')}>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
              </Select>
            </Field>
            <Field label="Status" htmlFor="status">
              <Select id="status" value={form.status} onChange={set('status')}>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="rented">Rented</option>
              </Select>
            </Field>
          </Section>

          {/* ── Location ── */}
          <Section title="Location" icon={MapPin}>
            <Field label="Full address" htmlFor="location" span>
              <input id="location" className={inputCls} value={form.location} onChange={set('location')} placeholder="Sector 45, Noida" />
            </Field>
            <Field label="City" htmlFor="city">
              <input id="city" className={inputCls} value={form.city} onChange={set('city')} placeholder="City" />
            </Field>
            <Field label="Area (sq ft)" htmlFor="area">
              <input id="area" type="number" min="0" className={inputCls} value={form.area} onChange={set('area')} placeholder="1200" />
            </Field>
          </Section>

          {/* ── Specs ── */}
          <Section title="Specifications" icon={Ruler} cols="sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Bedrooms" htmlFor="bedrooms">
              <input id="bedrooms" type="number" min="0" className={inputCls} value={form.bedrooms} onChange={set('bedrooms')} placeholder="3" />
            </Field>
            <Field label="Bathrooms" htmlFor="bathrooms">
              <input id="bathrooms" type="number" min="0" className={inputCls} value={form.bathrooms} onChange={set('bathrooms')} placeholder="2" />
            </Field>
            <Field label="Balconies" htmlFor="balcony">
              <input id="balcony" type="number" min="0" className={inputCls} value={form.balcony} onChange={set('balcony')} placeholder="1" />
            </Field>
            <Field label="Total floors" htmlFor="total_floors">
              <input id="total_floors" type="number" min="0" className={inputCls} value={form.total_floors} onChange={set('total_floors')} placeholder="10" />
            </Field>
            <Field label="Age of property" htmlFor="age_of_property">
              <input id="age_of_property" className={inputCls} value={form.age_of_property} onChange={set('age_of_property')} placeholder="e.g. 2 years" />
            </Field>
            <Field label="Construction type" htmlFor="construction_type">
              <input id="construction_type" className={inputCls} value={form.construction_type} onChange={set('construction_type')} placeholder="e.g. RCC, Brick" />
            </Field>
            <Field label="Furnishing" htmlFor="furnishing">
              <Select id="furnishing" value={form.furnishing} onChange={set('furnishing')}>
                <option value="">Select</option>
                <option value="unfurnished">Unfurnished</option>
                <option value="semi-furnished">Semi-furnished</option>
                <option value="furnished">Furnished</option>
              </Select>
            </Field>
            <Field label="Parking" htmlFor="parking">
              <Select id="parking" value={form.parking} onChange={set('parking')}>
                <option value="">Select</option>
                <option value="none">None</option>
                <option value="bike">Bike</option>
                <option value="car">Car</option>
                <option value="both">Car + Bike</option>
              </Select>
            </Field>
            <Field label="Facing" htmlFor="facing">
              <Select id="facing" value={form.facing} onChange={set('facing')}>
                <option value="">Select</option>
                {FACING.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </Select>
            </Field>
            <Field label="Transaction type" htmlFor="transaction_type">
              <Select id="transaction_type" value={form.transaction_type} onChange={set('transaction_type')}>
                <option value="">Select</option>
                <option value="new">New</option>
                <option value="resale">Resale</option>
              </Select>
            </Field>
          </Section>

          {/* ── Lists ── */}
          <Section title="Amenities and highlights" icon={Sparkles} cols="grid-cols-1">
            <div>
              <p className="mb-1.5 text-sm">Amenities</p>
              <TagInput value={form.amenities} onChange={setList('amenities')} placeholder="Gym, Lift, Power Backup…" />
            </div>
            <div>
              <p className="mb-1.5 text-sm">Property highlights</p>
              <TagInput value={form.property_highlights} onChange={setList('property_highlights')} placeholder="Corner plot, Park facing…" />
            </div>
            <div>
              <p className="mb-1.5 text-sm">Nearby landmarks</p>
              <TagInput value={form.nearby_landmarks} onChange={setList('nearby_landmarks')} placeholder="Metro Station, City Mall…" />
            </div>
          </Section>

          {/* ── Agent ── */}
          <Section title="Agent assignment" icon={UserCog}>
            <Field label="Assigned agent" htmlFor="agent_id">
              <Select id="agent_id" value={form.agent_id} onChange={set('agent_id')}>
                <option value="">No agent</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </Select>
            </Field>
          </Section>

          {/* ── Actions ── */}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <Link
              href="/admin/properties"
              className="inline-flex items-center justify-center rounded-full border border-[#0f2645]/20 px-7 py-3.5 font-sans text-[15px] text-[#52685B] transition hover:border-[#0f2645]/40 hover:text-[#0f2645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading || saved}
              aria-busy={loading}
              className="group relative inline-flex min-w-[240px] items-center justify-between overflow-hidden rounded-full bg-[#0f2645] py-2.5 pl-7 pr-2.5 text-base text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#0f2645] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span aria-hidden="true" className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100" />
              <span className="relative z-10">
                {saved ? 'Property updated' : loading ? 'Saving…' : 'Save changes'}
              </span>
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#0f2645] transition-all duration-500 group-hover:bg-none group-hover:bg-[#0f2645] group-hover:text-[#F5D77A]">
                {loading ? (
                  <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                ) : saved ? (
                  <CheckCircle2 size={18} aria-hidden="true" />
                ) : (
                  <ArrowRight size={16} className="transition-transform duration-500 group-hover:-rotate-45" aria-hidden="true" />
                )}
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}