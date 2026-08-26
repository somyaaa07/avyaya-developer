'use client';
import Link          from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname }         from 'next/navigation';

const C = {
  primary:     '#2e5d42',
  primaryPale: '#e8f0eb',
  accent:      '#c8a96e',
  text:        '#1a2e22',
  muted:       '#6b7c72',
  border:      '#d6ddd8',
};

export default function Navbar() {
  const { data: session } = useSession();
  const pathname          = usePathname();

  const navLink = (href, label) => {
    const active = pathname === href || pathname.startsWith(href + '?');
    return (
      <Link
        href={href}
        style={{
          fontSize:      '14px',
          fontFamily:    "'Jost', sans-serif",
          fontWeight:    active ? '600' : '400',
          color:         active ? C.primary : C.muted,
          textDecoration:'none',
          padding:       '4px 0',
          borderBottom:  active ? `2px solid ${C.primary}` : '2px solid transparent',
          transition:    'all 0.2s',
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Marcellus&family=Jost:wght@300;400;500;600&display=swap');`}</style>

      <nav style={{
        background:   '#fff',
        borderBottom: `1px solid ${C.border}`,
        padding:      '0 24px',
        position:     'sticky',
        top:          0,
        zIndex:       100,
        boxShadow:    '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          maxWidth:       '1200px',
          margin:         '0 auto',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          height:         '64px',
        }}>

          {/* ── Logo ── */}
          <Link href="/" style={{
            fontFamily:    "'Marcellus', serif",
            fontSize:      '22px',
            fontWeight:    '400',
            color:         C.primary,
            textDecoration:'none',
            letterSpacing: '0.02em',
          }}>
            Estate
          </Link>

          {/* ── Nav Links ── */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {navLink('/properties',          'All Properties')}
            {navLink('/properties?type=buy',  'Buy')}
            {navLink('/properties?type=sell', 'Sell')}
            {navLink('/properties?type=rent', 'Rent')}

            {/* Admin link — sirf admin ko dikhega */}
            {session?.user?.role === 'admin' && (
              navLink('/admin', 'Admin')
            )}
          </div>

          {/* ── Auth Section ── */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {session ? (
              <>
                {/* Dashboard link */}
                <Link href="/dashboard" style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            '8px',
                  padding:        '8px 14px',
                  background:     C.primaryPale,
                  borderRadius:   '8px',
                  textDecoration: 'none',
                  fontFamily:     "'Jost', sans-serif",
                  fontSize:       '14px',
                  fontWeight:     '500',
                  color:          C.primary,
                  transition:     'all 0.2s',
                }}>
                  {/* Avatar circle */}
                  <div style={{
                    width:          '26px',
                    height:         '26px',
                    borderRadius:   '50%',
                    background:     C.primary,
                    color:          '#fff',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    fontSize:       '12px',
                    fontWeight:     '700',
                    flexShrink:     0,
                  }}>
                    {session.user.name?.charAt(0).toUpperCase()}
                  </div>
                  {session.user.name?.split(' ')[0]}
                </Link>

                {/* Logout */}
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  style={{
                    padding:     '8px 16px',
                    background:  'transparent',
                    color:       C.muted,
                    border:      `1px solid ${C.border}`,
                    borderRadius:'8px',
                    fontSize:    '14px',
                    fontFamily:  "'Jost', sans-serif",
                    fontWeight:  '500',
                    cursor:      'pointer',
                    transition:  'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background    = '#fee2e2';
                    e.currentTarget.style.color         = '#dc2626';
                    e.currentTarget.style.borderColor   = '#fca5a5';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background    = 'transparent';
                    e.currentTarget.style.color         = C.muted;
                    e.currentTarget.style.borderColor   = C.border;
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" style={{
                  padding:        '8px 18px',
                  border:         `1px solid ${C.border}`,
                  borderRadius:   '8px',
                  fontSize:       '14px',
                  fontFamily:     "'Jost', sans-serif",
                  fontWeight:     '500',
                  color:          C.text,
                  textDecoration: 'none',
                  transition:     'all 0.2s',
                }}>
                  Login
                </Link>

                <Link href="/signup" style={{
                  padding:        '8px 18px',
                  background:     C.primary,
                  borderRadius:   '8px',
                  fontSize:       '14px',
                  fontFamily:     "'Jost', sans-serif",
                  fontWeight:     '600',
                  color:          '#fff',
                  textDecoration: 'none',
                  transition:     'all 0.2s',
                }}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}