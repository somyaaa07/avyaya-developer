"use client";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight } from "lucide-react";
import { Marcellus } from "next/font/google";
import { mapData } from "@/data/contactData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function ContactMap() {
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    mapData.name + " " + mapData.address
  )}`;

  return (
    <section className="relative overflow-hidden bg-[#faf9f6] pb-16 sm:pb-20 lg:pb-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-[#e8e3d3] bg-[#f3f0E8]"
          style={{ boxShadow: "0 30px 60px -35px rgba(26,42,34,0.35)" }}
        >
          {/* Top gold hairline: #e2a10d sides, #ffcd39 center */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-10 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, rgba(226,161,13,0) 0%, #e2a10d 25%, #ffcd39 50%, #e2a10d 75%, rgba(226,161,13,0) 100%)",
            }}
          />

          {/* Header */}
          <div className="flex flex-col gap-5 px-5 py-6 sm:px-8 sm:py-7 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#e2a10d]"
                style={{
                  border: "1px solid rgba(226,161,13,0.55)",
                  background: "rgba(255,205,57,0.1)",
                }}
              >
                <MapPin size={20} strokeWidth={1.6} aria-hidden="true" />
              </span>

              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span
                    className="h-px w-8"
                    style={{ background: "linear-gradient(90deg, #e2a10d, #ffcd39)" }}
                  />
                  <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#52685B]">
                    Visit Us
                  </span>
                </div>
                <h2
                  className={`${marcellus.className} mt-2 text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.15] tracking-tight text-[#1a2a22]`}
                >
                  Find Us on the Map
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-[#52685B]">
                  <span className="font-medium text-[#1a2a22]">{mapData.name}</span>
                  <span className="mx-2 text-[#e2a10d]">•</span>
                  <span className="break-words">{mapData.address}</span>
                </p>
              </div>
            </div>

            {/* Directions button — hero BtnDark style */}
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex w-fit shrink-0 items-center gap-3 overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-6 pr-2.5 text-sm font-medium text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:ring-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d] transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
              />
              <span className="relative z-10">Get Directions</span>
              <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-500 group-hover:rotate-45"
                  aria-hidden="true"
                />
              </span>
            </a>
          </div>

          {/* Map */}
          <div className="px-3 pb-3 sm:px-4 sm:pb-4">
            <div className="h-[320px] w-full overflow-hidden rounded-2xl border border-[#e8e3d3] sm:h-[380px] lg:h-[440px]">
              <iframe
                src={mapData.src}
                title={`Map showing ${mapData.name}`}
                className="h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}