'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const typeColors = {
  buy:  { bg: '#e8f0eb', text: '#0f2645' },
  sell: { bg: '#f5edd8', text: '#a07830' },
  rent: { bg: '#dce5f5', text: '#3a5a9c' },
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchProperties = () => {
  setLoading(true);

  fetch('/api/admin/properties')
    .then(async (res) => {
      const data = await res.json();

      // ✅ SAFE NORMALIZATION (IMPORTANT)
      const list = Array.isArray(data)
        ? data
        : data?.data || [];

      setProperties(list);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setProperties([]); // fallback so UI never crashes
      setLoading(false);
    });
};
  useEffect(() => { fetchProperties(); }, []);

  const deleteProperty = async (id) => {
    if (!confirm('Delete this property?')) return;
    try {
      const res = await fetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) fetchProperties();
      else alert('Delete failed: ' + data.error);
    } catch (err) {
      alert('Something went wrong');
    }
  };

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}
      >
        <div>
          <p style={{
            fontSize: '11px', color: '#0f2645', letterSpacing: '0.25em',
            textTransform: 'uppercase', fontWeight: '500', marginBottom: '6px',
          }}>Management</p>
          <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '38px', color: '#0f2645', lineHeight: 1 }}>
            Properties
          </h1>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/admin/properties/add" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 22px',
            background: '#0f2645',
            color: '#fafaef',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '500',
            letterSpacing: '0.04em',
            boxShadow: '0 4px 16px rgba(46,93,66,0.25)',
          }}>
            <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
            Add Property
          </Link>
        </motion.div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          background: '#fff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 2px 16px rgba(26,54,40,0.07)',
        }}
      >
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr 1fr 1fr',
          padding: '14px 24px',
          background: '#f3f5f7',
          borderBottom: '1px solid #e4ede6',
        }}>
          {['Title', 'Price', 'Type', 'City', 'Status', 'Actions'].map(h => (
            <span key={h} style={{
              fontSize: '11px', color: '#0f2645', fontWeight: '600',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>{h}</span>
          ))}
        </div>

        <AnimatePresence>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }}
                style={{ color: '#8a9e95', fontSize: '14px' }}>
                Loading properties...
              </motion.div>
            </div>
          ) : properties.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.3 }}>⌂</div>
              <p style={{ color: '#8a9e95', fontSize: '14px' }}>No properties listed yet</p>
            </motion.div>
          ) : (
            properties.map((p, i) => {
              const tc = typeColors[p.type] || typeColors.buy;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ background: '#fafafa' }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.5fr 1.5fr 1fr 1fr 1fr 1fr',
                    padding: '16px 24px',
                    borderBottom: '1px solid #f3f7f4',
                    alignItems: 'center',
                  }}
                >
                  {/* Title */}
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#0f2645' }}>{p.title}</span>

                  {/* Price */}
                  <span style={{ fontSize: '13px', color: '#0f2645', fontWeight: '600' }}>
                    ₹{Number(p.price).toLocaleString('en-IN')}
                  </span>

                  {/* Type */}
                  <span style={{
                    display: 'inline-flex',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    letterSpacing: '0.08em',
                    background: tc.bg,
                    color: tc.text,
                    width: 'fit-content',
                  }}>
                    {p.type?.toUpperCase()}
                  </span>

                  {/* City */}
                  <span style={{ fontSize: '13px', color: '#4a6358' }}>{p.city}</span>

                  {/* Status */}
                  <span style={{
                    display: 'inline-flex',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: p.status === 'active' ? '#e8f0eb' : '#fef0f0',
                    color: p.status === 'active' ? '#0f2645' : '#c0392b',
                    width: 'fit-content',
                  }}>
                    {p.status}
                  </span>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href={`/admin/properties/edit/${p.id}`} style={{
                        padding: '6px 14px',
                        background: '#f3f7f4',
                        borderRadius: '8px',
                        fontSize: '12px',
                        textDecoration: 'none',
                        color: '#0f2645',
                        fontWeight: '500',
                      }}>
                        Edit
                      </Link>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteProperty(p.id)}
                      style={{
                        padding: '6px 14px',
                        background: '#fef0f0',
                        color: '#c0392b',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontFamily: "'Jost', sans-serif",
                      }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>

        {properties.length > 0 && (
          <div style={{
            padding: '12px 24px',
            background: '#f9faf9',
            borderTop: '1px solid #e4ede6',
          }}>
            <p style={{ fontSize: '12px', color: '#8a9e95' }}>
              {properties.length} propert{properties.length !== 1 ? 'ies' : 'y'} total
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}