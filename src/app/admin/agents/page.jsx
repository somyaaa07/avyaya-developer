'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = () => {
    setLoading(true);
    fetch('/api/admin/agents')
      .then(r => r.json())
      .then(data => { setAgents(data); setLoading(false); });
  };

  useEffect(() => { fetchAgents(); }, []);

  const deleteAgent = async (id) => {
    if (!confirm('Delete this agent?')) return;
    await fetch(`/api/admin/agents/${id}`, { method: 'DELETE' });
    fetchAgents();
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
            fontSize: '11px', color: '#2e5d42', letterSpacing: '0.25em',
            textTransform: 'uppercase', fontWeight: '500', marginBottom: '6px',
          }}>Management</p>
          <h1 style={{ fontFamily: "'Marcellus', serif", fontSize: '38px', color: '#1a3628', lineHeight: 1 }}>
            Agents
          </h1>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link href="/admin/agents/add" style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 22px',
            background: '#2e5d42',
            color: '#fafaef',
            borderRadius: '10px',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '500',
            letterSpacing: '0.04em',
            boxShadow: '0 4px 16px rgba(46,93,66,0.25)',
          }}>
            <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span>
            Add Agent
          </Link>
        </motion.div>
      </motion.div>

      {/* Table Card */}
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
          gridTemplateColumns: '2fr 2fr 1.5fr 1fr',
          padding: '14px 24px',
          background: '#f3f7f4',
          borderBottom: '1px solid #e4ede6',
        }}>
          {['Name', 'Email', 'Phone', 'Actions'].map(h => (
            <span key={h} style={{
              fontSize: '11px', color: '#2e5d42', fontWeight: '600',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        <AnimatePresence>
          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#8a9e95' }}>
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.4 }}>
                Loading agents...
              </motion.div>
            </div>
          ) : agents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: '60px', textAlign: 'center' }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.3 }}>✦</div>
              <p style={{ color: '#8a9e95', fontSize: '14px' }}>No agents found</p>
            </motion.div>
          ) : (
            agents.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ delay: i * 0.06 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 2fr 1.5fr 1fr',
                  padding: '16px 24px',
                  borderBottom: '1px solid #f3f7f4',
                  alignItems: 'center',
                  transition: 'background 0.15s ease',
                }}
                whileHover={{ background: '#fafafa' }}
              >
                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px', height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2e5d42, #4a7a6a)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fafaef', fontSize: '13px', fontWeight: '600',
                    flexShrink: 0,
                  }}>
                    {agent.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a3628' }}>{agent.name}</span>
                </div>

                {/* Email */}
                <span style={{ fontSize: '13px', color: '#4a6358' }}>{agent.email}</span>

                {/* Phone */}
                <span style={{ fontSize: '13px', color: '#8a9e95' }}>{agent.phone || '—'}</span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteAgent(agent.id)}
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
            ))
          )}
        </AnimatePresence>

        {/* Footer count */}
        {agents.length > 0 && (
          <div style={{
            padding: '12px 24px',
            background: '#f9faf9',
            borderTop: '1px solid #e4ede6',
          }}>
            <p style={{ fontSize: '12px', color: '#8a9e95' }}>
              {agents.length} agent{agents.length !== 1 ? 's' : ''} total
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}