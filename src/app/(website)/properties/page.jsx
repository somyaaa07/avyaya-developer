'use client';
import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
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
  RefreshCw,
  Ruler,
  Search,
  SearchX,
  SlidersHorizontal,
  WifiOff,
  X,
} from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
});

const PAGE_SIZE = 6;
const DEBOUNCE_MS = 450;

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

/* Indian price format: ₹1.25 Cr / ₹45 L / ₹25,000 */
const formatPrice = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return '₹—';
  if (n >= 1e7) return `₹${Number((n / 1e7).toFixed(2))} Cr`;
  if (n >= 1e5) return `₹${Number((n / 1e5).toFixed(2))} L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const EMPTY_FILTERS = {
  search: '',
  type: '',
  city: '',
  property_type: '',
  minPrice: '',
  maxPrice: '',
  minBeds: '',
  furnishing: '',
  facing: '',
  parking: '',
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

const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'plot', 'commercial', 'residential'];

const FURNISHING_OPTIONS = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi-furnished', label: 'Semi-furnished' },
  { value: 'furnished', label: 'Furnished' },
];

const PARKING_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'bike', label: 'Bike' },
  { value: 'car', label: 'Car' },
  { value: 'both', label: 'Car + Bike' },
];

const FACING_OPTIONS = [
  'North',
  'South',
  'East',
  'West',
  'North-East',
  'North-West',
  'South-East',
  'South-West',
];

const LISTING_TABS = [
  { value: '', label: 'All' },
  { value: 'buy', label: 'Buy' },
  { value: 'sell', label: 'Sell' },
  { value: 'rent', label: 'Rent' },
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
  furnishing: sp.get('furnishing') || '',
  facing: sp.get('facing') || '',
  parking: sp.get('parking') || '',
  sort: sp.get('sort') || 'newest',
});

/* Filters -> query string (fixed key order, empty values skipped) */
const buildQs = (f) => {
  const params = new URLSearchParams();
  Object.entries(f).forEach(([k, v]) => {
    if (v) params.set(k, v);
  });
  return params.toString();
};

const isPriceRangeInvalid = (f) =>
  f.minPrice !== '' && f.maxPrice !== '' && Number(f.minPrice) > Number(f.maxPrice);

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]';

/* ---------------------------------------------------------------
   GOLD BUTTON  (golden fill + glass shine)
---------------------------------------------------------------- */
const GoldBtn = ({ children, onClick, type = 'button', className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-[#F5D77A] via-[#D4AF37] to-[#A67C1E] px-7 py-3 text-sm font-normal text-[#0f2645] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_20px_rgba(166,124,30,0.3)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_14px_30px_rgba(166,124,30,0.5)] ${focusRing} ${className}`}
  >
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[450%] motion-reduce:hidden"
    />
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  </button>
);

