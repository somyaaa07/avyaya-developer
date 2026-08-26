'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter }           from 'next/navigation';
import { useEffect, useState } from 'react';
import Link                    from 'next/link';

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
  error:       '#c0392b',
  success:     '#16a34a',
};

// ── Stat Card ──
function StatCard({ value, label, color }) {
  return (
    <div style={{
      background:  C.white,
      borderRadius:'12px',
      padding:     '20px 24px',
      border:      `1px solid ${C.border}`,
      borderTop:   `4px solid ${color}`,
      textAlign:   'center',
    }}>
      <p style={{ fontFamily: "'Marcellus', serif", fontSize: '36px', color, margin: '0 0 4px' }}>
        {value}
      </p>
      <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>{label}</p>
    </div>
  );
}

// ── Tab Button ──
function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:     '10px 20px',
        border:      active ? 'none' : `1px solid ${C.border}`,
        borderRadius:'8px',
        fontSize:    '14px',
        fontWeight:  '600',
        cursor:      'pointer',
        fontFamily:  "'Jost', sans-serif",
        background:  active ? C.primary : C.white,
        color:       active ? '#fff'    : C.muted,
        transition:  'all 0.2s',
      }}
    >
      {children}
    </button>
  );
}

// ── Property Row ──
function PropertyRow({ property, right }) {
  const img = property?.images?.[0]?.url || null;

  return (
    <div style={{
      background:   C.white,
      borderRadius: '12px',
      border:       `1px solid ${C.border}`,
      overflow:     'hidden',
      display:      'flex',
      marginBottom: '12px',
    }}>
      {/* Image */}
      <div style={{ width: '110px', flexShrink: 0, background: C.primaryPale, minHeight: '80px' }}>
        {img
          ? <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: '11px' }}>
              No image
            </div>
        }
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <p style={{ fontWeight: '600', color: C.text, margin: '0 0 4px', fontSize: '15px', fontFamily: "'Marcellus', serif" }}>
            {property?.title}
          </p>
          <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 4px' }}>
            📍 {property?.city}
            {property?.type && ` · ${property.type.toUpperCase()}`}
          </p>
          <p style={{ fontSize: '16px', fontWeight: '700', color: C.primary, margin: 0, fontFamily: "'Marcellus', serif" }}>
            ₹{Number(property?.price || 0).toLocaleString('en-IN')}
            {property?.type === 'rent' && (
              <span style={{ fontSize: '12px', color: C.muted, fontFamily: 'sans-serif', fontWeight: '400' }}>/mo</span>
            )}
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>{right}</div>
      </div>
    </div>
  );
}

// ── Empty State ──
function Empty({ icon, msg, sub, link, linkText }) {
  return (
    <div style={{
      background:   C.white,
      borderRadius: '16px',
      border:       `1px solid ${C.border}`,
      padding:      '50px 24px',
      textAlign:    'center',
    }}>
      <p style={{ fontSize: '40px', marginBottom: '12px' }}>{icon}</p>
      <p style={{ fontFamily: "'Marcellus', serif", fontSize: '17px', color: C.text, marginBottom: '6px' }}>{msg}</p>
      {sub && <p style={{ fontSize: '13px', color: C.muted, marginBottom: '16px' }}>{sub}</p>}
      {link && (
        <Link href={link} style={{
          display:        'inline-block',
          padding:        '10px 24px',
          background:     C.primary,
          color:          '#fff',
          borderRadius:   '8px',
          textDecoration: 'none',
          fontSize:       '14px',
          fontWeight:     '600',
          fontFamily:     "'Jost', sans-serif",
        }}>
          {linkText}
        </Link>
      )}
    </div>
  );
}

