'use client';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';

const navLinks = [
  { href: '/admin',            label: 'Dashboard',   icon: '◈' },
  { href: '/admin/properties', label: 'Properties',  icon: '⌂' },
  { href: '/admin/agents',     label: 'Agents',      icon: '✦' },
  { href: '/admin/inquiries',  label: 'Inquiries',   icon: '◎' },
];

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/');
  }, [status, session]);

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#fafaef',
        fontFamily: "'Jost', sans-serif",
      }}>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          style={{ color: '#2e5d42', fontSize: '15px', letterSpacing: '0.12em' }}
        >
          LOADING
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');
        // * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #fafaef; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f0f0e0; }
        ::-webkit-scrollbar-thumb { background: #2e5d42; border-radius: 10px; }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Jost', sans-serif" }}>

        {/* Sidebar */}
        <motion.aside
          initial={{ x: -260 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          style={{
            width: '240px',
            background: '#1a3628',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative pattern */}
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '120px', height: '120px',
            background: 'radial-gradient(circle at top right, rgba(46,93,66,0.6), transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '100px', height: '100px',
            background: 'radial-gradient(circle at bottom left, rgba(201,168,76,0.08), transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Brand */}
          <div style={{ padding: '32px 24px 24px' }}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p style={{
                fontFamily: "'Marcellus', serif",
                color: '#c9a84c',
                fontSize: '11px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}>Admin</p>
              <h2 style={{
                fontFamily: "'Marcellus', serif",
                color: '#fafaef',
                fontSize: '22px',
                lineHeight: 1.2,
              }}>volora Estate Panel</h2>
            </motion.div>
          </div>

          {/* Divider */}
          <div style={{ margin: '0 24px 24px', height: '1px', background: 'rgba(250,250,239,0.1)' }} />

          {/* Nav Links */}
          <nav style={{ flex: 1, padding: '0 12px' }}>
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i + 0.4 }}
                >
                  <Link
                    href={link.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      color: isActive ? '#fafaef' : 'rgba(250,250,239,0.5)',
                      background: isActive ? 'rgba(46,93,66,0.7)' : 'transparent',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: isActive ? '500' : '400',
                      letterSpacing: '0.02em',
                      marginBottom: '4px',
                      transition: 'all 0.2s ease',
                      borderLeft: isActive ? '2px solid #c9a84c' : '2px solid transparent',
                    }}
                  >
                    <span style={{ fontSize: '16px', opacity: 0.8 }}>{link.icon}</span>
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        style={{
                          marginLeft: 'auto',
                          width: '6px', height: '6px',
                          borderRadius: '50%',
                          background: '#c9a84c',
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

      
         <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
>
 {/* Logout */}
<div style={{ padding: '20px', borderTop: '1px solid rgba(250,250,239,0.07)' }}>
  <button
    onClick={() => signOut({ callbackUrl: '/login' })}
    style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '11px 14px',
      borderRadius: '10px',
      background: 'rgba(201,168,76,0.08)',
      color: '#fafaef',
      border: '1px solid rgba(201,168,76,0.2)',
      cursor: 'pointer',
      fontSize: '14px',
      letterSpacing: '0.04em',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(201,168,76,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(201,168,76,0.08)';
    }}
  >
    ⎋ Logout
  </button>
</div>
</motion.div>
        </motion.aside>

        {/* Main Content */}
        <div style={{
          flex: 1,
          background: '#fafaef',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Subtle background texture */}
          <div style={{
            position: 'fixed',
            top: 0, right: 0,
            width: '500px', height: '500px',
            background: 'radial-gradient(ellipse at top right, rgba(46,93,66,0.04), transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            style={{ position: 'relative', zIndex: 1, padding: '40px 36px' }}
          >
            {children}
          </motion.main>
        </div>
      </div>
    </>
  );
}