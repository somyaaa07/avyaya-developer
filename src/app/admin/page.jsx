'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!value) return;
    let start = 0;
    const step = Math.ceil(value / 30);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(interval); }
      else setDisplay(start);
    }, 30);
    return () => clearInterval(interval);
  }, [value]);
  return <>{display}</>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    properties:   0,
    agents:       0,
    inquiries:    0,
    users:        0,
    newInquiries: 0,
  });

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats);
  }, []);

  // ← stats define hone ke BAAD cards banao
  const cards = [
    { label: 'Properties', key: 'properties', icon: '⌂', accent: '#2e5d42', lightBg: '#e8f0eb' },
    { label: 'Agents',     key: 'agents',     icon: '✦', accent: '#c9a84c', lightBg: '#f5edd8' },
    { label: 'Inquiries',  key: 'inquiries',  icon: '◎', accent: '#7a5c3e', lightBg: '#ede3d8', badge: stats.newInquiries },
    { label: 'Users',      key: 'users',      icon: '◈', accent: '#4a7a6a', lightBg: '#dceae6' },
  ];

  return (
    <div style={{ fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
      `}</style>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: '40px' }}
      >
        <p style={{ fontFamily: "'Jost', sans-serif", color: '#2e5d42', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '500' }}>
          Overview
        </p>
        <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '38px', color: '#1a3628', lineHeight: 1.1 }}>
          Dashboard
        </h1>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '48px' }}>
        {cards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2, type: 'spring', stiffness: 120 }}
            whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(46,93,66,0.12)' }}
            style={{
              background:    '#fff',
              borderRadius:  '16px',
              padding:       '28px 24px',
              boxShadow:     '0 2px 12px rgba(26,54,40,0.06)',
              cursor:        'default',
              position:      'relative',
              overflow:      'hidden',
            }}
          >
            {/* Accent top bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: card.accent }} />

            {/* New badge */}
            {card.badge > 0 && (
              <span style={{
                position:     'absolute',
                top:          '14px',
                left:         '14px',
                background:   '#dc2626',
                color:        '#fff',
                borderRadius: '20px',
                fontSize:     '10px',
                fontWeight:   '700',
                padding:      '2px 8px',
              }}>
                {card.badge} new
              </span>
            )}

            {/* Icon blob */}
            <div style={{
              position:       'absolute',
              top:            '16px',
              right:          '16px',
              width:          '44px',
              height:         '44px',
              borderRadius:   '12px',
              background:     card.lightBg,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       '20px',
              color:          card.accent,
            }}>
              {card.icon}
            </div>

            <p style={{ fontSize: '12px', fontWeight: '500', color: '#8a9e95', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', marginTop: '24px' }}>
              {card.label}
            </p>

            <p style={{ fontFamily: "'Marcellus', serif", fontSize: '44px', color: '#1a3628', lineHeight: 1, marginBottom: '8px' }}>
              <AnimatedNumber value={stats[card.key]} />
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', color: card.accent, fontWeight: '500', background: card.lightBg, padding: '2px 8px', borderRadius: '20px' }}>
                Active
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Bottom Section ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}
      >
        {/* Quick Stats */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', boxShadow: '0 2px 12px rgba(26,54,40,0.06)' }}>
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '11px', color: '#2e5d42', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '500', marginBottom: '4px' }}>
              System
            </p>
            <h3 style={{ fontFamily: "'Marcellus', serif", fontSize: '20px', color: '#1a3628' }}>
              Quick Stats
            </h3>
          </div>

          {[
            { label: 'Active Listings',  val: stats.properties, max: stats.properties + 5  },
            { label: 'Available Agents', val: stats.agents,     max: stats.agents + 2      },
            { label: 'Open Inquiries',   val: stats.inquiries,  max: stats.inquiries + 10  },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              style={{ marginBottom: '16px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: '#4a6358' }}>{item.label}</span>
                <span style={{ fontSize: '13px', color: '#1a3628', fontWeight: '600' }}>{item.val}</span>
              </div>
              <div style={{ height: '4px', background: '#e8f0eb', borderRadius: '10px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((item.val / (item.max || 1)) * 100, 100)}%` }}
                  transition={{ delay: 1 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                  style={{ height: '100%', background: '#2e5d42', borderRadius: '10px' }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Portfolio Card */}
        <div style={{
          background:    'linear-gradient(135deg, #1a3628 0%, #2e5d42 100%)',
          borderRadius:  '16px',
          padding:       '28px',
          position:      'relative',
          overflow:      'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', bottom: -30, right: -30, width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(201,168,76,0.1)' }} />
          <div style={{ position: 'absolute', top: -20, right: 60, width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(250,250,239,0.04)' }} />

          <p style={{ fontSize: '11px', color: '#c9a84c', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: '500', marginBottom: '8px' }}>
            Portfolio
          </p>
          <h3 style={{ fontFamily: "'Marcellus', serif", fontSize: '24px', color: '#fafaef', marginBottom: '20px', lineHeight: 1.3 }}>
            Your Estate<br />at a Glance
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Properties', val: stats.properties },
              { label: 'Agents',     val: stats.agents     },
              { label: 'Inquiries',  val: stats.inquiries  },
              { label: 'Users',      val: stats.users      },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.08 }}
                style={{ background: 'rgba(250,250,239,0.07)', borderRadius: '10px', padding: '14px' }}
              >
                <p style={{ fontSize: '22px', fontFamily: "'Marcellus', serif", color: '#fafaef', marginBottom: '2px' }}>
                  {item.val}
                </p>
                <p style={{ fontSize: '11px', color: 'rgba(250,250,239,0.5)' }}>{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}