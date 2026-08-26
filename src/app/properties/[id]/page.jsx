'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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

// ─────────────────────────────────────────────
// Image Gallery
// ─────────────────────────────────────────────
function ImageGallery({ images = [] }) {
  const [current, setCurrent] = useState(0);

  if (!images.length) {
    return (
      <div style={{ height: '360px', background: C.primaryPale, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: C.muted, fontSize: '14px' }}>No images available</span>
      </div>
    );
  }

  return (
    <div>
      {/* Main image */}
      <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '380px', marginBottom: '10px', background: '#000' }}>
        <img
          src={images[current].url}
          alt={`Property image ${current + 1}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button onClick={() => setCurrent(p => (p - 1 + images.length) % images.length)} style={arrowBtn('left')}>‹</button>
            <button onClick={() => setCurrent(p => (p + 1) % images.length)}               style={arrowBtn('right')}>›</button>
          </>
        )}

        {/* Counter */}
        <div style={{ position: 'absolute', bottom: '12px', right: '14px', background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: '12px', padding: '3px 9px', borderRadius: '20px' }}>
          {current + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                flexShrink: 0, width: '72px', height: '54px', borderRadius: '8px', overflow: 'hidden',
                border: `2px solid ${i === current ? C.primary : 'transparent'}`,
                cursor: 'pointer', opacity: i === current ? 1 : 0.65, transition: 'all 0.2s',
              }}
            >
              <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function arrowBtn(side) {
  return {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    [side]: '12px',
    background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none',
    borderRadius: '50%', width: '38px', height: '38px', fontSize: '22px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    lineHeight: 1,
  };
}

// ─────────────────────────────────────────────
// Save Button
// ─────────────────────────────────────────────
function SaveButton({ propertyId }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch(`/api/saved?property_id=${propertyId}`)
      .then(r => r.json())
      .then(d => setSaved(d.saved));
  }, [session, propertyId]);

  const toggle = async () => {
    if (!session) { router.push('/login'); return; }
    setLoading(true);
    const res = await fetch('/api/saved', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ property_id: propertyId }),
    });
    const data = await res.json();
    setSaved(data.saved);
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? 'Remove from saved' : 'Save property'}
      style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        padding: '10px 18px',
        background: saved ? '#fff0f3' : C.white,
        border: `1.5px solid ${saved ? '#f87171' : C.border}`,
        borderRadius: '10px',
        color: saved ? '#ef4444' : C.muted,
        fontSize: '14px', fontFamily: "'Jost', sans-serif", fontWeight: '500',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <span style={{ fontSize: '16px' }}>{saved ? '♥' : '♡'}</span>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}

// ─────────────────────────────────────────────
// Agent Card
// ─────────────────────────────────────────────
function AgentCard({ agent }) {
  if (!agent) return null;

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px' }}>
      <h3 style={{ fontFamily: "'Marcellus', serif", fontSize: '17px', color: C.primary, marginBottom: '16px', fontWeight: '400' }}>
        Listed By
      </h3>

      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
        {/* Photo */}
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: C.primaryPale, border: `2px solid ${C.primaryPale}` }}>
          {agent.photo
            ? <img src={agent.photo} alt={agent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', color: C.primary }}>
                {agent.name?.[0] || '?'}
              </div>
          }
        </div>

        {/* Info */}
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: '600', fontSize: '16px', color: C.text, marginBottom: '2px' }}>{agent.name}</p>
          <p style={{ fontSize: '13px', color: C.muted }}>{agent.email}</p>
          {agent.description && (
            <p style={{ fontSize: '13px', color: C.muted, marginTop: '6px', lineHeight: 1.5 }}>{agent.description}</p>
          )}
        </div>
      </div>

      {/* Contact Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {agent.phone && (
          <a href={`tel:${agent.phone}`} style={{ ...contactBtn, background: C.primary, color: '#fff', textDecoration: 'none' }}>
            📞 Call Agent
          </a>
        )}
        {agent.phone && (
          <a
            href={`https://wa.me/${agent.phone.replace(/\D/g, '')}?text=Hi, I'm interested in your property listing.`}
            target="_blank" rel="noopener noreferrer"
            style={{ ...contactBtn, background: '#25d366', color: '#fff', textDecoration: 'none' }}
          >
            💬 WhatsApp
          </a>
        )}
        {agent.email && (
          <a href={`mailto:${agent.email}`} style={{ ...contactBtn, background: C.white, color: C.text, border: `1.5px solid ${C.border}`, textDecoration: 'none' }}>
            ✉ Email
          </a>
        )}
      </div>
    </div>
  );
}

