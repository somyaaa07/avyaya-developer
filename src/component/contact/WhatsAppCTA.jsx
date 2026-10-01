"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Marcellus } from "next/font/google";
import { WHATSAPP_URL } from "@/data/contactData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function WhatsAppCTA() {
  return (
    <section className="relative overflow-hidden bg-[#1A2A22] py-16 sm:py-20">
      {/* Top gold hairline: #e2a10d sides, #ffcd39 center */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(226,161,13,0) 0%, #e2a10d 25%, #ffcd39 50%, #e2a10d 75%, rgba(226,161,13,0) 100%)",
        }}
      />

      {/* Soft glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,205,57,0.12) 0%, rgba(255,205,57,0) 70%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(82,104,91,0.35) 0%, rgba(82,104,91,0) 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"
      >
        <div className="flex items-start gap-5">
          <span
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[#ffcd39]"
            style={{
              border: "1px solid rgba(226,161,13,0.55)",
              background: "rgba(255,205,57,0.06)",
            }}
          >
            <FaWhatsapp size={24} strokeWidth={1.6} aria-hidden="true" />
          </span>

          <div>
            <div className="flex items-center gap-3">
              <span
                className="h-px w-10"
                style={{ background: "linear-gradient(90deg, #e2a10d, #ffcd39)" }}
              />
              <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#ffcd39] sm:text-xs">
                WhatsApp
              </span>
            </div>
            <h2
              className={`${marcellus.className} mt-3 text-[clamp(1.6rem,3.2vw,2.4rem)] leading-[1.15] tracking-tight text-[#FAF9F6]`}
            >
              Prefer a quick conversation?
            </h2>
            <p className="mt-2 max-w-md text-base leading-relaxed text-[#F3F0E8]/70">
              Chat with our team directly on WhatsApp.
            </p>
          </div>
        </div>

        {/* Button — same style as hero BtnDark, inverted ring for dark bg */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex shrink-0 items-center gap-3 overflow-hidden rounded-full bg-[#FAF9F6] py-2.5 pl-6 pr-2.5 text-sm font-medium text-[#1A2A22] ring-1 ring-[#D4AF37]/60 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(212,175,55,0.35)] hover:ring-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        >
          {/* Golden fill */}
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d] transition-transform duration-500 ease-out group-hover:scale-x-100"
          />

          {/* Shine */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
          />

          <span className="relative z-10">Chat on WhatsApp</span>

          <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#1A2A22] text-[#ffcd39] transition-all duration-500 group-hover:bg-[#1A2A22] group-hover:text-[#ffcd39]">
            <ArrowRight
              size={14}
              className="transition-transform duration-500 group-hover:-rotate-45"
              aria-hidden="true"
            />
          </span>
        </a>
      </motion.div>
    </section>
  );
}