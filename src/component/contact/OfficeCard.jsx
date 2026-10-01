// OfficeCard.jsx
"use client";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { Marcellus } from "next/font/google";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function OfficeCard({ city, tag, address, phone, email, hours, index = 0 }) {
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-[#e8e3d3] bg-[#f3f0E8] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#e2a10d]/70 sm:p-8"
      style={{ boxShadow: "0 24px 50px -35px rgba(26,42,34,0.35)" }}
    >
      {/* Top gold hairline: #e2a10d sides, #ffcd39 center */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, rgba(226,161,13,0) 0%, #e2a10d 25%, #ffcd39 50%, #e2a10d 75%, rgba(226,161,13,0) 100%)",
        }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#e2a10d] transition-all duration-500 group-hover:text-[#1a2a22]"
            style={{
              border: "1px solid rgba(226,161,13,0.55)",
              background: "rgba(255,205,57,0.1)",
            }}
          >
            <MapPin size={20} strokeWidth={1.6} aria-hidden="true" />
          </span>
          <h3
            className={`${marcellus.className} text-2xl leading-tight tracking-tight text-[#1a2a22]`}
          >
            {city}
          </h3>
        </div>
        <span className="shrink-0 rounded-full border border-[#e2a10d]/50 bg-[#faf9f6] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#52685B]">
          {tag}
        </span>
      </div>

      <ul className="mt-6 text-sm text-[#52685B]">
        <li className="flex gap-3 border-t border-[#1a2a22]/10 py-3.5">
          <MapPin size={16} className="mt-0.5 shrink-0 text-[#e2a10d]" aria-hidden="true" />
          <span className="break-words leading-relaxed">{address}</span>
        </li>
        <li className="flex gap-3 border-t border-[#1a2a22]/10 py-3.5">
          <Phone size={16} className="mt-0.5 shrink-0 text-[#e2a10d]" aria-hidden="true" />
          <span>{phone}</span>
        </li>
        {email && (
          <li className="flex gap-3 border-t border-[#1a2a22]/10 py-3.5">
            <Mail size={16} className="mt-0.5 shrink-0 text-[#e2a10d]" aria-hidden="true" />
            <span className="break-all">{email}</span>
          </li>
        )}
        <li className="flex gap-3 border-t border-[#1a2a22]/10 pt-3.5">
          <Clock size={16} className="mt-0.5 shrink-0 text-[#e2a10d]" aria-hidden="true" />
          <span>{hours}</span>
        </li>
      </ul>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Call — hero BtnDark style */}
        <a
          href={telHref}
          aria-label={`Call ${city} office`}
          className="group/btn relative inline-flex items-center justify-between gap-3 overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-6 pr-2.5 text-sm font-medium text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:ring-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d] transition-transform duration-500 ease-out group-hover/btn:scale-x-100"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover/btn:translate-x-[450%] group-hover/btn:opacity-100"
          />
          <span className="relative z-10">Call Office</span>
          <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover/btn:bg-none group-hover/btn:bg-[#1A2A22] group-hover/btn:text-[#F5D77A]">
            <ArrowRight
              size={14}
              className="transition-transform duration-500 group-hover/btn:-rotate-45"
              aria-hidden="true"
            />
          </span>
        </a>

        {email && (
          <a
            href={`mailto:${email}`}
            aria-label={`Email ${city} office`}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[#52685B]/40 px-6 py-3 text-sm font-medium text-[#1a2a22] transition-all duration-300 hover:border-[#e2a10d] hover:bg-[#faf9f6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e2a10d]"
          >
            <Mail size={15} aria-hidden="true" /> Email
          </a>
        )}
      </div>
    </motion.article>
  );
}