/* ---------------------------------------------------------------
   PROPERTY CARD
   Price sits on the photo (the one memorable element);
   the body stays calm: title, place, three specs, link.
---------------------------------------------------------------- */
function PropertyCard({ p }) {
  const [imgFailed, setImgFailed] = useState(false);
  const mainImage = !imgFailed ? p.images?.[0]?.url || null : null;
  const stats = [
    p.bedrooms && { icon: BedDouble, value: p.bedrooms, label: 'Beds' },
    p.bathrooms && { icon: Bath, value: p.bathrooms, label: 'Baths' },
    p.area && { icon: Ruler, value: p.area, label: 'sqft' },
  ].filter(Boolean);

  return (
    <Link
      href={`/properties/${p.id}`}
      className={`group flex h-full flex-col overflow-hidden rounded-[26px] border border-[#0f2645]/10 bg-[#FAF9F6] p-2 transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/60 hover:shadow-[0_24px_48px_-20px_rgba(15,38,69,0.35)] motion-reduce:hover:translate-y-0 ${focusRing}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#F3F0E8]">
        {mainImage ? (
          <img
            src={mainImage}
            alt={p.title}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:group-hover:scale-100"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#52685B]">
            <ImageOff size={28} strokeWidth={1.4} />
            <span className="text-xs">No image</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0f2645]/85 via-[#0f2645]/35 to-transparent" />

        {p.type && (
          <span
            className={`absolute left-3 top-3 rounded-full px-3.5 py-1.5 text-xs capitalize shadow-sm ${
              TYPE_BADGE[p.type] || TYPE_BADGE.rent
            }`}
          >
            For {p.type}
          </span>
        )}

        {p.images?.length > 1 && (
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-[#0f2645]/60 px-2.5 py-1.5 text-[11px] text-[#FAF9F6] backdrop-blur">
            <Camera size={12} aria-hidden="true" /> {p.images.length}
          </span>
        )}

        {/* Price on photo */}
        <p
          className="absolute inset-x-4 bottom-3.5 text-[26px] leading-none text-[#FAF9F6]"
          title={`₹${Number(p.price).toLocaleString('en-IN')}`}
        >
          {formatPrice(p.price)}
          {p.type === 'rent' && <span className="ml-1.5 font-sans text-sm text-[#FAF9F6]/75">/mo</span>}
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-3 pb-2 pt-5">
        <h3 className="line-clamp-1 text-[21px] leading-snug text-[#0f2645]">{p.title}</h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#52685B]">
          <MapPin size={14} className="shrink-0 text-[#B8902F]" aria-hidden="true" />
          <span className="line-clamp-1">{[p.location, p.city].filter(Boolean).join(', ')}</span>
        </p>

        {stats.length > 0 && (
          <ul
            className="mt-5 grid divide-x divide-[#52685B]/15 rounded-2xl bg-[#F3F0E8] py-3"
            style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
          >
            {stats.map(({ icon: Icon, value, label }) => (
              <li key={label} className="flex flex-col items-center gap-1 px-2">
                <Icon size={16} strokeWidth={1.5} className="text-[#B8902F]" aria-hidden="true" />
                <span className="text-[15px] leading-none text-[#0f2645]">{value}</span>
                <span className="text-[11px] text-[#52685B]">{label}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between pt-5 text-sm text-[#0f2645]">
          <span>View details</span>
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
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#FAF9F6] py-1.5 pl-4 pr-2 text-xs capitalize text-[#0f2645]">
      <span className="truncate">{label}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A] transition hover:bg-[#52685B] ${focusRing}`}
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
  'w-full rounded-xl border border-[#52685B]/25 bg-[#FAF9F6] px-4 py-3 text-sm text-[#0f2645] outline-none transition placeholder:text-[#52685B]/60 hover:border-[#52685B]/50 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/25';

const Label = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="mb-2 block text-[13px] text-[#52685B]">
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

/* A titled group inside the filter panel */
const Group = ({ title, children }) => (
  <fieldset className="border-0 p-0">
    <legend className="mb-4 flex w-full items-center gap-3 text-[15px] text-[#0f2645]">
      {title}
      <span className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/50 to-transparent" />
    </legend>
    <div className="flex flex-col gap-4">{children}</div>
  </fieldset>
);

/* Filter fields (desktop sidebar + mobile drawer me same) */
function FilterFields({ idPrefix, filters, cities, setFilters, applyFilters, updateFilter }) {
  const applyOnEnter = (e) => e.key === 'Enter' && applyFilters(filters);
  const priceInvalid = isPriceRangeInvalid(filters);

  return (
    <div className="flex flex-col gap-8">
      <Group title="Where & what">
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
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </SelectField>
        </div>
      </Group>

      <Group title="Budget & size">
        <div>
          <Label htmlFor={`${idPrefix}-min`}>Price range</Label>
          <div className="flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#B8902F]">₹</span>
              <input
                id={`${idPrefix}-min`}
                type="number"
                min="0"
                inputMode="numeric"
                placeholder="Min"
                aria-invalid={priceInvalid}
                className={`${fieldBase} pl-8`}
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                onKeyDown={applyOnEnter}
              />
            </div>
            <span className="text-[#52685B]" aria-hidden="true">–</span>
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#B8902F]">₹</span>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                aria-label="Maximum price"
                placeholder="Max"
                aria-invalid={priceInvalid}
                className={`${fieldBase} pl-8`}
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                onKeyDown={applyOnEnter}
              />
            </div>
          </div>
          {priceInvalid ? (
            <p role="alert" className="mt-2 text-xs text-[#A67C1E]">
              Minimum price should be lower than maximum.
            </p>
          ) : (
            (filters.minPrice || filters.maxPrice) && (
              <p className="mt-2 text-xs text-[#52685B]">
                {filters.minPrice ? formatPrice(filters.minPrice) : 'Any'} –{' '}
                {filters.maxPrice ? formatPrice(filters.maxPrice) : 'Any'}
              </p>
            )
          )}
        </div>

        <div>
          <Label>Minimum bedrooms</Label>
          <div className="grid grid-cols-5 gap-1.5 rounded-full bg-[#F3F0E8] p-1">
            {['', '1', '2', '3', '4'].map((b) => {
              const active = filters.minBeds === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => updateFilter('minBeds', b)}
                  aria-pressed={active}
                  className={`rounded-full py-2 text-[13px] transition duration-300 ${focusRing} ${
                    active
                      ? 'bg-[#0f2645] text-[#F5D77A] shadow-sm'
                      : 'text-[#52685B] hover:text-[#0f2645]'
                  }`}
                >
                  {b === '' ? 'Any' : `${b}+`}
                </button>
              );
            })}
          </div>
        </div>
      </Group>

      <Group title="Features">
        <div>
          <Label htmlFor={`${idPrefix}-furn`}>Furnishing</Label>
          <SelectField
            id={`${idPrefix}-furn`}
            value={filters.furnishing}
            onChange={(e) => updateFilter('furnishing', e.target.value)}
          >
            <option value="">Any</option>
            {FURNISHING_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </SelectField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={`${idPrefix}-park`}>Parking</Label>
            <SelectField
              id={`${idPrefix}-park`}
              value={filters.parking}
              onChange={(e) => updateFilter('parking', e.target.value)}
            >
              <option value="">Any</option>
              {PARKING_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </SelectField>
          </div>

          <div>
            <Label htmlFor={`${idPrefix}-facing`}>Facing</Label>
            <SelectField
              id={`${idPrefix}-facing`}
              value={filters.facing}
              onChange={(e) => updateFilter('facing', e.target.value)}
            >
              <option value="">Any</option>
              {FACING_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </SelectField>
          </div>
        </div>
      </Group>
    </div>
  );
}

/* ---------------------------------------------------------------
   PAGINATION
---------------------------------------------------------------- */
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const arrow = `flex h-11 w-11 items-center justify-center rounded-full border border-[#0f2645]/20 bg-[#FAF9F6] text-[#0f2645] transition hover:border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#0f2645]/20 disabled:hover:shadow-none ${focusRing}`;

  return (
    <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
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
            className={`flex h-11 min-w-[44px] items-center justify-center rounded-full border px-3 text-sm transition duration-300 ${focusRing} ${
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
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop
  const [drawerOpen, setDrawerOpen] = useState(false); // mobile
  const resultsRef = useRef(null);
  const abortRef = useRef(null);
  const pushedRef = useRef(null); // last query string pushed by this page itself

  // Filters ka query string (page param ke bina) + page URL se
  const filtersKey = useMemo(() => buildQs(filtersFromParams(searchParams)), [searchParams]);
  const urlPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);

  useEffect(() => {
    fetch('/api/properties/cities')
      .then((r) => r.json())
      .then((d) => setCities(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const fetchProperties = useCallback(async (f) => {
    // purani request cancel, taaki slow response naye result ko overwrite na kare
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/properties?${buildQs(f)}`, { signal: controller.signal });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name === 'AbortError') return;
      setError(true);
    }
    setLoading(false);
    setHasLoaded(true);
  }, []);

  // URL badalte hi (navbar click, tabs, back/forward) fetch; bahar se change ho to filters sync
  useEffect(() => {
    const urlFilters = filtersFromParams(new URLSearchParams(filtersKey));
    if (filtersKey !== pushedRef.current) setFilters(urlFilters);
    fetchProperties(urlFilters);
    return () => abortRef.current?.abort();
  }, [filtersKey, reloadKey, fetchProperties]);

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

  // Sirf URL update karo; upar wala effect fetch karega. Filter badalne par page 1 par reset.
  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    const qs = buildQs(newFilters);
    pushedRef.current = qs;
    router.replace(qs ? `/properties?${qs}` : '/properties', { scroll: false });
  };

  const updateFilter = (key, value) => applyFilters({ ...filters, [key]: value });
  const resetFilters = () => applyFilters(EMPTY_FILTERS);

  // Typing pe live search: search + price ko debounce karke apply karo
  useEffect(() => {
    if (buildQs(filters) === filtersKey) return;
    if (isPriceRangeInvalid(filters)) return;
    const t = setTimeout(() => applyFilters(filters), DEBOUNCE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.minPrice, filters.maxPrice]);

  // Pagination (client-side, 6 per page) - page URL me rehta hai, back button kaam karta hai
  const totalPages = Math.max(1, Math.ceil(properties.length / PAGE_SIZE));
  const currentPage = Math.min(urlPage, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleProperties = properties.slice(start, start + PAGE_SIZE);

  const goToPage = (n) => {
    const qs = buildQs(filters);
    const params = new URLSearchParams(qs);
    if (n > 1) params.set('page', String(n));
    const next = params.toString();
    router.push(next ? `/properties?${next}` : '/properties', { scroll: false });
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeFilters = [
    filters.search && { key: 'search', label: `“${filters.search}”` },
    filters.type && { key: 'type', label: `For ${filters.type}` },
    filters.city && { key: 'city', label: filters.city },
    filters.property_type && { key: 'property_type', label: filters.property_type },
    filters.minPrice && { key: 'minPrice', label: `Min ${formatPrice(filters.minPrice)}` },
    filters.maxPrice && { key: 'maxPrice', label: `Max ${formatPrice(filters.maxPrice)}` },
    filters.minBeds && { key: 'minBeds', label: `${filters.minBeds}+ beds` },
    filters.furnishing && { key: 'furnishing', label: filters.furnishing },
    filters.parking && { key: 'parking', label: `Parking: ${filters.parking}` },
    filters.facing && { key: 'facing', label: `${filters.facing} facing` },
  ].filter(Boolean);

  const gridCols = sidebarOpen
    ? 'sm:grid-cols-2 xl:grid-cols-3'
    : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

  const fieldProps = { filters, cities, setFilters, applyFilters, updateFilter };
  const showSkeleton = loading && !hasLoaded;
  const countLabel = `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'}`;

  const toolbarBtn = `items-center gap-2 rounded-full border border-[#0f2645]/20 bg-[#FAF9F6] px-5 py-2.5 text-[13px] text-[#0f2645] transition hover:border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(212,175,55,0.25)] ${focusRing}`;
  const countBadge = (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0f2645] text-[10px] text-[#F5D77A]">
      {activeFilters.length}
    </span>
  );
``
  return (
    <div
      className={`${marcellus.variable} min-h-screen bg-[#0f2645] font-[family-name:var(--font-marcellus)] font-normal text-[#0f2645]`}
    >
      {/* ============ HERO + SEARCH ============ */}
      <section className="relative overflow-hidden bg-[#0f2645] px-5 pb-32 pt-14 sm:px-8 lg:pb-36 lg:pt-20">
        {/* soft gold glow, top centre */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.22),transparent_65%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl leading-[1.1] text-[#FAF9F6] sm:text-5xl lg:text-6xl">
            Find Your Perfect Property
          </h1>
          <span
            aria-hidden="true"
            className="mx-auto mt-6 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]"
          />
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed text-[#FAF9F6]/70">
            Buy, sell or rent handpicked homes, plots and commercial spaces across Greater Noida.
          </p>

          {/* Search panel: tabs + search in one surface */}
          <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[28px] bg-[#FAF9F6] text-left shadow-[0_30px_70px_rgba(0,0,0,0.35)]">
            <div
              role="group"
              aria-label="Listing type"
              className="flex border-b border-[#0f2645]/10 bg-[#F3F0E8] px-3 pt-2 sm:px-4"
            >
              {LISTING_TABS.map((t) => {
                const active = filters.type === t.value;
                return (
                  <button
                    key={t.value || 'all'}
                    type="button"
                    onClick={() => updateFilter('type', t.value)}
                    aria-pressed={active}
                    className={`relative flex-1 px-3 py-3.5 text-sm transition duration-300 sm:flex-none sm:px-8 ${focusRing} ${
                      active ? 'text-[#0f2645]' : 'text-[#52685B] hover:text-[#0f2645]'
                    }`}
                  >
                    {t.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-4 bottom-0 h-[3px] rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-opacity duration-300 ${
                        active ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:p-4">
              <div className="flex flex-1 items-center gap-3 rounded-full border border-[#52685B]/20 bg-white/60 px-5 transition focus-within:border-[#D4AF37] focus-within:ring-2 focus-within:ring-[#D4AF37]/25">
                <Search size={18} className="shrink-0 text-[#B8902F]" aria-hidden="true" />
                <input
                  type="search"
                  aria-label="Search properties"
                  placeholder="Search city, location or property name..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters(filters)}
                  className="w-full bg-transparent py-3.5 text-[15px] text-[#0f2645] outline-none placeholder:text-[#52685B]/60 [&::-webkit-search-cancel-button]:hidden"
                />
                {filters.search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => updateFilter('search', '')}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F3F0E8] text-[#52685B] transition hover:bg-[#0f2645] hover:text-[#F5D77A] ${focusRing}`}
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
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <div className="relative z-10 mx-auto -mt-12 max-w-7xl px-3 pb-24 sm:px-4">
        <div className="rounded-[2rem] bg-[#F3F0E8] p-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)] sm:p-8">
          {/* Toolbar */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#0f2645]/10 pb-6">
            <div>
              <h2 className="text-2xl text-[#0f2645] sm:text-3xl" aria-live="polite">
                {showSkeleton
                  ? 'Searching...'
                  : error
                  ? 'Could not load properties'
                  : `${countLabel} found`}
              </h2>
              {!showSkeleton && !error && properties.length > PAGE_SIZE && (
                <p className="mt-1.5 text-[13px] text-[#52685B]">
                  {loading
                    ? 'Updating results...'
                    : `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, properties.length)} of ${properties.length}`}
                </p>
              )}
              {!showSkeleton && !error && properties.length <= PAGE_SIZE && loading && (
                <p className="mt-1.5 text-[13px] text-[#52685B]">Updating results...</p>
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
                type="button"
                onClick={resetFilters}
                className={`ml-1 rounded text-xs text-[#52685B] underline underline-offset-4 transition hover:text-[#0f2645] ${focusRing}`}
              >
                Clear all
              </button>
            </div>
          )}

          <div
            className={`mt-8 grid items-start gap-8 ${
              sidebarOpen ? 'lg:grid-cols-[300px_1fr]' : 'grid-cols-1'
            }`}
          >
            {/* ---------- DESKTOP FILTER SIDEBAR ---------- */}
            {sidebarOpen && (
              <aside className="hidden max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl border border-[#0f2645]/10 bg-[#FAF9F6] p-6 shadow-[0_10px_30px_-18px_rgba(15,38,69,0.25)] lg:sticky lg:top-24 lg:block">
                <div className="mb-7 flex items-center justify-between">
                  <h2 className="text-xl text-[#0f2645]">Filters</h2>
                  {activeFilters.length > 0 && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className={`rounded text-xs text-[#52685B] underline underline-offset-4 transition hover:text-[#0f2645] ${focusRing}`}
                    >
                      Reset all
                    </button>
                  )}
                </div>
                <FilterFields idPrefix="d" {...fieldProps} />
              </aside>
            )}

            {/* ---------- RESULTS ---------- */}
            <div ref={resultsRef} className="min-w-0 scroll-mt-24">
              {showSkeleton ? (
                <div className={`grid gap-6 ${gridCols}`}>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="animate-pulse overflow-hidden rounded-[26px] border border-[#0f2645]/10 bg-[#FAF9F6] p-2 motion-reduce:animate-none"
                    >
                      <div className="aspect-[4/3] rounded-[20px] bg-[#52685B]/15" />
                      <div className="space-y-3 px-3 pb-4 pt-5">
                        <div className="h-5 w-3/4 rounded-full bg-[#52685B]/15" />
                        <div className="h-4 w-1/2 rounded-full bg-[#52685B]/10" />
                        <div className="h-16 rounded-2xl bg-[#52685B]/10" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-[#52685B]/30 bg-[#FAF9F6] px-6 py-20 text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F3F0E8] text-[#B8902F]">
                    <WifiOff size={32} strokeWidth={1.3} />
                  </span>
                  <p className="mt-6 text-2xl text-[#0f2645]">Something went wrong</p>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#52685B]">
                    We couldn&apos;t load the listings. Check your connection and try again.
                  </p>
                  <GoldBtn onClick={() => setReloadKey((k) => k + 1)} className="mt-7">
                    <RefreshCw size={15} aria-hidden="true" />
                    Try again
                  </GoldBtn>
                </div>
              ) : properties.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-dashed border-[#52685B]/30 bg-[#FAF9F6] px-6 py-20 text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F3F0E8] text-[#B8902F]">
                    <SearchX size={34} strokeWidth={1.3} />
                  </span>
                  <p className="mt-6 text-2xl text-[#0f2645]">No properties found</p>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#52685B]">
                    {activeFilters.length > 0
                      ? 'Nothing matches all your filters. Remove one below or reset to see everything.'
                      : 'There are no listings right now. Please check back soon.'}
                  </p>
                  {activeFilters.length > 0 && (
                    <>
                      <div className="mt-5 flex flex-wrap justify-center gap-2">
                        {activeFilters.map((f) => (
                          <FilterChip key={f.key} label={f.label} onRemove={() => updateFilter(f.key, '')} />
                        ))}
                      </div>
                      <GoldBtn onClick={resetFilters} className="mt-7">
                        Reset filters
                      </GoldBtn>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div
                    className={`grid gap-6 transition-opacity duration-300 ${gridCols} ${
                      loading ? 'pointer-events-none opacity-50' : 'opacity-100'
                    }`}
                    aria-busy={loading}
                  >
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
            className="absolute inset-0 bg-[#0f2645]/60 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[28px] bg-[#FAF9F6] shadow-2xl">
            <span aria-hidden="true" className="mx-auto mt-3 h-1 w-10 rounded-full bg-[#52685B]/30" />
            <div className="flex items-center justify-between border-b border-[#0f2645]/10 px-6 py-4">
              <h2 className="text-xl text-[#0f2645]">Filters</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close filters"
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#0f2645]/15 text-[#0f2645] transition hover:bg-[#F3F0E8] ${focusRing}`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <FilterFields idPrefix="m" {...fieldProps} />
            </div>

            <div className="flex items-center gap-4 border-t border-[#0f2645]/10 px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={resetFilters}
                className={`rounded text-sm text-[#52685B] underline underline-offset-4 ${focusRing}`}
              >
                Reset
              </button>
              <GoldBtn
                onClick={() => {
                  if (buildQs(filters) !== filtersKey && !isPriceRangeInvalid(filters)) applyFilters(filters);
                  setDrawerOpen(false);
                }}
                className="flex-1"
              >
                {loading ? 'Searching...' : error ? 'Show results' : `Show ${countLabel}`}
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