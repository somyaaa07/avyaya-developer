'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Marcellus } from 'next/font/google';
import {
  ArrowRight,
  Bath,
  BedDouble,
  Camera,
  ChevronDown,
  ImageOff,
  MapPin,
  Ruler,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from 'lucide-react';

/* ---------------------------------------------------------------
   FONT  (Marcellus sirf 400 weight me aata hai)
---------------------------------------------------------------- */
const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-marcellus',
  display: 'swap',
});

/* ---------------------------------------------------------------
   COLORS
   Primary  : #1A2A22
   Secondary: #52685B
   BG       : #FAF9F6  &  #F3F0E8
   Gold     : #D4AF37 / #F5D77A / #B8902F
---------------------------------------------------------------- */

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
  buy: 'bg-[#1A2A22] text-[#F5D77A]',
  sell: 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-[#1A2A22]',
  rent: 'bg-[#FAF9F6] text-[#1A2A22]',
};

/* ---------------------------------------------------------------
   GOLD BUTTON  (golden fill + glass shine)
---------------------------------------------------------------- */
const GoldBtn = ({ children, onClick, type = 'button', className = '' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-br from-[#F5D77A] via-[#D4AF37] to-[#A67C1E] px-7 py-3 text-sm font-normal text-[#1A2A22] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_8px_20px_rgba(166,124,30,0.3)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_14px_30px_rgba(166,124,30,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${className}`}
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

  return (
    <Link
      href={`/properties/${p.id}`}
      className="group block overflow-hidden rounded-3xl border border-[#1A2A22]/10 bg-[#FAF9F6] transition duration-500 hover:-translate-y-1.5 hover:border-[#D4AF37]/60 hover:shadow-[0_24px_50px_rgba(26,42,34,0.14)]"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-[#F3F0E8]">
        {mainImage ? (
          <img
            src={mainImage}
            alt={p.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#52685B]">
            <ImageOff size={28} strokeWidth={1.4} />
            <span className="text-xs">No Image</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#1A2A22]/50 via-transparent to-transparent opacity-70" />

        {/* Type badge */}
        <span
          className={`absolute left-4 top-4 rounded-full px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] shadow-md ${
            TYPE_BADGE[p.type] || TYPE_BADGE.rent
          }`}
        >
          {p.type}
        </span>

        {/* Image count */}
        {p.images?.length > 1 && (
          <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-[#1A2A22]/60 px-3 py-1 text-[11px] text-[#FAF9F6] backdrop-blur">
            <Camera size={12} /> {p.images.length}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="line-clamp-1 text-xl leading-snug text-[#1A2A22]">{p.title}</h3>
        <p className="mt-2 flex items-center gap-1.5 text-[13px] text-[#52685B]">
          <MapPin size={14} className="shrink-0 text-[#B8902F]" />
          <span className="line-clamp-1">
            {p.location}, {p.city}
          </span>
        </p>

        {/* Stats */}
        {(p.bedrooms || p.bathrooms || p.area) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[#52685B]/15 py-3 text-xs text-[#52685B]">
            {p.bedrooms && (
              <span className="flex items-center gap-1.5">
                <BedDouble size={15} strokeWidth={1.5} /> {p.bedrooms} Beds
              </span>
            )}
            {p.bathrooms && (
              <span className="flex items-center gap-1.5">
                <Bath size={15} strokeWidth={1.5} /> {p.bathrooms} Baths
              </span>
            )}
            {p.area && (
              <span className="flex items-center gap-1.5">
                <Ruler size={15} strokeWidth={1.5} /> {p.area} sqft
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-2xl text-[#1A2A22]">
            ₹{Number(p.price).toLocaleString('en-IN')}
            {p.type === 'rent' && <span className="text-sm text-[#52685B]"> /mo</span>}
          </p>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A2A22] text-[#F5D77A] transition duration-500 group-hover:bg-gradient-to-br group-hover:from-[#F5D77A] group-hover:to-[#B8902F] group-hover:text-[#1A2A22]">
            <ArrowRight
              size={16}
              className="transition-transform duration-500 group-hover:-rotate-45"
            />
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
    <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#F3F0E8] py-1.5 pl-4 pr-2 text-xs capitalize text-[#1A2A22]">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1A2A22] text-[#F5D77A] transition hover:bg-[#52685B]"
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
  'w-full rounded-xl border border-[#52685B]/25 bg-[#FAF9F6] px-4 py-3 text-sm text-[#1A2A22] outline-none transition placeholder:text-[#52685B]/60 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/25';

const Label = ({ children }) => (
  <label className="mb-2 block text-[11px] uppercase tracking-[0.2em] text-[#52685B]">
    {children}
  </label>
);

const SelectField = ({ value, onChange, children }) => (
  <div className="relative">
    <select
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

/* ---------------------------------------------------------------
   MAIN CONTENT (Suspense ke andar, useSearchParams ke liye)
---------------------------------------------------------------- */
function PropertiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters state, URL se initialize
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
    property_type: searchParams.get('property_type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minBeds: searchParams.get('minBeds') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  const [properties, setProperties] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Cities fetch
  useEffect(() => {
    fetch('/api/properties/cities')
      .then((r) => r.json())
      .then(setCities)
      .catch(() => {});
  }, []);

  // Properties fetch
  const fetchProperties = useCallback(async (f = filters) => {
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

  // Initial fetch
  useEffect(() => {
    fetchProperties();
  }, []);

  // URL update + fetch on filter change
  const applyFilters = (newFilters) => {
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.replace(`/properties?${params}`, { scroll: false });

    fetchProperties(newFilters);
  };

  const updateFilter = (key, value) => applyFilters({ ...filters, [key]: value });
  const resetFilters = () => applyFilters(EMPTY_FILTERS);

  // Active filter chips
  const activeFilters = [
    filters.type && { key: 'type', label: `Type: ${filters.type}` },
    filters.city && { key: 'city', label: `City: ${filters.city}` },
    filters.property_type && { key: 'property_type', label: filters.property_type },
    filters.minPrice && {
      key: 'minPrice',
      label: `Min: ₹${Number(filters.minPrice).toLocaleString('en-IN')}`,
    },
    filters.maxPrice && {
      key: 'maxPrice',
      label: `Max: ₹${Number(filters.maxPrice).toLocaleString('en-IN')}`,
    },
    filters.minBeds && { key: 'minBeds', label: `${filters.minBeds}+ Beds` },
  ].filter(Boolean);

  return (
    <div
      className={`${marcellus.variable} min-h-screen bg-[#FAF9F6] font-[family-name:var(--font-marcellus)] font-normal text-[#1A2A22]`}
    >
      {/* ============ HERO + SEARCH ============ */}
      <section className="relative overflow-hidden bg-[#1A2A22] px-5 pb-28 pt-16 sm:px-8 lg:pb-32 lg:pt-20">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#52685B]/30 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[#F5D77A]">
            <span className="h-px w-10 bg-[#D4AF37]/60" />
            Bringo Real Estates
            <span className="h-px w-10 bg-[#D4AF37]/60" />
          </p>
          <h1 className="mt-5 text-4xl leading-[1.1] text-[#FAF9F6] sm:text-5xl lg:text-6xl">
            Find Your Perfect Property
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-[#FAF9F6]/70">
            Buy, sell or rent handpicked homes, plots and commercial spaces across Greater Noida.
          </p>

          {/* Type tabs */}
          <div className="mt-8 inline-flex rounded-full border border-[#FAF9F6]/15 bg-[#FAF9F6]/5 p-1.5 backdrop-blur">
            {['', 'buy', 'sell', 'rent'].map((t) => {
              const active = filters.type === t;
              return (
                <button
                  key={t}
                  onClick={() => updateFilter('type', t)}
                  className={`rounded-full px-5 py-2 text-[13px] capitalize transition duration-300 sm:px-7 ${
                    active
                      ? 'bg-gradient-to-br from-[#F5D77A] via-[#D4AF37] to-[#A67C1E] text-[#1A2A22] shadow-md'
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
              <Search size={18} className="shrink-0 text-[#52685B]" />
              <input
                type="text"
                placeholder="Search city, location or property name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters(filters)}
                className="w-full bg-transparent py-3 text-[15px] text-[#1A2A22] outline-none placeholder:text-[#52685B]/60"
              />
            </div>
            <GoldBtn onClick={() => applyFilters(filters)} className="sm:py-3.5">
              Search
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </GoldBtn>
          </div>
        </div>
      </section>

      {/* ============ MAIN CONTENT ============ */}
      <div className="relative z-10 mx-auto -mt-10 max-w-7xl px-5 pb-20 sm:px-8">
        <div className="rounded-[2rem] bg-[#F3F0E8] p-5 shadow-[0_10px_40px_rgba(26,42,34,0.08)] sm:p-8">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#52685B]">Properties</p>
              <p className="mt-1 text-2xl text-[#1A2A22]">
                {loading
                  ? 'Searching...'
                  : `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'} found`}
              </p>
            </div>

            <button
              onClick={() => setSidebarOpen((p) => !p)}
              className="inline-flex items-center gap-2 rounded-full border border-[#1A2A22]/20 bg-[#FAF9F6] px-5 py-2.5 text-[13px] text-[#1A2A22] transition hover:border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(212,175,55,0.25)]"
            >
              <SlidersHorizontal size={15} />
              {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
              {activeFilters.length > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1A2A22] text-[10px] text-[#F5D77A]">
                  {activeFilters.length}
                </span>
              )}
            </button>
          </div>

          {/* Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {activeFilters.map((f) => (
                <FilterChip key={f.key} label={f.label} onRemove={() => updateFilter(f.key, '')} />
              ))}
              <button
                onClick={resetFilters}
                className="ml-1 text-xs text-[#52685B] underline underline-offset-4 transition hover:text-[#1A2A22]"
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
            {/* ---------- FILTER SIDEBAR ---------- */}
            {sidebarOpen && (
              <aside className="rounded-3xl border border-[#1A2A22]/10 bg-[#FAF9F6] p-6 lg:sticky lg:top-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl text-[#1A2A22]">Filters</h2>
                  {activeFilters.length > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-xs text-[#52685B] underline underline-offset-4 transition hover:text-[#1A2A22]"
                    >
                      Reset all
                    </button>
                  )}
                </div>
                <span className="mb-6 block h-px w-full bg-gradient-to-r from-[#D4AF37]/70 via-[#D4AF37]/20 to-transparent" />

                <div className="flex flex-col gap-6">
                  {/* City */}
                  <div>
                    <Label>City</Label>
                    <SelectField
                      value={filters.city}
                      onChange={(e) => updateFilter('city', e.target.value)}
                    >
                      <option value="">All Cities</option>
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </SelectField>
                  </div>

                  {/* Property Type */}
                  <div>
                    <Label>Property Type</Label>
                    <SelectField
                      value={filters.property_type}
                      onChange={(e) => updateFilter('property_type', e.target.value)}
                    >
                      <option value="">All Types</option>
                      {['apartment', 'house', 'villa', 'plot', 'commercial'].map((t) => (
                        <option key={t} value={t}>
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </option>
                      ))}
                    </SelectField>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label>Price Range (₹)</Label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className={fieldBase}
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        onBlur={() => applyFilters(filters)}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className={fieldBase}
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        onBlur={() => applyFilters(filters)}
                      />
                    </div>
                  </div>

                  {/* Min Bedrooms */}
                  <div>
                    <Label>Min Bedrooms</Label>
                    <div className="flex flex-wrap gap-2">
                      {['', '1', '2', '3', '4'].map((b) => {
                        const active = filters.minBeds === b;
                        return (
                          <button
                            key={b}
                            onClick={() => updateFilter('minBeds', b)}
                            className={`rounded-full border px-4 py-2 text-[13px] transition duration-300 ${
                              active
                                ? 'border-[#1A2A22] bg-[#1A2A22] text-[#F5D77A]'
                                : 'border-[#52685B]/25 bg-[#FAF9F6] text-[#52685B] hover:border-[#D4AF37] hover:text-[#1A2A22]'
                            }`}
                          >
                            {b === '' ? 'Any' : `${b}+`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <Label>Sort By</Label>
                    <SelectField
                      value={filters.sort}
                      onChange={(e) => updateFilter('sort', e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                    </SelectField>
                  </div>
                </div>
              </aside>
            )}

            {/* ---------- RESULTS ---------- */}
            <div>
              {loading ? (
                <div
                  className={`grid gap-6 ${
                    sidebarOpen
                      ? 'sm:grid-cols-2 xl:grid-cols-3'
                      : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  }`}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div
                      key={n}
                      className="animate-pulse overflow-hidden rounded-3xl border border-[#1A2A22]/10 bg-[#FAF9F6]"
                    >
                      <div className="h-56 bg-[#52685B]/15" />
                      <div className="space-y-3 p-6">
                        <div className="h-5 w-3/4 rounded-full bg-[#52685B]/15" />
                        <div className="h-4 w-1/2 rounded-full bg-[#52685B]/10" />
                        <div className="h-8 w-2/3 rounded-full bg-[#52685B]/15" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : properties.length === 0 ? (
                <div className="flex flex-col items-center rounded-3xl border border-[#1A2A22]/10 bg-[#FAF9F6] px-6 py-20 text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F3F0E8] text-[#B8902F]">
                    <SearchX size={34} strokeWidth={1.3} />
                  </span>
                  <p className="mt-6 text-2xl text-[#1A2A22]">No properties found</p>
                  <p className="mt-2 max-w-sm text-sm text-[#52685B]">
                    Try changing or clearing your filters to see more results.
                  </p>
                  <GoldBtn onClick={resetFilters} className="mt-7">
                    Reset Filters
                  </GoldBtn>
                </div>
              ) : (
                <div
                  className={`grid gap-6 ${
                    sidebarOpen
                      ? 'sm:grid-cols-2 xl:grid-cols-3'
                      : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  }`}
                >
                  {properties.map((p) => (
                    <PropertyCard key={p.id} p={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
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