// ── Section Wrapper ──
function Section({ title, action, children }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: "'Marcellus', serif", fontSize: '20px', color: C.text, margin: 0, fontWeight: '400' }}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// ══════════════════════════════════════════
// Main Dashboard
// ══════════════════════════════════════════
export default function Dashboard() {
  const { data: session, status } = useSession();
  const router                    = useRouter();

  const [activeTab,    setActiveTab]    = useState('saved');
  const [saved,        setSaved]        = useState([]);
  const [inquiries,    setInquiries]    = useState([]);
  const [myProps,      setMyProps]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [apiErrors,    setApiErrors]    = useState({});

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status]);

  // Fetch all data
  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchAll = async () => {
      setLoading(true);

      // ── Saved Properties ──
      try {
        const r = await fetch('/api/user/saved');
        const d = await r.json();
        if (Array.isArray(d)) {
          setSaved(d);
        } else {
          console.error('Saved error:', d);
          setApiErrors(e => ({ ...e, saved: d.error }));
        }
      } catch (err) {
        setApiErrors(e => ({ ...e, saved: err.message }));
      }

      // ── Inquiries ──
      try {
        const r = await fetch('/api/user/inquiries');
        const d = await r.json();
        if (Array.isArray(d)) {
          setInquiries(d);
        } else {
          console.error('Inquiries error:', d);
          setApiErrors(e => ({ ...e, inquiries: d.error }));
        }
      } catch (err) {
        setApiErrors(e => ({ ...e, inquiries: err.message }));
      }

      // ── My Properties ──
      try {
        const r = await fetch('/api/user/properties');
        const d = await r.json();
        if (Array.isArray(d)) {
          setMyProps(d);
        } else {
          console.error('My props error:', d);
          setApiErrors(e => ({ ...e, myProps: d.error }));
        }
      } catch (err) {
        setApiErrors(e => ({ ...e, myProps: err.message }));
      }

      setLoading(false);
    };

    fetchAll();
  }, [status]);

  // Unsave handler
  const handleUnsave = async (property_id) => {
    await fetch('/api/saved', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ property_id }),
    });
    setSaved(prev => prev.filter(s => s.property?.id !== property_id));
  };

  // Delete my property
  const handleDeleteProperty = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    const res = await fetch(`/api/user/properties?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMyProps(prev => prev.filter(p => p.id !== id));
    }
  };

  // ── Loading State ──
  if (status === 'loading' || loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Jost', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '36px', height: '36px', border: `3px solid ${C.primaryPale}`, borderTopColor: C.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: C.muted, fontSize: '14px' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const thisWeek = inquiries.filter(i => {
    return (new Date() - new Date(i.created_at)) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Jost', sans-serif", paddingBottom: '80px' }}>

        {/* ── Header ── */}
        <div style={{ background: C.primary, padding: '36px 24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>

            {/* User Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '22px', fontWeight: '700', fontFamily: "'Marcellus', serif", flexShrink: 0 }}>
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '22px', color: '#fff', margin: '0 0 4px', fontWeight: '400' }}>
                  {session?.user?.name}
                </h1>
                <p style={{ fontSize: '13px', color: '#a8c5b5', margin: 0 }}>
                  {session?.user?.email}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {session?.user?.role === 'admin' && (
                <Link href="/admin" style={{ padding: '10px 18px', background: C.accent, color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', fontFamily: "'Jost', sans-serif" }}>
                  Admin Panel
                </Link>
              )}
              <Link href="/dashboard/list-property" style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none', fontFamily: "'Jost', sans-serif" }}>
                + List Property
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                style={{ padding: '10px 18px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>

          {/* ── API Error Box (debug) ── */}
          {Object.keys(apiErrors).length > 0 && (
            <div style={{ background: '#fdf0ef', border: '1px solid #f87171', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
              <p style={{ fontWeight: '600', color: C.error, marginBottom: '8px', fontSize: '14px' }}>⚠️ Some APIs encountered an error:</p>
              {Object.entries(apiErrors).map(([key, val]) => (
                <p key={key} style={{ fontSize: '13px', color: C.error, margin: '2px 0' }}>
                  {key}: {val}
                </p>
              ))}
            </div>
          )}

          {/* ── Stats ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            <StatCard value={saved.length}     label="Saved Properties" color={C.primary} />
            <StatCard value={inquiries.length} label="Inquiries Sent"   color={C.accent}  />
            <StatCard value={myProps.length}   label="My Listings"      color="#3b82f6"   />
          </div>

          {/* ── Tabs ── */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <TabBtn active={activeTab === 'saved'}          onClick={() => setActiveTab('saved')}>
              ♥ Saved ({saved.length})
            </TabBtn>
            <TabBtn active={activeTab === 'inquiries'}      onClick={() => setActiveTab('inquiries')}>
              ✉ Inquiries ({inquiries.length})
            </TabBtn>
            <TabBtn active={activeTab === 'my-properties'}  onClick={() => setActiveTab('my-properties')}>
              🏠 My Properties ({myProps.length})
            </TabBtn>
          </div>

          {/* ══════════════════════════════ */}
          {/* TAB 1 — Saved Properties      */}
          {/* ══════════════════════════════ */}
          {activeTab === 'saved' && (
            <Section title="Saved Properties">
              {saved.length === 0 ? (
                <Empty
                  icon="🏠"
                  msg="No saved properties yet"
                  sub="Browse properties and save the ones you like"
                  link="/properties"
                  linkText="Browse Properties"
                />
              ) : (
                saved.map(item => {
                  const p = item.property;

                  if (!p) return (
                    <div key={item.id} style={{ padding: '12px 16px', background: '#fff3cd', borderRadius: '8px', fontSize: '13px', color: '#856404', marginBottom: '8px' }}>
                      ⚠️ Property not loaded (ID: {item.property_id})
                    </div>
                  );

                  return (
                    <PropertyRow
                      key={item.id}
                      property={p}
                      right={
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link
                            href={`/properties/${p.id}`}
                            style={{ padding: '7px 14px', background: C.primaryPale, color: C.primary, borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleUnsave(p.id)}
                            style={{ padding: '7px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                          >
                            ♥ Unsave
                          </button>
                        </div>
                      }
                    />
                  );
                })
              )}
            </Section>
          )}

          {/* ══════════════════════════════ */}
          {/* TAB 2 — Inquiries             */}
          {/* ══════════════════════════════ */}
          {activeTab === 'inquiries' && (
            <Section title="My Inquiries">
              {inquiries.length === 0 ? (
                <Empty
                  icon="✉️"
                  msg="No inquiries sent yet"
                  sub="Interested in a property? Contact the agent directly"
                  link="/properties"
                  linkText="Browse Properties"
                />
              ) : (
                inquiries.map(inq => {
                  const p = inq.property;
                  return (
                    <div key={inq.id} style={{ background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '18px', marginBottom: '12px' }}>

                      {/* Top row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '12px' }}>
                        <div>
                          {p ? (
                            <Link href={`/properties/${p.id}`} style={{ textDecoration: 'none' }}>
                              <p style={{ fontFamily: "'Marcellus', serif", fontSize: '15px', color: C.text, margin: '0 0 3px' }}>
                                {p.title}
                              </p>
                            </Link>
                          ) : (
                            <p style={{ fontFamily: "'Marcellus', serif", fontSize: '15px', color: C.text, margin: '0 0 3px' }}>
                              General Inquiry
                            </p>
                          )}
                          {p?.city && (
                            <p style={{ fontSize: '13px', color: C.muted, margin: 0 }}>📍 {p.city}</p>
                          )}
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span style={{
                            display:      'inline-block',
                            padding:      '3px 10px',
                            borderRadius: '20px',
                            fontSize:     '11px',
                            fontWeight:   '600',
                            background:   inq.status === 'new'     ? '#fef9c3'
                                        : inq.status === 'replied' ? '#f0fdf4'
                                        : '#f1f5f9',
                            color:        inq.status === 'new'     ? '#a16207'
                                        : inq.status === 'replied' ? C.success
                                        : C.muted,
                          }}>
                            {(inq.status || 'new').toUpperCase()}
                          </span>
                          <p style={{ fontSize: '12px', color: C.muted, margin: '4px 0 0' }}>
                            {new Date(inq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Message */}
                      <div style={{ background: C.bg, borderRadius: '8px', padding: '12px', borderLeft: `3px solid ${C.primary}` }}>
                        <p style={{ fontSize: '13px', color: C.text, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
                          "{inq.message}"
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </Section>
          )}

          {/* ══════════════════════════════ */}
          {/* TAB 3 — My Properties         */}
          {/* ══════════════════════════════ */}
          {activeTab === 'my-properties' && (
            <Section
              title="My Properties"
              action={
                <Link href="/dashboard/list-property" style={{ padding: '9px 18px', background: C.primary, color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', fontFamily: "'Jost', sans-serif" }}>
                  + Add New Listing
                </Link>
              }
            >
              {myProps.length === 0 ? (
                <Empty
                  icon="🏚"
                  msg="No listings yet"
                  sub="List your property — it's completely free!"
                  link="/dashboard/list-property"
                  linkText="List a Property"
                />
              ) : (
                myProps.map(p => (
                  <PropertyRow
                    key={p.id}
                    property={p}
                    right={
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          href={`/properties/${p.id}`}
                          style={{ padding: '7px 14px', background: C.primaryPale, color: C.primary, borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(p.id)}
                          style={{ padding: '7px 14px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                        >
                          Delete
                        </button>
                      </div>
                    }
                  />
                ))
              )}
            </Section>
          )}

        </div>
      </div>
    </>
  );
}