'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1.5px solid #dce8df',
  fontSize: '14px',
  fontFamily: "'Jost', sans-serif",
  background: '#fafaef',
  color: '#1a3628',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};

const focusHandlers = {
  onFocus: e => {
    e.target.style.borderColor = '#0f2645';
    e.target.style.boxShadow = '0 0 0 3px rgba(46,93,66,0.08)';
    e.target.style.background = '#fff';
  },
  onBlur: e => {
    e.target.style.borderColor = '#dce8df';
    e.target.style.boxShadow = 'none';
    e.target.style.background = '#fafaef';
  },
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: '600',
  color: '#0f2645',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '8px',
};

export default function AddAgentPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', description: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push('/admin/agents');
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong');
      setSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif", maxWidth: '780px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '36px' }}
      >
        <motion.button
          whileHover={{ x: -3 }}
          onClick={() => router.push('/admin/agents')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#0f2645', fontSize: '13px', fontFamily: "'Jost', sans-serif",
            display: 'flex', alignItems: 'center', gap: '6px',
            marginBottom: '16px', padding: 0,
          }}
        >
          ← Back to Agents
        </motion.button>
        <p style={{
          fontSize: '11px', color: '#0f2645', letterSpacing: '0.25em',
          textTransform: 'uppercase', fontWeight: '500', marginBottom: '10px',
        }}>New Entry</p>
        <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '38px', color: '#1a3628', lineHeight: 1 }}>
          Add Agent
        </h1>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: '#fef0f0',
              border: '1px solid #fca5a5',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#c0392b',
              fontSize: '13px',
              marginBottom: '20px',
            }}
          >
            ⚠ {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 100 }}
        style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: '0 4px 24px rgba(26,54,40,0.08)',
          border: '1px solid rgba(46,93,66,0.06)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {[
            { key: 'name',  label: 'Full Name',    type: 'text',  placeholder: 'Rajesh Kumar' },
            { key: 'email', label: 'Email Address', type: 'email', placeholder: 'agent@example.com' },
            { key: 'phone', label: 'Phone Number',  type: 'text',  placeholder: '+91 98765 43210' },
          ].map((field, i) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <label style={labelStyle}>{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                style={inputStyle}
                {...focusHandlers}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.44 }}
          >
            <label style={labelStyle}>Description</label>
            <textarea
              rows={4}
              placeholder="Brief introduction about the agent..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }}
              {...focusHandlers}
            />
          </motion.div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#e4ede6', margin: '28px 0' }} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(46,93,66,0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={saving}
            style={{
              padding: '13px 28px',
              background: '#0f2645',
              color: '#fafaef',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: "'Jost', sans-serif",
              letterSpacing: '0.04em',
              opacity: saving ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {saving ? 'Saving...' : 'Save Agent'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/admin/agents')}
            style={{
              padding: '13px 24px',
              background: '#f3f7f4',
              color: '#0f2645',
              border: '1px solid #dce8df',
              borderRadius: '10px',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: "'Jost', sans-serif",
            }}
          >
            Cancel
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}