'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Marcellus } from 'next/font/google';
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Heart,
  Home,
  Loader2,
  LogOut,
  MapPin,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from 'lucide-react';

const marcellus = Marcellus({ subsets: ['latin'], weight: '400', display: 'swap' });

const goldBg = 'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';

const pillPrimary =
  'inline-flex items-center gap-2 rounded-full bg-[#0f2645] px-5 py-2.5 font-sans text-sm text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition hover:bg-[#16345e] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]';

const rowBtn =
  'inline-flex items-center rounded-lg px-3.5 py-2 font-sans text-[13px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-60';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// Which API feeds which tab
const SOURCES = {
  saved: { url: '/api/user/saved', label: 'saved properties' },
  inquiries: { url: '/api/user/inquiries', label: 'inquiries' },
  properties: { url: '/api/user/properties', label: 'your listings' },
};

/* ── Stat card (click → jumps to that tab) ── */
function StatCard({ value, label, icon: Icon, onClick, active, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${loading ? 'loading' : value}. Open this section`}
      className={`relative overflow-hidden rounded-3xl border bg-white p-5 text-left transition hover:border-[#D4AF37]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] sm:p-6 ${
        active ? 'border-[#D4AF37]/70' : 'border-[#0f2645]/10'
      }`}
    >
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f2645] text-[#F5D77A]">
        <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
      </span>
      {loading ? (
        <span className="mt-4 block h-9 w-12 animate-pulse rounded-lg bg-[#F3F0E8]" />
      ) : (
        <p className="mt-4 text-4xl leading-none">{value}</p>
      )}
      <p className="mt-1.5 font-sans text-sm text-[#52685B]">{label}</p>
    </button>
  );
}

/* ── Skeleton rows while loading ── */
function SkeletonList({ rows = 3 }) {
  return (
    <div role="status" aria-label="Loading" className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex animate-pulse overflow-hidden rounded-2xl border border-[#0f2645]/10 bg-white">
          <div className="h-28 w-32 shrink-0 bg-[#F3F0E8]" />
          <div className="flex-1 space-y-3 p-4">
            <div className="h-4 w-2/3 rounded bg-[#F3F0E8]" />
            <div className="h-3 w-1/3 rounded bg-[#F3F0E8]" />
            <div className="h-4 w-1/4 rounded bg-[#F3F0E8]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Property row ── */
function PropertyRow({ property, right, dimmed }) {
  const [imgFailed, setImgFailed] = useState(false);
  const img = property?.images?.[0]?.url || null;

  return (
    <div
      className={`mb-3 flex flex-col overflow-hidden rounded-2xl border border-[#0f2645]/10 bg-white transition hover:border-[#D4AF37]/50 sm:flex-row ${
        dimmed ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <Link
        href={`/properties/${property?.id}`}
        tabIndex={-1}
        aria-hidden="true"
        className="h-36 w-full shrink-0 bg-[#F3F0E8] sm:h-auto sm:w-32"
      >
        {img && !imgFailed ? (
          <img
            src={img}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[88px] w-full items-center justify-center text-[#52685B]/70">
            <Building2 size={22} strokeWidth={1.4} aria-hidden="true" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <Link
            href={`/properties/${property?.id}`}
            className="block truncate text-base transition hover:text-[#B8902F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            {property?.title}
          </Link>
          <p className="mt-1 flex items-center gap-1.5 font-sans text-[13px] text-[#52685B]">
            <MapPin size={13} aria-hidden="true" />
            {property?.city}
            {property?.type && <span className="capitalize">· {property.type}</span>}
          </p>
          <p className="mt-1.5 text-lg text-[#0f2645]">
            ₹{Number(property?.price || 0).toLocaleString('en-IN')}
            {property?.type === 'rent' && <span className="font-sans text-xs text-[#52685B]"> /mo</span>}
          </p>
        </div>
        <div className="shrink-0">{right}</div>
      </div>
    </div>
  );
}

/* ── Inquiry card with expandable message ── */
function InquiryCard({ inq }) {
  const [open, setOpen] = useState(false);
  const p = inq.property;
  const st = inq.status || 'new';
  const long = (inq.message || '').length > 180;
  const statusStyle = {
    new: 'bg-[#F7E7B5] text-[#7A5C0F]',
    replied: 'bg-[#DDE9E1] text-[#2F5D45]',
  };
  const statusLabel = { new: 'Awaiting reply', replied: 'Replied' };

  return (
    <article className="mb-3 rounded-2xl border border-[#0f2645]/10 bg-white p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          {p ? (
            <Link
              href={`/properties/${p.id}`}
              className="block truncate text-base transition hover:text-[#B8902F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            >
              {p.title}
            </Link>
          ) : (
            <p className="text-base">{inq.property_id ? 'Property no longer available' : 'General inquiry'}</p>
          )}
          {p?.city && (
            <p className="mt-1 flex items-center gap-1.5 font-sans text-[13px] text-[#52685B]">
              <MapPin size={13} aria-hidden="true" /> {p.city}
            </p>
          )}
        </div>

        <div className="shrink-0 text-right">
          <span
            className={`inline-block rounded-full px-3 py-1 font-sans text-[11px] font-semibold ${
              statusStyle[st] || 'bg-[#EEF0F2] text-[#52685B]'
            }`}
          >
            {statusLabel[st] || st}
          </span>
          <p className="mt-1.5 font-sans text-xs text-[#52685B]">{formatDate(inq.created_at)}</p>
        </div>
      </div>

      <blockquote
        className={`rounded-xl border-l-[3px] border-[#D4AF37] bg-[#F3F0E8]/70 px-4 py-3 font-sans text-sm leading-relaxed ${
          long && !open ? 'line-clamp-3' : ''
        }`}
      >
        {inq.message}
      </blockquote>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="mt-2 font-sans text-[13px] text-[#B8902F] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
        >
          {open ? 'Show less' : 'Read full message'}
        </button>
      )}
    </article>
  );
}

