"use client";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Marcellus } from "next/font/google";
import { contactMethods } from "@/data/contactData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const icons = { Phone, Mail, FaWhatsapp, MapPin };

export default function ContactMethods() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {contactMethods.map((m, i) => {
        const Icon = icons[m.icon];
        return (
          <motion.a
            key={m.id}
            href={m.href}
            {...(m.external && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
            className="group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border border-[#e8e3d3] bg-[#f3f0E8] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-[#e2a10d]/70 hover:bg-[#faf9f6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e2a10d] sm:p-7"
            style={{ boxShadow: "0 24px 50px -35px rgba(26,42,34,0.35)" }}
          >
            {/* Top gold hairline: #e2a10d sides, #ffcd39 center */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-[2px] opacity-50 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(90deg, rgba(226,161,13,0) 0%, #e2a10d 25%, #ffcd39 50%, #e2a10d 75%, rgba(226,161,13,0) 100%)",
              }}
            />

            <div className="flex items-start justify-between">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-[#e2a10d] transition-all duration-500 group-hover:border-transparent group-hover:text-[#1a2a22] group-hover:[background:linear-gradient(135deg,#ffcd39_0%,#e2a10d_100%)]"
                style={{
                  border: "1px solid rgba(226,161,13,0.55)",
                  background: "rgba(255,205,57,0.1)",
                }}
              >
                <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <ArrowUpRight
                size={18}
                strokeWidth={1.6}
                className="text-[#52685B]/50 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e2a10d]"
                aria-hidden="true"
              />
            </div>

            <span className="mt-6 text-[11px] font-medium uppercase tracking-[0.25em] text-[#52685B]">
              {m.label}
            </span>
            <span
              className={`${marcellus.className} mt-2 break-words text-xl leading-snug text-[#1a2a22]`}
            >
              {m.value}
            </span>

            <span className="mt-4 border-t border-[#1a2a22]/10 pt-4 text-sm leading-relaxed text-[#52685B]">
              {m.note}
            </span>
          </motion.a>
        );
      })}
    </div>
  );
}