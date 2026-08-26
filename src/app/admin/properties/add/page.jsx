'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from '@/component/ImageUploads';

const COLORS = {
  primary: '#2e5d42',
  primaryLight: '#3d7a58',
  primaryPale: '#e8f0eb',
  bg: '#fafaef',
  white: '#ffffff',
  border: '#d6ddd8',
  text: '#1a2e22',
  muted: '#6b7c72',
  accent: '#c8a96e',
  error: '#c0392b',
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

function FloatingField({ label, children, span = false, index = 0 }) {
  return (
    <motion.div variants={fadeUp} custom={index} style={{ gridColumn: span ? '1 / -1' : undefined }}>
      <label style={{
        display: 'block',
        fontFamily: "'Jost', sans-serif",
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: COLORS.primary,
        marginBottom: '8px',
      }}>
        {label}
      </label>
      {children}
    </motion.div>
  );
}

const fieldStyle = {
  width: '100%',
  padding: '12px 16px',
  fontFamily: "'Jost', sans-serif",
  fontSize: '15px',
  color: COLORS.text,
  background: COLORS.white,
  border: `1.5px solid ${COLORS.border}`,
  borderRadius: '10px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

function Field({ as: Tag = 'input', style: extra, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Tag
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...fieldStyle,
        ...(Tag === 'textarea' ? { resize: 'vertical', minHeight: '90px' } : {}),
        ...(Tag === 'select' ? {
          cursor: 'pointer', appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232e5d42' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 14px center',
        } : {}),
        borderColor: focused ? COLORS.primary : COLORS.border,
        boxShadow: focused ? `0 0 0 3px ${COLORS.primaryPale}` : 'none',
        ...extra,
      }}
    />
  );
}

export default function AddPropertyPage() {
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── CHANGED: images is now an array ──
  const [form, setForm] = useState({
    title: '', description: '', price: '',
    type: 'buy', property_type: 'apartment',
    location: '', city: '', area: '',
    bedrooms: '', bathrooms: '',
    images: [],   // ← array of URLs
    agent_id: '', status: 'active',
  });

  useEffect(() => {
    fetch('/api/admin/agents').then(r => r.json()).then(setAgents);
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async () => {
    setError('');

    if (!form.title || !form.price || !form.city) {
      setError('Title, Price aur City required hai.');
      return;
    }
    if (form.images.length === 0) {
      setError('Kam se kam ek image upload karo.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),  // images array bhi jayega
      });

      if (res.ok) {
        router.push('/admin/properties');
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Network error. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.bg}; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #a0b0a8; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ minHeight: '100vh', background: COLORS.bg, padding: '40px 24px 80px', fontFamily: "'Jost', sans-serif" }}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '36px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M9 21V12h6v9" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', color: COLORS.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Property Management</p>
                <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '28px', color: COLORS.text, lineHeight: 1.1 }}>Add New Property</h1>
              </div>
            </div>
            <div style={{ height: '2px', background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent}, transparent)`, borderRadius: '2px', marginTop: '16px' }} />
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ background: '#fdf0ef', border: `1px solid ${COLORS.error}30`, borderLeft: `4px solid ${COLORS.error}`, borderRadius: '10px', padding: '12px 16px', color: COLORS.error, fontSize: '14px', marginBottom: '20px' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Basic Info */}
          <Section title="Basic Information" icon="✦" delay={0}>
            <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FloatingField label="Property Title" span index={0}>
                <Field placeholder="e.g. Luxury Villa in Sector 45" value={form.title} onChange={set('title')} />
              </FloatingField>
              <FloatingField label="Description" span index={1}>
                <Field as="textarea" placeholder="Describe the property…" value={form.description} onChange={set('description')} />
              </FloatingField>
              <FloatingField label="Price (₹)" index={2}>
                <Field type="number" placeholder="50,00,000" value={form.price} onChange={set('price')} />
              </FloatingField>
              <FloatingField label="Listing Type" index={3}>
                <Field as="select" value={form.type} onChange={set('type')}>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                  <option value="rent">Rent</option>
                </Field>
              </FloatingField>
              <FloatingField label="Property Type" index={4}>
                <Field as="select" value={form.property_type} onChange={set('property_type')}>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </Field>
              </FloatingField>
              <FloatingField label="Status" index={5}>
                <Field as="select" value={form.status} onChange={set('status')}>
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </Field>
              </FloatingField>
            </motion.div>
          </Section>

          {/* Location */}
          <Section title="Location Details" icon="◈" delay={0.1}>
            <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <FloatingField label="Full Location / Address" span index={0}>
                <Field placeholder="Sector 45, Noida, Uttar Pradesh" value={form.location} onChange={set('location')} />
              </FloatingField>
              <FloatingField label="City" index={1}>
                <Field placeholder="Noida" value={form.city} onChange={set('city')} />
              </FloatingField>
              <FloatingField label="Area (sq ft)" index={2}>
                <Field type="number" placeholder="1200" value={form.area} onChange={set('area')} />
              </FloatingField>
            </motion.div>
          </Section>

          {/* Specs */}
          <Section title="Property Specifications" icon="◇" delay={0.2}>
            <motion.div variants={stagger} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <FloatingField label="Bedrooms" index={0}>
                <Field type="number" placeholder="3" value={form.bedrooms} onChange={set('bedrooms')} />
              </FloatingField>
              <FloatingField label="Bathrooms" index={1}>
                <Field type="number" placeholder="2" value={form.bathrooms} onChange={set('bathrooms')} />
              </FloatingField>
              <FloatingField label="Assigned Agent" index={2}>
                <Field as="select" value={form.agent_id} onChange={set('agent_id')}>
                  <option value="">Select Agent</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </Field>
              </FloatingField>
            </motion.div>
          </Section>

          {/* ── CHANGED: Multi-image upload ── */}
          <Section title="Property Images" icon="▣" delay={0.3}>
            <ImageUpload
              value={form.images}
              onChange={(urls) => setForm({ ...form, images: urls })}
            />
          </Section>

          {/* Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: COLORS.primaryLight }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '13px 32px',
                background: loading ? COLORS.muted : COLORS.primary,
                color: '#fff', border: 'none', borderRadius: '10px',
                fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: '600',
                letterSpacing: '0.04em',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.2s',
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Saving…
                </>
              ) : 'Save Property'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/admin/properties')}
              style={{ padding: '13px 24px', background: 'transparent', color: COLORS.muted, border: `1.5px solid ${COLORS.border}`, borderRadius: '10px', fontFamily: "'Jost', sans-serif", fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}
            >
              Cancel
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

function Section({ title, icon, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{ background: COLORS.white, borderRadius: '16px', border: `1px solid ${COLORS.border}`, overflow: 'hidden', marginBottom: '20px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 24px', borderBottom: `1px solid ${COLORS.primaryPale}`, background: COLORS.primaryPale }}>
        <span style={{ color: COLORS.primary, fontSize: '14px' }}>{icon}</span>
        <h2 style={{ fontFamily: "'Marcellus', serif", fontSize: '17px', color: COLORS.primary, fontWeight: '400' }}>{title}</h2>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </motion.div>
  );
}