/* ── Empty state ── */
function Empty({ icon: Icon, msg, sub, link, linkText }) {
  return (
    <div className="rounded-3xl border border-[#0f2645]/10 bg-white px-6 py-12 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F3F0E8] text-[#B8902F] ring-1 ring-[#D4AF37]/40">
        <Icon size={24} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <p className="mt-5 text-xl">{msg}</p>
      {sub && <p className="mx-auto mt-1.5 max-w-sm font-sans text-sm text-[#52685B]">{sub}</p>}
      {link && (
        <Link href={link} className={`${pillPrimary} mt-6`}>
          {linkText} <ArrowRight size={15} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

/* ── Section-level error with retry ── */
function SectionError({ label, onRetry, retrying }) {
  return (
    <div role="alert" className="rounded-3xl border border-[#9C3B2B]/25 bg-[#F6E3DF] px-6 py-10 text-center">
      <AlertCircle size={26} className="mx-auto text-[#9C3B2B]" aria-hidden="true" />
      <p className="mt-3 text-xl text-[#9C3B2B]">Could not load {label}</p>
      <p className="mt-1 font-sans text-sm text-[#9C3B2B]/80">Check your connection and try again.</p>
      <button
        type="button"
        onClick={onRetry}
        disabled={retrying}
        className={`${pillPrimary} mt-5 disabled:opacity-60`}
      >
        <RefreshCw size={15} className={retrying ? 'animate-spin' : ''} aria-hidden="true" />
        {retrying ? 'Retrying…' : 'Try again'}
      </button>
    </div>
  );
}

/* ── Search box (shown only when list is long enough) ── */
function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="relative mb-4">
      <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#52685B]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-[#0f2645]/15 bg-white py-2.5 pl-10 pr-4 font-sans text-sm text-[#0f2645] placeholder:text-[#52685B]/70 focus:border-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/40"
      />
    </div>
  );
}

/* ── Section ── */
function Section({ title, action, children }) {
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ══════════════════════════════════════════
   Main dashboard
══════════════════════════════════════════ */
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const reduce = useReducedMotion();

  const [activeTab, setActiveTab] = useState('saved');
  const [data, setData] = useState({ saved: [], inquiries: [], properties: [] });
  const [loading, setLoading] = useState({ saved: true, inquiries: true, properties: true });
  const [failed, setFailed] = useState({ saved: false, inquiries: false, properties: false });
  const [query, setQuery] = useState('');
  const [confirmId, setConfirmId] = useState(null); // listing awaiting delete confirmation
  const [busyId, setBusyId] = useState(null); // row with request in flight
  const [toast, setToast] = useState(null); // { type, msg, undo? }
  const toastTimer = useRef(null);

  const showToast = useCallback((t, ms = 6000) => {
    clearTimeout(toastTimer.current);
    setToast(t);
    toastTimer.current = setTimeout(() => setToast(null), ms);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  // Load one section (also used for retry)
  const loadSection = useCallback(async (key) => {
    setLoading((p) => ({ ...p, [key]: true }));
    try {
      const r = await fetch(SOURCES[key].url);
      const d = await r.json();
      if (!Array.isArray(d)) throw new Error('Bad response');
      setData((p) => ({ ...p, [key]: d }));
      setFailed((p) => ({ ...p, [key]: false }));
    } catch (err) {
      console.error(`${SOURCES[key].label} error:`, err);
      setFailed((p) => ({ ...p, [key]: true }));
    } finally {
      setLoading((p) => ({ ...p, [key]: false }));
    }
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') return;
    Object.keys(SOURCES).forEach(loadSection);
  }, [status, loadSection]);

  const switchTab = (id) => {
    setActiveTab(id);
    setQuery('');
    setConfirmId(null);
  };

  // Arrow-key navigation between tabs
  const onTabKeyDown = (e, tabs) => {
    const i = tabs.findIndex((t) => t.id === activeTab);
    let next = null;
    if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
    if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
    if (e.key === 'Home') next = tabs[0];
    if (e.key === 'End') next = tabs[tabs.length - 1];
    if (!next) return;
    e.preventDefault();
    switchTab(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  // Unsave (optimistic, with undo)
  const postSaved = (property_id) =>
    fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property_id }),
    }).then((res) => {
      if (!res.ok) throw new Error('Failed');
    });

  const handleUnsave = async (item, index) => {
    const pid = item.property.id;
    setData((p) => ({ ...p, saved: p.saved.filter((s) => s.id !== item.id) }));
    try {
      await postSaved(pid);
      showToast({
        type: 'success',
        msg: 'Removed from saved.',
        undo: async () => {
          try {
            await postSaved(pid);
            setData((p) => {
              const next = [...p.saved];
              next.splice(Math.min(index, next.length), 0, item);
              return { ...p, saved: next };
            });
            showToast({ type: 'success', msg: 'Saved again.' }, 3000);
          } catch {
            showToast({ type: 'error', msg: 'Could not undo. Please save it again from the property page.' });
          }
        },
      });
    } catch {
      // roll back
      setData((p) => {
        const next = [...p.saved];
        next.splice(Math.min(index, next.length), 0, item);
        return { ...p, saved: next };
      });
      showToast({ type: 'error', msg: 'Could not remove this property from your saved list. Please try again.' });
    }
  };

  // Delete my property (inline confirm, no browser popup)
  const handleDeleteProperty = async (id) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/user/properties?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      setData((p) => ({ ...p, properties: p.properties.filter((x) => x.id !== id) }));
      setConfirmId(null);
      showToast({ type: 'success', msg: 'Listing deleted.' }, 4000);
    } catch {
      showToast({ type: 'error', msg: 'Could not delete this listing. Please try again.' });
    } finally {
      setBusyId(null);
    }
  };

  // ── Auth loading state ──
  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className={`${marcellus.className} flex min-h-screen items-center justify-center bg-[#FAF9F6] text-[#0f2645]`}>
        <div role="status" className="flex items-center gap-3 font-sans text-sm text-[#52685B]">
          <Loader2 size={20} className="animate-spin text-[#B8902F]" aria-hidden="true" />
          {status === 'unauthenticated' ? 'Redirecting to login…' : 'Loading your dashboard…'}
        </div>
      </div>
    );
  }

  const isAdmin = session?.user?.role?.toLowerCase() === 'admin';
  const initial = session?.user?.name?.charAt(0)?.toUpperCase() || 'U';
  const { saved, inquiries, properties: myProps } = data;

  const tabs = [
    { id: 'saved', label: 'Saved', count: saved.length, icon: Heart, key: 'saved' },
    { id: 'inquiries', label: 'Inquiries', count: inquiries.length, icon: MessageSquare, key: 'inquiries' },
    { id: 'my-properties', label: 'My properties', count: myProps.length, icon: Home, key: 'properties' },
  ];

  const q = query.trim().toLowerCase();
  const matches = (p) => !q || `${p?.title || ''} ${p?.city || ''}`.toLowerCase().includes(q);
  const SEARCH_AT = 4; // show search only when list is long enough to need it

  const NoMatch = () => (
    <p className="rounded-2xl border border-[#0f2645]/10 bg-white px-5 py-8 text-center font-sans text-sm text-[#52685B]">
      No results for “{query}”.{' '}
      <button type="button" onClick={() => setQuery('')} className="text-[#B8902F] underline-offset-2 hover:underline">
        Clear search
      </button>
    </p>
  );

  const renderSection = (key, body) => {
    if (loading[key]) return <SkeletonList />;
    if (failed[key]) return <SectionError label={SOURCES[key].label} onRetry={() => loadSection(key)} retrying={loading[key]} />;
    return body;
  };

  return (
    <div className={`${marcellus.className} min-h-screen bg-[#FAF9F6] pb-24 font-normal text-[#0f2645]`}>
      {/* ── Header ── */}
      <header className="relative overflow-hidden bg-[#0f2645] px-5 py-9 text-[#FAF9F6] sm:px-8">
        <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl text-[#0f2645] ${goldBg}`}>
              {initial}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-2xl leading-tight">Welcome, {session?.user?.name?.split(' ')[0] || 'there'}</h1>
              <p className="truncate font-sans text-sm text-[#FAF9F6]/60">{session?.user?.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 font-sans text-sm">
            {isAdmin && (
              <Link
                href="/admin"
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[#0f2645] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D77A] ${goldBg}`}
              >
                <ShieldCheck size={15} aria-hidden="true" /> Admin panel
              </Link>
            )}
            <Link
              href="/dashboard/list-property"
              className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 px-5 py-2.5 transition hover:bg-[#FAF9F6]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D77A]"
            >
              <Plus size={15} aria-hidden="true" /> List property
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="inline-flex items-center gap-2 rounded-full border border-[#FAF9F6]/25 px-5 py-2.5 transition hover:border-[#E8A396]/60 hover:bg-[#9C3B2B]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D77A]"
            >
              <LogOut size={15} aria-hidden="true" /> Logout
            </button>
          </div>
        </div>
      </header>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mx-auto max-w-4xl px-5 py-8 sm:px-8"
      >
        {/* ── Stats (clickable shortcuts) ── */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard value={saved.length} label="Saved properties" icon={Heart} loading={loading.saved} active={activeTab === 'saved'} onClick={() => switchTab('saved')} />
          <StatCard value={inquiries.length} label="Inquiries sent" icon={MessageSquare} loading={loading.inquiries} active={activeTab === 'inquiries'} onClick={() => switchTab('inquiries')} />
          <StatCard value={myProps.length} label="My listings" icon={Building2} loading={loading.properties} active={activeTab === 'my-properties'} onClick={() => switchTab('my-properties')} />
        </div>

        {/* ── Tabs ── */}
        <div
          role="tablist"
          aria-label="Dashboard sections"
          onKeyDown={(e) => onTabKeyDown(e, tabs)}
          className="mb-6 flex gap-2 overflow-x-auto pb-1"
        >
          {tabs.map(({ id, label, count, icon: Icon, key }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={active}
                aria-controls={`panel-${id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => switchTab(id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-5 py-2.5 font-sans text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                  active
                    ? 'border-[#0f2645] bg-[#0f2645] text-[#FAF9F6]'
                    : 'border-[#0f2645]/15 bg-white text-[#52685B] hover:border-[#D4AF37] hover:text-[#0f2645]'
                }`}
              >
                <Icon size={15} aria-hidden="true" className={active ? 'text-[#F5D77A]' : ''} />
                {label}
                <span className={`text-xs ${active ? 'text-[#F5D77A]' : 'text-[#52685B]/80'}`}>
                  {loading[key] ? '…' : count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ═══ Saved ═══ */}
        {activeTab === 'saved' && (
          <div role="tabpanel" id="panel-saved" aria-labelledby="tab-saved">
            <Section title="Saved properties">
              {renderSection(
                'saved',
                saved.length === 0 ? (
                  <Empty
                    icon={Heart}
                    msg="No saved properties yet"
                    sub="Tap the heart on any property to keep it here."
                    link="/properties"
                    linkText="Browse properties"
                  />
                ) : (
                  <>
                    {saved.length >= SEARCH_AT && (
                      <SearchBox value={query} onChange={setQuery} placeholder="Search saved by title or city" />
                    )}
                    {(() => {
                      const list = saved.map((item, index) => ({ item, index })).filter(({ item }) => !item.property || matches(item.property));
                      if (list.length === 0) return <NoMatch />;
                      return list.map(({ item, index }) => {
                        const p = item.property;

                        if (!p)
                          return (
                            <p key={item.id} className="mb-3 flex items-start gap-2.5 rounded-xl border border-[#D4AF37]/40 bg-[#F3F0E8] px-4 py-3 font-sans text-sm text-[#7A5C0F]">
                              <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                              This saved property is no longer available (ID: {item.property_id}).
                            </p>
                          );

                        return (
                          <PropertyRow
                            key={item.id}
                            property={p}
                            right={
                              <div className="flex gap-2">
                                <Link href={`/properties/${p.id}`} className={`${rowBtn} bg-[#F3F0E8] text-[#0f2645] hover:bg-[#ebe6d8]`}>
                                  View
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleUnsave(item, index)}
                                  aria-label={`Remove ${p.title} from saved`}
                                  className={`${rowBtn} gap-1.5 bg-[#F6E3DF] text-[#9C3B2B] hover:bg-[#f0d3cd]`}
                                >
                                  <Heart size={13} aria-hidden="true" /> Unsave
                                </button>
                              </div>
                            }
                          />
                        );
                      });
                    })()}
                  </>
                )
              )}
            </Section>
          </div>
        )}

        {/* ═══ Inquiries ═══ */}
        {activeTab === 'inquiries' && (
          <div role="tabpanel" id="panel-inquiries" aria-labelledby="tab-inquiries">
            <Section title="My inquiries">
              {renderSection(
                'inquiries',
                inquiries.length === 0 ? (
                  <Empty
                    icon={MessageSquare}
                    msg="No inquiries sent yet"
                    sub="Interested in a property? Contact the agent directly from its page."
                    link="/properties"
                    linkText="Browse properties"
                  />
                ) : (
                  inquiries.map((inq) => <InquiryCard key={inq.id} inq={inq} />)
                )
              )}
            </Section>
          </div>
        )}

        {/* ═══ My properties ═══ */}
        {activeTab === 'my-properties' && (
          <div role="tabpanel" id="panel-my-properties" aria-labelledby="tab-my-properties">
            <Section
              title="My properties"
              action={
                <Link href="/dashboard/list-property" className={pillPrimary}>
                  <Plus size={15} aria-hidden="true" /> Add new listing
                </Link>
              }
            >
              {renderSection(
                'properties',
                myProps.length === 0 ? (
                  <Empty
                    icon={Home}
                    msg="No listings yet"
                    sub="List your property. It's completely free."
                    link="/dashboard/list-property"
                    linkText="List a property"
                  />
                ) : (
                  <>
                    {myProps.length >= SEARCH_AT && (
                      <SearchBox value={query} onChange={setQuery} placeholder="Search your listings by title or city" />
                    )}
                    {(() => {
                      const list = myProps.filter(matches);
                      if (list.length === 0) return <NoMatch />;
                      return list.map((p) => {
                        const confirming = confirmId === p.id;
                        const busy = busyId === p.id;
                        return (
                          <PropertyRow
                            key={p.id}
                            property={p}
                            dimmed={busy}
                            right={
                              confirming ? (
                                <div role="group" aria-label="Confirm delete" className="flex flex-wrap items-center gap-2">
                                  <span className="font-sans text-[13px] text-[#9C3B2B]">Delete permanently?</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProperty(p.id)}
                                    disabled={busy}
                                    className={`${rowBtn} gap-1.5 bg-[#9C3B2B] text-[#FAF9F6] hover:bg-[#832f21]`}
                                  >
                                    {busy && <Loader2 size={13} className="animate-spin" aria-hidden="true" />}
                                    Yes, delete
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmId(null)}
                                    disabled={busy}
                                    className={`${rowBtn} bg-[#F3F0E8] text-[#0f2645] hover:bg-[#ebe6d8]`}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <Link href={`/properties/${p.id}`} className={`${rowBtn} bg-[#F3F0E8] text-[#0f2645] hover:bg-[#ebe6d8]`}>
                                    View
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmId(p.id)}
                                    aria-label={`Delete ${p.title}`}
                                    className={`${rowBtn} bg-[#F6E3DF] text-[#9C3B2B] hover:bg-[#f0d3cd]`}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )
                            }
                          />
                        );
                      });
                    })()}
                  </>
                )
              )}
            </Section>
          </div>
        )}
      </motion.div>

      {/* ── Toast (feedback + undo) ── */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.msg}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-full px-5 py-3 font-sans text-sm shadow-lg ring-1 ${
                toast.type === 'error'
                  ? 'bg-[#F6E3DF] text-[#9C3B2B] ring-[#9C3B2B]/25'
                  : 'bg-[#0f2645] text-[#FAF9F6] ring-[#D4AF37]/40'
              }`}
            >
              {toast.type === 'error' ? (
                <AlertCircle size={16} className="shrink-0" aria-hidden="true" />
              ) : (
                <CheckCircle2 size={16} className="shrink-0 text-[#F5D77A]" aria-hidden="true" />
              )}
              <span>{toast.msg}</span>
              {toast.undo && (
                <button
                  type="button"
                  onClick={() => {
                    const fn = toast.undo;
                    setToast(null);
                    fn();
                  }}
                  className="shrink-0 font-semibold text-[#F5D77A] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F5D77A]"
                >
                  Undo
                </button>
              )}
              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Dismiss"
                className="shrink-0 opacity-70 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F5D77A]"
              >
                <X size={15} aria-hidden="true" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}