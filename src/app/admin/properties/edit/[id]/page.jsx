'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
  success: '#1a6b3c',
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
    <motion.div variants={fadeUp} custom={index}
      style={{ gridColumn: span ? '1 / -1' : undefined }}>
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
        ...(Tag === 'select' ? {
          cursor: 'pointer',
          appearance: 'none',
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

function Section({ title, icon, delay = 0, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: COLORS.white,
        borderRadius: '16px',
        border: `1px solid ${COLORS.border}`,
        overflow: 'hidden',
        marginBottom: '20px',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '16px 24px',
        borderBottom: `1px solid ${COLORS.primaryPale}`,
        background: COLORS.primaryPale,
      }}>
        <span style={{ color: COLORS.primary, fontSize: '14px' }}>{icon}</span>
        <h2 style={{
          fontFamily: "'Marcellus', serif",
          fontSize: '17px',
          color: COLORS.primary,
          fontWeight: '400',
        }}>
          {title}
        </h2>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </motion.div>
  );
}

export default function EditPropertyPage() {
  const router = useRouter();
  const { id } = useParams();
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/properties/${id}`).then(r => r.json()).then(setForm);
    fetch('/api/admin/agents').then(r => r.json()).then(setAgents);
  }, [id]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/properties/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => router.push('/admin/properties'), 1200);
    } else {
      setError('Failed to update property.');
    }
  };

  /* Loading skeleton */
  if (!form) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.bg, padding: '40px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ width: '48px', height: '48px', border: `3px solid ${COLORS.primaryPale}`, borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 0.9s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: "'Jost', sans-serif", color: COLORS.muted, fontSize: '14px' }}>Fetching property data…</p>
        </motion.div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${COLORS.bg}; }
        input::placeholder { color: #a0b0a8; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          minHeight: '100vh',
          background: COLORS.bg,
          padding: '40px 24px 80px',
          fontFamily: "'Jost', sans-serif",
        }}
      >
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '36px' }}
          >
            {/* Back button */}
            <motion.button
              whileHover={{ x: -4 }}
              onClick={() => router.push('/admin/properties')}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: COLORS.muted,
                fontFamily: "'Jost', sans-serif",
                fontSize: '13px',
                marginBottom: '20px',
                padding: 0,
              }}
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={COLORS.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Properties
            </motion.button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M11 4H4a1 1 0 00-1 1v14a1 1 0 001 1h14a1 1 0 001-1v-7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', color: COLORS.muted, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Property #{id}
                </p>
                <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '28px', color: COLORS.text, lineHeight: 1.1 }}>
                  Edit Property
                </h1>
              </div>
            </div>
            <div style={{ height: '2px', background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent}, transparent)`, borderRadius: '2px', marginTop: '16px' }} />
          </motion.div>

          {/* ── Alerts ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  background: '#fdf0ef', border: `1px solid ${COLORS.error}30`,
                  borderLeft: `4px solid ${COLORS.error}`,
                  borderRadius: '10px', padding: '12px 16px',
                  color: COLORS.error, fontSize: '14px', marginBottom: '20px',
                }}
              >
                {error}
              </motion.div>
            )}
            {saved && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: '#eaf4ef', border: `1px solid ${COLORS.success}30`,
                  borderLeft: `4px solid ${COLORS.success}`,
                  borderRadius: '10px', padding: '12px 16px',
                  color: COLORS.success, fontSize: '14px', marginBottom: '20px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" stroke={COLORS.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Property updated! Redirecting…
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Section: Core Details ── */}
          <Section title="Core Details" icon="✦" delay={0.05}>
            <motion.div variants={stagger} initial="hidden" animate="show"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

              <FloatingField label="Property Title" span index={0}>
                <Field value={form.title || ''} onChange={set('title')} placeholder="Property title" />
              </FloatingField>

              <FloatingField label="Price (₹)" index={1}>
                <Field type="number" value={form.price || ''} onChange={set('price')} placeholder="50,00,000" />
              </FloatingField>

              <FloatingField label="Listing Type" index={2}>
                <Field as="select" value={form.type || 'buy'} onChange={set('type')}>
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                  <option value="rent">Rent</option>
                </Field>
              </FloatingField>

              <FloatingField label="City" index={3}>
                <Field value={form.city || ''} onChange={set('city')} placeholder="City" />
              </FloatingField>

              <FloatingField label="Status" index={4}>
                <Field as="select" value={form.status || 'active'} onChange={set('status')}>
                  <option value="active">Active</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </Field>
              </FloatingField>

              <FloatingField label="Bedrooms" index={5}>
                <Field type="number" value={form.bedrooms || ''} onChange={set('bedrooms')} placeholder="3" />
              </FloatingField>
            </motion.div>
          </Section>

          {/* ── Section: Assignment ── */}
          <Section title="Agent Assignment" icon="◈" delay={0.15}>
            <motion.div variants={stagger} initial="hidden" animate="show"
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

              <FloatingField label="Assigned Agent" index={0}>
                <Field as="select" value={form.agent_id || ''} onChange={set('agent_id')}>
                  <option value="">Select Agent</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </Field>
              </FloatingField>

              {/* Placeholder for future fields */}
              <div />
            </motion.div>
          </Section>

          {/* ── Actions ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', gap: '12px' }}
          >
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: COLORS.primaryLight }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading || saved}
              style={{
                padding: '13px 32px',
                background: saved ? COLORS.success : loading ? COLORS.muted : COLORS.primary,
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontFamily: "'Jost', sans-serif",
                fontSize: '15px',
                fontWeight: '600',
                letterSpacing: '0.04em',
                cursor: loading || saved ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.2s',
              }}
            >
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Updating…
                </>
              ) : saved ? '✓ Updated!' : 'Update Property'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/admin/properties')}
              style={{
                padding: '13px 24px',
                background: 'transparent',
                color: COLORS.muted,
                border: `1.5px solid ${COLORS.border}`,
                borderRadius: '10px',
                fontFamily: "'Jost', sans-serif",
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Cancel
            </motion.button>
          </motion.div>

        </div>
      </motion.div>
    </>
  );
}