'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Marcellus } from 'next/font/google';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Inbox,
  Plus,
  UserCog,
  Users,
} from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const goldBg = 'bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]';

/* ---------------------------------------------------------------
   ANIMATED NUMBER
---------------------------------------------------------------- */
function AnimatedNumber({ value }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const target = Number(value) || 0;
    if (reduce || target === 0) {
      setDisplay(target);
      return;
    }
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        setDisplay(target);
        clearInterval(interval);
      } else {
        setDisplay(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [value, reduce]);

  return <>{display.toLocaleString('en-IN')}</>;
}

/* ---------------------------------------------------------------
   DASHBOARD
---------------------------------------------------------------- */
export default function AdminDashboard() {
  const reduce = useReducedMotion();
  const [stats, setStats] = useState({
    properties: 0,
    agents: 0,
    inquiries: 0,
    users: 0,
    newInquiries: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => {
        if (!r.ok) throw new Error('Failed');
        return r.json();
      })
      .then((data) => setStats((p) => ({ ...p, ...data })))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // NOTE: hrefs apne admin routes ke hisaab se badal lena
  const cards = [
    { label: 'Properties', key: 'properties', icon: Building2, href: '/admin/properties' },
    { label: 'Agents', key: 'agents', icon: UserCog, href: '/admin/agents' },
    { label: 'Inquiries', key: 'inquiries', icon: Inbox, href: '/admin/inquiries', badge: stats.newInquiries },
    { label: 'Users', key: 'users', icon: Users, href: '/admin/users' },
  ];

  const actions = [
    { label: 'Add a property', href: '/admin/properties', icon: Plus },
    { label: 'Review inquiries', href: '/admin/inquiries', icon: Inbox },
    { label: 'Manage agents', href: '/admin/agents', icon: UserCog },
    // { label: 'Manage users', href: '/admin/users', icon: Users },
  ];

  const enter = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: 'easeOut' },
  });

  return (
    <div className={`${marcellus.className} font-normal text-[#0f2645]`}>
      {/* ── Header ── */}
      <motion.header {...enter()} className="mb-8 sm:mb-10">
        <h1 className="text-3xl leading-tight sm:text-4xl">Dashboard</h1>
        <span aria-hidden="true" className={`mt-4 block h-[3px] w-14 rounded-full ${goldBg}`} />
        <p className="mt-4 font-sans text-sm text-[#52685B]">
          A quick look at your listings, team and enquiries.
        </p>
      </motion.header>

      {error && (
        <p
          role="alert"
          className="mb-6 flex items-start gap-2 rounded-xl border border-[#9C3B2B]/25 bg-[#F6E3DF] px-4 py-3 font-sans text-sm text-[#9C3B2B]"
        >
          <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
          Could not load the latest numbers. Please refresh the page.
        </p>
      )}

      {/* ── Stat cards ── */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {cards.map(({ label, key, icon: Icon, href, badge }, i) => (
          <motion.li key={key} {...enter(0.1 + i * 0.08)} className="list-none">
            <Link
              href={href}
              className="group relative block overflow-hidden rounded-3xl border border-[#0f2645]/10 bg-white p-6 transition duration-300 hover:border-[#D4AF37]/60 hover:shadow-[0_18px_40px_-18px_rgba(15,38,69,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100 ${goldBg}`}
              />

              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f2645] text-[#F5D77A] transition duration-300 group-hover:bg-gradient-to-br group-hover:from-[#F5D77A] group-hover:to-[#B8902F] group-hover:text-[#0f2645]">
                  <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                </span>
                {badge > 0 && (
                  <span className="rounded-full bg-[#9C3B2B] px-2.5 py-1 font-sans text-[11px] font-semibold text-white">
                    {badge} new
                  </span>
                )}
              </div>

              <p className="mt-6 font-sans text-sm text-[#52685B]">{label}</p>
              <div className="mt-1 flex items-end justify-between">
                {loading ? (
                  <span className="h-11 w-20 animate-pulse rounded-lg bg-[#0f2645]/10" />
                ) : (
                  <p className="text-[44px] leading-none">
                    <AnimatedNumber value={stats[key]} />
                  </p>
                )}
                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="mb-1 text-[#52685B]/50 transition group-hover:text-[#B8902F]"
                />
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>

      {/* ── Bottom section ── */}
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_1fr] lg:gap-6">
        {/* Quick actions */}
        <motion.section
          {...enter(0.5)}
          aria-labelledby="quick-actions"
          className="rounded-3xl border border-[#0f2645]/10 bg-white p-6 sm:p-8"
        >
          <h2 id="quick-actions" className="text-xl sm:text-2xl">
            Quick actions
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {actions.map(({ label, href, icon: Icon }) => (
              <li key={label} className="list-none">
                <Link
                  href={href}
                  className="group flex items-center gap-3 rounded-2xl border border-[#0f2645]/10 bg-[#FAF9F6] p-3.5 transition hover:border-[#D4AF37]/60 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0f2645]/[0.06] text-[#0f2645] transition group-hover:bg-[#0f2645] group-hover:text-[#F5D77A]">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="flex-1 font-sans text-[15px]">{label}</span>
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="text-[#52685B]/50 transition group-hover:translate-x-1 group-hover:text-[#B8902F]"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Needs attention */}
        <motion.section
          {...enter(0.6)}
          aria-labelledby="attention"
          className="relative overflow-hidden rounded-3xl bg-[#0f2645] p-6 text-[#FAF9F6] sm:p-8"
        >
          <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`} />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
          <h2 id="attention" className="relative text-xl sm:text-2xl">
            Needs attention
          </h2>

          {loading ? (
            <div className="relative mt-6 space-y-3">
              <span className="block h-12 w-24 animate-pulse rounded-lg bg-[#FAF9F6]/10" />
              <span className="block h-4 w-3/4 animate-pulse rounded-full bg-[#FAF9F6]/10" />
            </div>
          ) : stats.newInquiries > 0 ? (
            <div className="relative">
              <p className="mt-6 text-5xl leading-none text-[#F5D77A]">
                {stats.newInquiries.toLocaleString('en-IN')}
              </p>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#FAF9F6]/75">
                New {stats.newInquiries === 1 ? 'inquiry is' : 'inquiries are'} waiting for a
                reply. Quick responses help you win more clients.
              </p>
              <Link
                href="/admin/inquiries"
                className="group mt-7 inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-[#F5D77A] via-[#D4AF37] to-[#A67C1E] py-2.5 pl-6 pr-2.5 font-sans text-sm text-[#0f2645] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D77A]"
              >
                View inquiries
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A]">
                  <ArrowRight size={14} className="transition-transform duration-300 group-hover:-rotate-45" aria-hidden="true" />
                </span>
              </Link>
            </div>
          ) : (
            <p className="relative mt-6 font-sans text-sm leading-relaxed text-[#FAF9F6]/75">
              You are all caught up. New inquiries will show up here as soon as they arrive.
            </p>
          )}
        </motion.section>
      </div>
    </div>
  );
}