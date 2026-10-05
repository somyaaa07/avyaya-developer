'use client';
import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Marcellus } from 'next/font/google';
import {
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  MapPin,
  Ruler,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
});

const PAGE_SIZE = 6;

/* Page numbers with ellipsis: 1 ... 4 5 6 ... 12 */
const getPageList = (total, current) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const list = [...pages].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out = [];
  list.forEach((n, i) => {
    if (i > 0 && n - list[i - 1] > 1) out.push('...');
    out.push(n);
  });
  return out;
};

const EMPTY_FILTERS = {
  search: '',
  type: '',
  city: '',
  property_type: '',
  minPrice: '',
  maxPrice: '',
  minBeds: '',
  sort: 'newest',
};

const TYPE_BADGE = {
  buy: 'bg-[#0f2645] text-[#F5D77A]',
  sell: 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-[#0f2645]',
  rent: 'bg-[#FAF9F6] text-[#0f2645]',
};

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

/* URL se filters nikalne ka helper */
const filtersFromParams = (sp) => ({
  search: sp.get('search') || '',
  type: sp.get('type') || '',
  city: sp.get('city') || '',
  property_type: sp.get('property_type') || '',
  minPrice: sp.get('minPrice') || '',
  maxPrice: sp.get('maxPrice') || '',
  minBeds: sp.get('minBeds') || '',
  sort: sp.get('sort') || 'newest',
});

/* ---------------------------------------------------------------
   GOLD BUTTON  (golden fill + glass shine)
---------------------------------------------------------------- */
const GoldBtn = ({ children, onClick, type = 'button', className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-[#F5D77A] via-[#D4AF37] to-[#A67C1E] px-7 py-3 text-sm font-normal text-[#0f2645] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_20px_rgba(166,124,30,0.3)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_14px_30px_rgba(166,124,30,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${className}`}
  >
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[450%]"
    />
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  </button>
);

/* ---------------------------------------------------------------
   PROPERTY CARD
---------------------------------------------------------------- */
function PropertyCard({ p }) {
  const mainImage = p.images?.[0]?.url || null;
  const stats = [
    p.bedrooms && { icon: BedDouble, text: `${p.bedrooms} Beds` },
    p.bathrooms && { icon: Bath, text: `${p.bathrooms} Baths` },
    p.area && { icon: Ruler, text: `${p.area} sqft` },
  ].filter(Boolean);

  return (
    <Link
      href={`/properties/${p.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#0f2645]/10 bg-[#FAF9F6] p-2.5 transition duration-300 hover:border-[#D4AF37]/60 hover:shadow-[0_18px_40px_-18px_rgba(26,42,34,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F3F0E8]">
        {mainImage ? (
          <img
            src={mainImage}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#52685B]">
            <ImageOff size={28} strokeWidth={1.4} />
            <span className="text-xs">No image</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f2645]/55 to-transparent" />

        {p.type && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs capitalize shadow-sm ${
              TYPE_BADGE[p.type] || TYPE_BADGE.rent
            }`}
          >
            For {p.type}
          </span>
        )}

        {p.images?.length > 1 && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-[#0f2645]/65 px-2.5 py-1 text-[11px] text-[#FAF9F6] backdrop-blur">
            <Camera size={12} aria-hidden="true" /> {p.images.length}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-3.5 pb-3 pt-5">
        <h3 className="line-clamp-1 text-[22px] leading-snug text-[#0f2645]">{p.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#52685B]">
          <MapPin size={14} className="shrink-0 text-[#B8902F]" aria-hidden="true" />
          <span className="line-clamp-1">
            {[p.location, p.city].filter(Boolean).join(', ')}
          </span>
        </p>

        {stats.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[#52685B]/15 pt-4 text-[13px] text-[#52685B]">
            {stats.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-1.5">
                <Icon size={15} strokeWidth={1.5} aria-hidden="true" /> {text}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-end justify-between pt-5">
          <p className="text-2xl leading-none text-[#0f2645]">
            ₹{Number(p.price).toLocaleString('en-IN')}
            {p.type === 'rent' && <span className="ml-1 font-sans text-sm text-[#52685B]">/mo</span>}
          </p>
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A] transition duration-300 group-hover:bg-gradient-to-br group-hover:from-[#F5D77A] group-hover:to-[#B8902F] group-hover:text-[#0f2645]"
          >
            <ArrowUpRight size={17} />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ---------------------------------------------------------------
   FILTER CHIP
---------------------------------------------------------------- */
function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#FAF9F6] py-1.5 pl-4 pr-2 text-xs capitalize text-[#0f2645]">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A] transition hover:bg-[#52685B]"
      >
        <X size={11} />
      </button>
    </span>
  );
}

/* ---------------------------------------------------------------
   FORM PIECES
---------------------------------------------------------------- */
const fieldBase =
  'w-full rounded-xl border border-[#52685B]/25 bg-[#FAF9F6] px-4 py-3 text-sm text-[#0f2645] outline-none transition placeholder:text-[#52685B]/60 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/25';

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="mb-2 block text-sm text-[#0f2645]">
    {children}
  </label>
);

const SelectField = ({ id, value, onChange, children, className = '' }) => (
  <div className={`relative ${className}`}>
    <select
      id={id}
      value={value}
      onChange={onChange}
      className={`${fieldBase} cursor-pointer appearance-none pr-10`}
    >
      {children}
    </select>
    <ChevronDown
      size={16}
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#52685B]"
    />
  </div>
);

/* Filter fields (desktop sidebar + mobile drawer me same) */
function FilterFields({ idPrefix, filters, cities, setFilters, applyFilters, updateFilter }) {
  const applyOnEnter = (e) => e.key === 'Enter' && applyFilters(filters);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Label htmlFor={`${idPrefix}-city`}>City</Label>
        <SelectField
          id={`${idPrefix}-city`}
          value={filters.city}
          onChange={(e) => updateFilter('city', e.target.value)}
        >
          <option value="">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>
      </div>

      <div>
        <Label htmlFor={`${idPrefix}-ptype`}>Property type</Label>
        <SelectField
          id={`${idPrefix}-ptype`}
          value={filters.property_type}
          onChange={(e) => updateFilter('property_type', e.target.value)}
        >
          <option value="">All types</option>
          {['apartment', 'house', 'villa', 'plot', 'commercial'].map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </SelectField>
      </div>

      <div>
        <Label htmlFor={`${idPrefix}-min`}>Price range (₹)</Label>
        <div className="flex items-center gap-2">
          <input
            id={`${idPrefix}-min`}
            type="number"
            inputMode="numeric"
            placeholder="Min"
            className={fieldBase}
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            onBlur={() => applyFilters(filters)}
            onKeyDown={applyOnEnter}
          />
          <span className="text-[#52685B]" aria-hidden="true">–</span>
          <input
            type="number"
            inputMode="numeric"
            aria-label="Maximum price"
            placeholder="Max"
            className={fieldBase}
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            onBlur={() => applyFilters(filters)}
            onKeyDown={applyOnEnter}
          />
        </div>
      </div>

      <div>
        <Label>Minimum bedrooms</Label>
        <div className="flex flex-wrap gap-2">
          {['', '1', '2', '3', '4'].map((b) => {
            const active = filters.minBeds === b;
            return (
              <button
                key={b}
                type="button"
                onClick={() => updateFilter('minBeds', b)}
                aria-pressed={active}
                className={`rounded-full border px-4 py-2 text-[13px] transition duration-300 ${
                  active
                    ? 'border-[#0f2645] bg-[#0f2645] text-[#F5D77A]'
                    : 'border-[#52685B]/25 bg-[#FAF9F6] text-[#52685B] hover:border-[#D4AF37] hover:text-[#0f2645]'
                }`}
              >
                {b === '' ? 'Any' : `${b}+`}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   PAGINATION
---------------------------------------------------------------- */
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const arrow =
    'flex h-11 w-11 items-center justify-center rounded-full border border-[#0f2645]/20 bg-[#FAF9F6] text-[#0f2645] transition hover:border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#0f2645]/20 disabled:hover:shadow-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]';

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page" className={arrow}>
        <ChevronLeft size={18} />
      </button>

      {getPageList(totalPages, page).map((n, i) =>
        n === '...' ? (
          <span key={`dots-${i}`} className="px-1 text-[#52685B]" aria-hidden="true">…</span>
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`Page ${n}`}
            aria-current={n === page ? 'page' : undefined}
            className={`flex h-11 min-w-[44px] items-center justify-center rounded-full border px-3 text-sm transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
              n === page
                ? 'border-transparent bg-gradient-to-br from-[#F5D77A] via-[#D4AF37] to-[#A67C1E] text-[#0f2645] shadow-md'
                : 'border-[#0f2645]/20 bg-[#FAF9F6] text-[#52685B] hover:border-[#D4AF37] hover:text-[#0f2645]'
            }`}
          >
            {n}
          </button>
        )
      )}

      <button type="button" onClick={() => onChange(page + 1)} disabled={page === totalPages} aria-label="Next page" className={arrow}>
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}

/* ---------------------------------------------------------------
   MAIN CONTENT (Suspense ke andar, useSearchParams ke liye)
---------------------------------------------------------------- */
function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(() => filtersFromParams(searchParams));
  const [properties, setProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop
  const [drawerOpen, setDrawerOpen] = useState(false); // mobile
  const [page, setPage] = useState(1);
  const resultsRef = useRef(null);

  useEffect(() => {
    fetch('/api/properties/cities')
      .then((r) => r.json())
      .then(setCities)
      .catch(() => {});
  }, []);

  const fetchProperties = useCallback(async (f) => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });

    try {
      const res = await fetch(`/api/properties?${params}`);
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch {
      setProperties([]);
    }
    setLoading(false);
  }, []);

  // URL badalte hi (navbar click, tabs, back/forward) filters sync + fetch
  useEffect(() => {
    const urlFilters = filtersFromParams(searchParams);
    setFilters(urlFilters);
    setPage(1);
    fetchProperties(urlFilters);
  }, [searchParams, fetchProperties]);

  // Mobile drawer: body scroll lock + Esc
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setDrawerOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  // Sirf URL update karo; upar wala effect fetch karega
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.replace(`/properties?${params}`, { scroll: false });
  };

  const updateFilter = (key, value) => applyFilters({ ...filters, [key]: value });
  const resetFilters = () => applyFilters(EMPTY_FILTERS);

  // Pagination (client-side, 6 per page)
  const totalPages = Math.max(1, Math.ceil(properties.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleProperties = properties.slice(start, start + PAGE_SIZE);

  const goToPage = (n) => {
    setPage(n);
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeFilters = [
    filters.type && { key: 'type', label: `For ${filters.type}` },
    filters.city && { key: 'city', label: filters.city },
    filters.property_type && { key: 'property_type', label: filters.property_type },
    filters.minPrice && {
      key: 'minPrice',
      label: `Min ₹${Number(filters.minPrice).toLocaleString('en-IN')}`,
    },
    filters.maxPrice && {
      key: 'maxPrice',
      label: `Max ₹${Number(filters.maxPrice).toLocaleString('en-IN')}`,
    },
    filters.minBeds && { key: 'minBeds', label: `${filters.minBeds}+ beds` },
  ].filter(Boolean);

  const gridCols = sidebarOpen
    ? 'sm:grid-cols-2 xl:grid-cols-3'
    : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  const fieldProps = { filters, cities, setFilters, applyFilters, updateFilter };

  const toolbarBtn =
    'items-center gap-2 rounded-full border border-[#0f2645]/20 bg-[#FAF9F6] px-5 py-2.5 text-[13px] text-[#0f2645] transition hover:border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(212,175,55,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]';
  const countBadge = (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0f2645] text-[10px] text-[#F5D77A]">
      {activeFilters.length}
    </span>
  );

  return (
    <div
      className={`${marcellus.variable} min-h-screen bg-[#0f2645] font-[family-name:var(--font-marcellus)] font-normal text-[#0f2645]`}
    >
      {/* ============ HERO + SEARCH ============ */}
      <section className="relative overflow-hidden bg-[#0f2645] px-5 pb-28 pt-14 sm:px-8 lg:pb-32 lg:pt-20">
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl leading-[1.1] text-[#FAF9F6] sm:text-5xl lg:text-6xl">
            Find Your Perfect Property
          </h1>
          <span
            aria-hidden="true"
            className="mx-auto mt-5 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]"
          />
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-[#FAF9F6]/70">
            Buy, sell or rent handpicked homes, plots and commercial spaces across Greater Noida.
          </p>

          {/* Type tabs */}
          <div
            role="group"
            aria-label="Listing type"
            className="mt-8 inline-flex rounded-full border border-[#FAF9F6]/15 bg-[#FAF9F6]/5 p-1.5 backdrop-blur"
          >
            {['', 'buy', 'sell', 'rent'].map((t) => {
              const active = filters.type === t;
              return (
                <button
                  key={t}
                  onClick={() => updateFilter('type', t)}
                  aria-pressed={active}
                  className={`rounded-full px-5 py-2 text-[13px] capitalize transition duration-300 sm:px-7 ${
                    active
                      ? 'bg-gradient-to-br from-[#F5D77A] via-[#D4AF37] to-[#A67C1E] text-[#0f2645] shadow-md'
                      : 'text-[#FAF9F6]/80 hover:text-[#F5D77A]'
                  }`}
                >
                  {t === '' ? 'All' : t}
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="mx-auto mt-6 flex max-w-3xl flex-col gap-3 rounded-3xl bg-[#FAF9F6] p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:flex-row sm:items-center sm:rounded-full">
            <div className="flex flex-1 items-center gap-3 px-4">
              <Search size={18} className="shrink-0 text-[#52685B]" aria-hidden="true" />
              <input
                type="text"
                aria-label="Search properties"
                placeholder="Search city, location or property name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters(filters)}
                className="w-full bg-transparent py-3 text-[15px] text-[#0f2645] outline-none placeholder:text-[#52685B]/60"
              />
              {filters.search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => updateFilter('search', '')}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F3F0E8] text-[#52685B] transition hover:bg-[#0f2645] hover:text-[#F5D77A]"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <GoldBtn onClick={() => applyFilters(filters)} className="sm:py-3.5">
              Search
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </GoldBtn>
          </div>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-3 pb-20 sm:px-4">
        <div className="rounded-[2rem] bg-[#F3F0E8] p-4 shadow-[0_10px_40px_rgba(26,42,34,0.08)] sm:p-8">
          {/* Toolbar */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl text-[#0f2645]" aria-live="polite">
                {loading
                  ? 'Searching...'
                  : `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'} found`}
              </h2>
              {!loading && properties.length > PAGE_SIZE && (
                <p className="mt-1 text-[13px] text-[#52685B]">
                  Showing {start + 1}–{Math.min(start + PAGE_SIZE, properties.length)} of {properties.length}
                </p>
              )}
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
              {/* Mobile: open drawer */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className={`inline-flex lg:hidden ${toolbarBtn}`}
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                Filters
                {activeFilters.length > 0 && countBadge}
              </button>

              {/* Desktop: toggle sidebar */}
              <button
                type="button"
                onClick={() => setSidebarOpen((p) => !p)}
                aria-expanded={sidebarOpen}
                className={`hidden lg:inline-flex ${toolbarBtn}`}
              >
                <SlidersHorizontal size={15} aria-hidden="true" />
                {sidebarOpen ? 'Hide filters' : 'Show filters'}
                {activeFilters.length > 0 && countBadge}
              </button>

              {/* Sort */}
              <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
                <label htmlFor="sort-by" className="hidden text-[13px] text-[#52685B] sm:block">
                  Sort by
                </label>
                <SelectField
                  id="sort-by"
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="w-full sm:w-52"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </SelectField>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {activeFilters.map((f) => (
                <FilterChip key={f.key} label={f.label} onRemove={() => updateFilter(f.key, '')} />
              ))}
              <button
                onClick={resetFilters}
                className="ml-1 text-xs text-[#52685B] underline underline-offset-4 transition hover:text-[#0f2645]"
              >
                Clear all
              </button>
            </div>
          )}

          <div
            className={`mt-8 grid items-start gap-8 ${
              sidebarOpen ? 'lg:grid-cols-[290px_1fr]' : 'grid-cols-1'
            }`}
          >
            {/* ---------- DESKTOP FILTER SIDEBAR ---------- */}
            {sidebarOpen && (
              <aside className="hidden rounded-3xl border border-[#0f2645]/10 bg-[#FAF9F6] p-6 lg:sticky lg:top-24 lg:block">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl text-[#0f2645]">Filters</h2>
                  {activeFilters.length > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-xs text-[#52685B] underline underline-offset-4 transition hover:text-[#0f2645]"
                    >
                      Reset all
                    </button>
                  )}
                </div>
                <span className="mb-6 block h-px w-full bg-gradient-to-r from-[#D4AF37]/70 via-[#D4AF37]/20 to-transparent" />
                <FilterFields idPrefix="d" {...fieldProps} />
              </aside>
            )}

            {/* ---------- RESULTS ---------- */}
            <div ref={resultsRef} className="min-w-0 scroll-mt-24">
              {loading ? (
                <div className={`grid gap-6 ${gridCols}`}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="animate-pulse overflow-hidden rounded-[22px] border border-[#0f2645]/10 bg-[#FAF9F6] p-2.5"
                    >
                      <div className="aspect-[4/3] rounded-2xl bg-[#52685B]/15" />
                      <div className="space-y-3 px-3.5 pb-4 pt-5">
                        <div className="h-5 w-3/4 rounded-full bg-[#52685B]/15" />
                        <div className="h-4 w-1/2 rounded-full bg-[#52685B]/10" />
                        <div className="h-7 w-2/5 rounded-full bg-[#52685B]/15" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-[#0f2645]/10 bg-[#FAF9F6] px-6 py-20 text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F3F0E8] text-[#B8902F]">
                    <SearchX size={34} strokeWidth={1.3} />
                  </span>
                  <p className="mt-6 text-2xl text-[#0f2645]">No properties found</p>
                  <p className="mt-2 max-w-sm text-sm text-[#52685B]">
                    Try changing or clearing your filters to see more results.
                  </p>
                  <GoldBtn onClick={resetFilters} className="mt-7">
                    Reset filters
                  </GoldBtn>
                </div>
              ) : (
                <>
                  <div className={`grid gap-6 ${gridCols}`}>
                    {visibleProperties.map((p) => (
                      <PropertyCard key={p.id} p={p} />
                    ))}
                  </div>
                  <Pagination page={currentPage} totalPages={totalPages} onChange={goToPage} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============ MOBILE FILTER DRAWER ============ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div
            className="absolute inset-0 bg-[#0f2645]/50"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[28px] bg-[#FAF9F6] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#0f2645]/10 px-6 py-4">
              <h2 className="text-xl text-[#0f2645]">Filters</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0f2645]/15 text-[#0f2645] transition hover:bg-[#F3F0E8]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <FilterFields idPrefix="m" {...fieldProps} />
            </div>

            <div className="flex items-center gap-3 border-t border-[#0f2645]/10 px-6 py-4">
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm text-[#52685B] underline underline-offset-4"
              >
                Reset
              </button>
              <GoldBtn onClick={() => setDrawerOpen(false)} className="flex-1">
                {loading ? 'Searching...' : `Show ${properties.length} propert${properties.length === 1 ? 'y' : 'ies'}`}
              </GoldBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   EXPORT (Suspense required for useSearchParams)
---------------------------------------------------------------- */
export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
          <p className="text-[#52685B]">Loading...</p>
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}