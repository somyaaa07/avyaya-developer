"use client";
import Link from "next/link";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiFacebook,
  FiInstagram,

  FiYoutube,
  FiArrowUp,
} from "react-icons/fi";

// Gold gradient: #e2a10d on the sides, #ffcd39 in the center
const goldBg = "bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";
const goldText = `${goldBg} bg-clip-text text-transparent`;
// Icons are stroke-based, so they use the SVG gradient defined in the component
const goldStroke = { stroke: "url(#footer-gold)" };

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Properties", href: "/properties" },
  // { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const services = [
  { label: "Residential Properties", href: "/properties" },
  { label: "Commercial Properties", href: "/properties" },
  { label: "Land / Plotting", href: "/properties" },
  // { label: "Investment Advisory", href: "/properties" },
];

const socials = [
  { label: "Facebook", icon: FiFacebook, href: "#" },
  { label: "Instagram", icon: FiInstagram, href: "#" },
  { label: "YouTube", icon: FiYoutube, href: "#" },
];

const contact = [
  { icon: FiPhone, text: "+91 9999300301", href: "tel:+919999300301" },
  {
    icon: FiMail,
    text: "bringo.realstates@gmail.com",
    href: "mailto:bringo.realstates@gmail.com",
  },
  
  { icon: FiMapPin, text: "FF01,FF02 Kaveri City Center,Delta 1.Greater Noida,Gautam Buddha Nagar,UP 201306" },
];

const linkClass =
  "text-sm text-[#f3f0E8]/70 transition-colors hover:text-[#ffcd39] focus:outline-none focus-visible:text-[#ffcd39] focus-visible:underline";

const headingClass = "text-base font-semibold text-[#faf9f6]";

function ColumnHeading({ children }) {
  return (
    <>
      <h3 className={headingClass}>{children}</h3>
      <span
        aria-hidden="true"
        className={`mt-2 block h-[2px] w-8 rounded-full ${goldBg}`}
      />
    </>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#1a2a22] text-[#faf9f6]">
      {/* Gradient definition used by the stroke icons (keep width/height 0, not display:none) */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        className="pointer-events-none absolute"
      >
        <defs>
          <linearGradient
            id="footer-gold"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="24"
            y2="0"
          >
            <stop offset="0%" stopColor="#e2a10d" />
            <stop offset="50%" stopColor="#ffcd39" />
            <stop offset="100%" stopColor="#e2a10d" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top gold line */}
      <div aria-hidden="true" className={`h-[3px] w-full ${goldBg}`} />

      {/* Soft glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full bg-[#ffcd39]/[0.07] blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-[#52685B]/25 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4 -mt-16">
            <Link
  href="/"
  className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcd39]"
>
  <img
    src="/uploads/logo.png"
    alt="Bingo Real Estate"
    className="h-40 w-auto object-contain"
  />
</Link>
            <p className="-mt-12 max-w-sm text-sm leading-relaxed text-[#f3f0E8]/70">
              Building trusted residential, commercial and investment
              opportunities across Delhi NCR with transparency and care.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-full border border-[#52685B] transition duration-300 hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:from-[#e2a10d] hover:via-[#ffcd39] hover:to-[#e2a10d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcd39] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a2a22]"
                >
                  <Icon
                    size={18}
                    aria-hidden="true"
                    className="text-[#f3f0E8] transition-colors group-hover:text-[#1a2a22]"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav
            aria-label="Quick links"
            className="lg:col-span-2 lg:col-start-6"
          >
            <ColumnHeading>Quick Links</ColumnHeading>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services" className="lg:col-span-2">
            <ColumnHeading>Services</ColumnHeading>
            <ul className="mt-5 space-y-3">
              {services.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-3">
            <ColumnHeading>Contact</ColumnHeading>
            <ul className="mt-5 space-y-4">
              {contact.map(({ icon: Icon, text, href }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon
                    size={16}
                    className="mt-0.5 shrink-0"
                    style={goldStroke}
                    aria-hidden="true"
                  />
                  {href ? (
                    <a href={href} className={`${linkClass} break-all`}>
                      {text}
                    </a>
                  ) : (
                    <span className="text-sm text-[#f3f0E8]/70">{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#52685B]/50 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-[#f3f0E8]/60 sm:text-sm">
            © {new Date().getFullYear()} Bringo Real Estates. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs sm:text-sm">
            
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className={`flex h-9 w-9 items-center justify-center rounded-full text-[#1a2a22] shadow-[0_8px_20px_-8px_rgba(226,161,13,0.8)] transition hover:-translate-y-0.5 hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcd39] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a2a22] ${goldBg}`}
            >
              <FiArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
