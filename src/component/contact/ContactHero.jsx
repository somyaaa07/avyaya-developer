"use client";
import { motion } from "framer-motion";
import { heroImage, PHONE_HREF } from "@/data/contactData";

export default function ContactHero() {
  return (
    <section className="relative flex min-h-[440px] items-center overflow-hidden sm:min-h-[500px] lg:min-h-[600px]">
      <img
        src={heroImage.src}
        alt={heroImage.alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#173d2a]/95 via-[#173d2a]/80 to-[#2e5d42]/40" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#dce9e1]">
            Get in Touch
          </span>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.1] tracking-tight text-white">
            Let’s Start a Conversation
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Have a question, project idea, or need expert guidance? Our team is
            here to help you with the right information and support.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#enquiry-form"
              className="inline-flex items-center justify-center rounded-xl bg-[#2e5d42] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-[#173d2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#173d2a]"
            >
              Send an Enquiry
            </a>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center rounded-xl border border-white/60 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-[#173d2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Call Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}