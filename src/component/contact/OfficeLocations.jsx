// OfficeLocations.jsx
"use client";
import { motion } from "framer-motion";
import { Marcellus } from "next/font/google";
import OfficeCard from "./OfficeCard";
import { offices } from "@/data/contactData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function OfficeLocations() {
  return (
    <section
      id="offices"
      className="relative scroll-mt-20 overflow-hidden bg-[#faf9f6] py-16 sm:py-20 lg:py-24"
    >
      {/* Soft background wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, #f3f0E8 0%, rgba(243,240,232,0) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          {/* Eyebrow */}
          <div className="mb-5 flex items-center justify-center gap-3">
            <span
              className="h-px w-8 sm:w-12"
              style={{ background: "linear-gradient(90deg, transparent, #e2a10d)" }}
            />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#52685B] sm:text-xs">
              Our Offices
            </span>
            <span
              className="h-px w-8 sm:w-12"
              style={{ background: "linear-gradient(90deg, #e2a10d, transparent)" }}
            />
          </div>

          <h2
            className={`${marcellus.className} text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.15] tracking-tight text-[#1a2a22]`}
          >
            Visit Us Across Delhi NCR
          </h2>

          {/* Gold divider: #e2a10d at sides, #ffcd39 at center */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <span
              className="h-[2px] w-16 rounded-full sm:w-24"
              style={{
                background:
                  "linear-gradient(90deg, rgba(226,161,13,0) 0%, #e2a10d 55%, #ffcd39 100%)",
              }}
            />
            <span
              className="h-2 w-2 rotate-45"
              style={{
                background: "#ffcd39",
                boxShadow: "0 0 0 3px rgba(255,205,57,0.2)",
              }}
            />
            <span
              className="h-[2px] w-16 rounded-full sm:w-24"
              style={{
                background:
                  "linear-gradient(90deg, #ffcd39 0%, #e2a10d 45%, rgba(226,161,13,0) 100%)",
              }}
            />
          </div>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offices.map((office, i) => (
            <OfficeCard key={office.city} {...office} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}