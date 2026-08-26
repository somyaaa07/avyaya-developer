'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams }                  from 'next/navigation';
import Link                                            from 'next/link';

// ── Colors (same as detail page) ──
const C = {
  primary:     '#2e5d42',
  primaryLight:'#3d7a58',
  primaryPale: '#e8f0eb',
  bg:          '#fafaef',
  white:       '#ffffff',
  border:      '#d6ddd8',
  text:        '#1a2e22',
  muted:       '#6b7c72',
  accent:      '#c8a96e',
};

// ── Property Card ──
function PropertyCard({ p }) {
  const mainImage = p.images?.[0]?.url || null;

  const typeColor = {
    buy:  { bg: '#e8f0eb', text: '#2e5d42' },
    sell: { bg: '#fdf6ec', text: '#92600a' },
    rent: { bg: '#eff6ff', text: '#1d4ed8' },
  };

  return (
    <Link href={`/properties/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        style={{
          background: C.white, borderRadius: '16px', overflow: 'hidden',
          border: `1px solid ${C.border}`, transition: 'all 0.2s', cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform   = 'translateY(-4px)';
          e.currentTarget.style.boxShadow   = '0 12px 32px rgba(0,0,0,0.10)';
          e.currentTarget.style.borderColor = C.primary;
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform   = 'translateY(0)';
          e.currentTarget.style.boxShadow   = 'none';
          e.currentTarget.style.borderColor = C.border;
        }}
      >
        {/* Image */}
        <div style={{ height: '200px', background: C.primaryPale, position: 'relative', overflow: 'hidden' }}>
          {mainImage
            ? <img src={mainImage} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: '14px' }}>No Image</div>
          }

          {/* Type Badge */}
          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700',
            letterSpacing: '0.05em', textTransform: 'uppercase',
            background: typeColor[p.type]?.bg,
            color:      typeColor[p.type]?.text,
          }}>
            {p.type}
          </span>

          {/* Images count */}
          {p.images?.length > 1 && (
            <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '12px' }}>
              📷 {p.images.length}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px' }}>
          <h3 style={{ fontFamily: "'Marcellus', serif", fontSize: '16px', color: C.text, margin: '0 0 6px', lineHeight: 1.3 }}>
            {p.title}
          </h3>
          <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 12px' }}>
            📍 {p.location}, {p.city}
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: C.muted, marginBottom: '14px' }}>
            {p.bedrooms  && <span>🛏 {p.bedrooms} Beds</span>}
            {p.bathrooms && <span>🚿 {p.bathrooms} Baths</span>}
            {p.area      && <span>📐 {p.area} sqft</span>}
          </div>

          {/* Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontFamily: "'Marcellus', serif", fontSize: '20px', color: C.primary, margin: 0 }}>
              ₹{Number(p.price).toLocaleString('en-IN')}
              {p.type === 'rent' && <span style={{ fontSize: '13px', color: C.muted, fontFamily: 'sans-serif' }}>/mo</span>}
            </p>
            <span style={{ fontSize: '12px', color: C.primary, fontWeight: '600' }}>View →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Filter Chip ──
function FilterChip({ label, onRemove }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '6px',
      padding: '5px 12px', background: C.primaryPale, borderRadius: '20px',
      fontSize: '13px', color: C.primary, fontWeight: '500',
    }}>
      {label}
      <button
        onClick={onRemove}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.primary, fontSize: '15px', lineHeight: 1, padding: 0 }}
      >
        ×
      </button>
    </div>
  );
}

// ── Main Component (wrapped for useSearchParams) ──
function PropertiesContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  // ── Filters state — URL se initialize ──
  const [filters, setFilters] = useState({
    search:        searchParams.get('search')        || '',
    type:          searchParams.get('type')          || '',
    city:          searchParams.get('city')          || '',
    property_type: searchParams.get('property_type') || '',
    minPrice:      searchParams.get('minPrice')      || '',
    maxPrice:      searchParams.get('maxPrice')      || '',
    minBeds:       searchParams.get('minBeds')       || '',
    sort:          searchParams.get('sort')          || 'newest',
  });

  const [properties, setProperties] = useState([]);
  const [cities, setCities]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Cities fetch
  useEffect(() => {
    fetch('/api/properties/cities')
      .then(r => r.json())
      .then(setCities)
      .catch(() => {});
  }, []);

  // Properties fetch
  const fetchProperties = useCallback(async (f = filters) => {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => { if (v) params.set(k, v); });

    try {
      const res  = await fetch(`/api/properties?${params}`);
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch {
      setProperties([]);
    }
    setLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => { fetchProperties(); }, []);

  // URL update + fetch on filter change
  const applyFilters = (newFilters) => {
    setFilters(newFilters);

    // URL update karo
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => { if (v) params.set(k, v); });
    router.replace(`/properties?${params}`, { scroll: false });

    fetchProperties(newFilters);
  };

  const updateFilter = (key, value) => {
    applyFilters({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    const empty = { search: '', type: '', city: '', property_type: '', minPrice: '', maxPrice: '', minBeds: '', sort: 'newest' };
    applyFilters(empty);
  };

  // Active filter chips
  const activeFilters = [
    filters.type          && { key: 'type',          label: `Type: ${filters.type}` },
    filters.city          && { key: 'city',          label: `City: ${filters.city}` },
    filters.property_type && { key: 'property_type', label: `${filters.property_type}` },
    filters.minPrice      && { key: 'minPrice',      label: `Min: ₹${Number(filters.minPrice).toLocaleString('en-IN')}` },
    filters.maxPrice      && { key: 'maxPrice',      label: `Max: ₹${Number(filters.maxPrice).toLocaleString('en-IN')}` },
    filters.minBeds       && { key: 'minBeds',       label: `${filters.minBeds}+ Beds` },
  ].filter(Boolean);

  const selectStyle = {
    width: '100%', padding: '10px 12px',
    border: `1.5px solid ${C.border}`, borderRadius: '8px',
    fontSize: '14px', color: C.text, background: C.white,
    outline: 'none', cursor: 'pointer',
    fontFamily: "'Jost', sans-serif",
  };

  const inputStyle = { ...selectStyle, cursor: 'text' };

  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: '600',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    color: C.primary, marginBottom: '6px',
    fontFamily: "'Jost', sans-serif",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Jost', sans-serif" }}>

        {/* ── Hero Search Bar ── */}
        <div style={{ background: C.primary, padding: '40px 24px' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '32px', color: '#fff', marginBottom: '8px', fontWeight: '400' }}>
              Find Your Property
            </h1>
            <p style={{ color: '#a8c5b5', fontSize: '15px', marginBottom: '24px' }}>
              Buy, sell or rent your Dream Property
            </p>

            {/* Search Input */}
            <div style={{ display: 'flex', gap: '0', background: C.white, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              <input
                type="text"
                placeholder="Search City, location or Property Name..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && applyFilters(filters)}
                style={{
                  flex: 1, padding: '16px 20px', border: 'none', outline: 'none',
                  fontSize: '15px', fontFamily: "'Jost', sans-serif", color: C.text,
                }}
              />
              <button
                onClick={() => applyFilters(filters)}
                style={{
                  padding: '16px 28px', background: C.accent, border: 'none',
                  color: '#fff', fontSize: '15px', fontWeight: '600',
                  cursor: 'pointer', fontFamily: "'Jost', sans-serif",
                }}
              >
                Search
              </button>
            </div>

            {/* Quick Type Filters */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
              {['', 'buy', 'sell', 'rent'].map(t => (
                <button
                  key={t}
                  onClick={() => updateFilter('type', t)}
                  style={{
                    padding: '7px 18px', borderRadius: '20px', border: 'none',
                    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    fontFamily: "'Jost', sans-serif",
                    background: filters.type === t ? C.accent      : 'rgba(255,255,255,0.15)',
                    color:      filters.type === t ? '#fff'         : 'rgba(255,255,255,0.85)',
                    transition: 'all 0.2s',
                  }}
                >
                  {t === '' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>

          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: C.muted }}>Active filters:</span>
              {activeFilters.map(f => (
                <FilterChip
                  key={f.key}
                  label={f.label}
                  onRemove={() => updateFilter(f.key, '')}
                />
              ))}
              <button
                onClick={resetFilters}
                style={{ fontSize: '13px', color: "black", background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear all
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: sidebarOpen ? '260px 1fr' : '1fr', gap: '28px', alignItems: 'start' }}>

            {/* ── FILTER SIDEBAR ── */}
            {sidebarOpen && (
              <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', position: 'sticky', top: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ fontFamily: "'Marcellus', serif", fontSize: '18px', color: C.text, fontWeight: '400' }}>Filters</h2>
                  {activeFilters.length > 0 && (
                    <button onClick={resetFilters} style={{ fontSize: '12px', color: C.primary, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                      Reset all
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                  {/* City */}
                  <div>
                    <label style={labelStyle}>City</label>
                    <select style={selectStyle} value={filters.city}
                      onChange={e => updateFilter('city', e.target.value)}>
                      <option value="">All Cities</option>
                      {cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Property Type */}
                  <div>
                    <label style={labelStyle}>Property Type</label>
                    <select style={selectStyle} value={filters.property_type}
                      onChange={e => updateFilter('property_type', e.target.value)}>
                      <option value="">All Types</option>
                      {['apartment', 'house', 'villa', 'plot', 'commercial'].map(t => (
                        <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label style={labelStyle}>Price Range (₹)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="number"
                        placeholder="Min"
                        style={{ ...inputStyle, width: '50%' }}
                        value={filters.minPrice}
                        onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                        onBlur={() => applyFilters(filters)}
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        style={{ ...inputStyle, width: '50%' }}
                        value={filters.maxPrice}
                        onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                        onBlur={() => applyFilters(filters)}
                      />
                    </div>
                  </div>

                  {/* Min Bedrooms */}
                  <div>
                    <label style={labelStyle}>Min Bedrooms</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['', '1', '2', '3', '4'].map(b => (
                        <button
                          key={b}
                          onClick={() => updateFilter('minBeds', b)}
                          style={{
                            padding: '6px 14px', borderRadius: '8px', border: `1.5px solid ${filters.minBeds === b ? C.primary : C.border}`,
                            background: filters.minBeds === b ? C.primaryPale : C.white,
                            color: filters.minBeds === b ? C.primary : C.muted,
                            fontSize: '13px', cursor: 'pointer', fontFamily: "'Jost', sans-serif",
                            transition: 'all 0.2s',
                          }}
                        >
                          {b === '' ? 'Any' : `${b}+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <label style={labelStyle}>Sort By</label>
                    <select style={selectStyle} value={filters.sort}
                      onChange={e => updateFilter('sort', e.target.value)}>
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                    </select>
                  </div>

                </div>
              </div>
            )}

            {/* ── RIGHT — Results ── */}
            <div>
              {/* Results Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <p style={{ fontSize: '14px', color: C.muted }}>
                  {loading ? 'Searching...' : `${properties.length} propert${properties.length === 1 ? 'y' : 'ies'} found`}
                </p>
                <button
                  onClick={() => setSidebarOpen(p => !p)}
                  style={{ padding: '8px 14px', background: C.white, border: `1px solid ${C.border}`, borderRadius: '8px', fontSize: '13px', color: C.text, cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}
                >
                  {sidebarOpen ? '← Hide Filters' : '→ Show Filters'}
                </button>
              </div>

              {/* Grid */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px', color: C.muted }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
                  <p>Searching properties...</p>
                </div>
              ) : properties.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', color: C.muted, background: C.white, borderRadius: '16px', border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏚</div>
                  <p style={{ fontSize: '16px', marginBottom: '8px', color: C.text }}>Did'nt find any property</p>
                  <p style={{ fontSize: '14px', marginBottom: '20px' }}>Change the Filter and try again</p>
                  <button
                    onClick={resetFilters}
                    style={{ padding: '10px 24px', background: C.primary, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: "'Jost', sans-serif", fontSize: '14px' }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: sidebarOpen ? 'repeat(auto-fill, minmax(260px, 1fr))' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {properties.map(p => <PropertyCard key={p.id} p={p} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Export with Suspense (required for useSearchParams) ──
export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafaef' }}>
        <p style={{ color: '#6b7c72' }}>Loading...</p>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}