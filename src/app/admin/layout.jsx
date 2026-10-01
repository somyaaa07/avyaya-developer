'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from 'framer-motion';
import { Marcellus } from 'next/font/google';
import {
  ExternalLink,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCog,
  Building2,
  X,
} from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const goldBg =
  'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';

const navLinks = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/properties',
    label: 'Properties',
    icon: Building2,
  },
  {
    href: '/admin/agents',
    label: 'Agents',
    icon: UserCog,
  },
  {
    href: '/admin/inquiries',
    label: 'Inquiries',
    icon: Inbox,
  },
];

const isActive = (pathname, href) =>
  href === '/admin'
    ? pathname === '/admin'
    : pathname === href ||
      pathname.startsWith(href + '/');

/* ===============================================================
   SIDEBAR CONTENT
================================================================ */

function SidebarContent({
  pathname,
  user,
  onNavigate,
}) {
  const initial =
    user?.name?.charAt(0)?.toUpperCase() || 'A';

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#1A2A22] text-[#FAF9F6]">

      {/* Gold top line */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`}
      />

      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#D4AF37]/10 blur-3xl"
      />

      {/* Brand */}
      <div className="relative px-6 pb-6 pt-8">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          <h2
            className={`${marcellus.className} text-2xl leading-tight`}
          >
            Bringo Real Estates
          </h2>

          <p className="mt-1 text-sm text-[#F5D77A]">
            Admin panel
          </p>
        </Link>
      </div>

      <div
        aria-hidden="true"
        className="mx-6 h-px bg-[#FAF9F6]/10"
      />

      {/* Navigation */}
      <nav
        aria-label="Admin navigation"
        className="relative flex-1 overflow-y-auto px-4 py-6"
      >
        <ul className="space-y-1.5">
          {navLinks.map(
            ({ href, label, icon: Icon }) => {
              const active = isActive(
                pathname,
                href
              );

              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={
                      active ? 'page' : undefined
                    }
                    className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37] ${
                      active
                        ? 'bg-[#FAF9F6]/10 text-[#FAF9F6]'
                        : 'text-[#FAF9F6]/60 hover:bg-[#FAF9F6]/5 hover:text-[#FAF9F6]'
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-[#F5D77A]"
                      />
                    )}

                    <Icon
                      size={19}
                      strokeWidth={1.6}
                      aria-hidden="true"
                      className={
                        active
                          ? 'text-[#F5D77A]'
                          : 'transition group-hover:text-[#F5D77A]'
                      }
                    />

                    <span
                      className={
                        marcellus.className
                      }
                    >
                      {label}
                    </span>
                  </Link>
                </li>
              );
            }
          )}
        </ul>

        {/* View website */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#FAF9F6]/50 transition hover:text-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
        >
          <ExternalLink
            size={17}
            strokeWidth={1.6}
            aria-hidden="true"
          />

          View website
        </Link>
      </nav>

      {/* User + Logout */}
      <div className="relative border-t border-[#FAF9F6]/10 p-4">
        <div className="mb-3 flex items-center gap-3 px-1">

          <span
            aria-hidden="true"
            className={`${marcellus.className} flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base text-[#1A2A22] ${goldBg}`}
          >
            {initial}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm text-[#FAF9F6]">
              {user?.name || 'Admin'}
            </p>

            {user?.email && (
              <p className="truncate font-sans text-xs text-[#FAF9F6]/50">
                {user.email}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            signOut({
              callbackUrl: '/admin/login',
            })
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-4 py-2.5 text-sm text-[#FAF9F6] transition hover:border-red-300/50 hover:bg-red-500/15 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
        >
          <LogOut
            size={16}
            aria-hidden="true"
          />

          Logout
        </button>
      </div>
    </div>
  );
}

/* ===============================================================
   ADMIN LAYOUT
================================================================ */

export default function AdminLayout({
  children,
}) {
  const {
    data: session,
    status,
  } = useSession();

  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  /*
    /admin/login ko authentication check se
    exclude karna hai.
  */
  const isAdminLoginPage =
    pathname === '/admin/login';

  /*
    Role ko lowercase kar rahe hain taaki
    "admin" aur "ADMIN" dono work karein.
  */
  const userRole =
    session?.user?.role?.toLowerCase();

  const isAdmin =
    status === 'authenticated' &&
    userRole === 'admin';

  /* =============================================================
     DEBUG
  ============================================================= */

  useEffect(() => {
    console.log(
      '===== ADMIN LAYOUT ====='
    );

    console.log('PATHNAME:', pathname);
    console.log('STATUS:', status);
    console.log(
      'SESSION:',
      session
    );
    console.log(
      'ROLE:',
      session?.user?.role
    );
    console.log(
      'IS ADMIN:',
      isAdmin
    );
    console.log(
      'ADMIN LOGIN PAGE:',
      isAdminLoginPage
    );
  }, [
    pathname,
    status,
    session,
    isAdmin,
    isAdminLoginPage,
  ]);

  /* =============================================================
     AUTH REDIRECT
  ============================================================= */

  useEffect(() => {
    /*
      Admin login page par redirect nahi karna.
    */
    if (isAdminLoginPage) {
      return;
    }

    /*
      Session abhi load ho rahi hai.
    */
    if (status === 'loading') {
      return;
    }

    /*
      User logged out hai.
    */
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
      return;
    }

    /*
      User logged in hai lekin admin nahi hai.
    */
    if (
      status === 'authenticated' &&
      userRole !== 'admin'
    ) {
      router.replace('/admin/login');
    }
  }, [
    status,
    userRole,
    router,
    isAdminLoginPage,
  ]);

  /* =============================================================
     ADMIN LOGIN PAGE
  ============================================================= */

  /*
    /admin/login par:
    - Sidebar nahi
    - Mobile header nahi
    - Admin navigation nahi
    - Navbar/Footer nahi

    Sirf login page render hoga.
  */
  if (isAdminLoginPage) {
    return <>{children}</>;
  }

  /* =============================================================
     SESSION LOADING
  ============================================================= */

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <motion.p
          animate={
            reduce
              ? undefined
              : {
                  opacity: [0.4, 1, 0.4],
                }
          }
          transition={{
            repeat: Infinity,
            duration: 1.6,
          }}
          className={`${marcellus.className} text-sm tracking-[0.2em] text-[#52685B]`}
        >
          LOADING
        </motion.p>
      </div>
    );
  }

  /* =============================================================
     NOT ADMIN
  ============================================================= */

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF9F6]">
        <motion.p
          animate={
            reduce
              ? undefined
              : {
                  opacity: [0.4, 1, 0.4],
                }
          }
          transition={{
            repeat: Infinity,
            duration: 1.6,
          }}
          className={`${marcellus.className} text-sm tracking-[0.2em] text-[#52685B]`}
        >
          REDIRECTING...
        </motion.p>
      </div>
    );
  }

  const user = session.user;

  /* =============================================================
     ADMIN UI
  ============================================================= */

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A2A22] lg:flex">

      {/* =========================================================
          DESKTOP SIDEBAR
      ========================================================= */}

      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent
            pathname={pathname}
            user={user}
          />
        </div>
      </aside>

      {/* =========================================================
          MOBILE HEADER
      ========================================================= */}

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#1A2A22]/10 bg-[#FAF9F6]/95 px-4 py-3 backdrop-blur lg:hidden">

        <Link
          href="/admin"
          className={`${marcellus.className} text-lg`}
        >
          Bringo{' '}
          <span className="text-[#B8902F]">
            Admin
          </span>
        </Link>

        <button
          type="button"
          onClick={() =>
            setDrawerOpen(true)
          }
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#1A2A22]/15 transition hover:bg-[#F3F0E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
        >
          <Menu
            size={22}
            aria-hidden="true"
          />
        </button>
      </header>

      {/* =========================================================
          MOBILE DRAWER
      ========================================================= */}

      <AnimatePresence>
        {drawerOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Admin menu"
          >

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.2,
              }}
              onClick={() =>
                setDrawerOpen(false)
              }
              className="absolute inset-0 bg-[#1A2A22]/50"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={
                reduce
                  ? { opacity: 0 }
                  : { x: '-100%' }
              }
              animate={
                reduce
                  ? { opacity: 1 }
                  : { x: 0 }
              }
              exit={
                reduce
                  ? { opacity: 0 }
                  : { x: '-100%' }
              }
              transition={{
                type: 'tween',
                duration: 0.25,
                ease: 'easeOut',
              }}
              className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl"
            >

              <SidebarContent
                pathname={pathname}
                user={user}
                onNavigate={() =>
                  setDrawerOpen(false)
                }
              />

              <button
                type="button"
                onClick={() =>
                  setDrawerOpen(false)
                }
                aria-label="Close menu"
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-[#FAF9F6]/70 transition hover:bg-[#FAF9F6]/10 hover:text-[#FAF9F6]"
              >
                <X
                  size={20}
                  aria-hidden="true"
                />
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="min-w-0 flex-1">

        <motion.main
          key={pathname}
          initial={
            reduce
              ? false
              : {
                  opacity: 0,
                  y: 12,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.35,
            ease: 'easeOut',
          }}
          className="px-4 py-8 sm:px-8 lg:px-10 lg:py-10"
        >
          {children}
        </motion.main>

      </div>
    </div>
  );
}