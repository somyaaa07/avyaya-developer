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
  'inline-flex items-center justify-center gap-2 rounded-full bg-[#0f2645] px-5 py-2.5 font-sans text-sm text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition hover:bg-[#16345e] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]';

const cardBtn =
  'inline-flex items-center justify-center rounded-xl px-3.5 py-2.5 font-sans text-[13px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-60';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const SOURCES = {
  saved: { url: '/api/user/saved', label: 'saved properties' },
  inquiries: { url: '/api/user/inquiries', label: 'inquiries' },
  properties: { url: '/api/user/properties', label: 'your listings' },
};

const SECTIONS = {
  saved: { title: 'Saved properties', sub: 'Properties you bookmarked to look at again.' },
  inquiries: { title: 'My inquiries', sub: 'Messages you sent to property agents.' },
  properties: { title: 'My properties', sub: 'Listings you published on the site.' },
};

/* ── Skeleton grid ── */
function SkeletonGrid({ n = 6 }) {
  return (
    <div role="status" aria-label="Loading" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="animate-pulse overflow-hidden rounded-3xl border border-[#0f2645]/10 bg-white">
          <div className="aspect-[4/3] bg-[#F3F0E8]" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 rounded bg-[#F3F0E8]" />
            <div className="h-3 w-1/2 rounded bg-[#F3F0E8]" />
            <div className="h-5 w-1/3 rounded bg-[#F3F0E8]" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Property card (image on top, actions at bottom) ── */
function PropertyCard({ property, actions, dimmed }) {
  const [imgFailed, setImgFailed] = useState(false);
  const img = property?.images?.[0]?.url || null;
  const href = `/properties/${property?.id}`;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-3xl border border-[#0f2645]/10 bg-white transition hover:border-[#D4AF37]/60 ${
        dimmed ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <Link href={href} tabIndex={-1} aria-hidden="true" className="relative block aspect-[4/3] overflow-hidden bg-[#F3F0E8]">
        {img && !imgFailed ? (
          <img
            src={img}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[#52685B]/70">
            <Building2 size={30} strokeWidth={1.3} aria-hidden="true" />
          </span>
        )}
        {property?.type && (
          <span className="absolute left-3 top-3 rounded-full bg-[#0f2645] px-3 py-1 font-sans text-[11px] capitalize text-[#F5D77A] ring-1 ring-[#D4AF37]/40">
            For {property.type}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={href} className="truncate text-lg transition hover:text-[#B8902F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]">
          {property?.title}
        </Link>
        <p className="mt-1 flex items-center gap-1.5 font-sans text-[13px] text-[#52685B]">
          <MapPin size={13} aria-hidden="true" /> {property?.city}
        </p>
        <p className="mt-2 text-xl text-[#0f2645]">
          ₹{Number(property?.price || 0).toLocaleString('en-IN')}
          {property?.type === 'rent' && <span className="font-sans text-xs text-[#52685B]"> /mo</span>}
        </p>
        <div className="mt-4 flex gap-2 border-t border-[#0f2645]/10 pt-4">{actions}</div>
      </div>
    </article>
  );
}

/* ── Inquiry card ── */
function InquiryCard({ inq }) {
  const [open, setOpen] = useState(false);
  const p = inq.property;
  const st = inq.status || 'new';
  const long = (inq.message || '').length > 200;
  const style = { new: 'bg-[#F7E7B5] text-[#7A5C0F]', replied: 'bg-[#DDE9E1] text-[#2F5D45]' };
  const label = { new: 'Awaiting reply', replied: 'Replied' };

  return (
    <article className="rounded-3xl border border-[#0f2645]/10 bg-white p-5 transition hover:border-[#D4AF37]/50">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {p ? (
            <Link href={`/properties/${p.id}`} className="block truncate text-lg transition hover:text-[#B8902F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]">
              {p.title}
            </Link>
          ) : (
            <p className="text-lg">{inq.property_id ? 'Property no longer available' : 'General inquiry'}</p>
          )}
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[13px] text-[#52685B]">
            {p?.city && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} aria-hidden="true" /> {p.city}
              </span>
            )}
            <span>Sent {formatDate(inq.created_at)}</span>
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 font-sans text-[11px] font-semibold ${style[st] || 'bg-[#EEF0F2] text-[#52685B]'}`}>
          {label[st] || st}
        </span>
      </div>

      <blockquote className={`mt-4 rounded-xl border-l-[3px] border-[#D4AF37] bg-[#F3F0E8]/70 px-4 py-3 font-sans text-sm leading-relaxed ${long && !open ? 'line-clamp-3' : ''}`}>
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

function Empty({ icon: Icon, msg, sub, link, linkText }) {
  return (
    <div className="rounded-3xl border border-[#0f2645]/10 bg-white px-6 py-14 text-center">
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

function SectionError({ label, onRetry }) {
  return (
    <div role="alert" className="rounded-3xl border border-[#9C3B2B]/25 bg-[#F6E3DF] px-6 py-12 text-center">
      <AlertCircle size={26} className="mx-auto text-[#9C3B2B]" aria-hidden="true" />
      <p className="mt-3 text-xl text-[#9C3B2B]">Could not load {label}</p>
      <p className="mt-1 font-sans text-sm text-[#9C3B2B]/80">Check your connection and try again.</p>
      <button type="button" onClick={onRetry} className={`${pillPrimary} mt-5`}>
        <RefreshCw size={15} aria-hidden="true" /> Try again
      </button>
    </div>
  );
}

/* ── Toolbar: search + sort (grids) ── */
function Toolbar({ query, setQuery, sort, setSort, placeholder }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#52685B]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full rounded-full border border-[#0f2645]/15 bg-white py-2.5 pl-10 pr-4 font-sans text-sm text-[#0f2645] placeholder:text-[#52685B]/70 focus:border-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/40"
        />
      </div>
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        aria-label="Sort properties"
        className="rounded-full border border-[#0f2645]/15 bg-white px-4 py-2.5 font-sans text-sm text-[#0f2645] focus:border-[#D4AF37] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/40"
      >
        <option value="default">Sort: Default</option>
        <option value="low">Price: Low to high</option>
        <option value="high">Price: High to low</option>
      </select>
    </div>
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
  const [sort, setSort] = useState('default');
  const [inqFilter, setInqFilter] = useState('all');
  const [confirmId, setConfirmId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((t, ms = 6000) => {
    clearTimeout(toastTimer.current);
    setToast(t);
    toastTimer.current = setTimeout(() => setToast(null), ms);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

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
    setSort('default');
    setInqFilter('all');
    setConfirmId(null);
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  const postSaved = (property_id) =>
    fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property_id }),
    }).then((res) => {
      if (!res.ok) throw new Error('Failed');
    });

  const reinsertSaved = (item, index) =>
    setData((p) => {
      const next = [...p.saved];
      next.splice(Math.min(index, next.length), 0, item);
      return { ...p, saved: next };
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
            reinsertSaved(item, index);
            showToast({ type: 'success', msg: 'Saved again.' }, 3000);
          } catch {
            showToast({ type: 'error', msg: 'Could not undo. Please save it again from the property page.' });
          }
        },
      });
    } catch {
      reinsertSaved(item, index);
      showToast({ type: 'error', msg: 'Could not remove this property from your saved list. Please try again.' });
    }
  };

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

  const nav = [
    { id: 'saved', key: 'saved', label: 'Saved', icon: Heart, count: saved.length },
    { id: 'inquiries', key: 'inquiries', label: 'Inquiries', icon: MessageSquare, count: inquiries.length },
    { id: 'my-properties', key: 'properties', label: 'My properties', icon: Home, count: myProps.length },
  ];
  const activeKey = nav.find((n) => n.id === activeTab).key;
  const section = SECTIONS[activeKey];

  // helpers
  const q = query.trim().toLowerCase();
  const matches = (p) => !q || `${p?.title || ''} ${p?.city || ''}`.toLowerCase().includes(q);
  const sortFn = (a, b) => {
    const pa = Number(a?.price || 0);
    const pb = Number(b?.price || 0);
    return sort === 'low' ? pa - pb : sort === 'high' ? pb - pa : 0;
  };
  const SHOW_TOOLS_AT = 4;

  const NoMatch = () => (
    <p className="rounded-3xl border border-[#0f2645]/10 bg-white px-5 py-10 text-center font-sans text-sm text-[#52685B]">
      No results for “{query}”.{' '}
      <button type="button" onClick={() => setQuery('')} className="text-[#B8902F] underline-offset-2 hover:underline">
        Clear search
      </button>
    </p>
  );

  /* ── Panels ── */
  const renderSaved = () => {
    if (saved.length === 0)
      return <Empty icon={Heart} msg="No saved properties yet" sub="Tap the heart on any property to keep it here." link="/properties" linkText="Browse properties" />;

    const list = saved
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.property && matches(item.property))
      .sort((a, b) => sortFn(a.item.property, b.item.property));
    const orphans = saved.filter((s) => !s.property);

    return (
      <>
        {saved.length >= SHOW_TOOLS_AT && (
          <Toolbar query={query} setQuery={setQuery} sort={sort} setSort={setSort} placeholder="Search saved by title or city" />
        )}
        {list.length === 0 && orphans.length === 0 ? (
          <NoMatch />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map(({ item, index }) => (
              <PropertyCard
                key={item.id}
                property={item.property}
                actions={
                  <>
                    <Link href={`/properties/${item.property.id}`} className={`${cardBtn} flex-1 bg-[#F3F0E8] text-[#0f2645] hover:bg-[#ebe6d8]`}>
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleUnsave(item, index)}
                      aria-label={`Remove ${item.property.title} from saved`}
                      className={`${cardBtn} flex-1 gap-1.5 bg-[#F6E3DF] text-[#9C3B2B] hover:bg-[#f0d3cd]`}
                    >
                      <Heart size={13} aria-hidden="true" /> Unsave
                    </button>
                  </>
                }
              />
            ))}
          </div>
        )}
        {orphans.length > 0 && (
          <div className="mt-5 space-y-3">
            {orphans.map((o) => (
              <p key={o.id} className="flex items-start gap-2.5 rounded-xl border border-[#D4AF37]/40 bg-[#F3F0E8] px-4 py-3 font-sans text-sm text-[#7A5C0F]">
                <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                A saved property is no longer available (ID: {o.property_id}).
              </p>
            ))}
          </div>
        )}
      </>
    );
  };

  const renderInquiries = () => {
    if (inquiries.length === 0)
      return <Empty icon={MessageSquare} msg="No inquiries sent yet" sub="Interested in a property? Contact the agent from its page." link="/properties" linkText="Browse properties" />;

    const countOf = (s) => inquiries.filter((i) => (i.status || 'new') === s).length;
    const chips = [
      { id: 'all', label: 'All', n: inquiries.length },
      { id: 'new', label: 'Awaiting reply', n: countOf('new') },
      { id: 'replied', label: 'Replied', n: countOf('replied') },
    ];
    const list = inqFilter === 'all' ? inquiries : inquiries.filter((i) => (i.status || 'new') === inqFilter);

    return (
      <>
        <div role="group" aria-label="Filter inquiries" className="mb-5 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={inqFilter === c.id}
              onClick={() => setInqFilter(c.id)}
              className={`rounded-full border px-4 py-2 font-sans text-[13px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                inqFilter === c.id
                  ? 'border-[#0f2645] bg-[#0f2645] text-[#FAF9F6]'
                  : 'border-[#0f2645]/15 bg-white text-[#52685B] hover:border-[#D4AF37] hover:text-[#0f2645]'
              }`}
            >
              {c.label} ({c.n})
            </button>
          ))}
        </div>
        {list.length === 0 ? (
          <p className="rounded-3xl border border-[#0f2645]/10 bg-white px-5 py-10 text-center font-sans text-sm text-[#52685B]">
            Nothing here yet.
          </p>
        ) : (
          <div className="space-y-4">
            {list.map((inq) => (
              <InquiryCard key={inq.id} inq={inq} />
            ))}
          </div>
        )}
      </>
    );
  };

  const renderMyProps = () => {
    if (myProps.length === 0)
      return <Empty icon={Home} msg="No listings yet" sub="List your property. It's completely free." link="/dashboard/list-property" linkText="List a property" />;

    const list = myProps.filter(matches).sort(sortFn);

    return (
      <>
        {myProps.length >= SHOW_TOOLS_AT && (
          <Toolbar query={query} setQuery={setQuery} sort={sort} setSort={setSort} placeholder="Search your listings by title or city" />
        )}
        {list.length === 0 ? (
          <NoMatch />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((p) => {
              const confirming = confirmId === p.id;
              const busy = busyId === p.id;
              return (
                <PropertyCard
                  key={p.id}
                  property={p}
                  dimmed={busy}
                  actions={
                    confirming ? (
                      <div role="group" aria-label="Confirm delete" className="w-full">
                        <p className="mb-2 font-sans text-[13px] text-[#9C3B2B]">Delete this listing permanently?</p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleDeleteProperty(p.id)}
                            disabled={busy}
                            className={`${cardBtn} flex-1 gap-1.5 bg-[#9C3B2B] text-[#FAF9F6] hover:bg-[#832f21]`}
                          >
                            {busy && <Loader2 size={13} className="animate-spin" aria-hidden="true" />} Yes, delete
                          </button>
                          <button type="button" onClick={() => setConfirmId(null)} className={`${cardBtn} flex-1 bg-[#F3F0E8] text-[#0f2645] hover:bg-[#ebe6d8]`}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Link href={`/properties/${p.id}`} className={`${cardBtn} flex-1 bg-[#F3F0E8] text-[#0f2645] hover:bg-[#ebe6d8]`}>
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => setConfirmId(p.id)}
                          aria-label={`Delete ${p.title}`}
                          className={`${cardBtn} flex-1 bg-[#F6E3DF] text-[#9C3B2B] hover:bg-[#f0d3cd]`}
                        >
                          Delete
                        </button>
                      </>
                    )
                  }
                />
              );
            })}
          </div>
        )}
      </>
    );
  };

  const body = loading[activeKey] ? (
    activeKey === 'inquiries' ? <SkeletonGrid n={2} /> : <SkeletonGrid />
  ) : failed[activeKey] ? (
    <SectionError label={SOURCES[activeKey].label} onRetry={() => loadSection(activeKey)} />
  ) : activeKey === 'saved' ? (
    renderSaved()
  ) : activeKey === 'inquiries' ? (
    renderInquiries()
  ) : (
    renderMyProps()
  );

  return (
    <div className={`${marcellus.className} min-h-screen bg-[#FAF9F6] font-normal text-[#0f2645]`}>
      {/* ═══ Mobile / tablet top bar ═══ */}
      <header className="relative bg-[#0f2645] px-4 py-3 text-[#FAF9F6] lg:hidden">
        <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg text-[#0f2645] ${goldBg}`}>
            {initial}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base leading-tight">{session?.user?.name}</p>
            <p className="truncate font-sans text-xs text-[#FAF9F6]/60">{session?.user?.email}</p>
          </div>
          {isAdmin && (
            <Link href="/admin" aria-label="Admin panel" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/50 transition hover:bg-[#FAF9F6]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F5D77A]">
              <ShieldCheck size={17} aria-hidden="true" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/login' })}
            aria-label="Logout"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#FAF9F6]/25 transition hover:bg-[#9C3B2B]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F5D77A]"
          >
            <LogOut size={17} aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 pb-28 sm:px-6 lg:grid-cols-[272px_1fr] lg:px-8 lg:py-10 lg:pb-10">
        {/* ═══ Desktop sidebar ═══ */}
        <aside className="hidden lg:block">
          <div className="sticky top-8 overflow-hidden rounded-3xl bg-[#0f2645] p-6 text-[#FAF9F6]">
            <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
            <div aria-hidden="true" className="pointer-events-none absolute -left-16 -top-10 h-48 w-48 rounded-full bg-[#D4AF37]/10 blur-3xl" />

            <div className="relative flex items-center gap-3">
              <span aria-hidden="true" className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl text-[#0f2645] ${goldBg}`}>
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg leading-tight">{session?.user?.name}</p>
                <p className="truncate font-sans text-xs text-[#FAF9F6]/60">{session?.user?.email}</p>
              </div>
            </div>

            <nav aria-label="Dashboard sections" className="relative mt-6 space-y-1.5 font-sans text-sm">
              {nav.map(({ id, key, label, icon: Icon, count }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => switchTab(id)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#F5D77A] ${
                      active ? 'bg-[#FAF9F6] text-[#0f2645]' : 'text-[#FAF9F6]/80 hover:bg-[#FAF9F6]/10'
                    }`}
                  >
                    <Icon size={17} aria-hidden="true" className={active ? 'text-[#B8902F]' : 'text-[#F5D77A]'} />
                    <span className="flex-1">{label}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs ${active ? 'bg-[#F3F0E8] text-[#0f2645]' : 'bg-[#FAF9F6]/10'}`}>
                      {loading[key] ? '…' : count}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="relative mt-6 space-y-2.5 border-t border-[#FAF9F6]/15 pt-6 font-sans text-sm">
              <Link
                href="/dashboard/list-property"
                className={`flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[#0f2645] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D77A] ${goldBg}`}
              >
                <Plus size={15} aria-hidden="true" /> List property
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2 rounded-full border border-[#D4AF37]/50 px-5 py-2.5 transition hover:bg-[#FAF9F6]/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D77A]"
                >
                  <ShieldCheck size={15} aria-hidden="true" /> Admin panel
                </Link>
              )}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#FAF9F6]/25 px-5 py-2.5 transition hover:border-[#E8A396]/60 hover:bg-[#9C3B2B]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D77A]"
              >
                <LogOut size={15} aria-hidden="true" /> Logout
              </button>
            </div>
          </div>
        </aside>

        {/* ═══ Main content ═══ */}
        <main className="min-w-0">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl leading-tight">{section.title}</h1>
              <p className="mt-1 font-sans text-sm text-[#52685B]">{section.sub}</p>
            </div>
            {activeKey === 'properties' && myProps.length > 0 && (
              <Link href="/dashboard/list-property" className={pillPrimary}>
                <Plus size={15} aria-hidden="true" /> Add new listing
              </Link>
            )}
          </div>

          <motion.div
            key={activeTab}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {body}
          </motion.div>
        </main>
      </div>

      {/* ═══ Mobile bottom nav (thumb reach) ═══ */}
      <nav
        aria-label="Dashboard sections"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#0f2645]/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 font-sans text-[11px]">
          {nav.map(({ id, key, label, icon: Icon, count }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => switchTab(id)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex flex-col items-center gap-1 py-2.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                  active ? 'text-[#0f2645]' : 'text-[#52685B]'
                }`}
              >
                {active && <span aria-hidden="true" className={`absolute inset-x-4 top-0 h-[3px] rounded-b ${goldBg}`} />}
                <span className="relative">
                  <Icon size={20} strokeWidth={active ? 2 : 1.6} aria-hidden="true" />
                  {!loading[key] && count > 0 && (
                    <span className="absolute -right-3 -top-2 min-w-[16px] rounded-full bg-[#0f2645] px-1 text-center text-[10px] leading-4 text-[#F5D77A]">
                      {count}
                    </span>
                  )}
                </span>
                {label === 'My properties' ? 'Listings' : label}
              </button>
            );
          })}
          <Link href="/dashboard/list-property" className="flex flex-col items-center gap-1 py-2.5 text-[#B8902F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]">
            <Plus size={20} aria-hidden="true" />
            List
          </Link>
        </div>
      </nav>

      {/* ── Toast ── */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 lg:bottom-6">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.msg}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex max-w-md items-center gap-3 rounded-full px-5 py-3 font-sans text-sm shadow-lg ring-1 ${
                toast.type === 'error' ? 'bg-[#F6E3DF] text-[#9C3B2B] ring-[#9C3B2B]/25' : 'bg-[#0f2645] text-[#FAF9F6] ring-[#D4AF37]/40'
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