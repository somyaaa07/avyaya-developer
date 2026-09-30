"use client";
import { motion } from "framer-motion";
import { WHATSAPP_URL } from "@/data/contactData";

export default function ContactCTA() {
  return (
    <section className="bg-[#173d2a] py-16 sm:py-20 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8"
      >
        <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-tight tracking-tight text-white">
          Ready to Take the Next Step?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/80 sm:text-lg">
          Tell us what you’re looking for and our team will help you find the right solution.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="#enquiry-form"
            className="inline-flex items-center justify-center rounded-xl bg-[#2e5d42] px-7 py-3.5 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:scale-[1.02] hover:bg-[#3a7353] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Send an Enquiry
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-white/60 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#173d2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            WhatsApp Us
          </a>
        </div>
      </motion.div>
    </section>
  );
}