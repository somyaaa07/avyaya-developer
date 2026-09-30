"use client";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function OfficeCard({ city, tag, address, phone, email, hours, index = 0 }) {
  const telHref = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="flex min-w-0 flex-col rounded-2xl border border-[#dce5df] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#2e5d42] hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dce9e1] text-[#2e5d42]">
            <MapPin size={20} aria-hidden="true" />
          </span>
          <h3 className="text-xl font-semibold text-[#1b2b23]">{city}</h3>
        </div>
        <span className="rounded-full bg-[#f0f4f1] px-3 py-1 text-xs font-semibold text-[#2e5d42]">
          {tag}
        </span>
      </div>

      <ul className="mt-5 space-y-3 text-sm text-[#66736c]">
        <li className="flex gap-3">
          <MapPin size={16} className="mt-0.5 shrink-0 text-[#2e5d42]" aria-hidden="true" />
          <span className="break-words">{address}</span>
        </li>
        <li className="flex gap-3">
          <Phone size={16} className="mt-0.5 shrink-0 text-[#2e5d42]" aria-hidden="true" />
          <span>{phone}</span>
        </li>
        {email && (
          <li className="flex gap-3">
            <Mail size={16} className="mt-0.5 shrink-0 text-[#2e5d42]" aria-hidden="true" />
            <span className="break-all">{email}</span>
          </li>
        )}
        <li className="flex gap-3">
          <Clock size={16} className="mt-0.5 shrink-0 text-[#2e5d42]" aria-hidden="true" />
          <span>{hours}</span>
        </li>
      </ul>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a
          href={telHref}
          aria-label={`Call ${city} office`}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2e5d42] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#173d2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e5d42] focus-visible:ring-offset-2"
        >
          <Phone size={16} aria-hidden="true" /> Call
        </a>
        {email && (
          <a
            href={`mailto:${email}`}
            aria-label={`Email ${city} office`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#2e5d42] px-4 py-2.5 text-sm font-semibold text-[#2e5d42] transition hover:bg-[#2e5d42] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e5d42] focus-visible:ring-offset-2"
          >
            <Mail size={16} aria-hidden="true" /> Email
          </a>
        )}
      </div>
    </motion.article>
  );
}