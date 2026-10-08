"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Marcellus, Jost } from "next/font/google";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/*
  Palette
  cream : #F3F0E8  (header + mobile menu surface)
  navy  : #0F1F3D  (text, borders, primary buttons)
  navy+ : #1A3260  (primary button hover)
*/

const links = [
  { label: "Home", href: "/" },
  { label: "All Properties", href: "/properties" },
  { label: "Buy", href: "/properties?type=buy" },
  { label: "Sell", href: "/properties?type=sell" },
  { label: "Rent", href: "/properties?type=rent" },
    { label: "About", href: "/about" },

  { label: "Contact", href: "/contact" },
];

/* ---------- Logo ---------- */
function Logo() {
  return (
    <Link
      href="/"
      aria-label="Estate – Home"
      className="flex items-center gap-2.5 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F1F3D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F0E8]"
    >
      <img
        src="/logo.png"
        alt="Estate"
        className="h-15 w-auto object-contain sm:h-15"
      />
    </Link>
  );
}

/* ---------- Main ---------- */
function NavbarInner() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAdmin = session?.user?.role?.toLowerCase() === "admin";
  const allLinks = isAdmin ? [...links] : links;
  const firstName = session?.user?.name?.split(" ")[0];
  const initial = session?.user?.name?.charAt(0).toUpperCase();

  // Active state (handles ?type=buy/sell/rent)
  const isActive = (href) => {
    const [path, query] = href.split("?");
    if (path === "/") return pathname === "/";
    if (query) {
      const [k, v] = query.split("=");
      return pathname === path && searchParams.get(k) === v;
    }
    if (path === "/properties")
      return pathname.startsWith(path) && !searchParams.get("type");
    return pathname === path || pathname.startsWith(path + "/");
  };

  // Close menu on route change
  useEffect(() => setOpen(false), [pathname, searchParams]);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + Esc to close
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F1F3D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F3F0E8]";

  const logoutBtn = (extra = "") => (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-[#0F1F3D]/25 px-4 py-2 text-sm font-medium text-[#0F1F3D] transition hover:border-red-600/40 hover:bg-red-600/10 hover:text-red-700 ${focusRing} ${extra}`}
    >
      <FiLogOut size={15} aria-hidden="true" />
      Logout
    </button>
  );

  const dashboardChip = (extra = "") => (
    <Link
      href={isAdmin ? "/admin" : "/dashboard"}
      className={`inline-flex items-center gap-2 rounded-lg bg-[#0F1F3D]/5 px-3.5 py-2 text-sm font-medium text-[#0F1F3D] transition hover:bg-[#0F1F3D]/10 ${focusRing} ${extra}`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0F1F3D] text-xs font-bold text-white">
        {initial}
      </span>
      <span className="truncate">{firstName}</span>
    </Link>
  );

  const loginBtn = (extra = "", onClick) => (
    <Link
      href="/login"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-lg border border-[#0F1F3D]/25 px-4 py-2 text-sm font-medium text-[#0F1F3D] transition hover:border-[#0F1F3D] hover:bg-[#0F1F3D] hover:text-white ${focusRing} ${extra}`}
    >
      Login
    </Link>
  );

  const listPropertyBtn = (extra = "", onClick) => (
    <Link
      href="/signup"
      onClick={onClick}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-[#e2220d] bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] px-4 py-2 text-sm font-medium text-white transition hover:border-[#1A3260] hover:bg-[#1A3260] ${focusRing} ${extra}`}
    >
      Free Property Listing
    </Link>
  );

  return (
    <header
      className={`${jost.className} sticky top-0 z-50 border-b border-[#0F1F3D]/10 bg-[#F3F0E8]/95 text-[#0F1F3D] backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_4px_20px_-10px_rgba(15,31,61,0.35)]" : ""
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8"
      >
        <Logo />

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {allLinks.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`border-b-2 py-1 text-sm transition-colors ${focusRing} ${
                    active
                      ? "border-[#0F1F3D] font-semibold text-[#0F1F3D]"
                      : "border-transparent font-normal text-[#0F1F3D]/70 hover:border-[#0F1F3D]/30 hover:text-[#0F1F3D]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {session ? (
            <>
              {dashboardChip("max-w-[160px]")}
              {logoutBtn()}
            </>
          ) : (
            <>
              {loginBtn()}
              {listPropertyBtn()}
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className={`flex h-11 w-11 items-center justify-center rounded-lg border border-[#0F1F3D]/25 text-[#0F1F3D] transition hover:bg-[#0F1F3D]/5 lg:hidden ${focusRing}`}
        >
          {open ? (
            <FiX size={22} aria-hidden="true" />
          ) : (
            <FiMenu size={22} aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-x-0 bottom-0 top-16 bg-[#0F1F3D]/50 lg:hidden"
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="absolute inset-x-0 top-full max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-[#0F1F3D]/10 bg-[#F3F0E8] text-[#0F1F3D] shadow-xl lg:hidden"
            >
              <ul className="mx-auto max-w-7xl space-y-1 px-4 pb-2 pt-4 sm:px-6">
                {allLinks.map(({ label, href }) => {
                  const active = isActive(href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-base transition ${focusRing} ${
                          active
                            ? "bg-[#0F1F3D]/10 font-semibold text-[#0F1F3D]"
                            : "font-normal text-[#0F1F3D]/75 hover:bg-[#0F1F3D]/5 hover:text-[#0F1F3D]"
                        }`}
                      >
                        {label}
                        {active && (
                          <span
                            className="h-1.5 w-1.5 rounded-full bg-[#0F1F3D]"
                            aria-hidden="true"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mx-auto max-w-7xl border-t border-[#0F1F3D]/10 px-4 pb-6 pt-4 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  {session ? (
                    <>
                      {dashboardChip("flex-1 justify-center py-3")}
                      {logoutBtn("flex-1 py-3")}
                    </>
                  ) : (
                    <>
                      {loginBtn("flex-1 py-3", () => setOpen(false))}
                      {listPropertyBtn("flex-1 py-3", () => setOpen(false))}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

/* useSearchParams needs a Suspense boundary in the App Router */
export default function Navbar() {
  return (
    <Suspense
      fallback={
        <div className="sticky top-0 z-50 h-16 border-b border-[#0F1F3D]/10 bg-[#F3F0E8] lg:h-[72px]" />
      }
    >
      <NavbarInner />
    </Suspense>
  );
}
