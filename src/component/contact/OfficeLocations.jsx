"use client";
import { motion } from "framer-motion";
import OfficeCard from "./OfficeCard";
import { offices } from "@/data/contactData";

export default function OfficeLocations() {
  return (
    <section id="offices" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2e5d42]">
            Our Offices
          </span>
          <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-tight text-[#1b2b23]">
            Visit Us Across Delhi NCR
          </h2>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offices.map((office, i) => (
            <OfficeCard key={office.city} {...office} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}