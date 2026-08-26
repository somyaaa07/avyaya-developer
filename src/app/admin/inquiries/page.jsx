'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const C = {
  primary:     '#2e5d42',
  primaryPale: '#e8f0eb',
  bg:          '#f8fafc',
  white:       '#ffffff',
  border:      '#d6ddd8',
  text:        '#1a2e22',
  muted:       '#6b7c72',
  accent:      '#c8a96e',
  error:       '#c0392b',
  success:     '#16a34a',
};

const STATUS_CONFIG = {
  new:     { bg: '#fef9c3', color: '#a16207', label: 'New'     },
  read:    { bg: '#f1f5f9', color: '#475569', label: 'Read'    },
  replied: { bg: '#f0fdf4', color: '#16a34a', label: 'Replied' },
};

export default function AdminInquiriesPage() {
  const [inquiries,  setInquiries]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null);
  const [filter,     setFilter]     = useState('all');
  const [updating,   setUpdating]   = useState(null);

  const fetchInquiries = async () => {
    try {
      const res  = await fetch('/api/admin/inquiries');
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchInquiries(); }, []);

  // Status update
  const updateStatus = async (id, status) => {
    setUpdating(id);
    await fetch(`/api/admin/inquiries/${id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ status }),
    });

    setInquiries(prev =>
      prev.map(i => i.id === id ? { ...i, status } : i)
    );

    if (selected?.id === id) {
      setSelected(prev => ({ ...prev, status }));
    }
    setUpdating(null);
  };

  // Delete
  const deleteInquiry = async (id) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });

    setInquiries(prev => prev.filter(i => i.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  // Filter
  const filtered = inquiries.filter(i => {
    if (filter === 'all') return true;
    return i.status === filter;
  });

  // Stats
  const stats = {
    all:     inquiries.length,
    new:     inquiries.filter(i => i.status === 'new').length,
    read:    inquiries.filter(i => i.status === 'read').length,
    replied: inquiries.filter(i => i.status === 'replied').length,
  };

  const thStyle = {
    padding:   '12px 16px',
    textAlign: 'left',
    fontSize:  '12px',
    color:     C.muted,
    fontWeight:'600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    background: '#f8fafc',
    borderBottom: `1px solid ${C.border}`,
  };

  const tdStyle = {
    padding:     '14px 16px',
    fontSize:    '14px',
    color:       C.text,
    borderBottom:`1px solid #f1f5f9`,
    verticalAlign: 'middle',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .inq-row:hover { background: #f8fafc !important; }
        .inq-row.selected { background: ${C.primaryPale} !important; }
      `}</style>

      <div>
        {/* ── Header ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '24px', color: C.text, margin: '0 0 4px', fontWeight: '400' }}>
              Inquiries
            </h1>
            <p style={{ fontSize: '14px', color: C.muted, margin: 0 }}>
              Total {stats.all} inquiries · {stats.new} new
            </p>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { key: 'all',     label: 'Total',   value: stats.all,     color: C.primary },
            { key: 'new',     label: 'New',     value: stats.new,     color: '#a16207' },
            { key: 'read',    label: 'Read',    value: stats.read,    color: '#475569' },
            { key: 'replied', label: 'Replied', value: stats.replied, color: C.success },
          ].map(s => (
            <div
              key={s.key}
              onClick={() => setFilter(s.key)}
              style={{
                background:   filter === s.key ? s.color : C.white,
                borderRadius: '12px',
                padding:      '16px',
                border:       `1px solid ${filter === s.key ? s.color : C.border}`,
                textAlign:    'center',
                cursor:       'pointer',
                transition:   'all 0.2s',
              }}
            >
              <p style={{ fontSize: '28px', fontWeight: '700', color: filter === s.key ? '#fff' : s.color, margin: '0 0 4px', fontFamily: "'Marcellus', serif" }}>
                {s.value}
              </p>
              <p style={{ fontSize: '12px', color: filter === s.key ? 'rgba(255,255,255,0.85)' : C.muted, margin: 0, fontWeight: '600' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Two Column Layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '20px', alignItems: 'start' }}>

          {/* ── Table ── */}
          <div style={{ background: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: C.muted }}>
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: C.muted }}>
                <p style={{ fontSize: '40px', marginBottom: '12px' }}>📭</p>
                <p style={{ fontFamily: "'Marcellus', serif", fontSize: '16px', color: C.text }}>
                  No inquiries found
                </p>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Sender</th>
                    <th style={thStyle}>Property</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inq => {
                    const sc     = STATUS_CONFIG[inq.status] || STATUS_CONFIG.new;
                    const isSelected = selected?.id === inq.id;

                    return (
                      <tr
                        key={inq.id}
                        className={`inq-row${isSelected ? ' selected' : ''}`}
                        style={{ background: isSelected ? C.primaryPale : C.white, cursor: 'pointer', transition: 'background 0.15s' }}
                        onClick={() => setSelected(isSelected ? null : inq)}
                      >
                        <td style={tdStyle}>
                          <p style={{ fontWeight: '600', margin: '0 0 2px', fontSize: '14px' }}>{inq.name}</p>
                          <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>{inq.email}</p>
                        </td>

                        <td style={tdStyle}>
                          {inq.property ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {inq.property.images?.[0]?.url && (
                                <img
                                  src={inq.property.images[0].url}
                                  alt=""
                                  style={{ width: '40px', height: '32px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
                                />
                              )}
                              <div>
                                <p style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 2px', color: C.text }}>{inq.property.title}</p>
                                <p style={{ fontSize: '12px', color: C.muted, margin: 0 }}>{inq.property.city}</p>
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: C.muted, fontSize: '13px' }}>General</span>
                          )}
                        </td>

                        <td style={tdStyle}>
                          <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', background: sc.bg, color: sc.color }}>
                            {sc.label}
                          </span>
                        </td>

                        <td style={{ ...tdStyle, fontSize: '13px', color: C.muted }}>
                          {new Date(inq.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>

                        <td style={tdStyle}>
                          <button
                            onClick={e => { e.stopPropagation(); deleteInquiry(inq.id); }}
                            style={{ padding: '6px 12px', background: '#fee2e2', color: C.error, border: 'none', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Detail Panel ── */}
          {selected && (
            <div style={{ background: C.white, borderRadius: '16px', border: `1px solid ${C.border}`, padding: '24px', position: 'sticky', top: '20px' }}>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: "'Marcellus', serif", fontSize: '18px', color: C.text, margin: 0, fontWeight: '400' }}>
                  Inquiry Detail
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '22px', color: C.muted, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>

              {/* Sender Info */}
              <div style={{ background: C.bg, borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: C.primary, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                  Sender
                </p>
                {[
                  { label: 'Name',  value: selected.name },
                  { label: 'Email', value: selected.email },
                  { label: 'Phone', value: selected.phone || 'N/A' },
                ].map(f => (
                  <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: C.muted }}>{f.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: C.text }}>{f.value}</span>
                  </div>
                ))}
              </div>

              {/* Property Info */}
              {selected.property && (
                <div style={{ background: C.bg, borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: C.primary, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                    Property
                  </p>
                  {selected.property.images?.[0]?.url && (
                    <img
                      src={selected.property.images[0].url}
                      alt=""
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                    />
                  )}
                  <p style={{ fontFamily: "'Marcellus', serif", fontSize: '15px', color: C.text, margin: '0 0 4px' }}>
                    {selected.property.title}
                  </p>
                  <p style={{ fontSize: '13px', color: C.muted, margin: '0 0 8px' }}>
                    📍 {selected.property.location}, {selected.property.city}
                  </p>
                  <p style={{ fontFamily: "'Marcellus', serif", fontSize: '16px', color: C.primary, margin: '0 0 10px' }}>
                    ₹{Number(selected.property.price).toLocaleString('en-IN')}
                  </p>
                  <Link
                    href={`/properties/${selected.property.id}`}
                    target="_blank"
                    style={{ fontSize: '13px', color: C.primary, fontWeight: '600' }}
                  >
                    View Property →
                  </Link>
                </div>
              )}

              {/* Message */}
              <div style={{ background: C.bg, borderRadius: '10px', padding: '16px', marginBottom: '16px', borderLeft: `3px solid ${C.primary}` }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: C.primary, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  Message
                </p>
                <p style={{ fontSize: '14px', color: C.text, lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>
                  "{selected.message}"
                </p>
              </div>

              {/* Date */}
              <p style={{ fontSize: '12px', color: C.muted, marginBottom: '16px' }}>
                📅 {new Date(selected.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>

              {/* Status Update */}
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', fontWeight: '600', color: C.primary, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
                  Update Status
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['new', 'read', 'replied'].map(s => {
                    const sc      = STATUS_CONFIG[s];
                    const isActive = selected.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        disabled={updating === selected.id}
                        style={{
                          flex:        1,
                          padding:     '8px',
                          borderRadius:'8px',
                          border:      `1.5px solid ${isActive ? sc.color : C.border}`,
                          background:  isActive ? sc.bg   : C.white,
                          color:       isActive ? sc.color : C.muted,
                          fontSize:    '12px',
                          fontWeight:  '600',
                          cursor:      'pointer',
                          transition:  'all 0.2s',
                        }}
                      >
                        {sc.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.property?.title || 'Your Inquiry'}`}
                  style={{ flex: 1, padding: '10px', background: C.primary, color: '#fff', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '600', fontFamily: "'Jost', sans-serif" }}
                >
                  ✉ Send Email
                </a>
                {selected.phone && (
                  <a
                    href={`tel:${selected.phone}`}
                    style={{ flex: 1, padding: '10px', background: C.primaryPale, color: C.primary, borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontSize: '13px', fontWeight: '600', fontFamily: "'Jost', sans-serif" }}
                  >
                    📞 Call
                  </a>
                )}
                <button
                  onClick={() => deleteInquiry(selected.id)}
                  style={{ padding: '10px 14px', background: '#fee2e2', color: C.error, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}