const contactBtn = {
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '9px 16px', borderRadius: '8px',
  fontSize: '13px', fontFamily: "'Jost', sans-serif", fontWeight: '600',
  cursor: 'pointer', border: 'none', transition: 'opacity 0.2s',
};

// ─────────────────────────────────────────────
// Inquiry Form
// ─────────────────────────────────────────────
function InquiryForm({ propertyId }) {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    name:    session?.user?.name  || '',
    email:   session?.user?.email || '',
    phone:   '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill when session loads
  useEffect(() => {
    if (session?.user) {
      setForm(p => ({
        ...p,
        name:  session.user.name  || p.name,
        email: session.user.email || p.email,
      }));
    }
  }, [session]);

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async () => {
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
        setForm(p => ({ ...p, phone: '', message: '' }));
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
      <div style={{ background: '#f0fdf4', border: `1px solid #bbf7d0`, borderRadius: '12px', padding: '20px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>✅</div>
        <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: '600', color: C.success, fontSize: '15px' }}>Inquiry Sent Successfully!</p>
        <p style={{ fontSize: '13px', color: C.muted, marginTop: '4px' }}>The agent will contact you shortly.</p>
        <button onClick={() => setStatus('idle')} style={{ marginTop: '14px', background: 'none', border: 'none', color: C.primary, fontFamily: "'Jost', sans-serif", fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px' }}>
      <h3 style={{ fontFamily: "'Marcellus', serif", fontSize: '17px', color: C.primary, marginBottom: '6px', fontWeight: '400' }}>
        Send Inquiry
      </h3>
      {!session && (
        <p style={{ fontSize: '12px', color: C.muted, marginBottom: '16px' }}>
          You can send an inquiry as a guest, or{' '}
          <a href="/login" style={{ color: C.primary }}>login</a> to your account.
        </p>
      )}

      {status === 'error' && (
        <div style={{ background: '#fdf0ef', borderLeft: `3px solid ${C.error}`, borderRadius: '6px', padding: '10px 14px', color: C.error, fontSize: '13px', marginBottom: '14px' }}>
          {errorMsg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <FormField label="Your Name *">
          <FormInput placeholder="e.g. John Smith" value={form.name} onChange={set('name')} />
        </FormField>
        <FormField label="Email *">
          <FormInput type="email" placeholder="john@example.com" value={form.email} onChange={set('email')} />
        </FormField>
        <FormField label="Phone (optional)">
          <FormInput type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
        </FormField>
        <FormField label="Message *">
          <FormInput
            as="textarea"
            placeholder="I'm interested in this property, please contact me."
            value={form.message}
            onChange={set('message')}
            style={{ minHeight: '90px', resize: 'vertical' }}
          />
        </FormField>

        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          style={{
            padding: '12px',
            background: status === 'loading' ? C.muted : C.primary,
            color: '#fff', border: 'none', borderRadius: '10px',
            fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: '600',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background 0.2s',
          }}
        >
          {status === 'loading' ? (
            <>
              <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
              Sending…
            </>
          ) : 'Send Inquiry'}
        </button>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.primary, marginBottom: '6px', fontFamily: "'Jost', sans-serif" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function FormInput({ as: Tag = 'input', style: extra, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Tag
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', padding: '11px 14px',
        fontFamily: "'Jost', sans-serif", fontSize: '14px', color: C.text,
        background: C.white, border: `1.5px solid ${focused ? C.primary : C.border}`,
        borderRadius: '8px', outline: 'none', boxSizing: 'border-box',
        boxShadow: focused ? `0 0 0 3px ${C.primaryPale}` : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        ...extra,
      }}
    />
  );
}

// ─────────────────────────────────────────────
// Main Property Detail Page
// ─────────────────────────────────────────────
export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/properties/${id}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => {
        if (data) setProperty(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <PageShell><Spinner /></PageShell>;
  if (notFound) return <PageShell><NotFound /></PageShell>;
  if (!property) return null;

  const price = Number(property.price).toLocaleString('en-IN');
  const images = property.images || [];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #a0b0a8; }
        ::-webkit-scrollbar { height: 4px; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 2px; }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Jost', sans-serif", paddingBottom: '80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' }}>

          {/* ── Breadcrumb ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: C.muted, marginBottom: '24px' }}>
            <a href="/" style={{ color: C.muted, textDecoration: 'none' }}>Home</a>
            <span>›</span>
            <a href="/properties" style={{ color: C.muted, textDecoration: 'none' }}>Properties</a>
            <span>›</span>
            <span style={{ color: C.text }}>{property.title}</span>
          </div>

          {/* ── Two-column layout ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>

            {/* ── LEFT COLUMN ── */}
            <div>
              {/* Gallery */}
              <ImageGallery images={images} />

              {/* Title + Price row */}
              <div style={{ marginTop: '24px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ ...badge, background: C.primaryPale, color: C.primary }}>
                      {property.type?.toUpperCase()}
                    </span>
                    <span style={{ ...badge, background: '#fdf6ec', color: '#92600a' }}>
                      {property.property_type}
                    </span>
                    <span style={{ ...badge, background: property.status === 'active' ? '#f0fdf4' : '#fef2f2', color: property.status === 'active' ? C.success : C.error }}>
                      {property.status}
                    </span>
                  </div>
                  <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '26px', color: C.text, lineHeight: 1.2, marginBottom: '6px' }}>
                    {property.title}
                  </h1>
                  <p style={{ fontSize: '14px', color: C.muted }}>
                    📍 {property.location}{property.city ? `, ${property.city}` : ''}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontFamily: "'Marcellus', serif", fontSize: '28px', color: C.primary }}>₹{price}</p>
                  {property.area && (
                    <p style={{ fontSize: '13px', color: C.muted }}>
                      ₹{Math.round(property.price / property.area).toLocaleString('en-IN')}/sq ft
                    </p>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
                {property.bedrooms  && <StatPill icon="🛏" label={`${property.bedrooms} Beds`} />}
                {property.bathrooms && <StatPill icon="🚿" label={`${property.bathrooms} Baths`} />}
                {property.area      && <StatPill icon="📐" label={`${property.area} sq ft`} />}
              </div>

              {/* Description */}
              {property.description && (
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
                  <h2 style={{ fontFamily: "'Marcellus', serif", fontSize: '18px', color: C.primary, marginBottom: '14px', fontWeight: '400' }}>
                    About this Property
                  </h2>
                  <p style={{ fontSize: '15px', color: C.text, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {property.description}
                  </p>
                </div>
              )}

              {/* Save button (mobile) */}
              <div style={{ display: 'none' }}>
                <SaveButton propertyId={id} />
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Save button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <SaveButton propertyId={id} />
              </div>

              {/* Agent Card */}
              <AgentCard agent={property.agent} />

              {/* Inquiry Form */}
              <InquiryForm propertyId={id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Small helpers ──────────────────────────

function StatPill({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.white, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '8px 14px', fontSize: '14px', color: C.text }}>
      <span>{icon}</span> {label}
    </div>
  );
}

const badge = {
  display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
  fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase',
};

function PageShell({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Jost', sans-serif" }}>
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div style={{ width: '36px', height: '36px', border: `3px solid ${C.primaryPale}`, borderTopColor: C.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: C.muted, fontSize: '14px' }}>Loading property…</p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '48px', marginBottom: '12px' }}>🏚</p>
      <h2 style={{ fontFamily: "'Marcellus', serif", fontSize: '22px', color: C.text, marginBottom: '8px' }}>Property Not Found</h2>
      <p style={{ color: C.muted, fontSize: '14px', marginBottom: '20px' }}>This property does not exist or has been deleted.</p>
      <a href="/properties" style={{ color: C.primary, fontSize: '14px' }}>← Back to Properties</a>
    </div>
  );
}