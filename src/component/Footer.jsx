"use client";
import Link from "next/link";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiArrowUp,
} from "react-icons/fi";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

const services = [
  { label: "Residential Projects", href: "/services" },
  { label: "Commercial Projects", href: "/services" },
  { label: "Land / Plotting", href: "/services" },
  { label: "Investment Advisory", href: "/services" },
];

const socials = [
  { label: "Facebook", icon: FiFacebook, href: "#" },
  { label: "Instagram", icon: FiInstagram, href: "#" },
  { label: "LinkedIn", icon: FiLinkedin, href: "#" },
  { label: "YouTube", icon: FiYoutube, href: "#" },
];

const contact = [
  { icon: FiPhone, text: "+91 7004397655", href: "tel:+917004397655" },
  { icon: FiMail, text: "info@avyayadevelopers.com", href: "mailto:info@avyayadevelopers.com" },
  { icon: FiClock, text: "Mon – Sat, 10 AM – 7 PM" },
  { icon: FiMapPin, text: "Noida, Uttar Pradesh" },
];

const linkClass =
  "text-sm text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:text-white focus-visible:underline";

export default function Footer() {
  return (
    <footer className="bg-[#173d2a] text-white">
      <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link href="/" className="inline-block text-2xl font-semibold tracking-tight">
              Avyaya <span className="text-[#dce9e1]">Developers</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
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
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-white hover:bg-white hover:text-[#173d2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Quick links" className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#dce9e1]">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services" className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#dce9e1]">
              Services
            </h3>
            <ul className="mt-5 space-y-3">
              {services.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#dce9e1]">
              Contact
            </h3>
            <ul className="mt-5 space-y-4">
              {contact.map(({ icon: Icon, text, href }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon size={16} className="mt-0.5 shrink-0 text-[#dce9e1]" aria-hidden="true" />
                  {href ? (
                    <a href={href} className={`${linkClass} break-all`}>{text}</a>
                  ) : (
                    <span className="text-sm text-white/70">{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/60 sm:text-sm">
            © {new Date().getFullYear()} Avyaya Developers. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-xs sm:text-sm">
            <Link href="/privacy-policy" className={linkClass}>Privacy Policy</Link>
            <Link href="/terms" className={linkClass}>Terms</Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2e5d42] text-white transition hover:bg-white hover:text-[#173d2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <FiArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}