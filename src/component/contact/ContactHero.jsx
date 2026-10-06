"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { Marcellus } from "next/font/google";
import { heroImage, PHONE, PHONE_HREF } from "@/data/contactData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const Eyebrow = ({ children }) => (
  <div className="flex items-center gap-3">
    <span
      className="h-px w-10"
      style={{ background: "linear-gradient(90deg, #e2a10d, #ffcd39)" }}
    />
    <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#F5D77A]">
      {children}
    </span>
  </div>
);

/* Gold button for the dark hero */
const BtnGold = ({ href, children }) => (
  <a
    href={href}
    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] py-2.5 pl-6 pr-2.5 text-sm font-medium text-[#0f2645] shadow-[0_10px_30px_rgba(212,175,55,0.25)] transition-all duration-500 hover:shadow-[0_14px_40px_rgba(212,175,55,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D77A]"
  >
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
    />
    <span className="relative z-10">{children}</span>
    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A] transition-all duration-500 group-hover:bg-[#FAF9F6]">
      <ArrowRight
        size={14}
        className="transition-transform duration-500 group-hover:-rotate-45"
      />
    </span>
  </a>
);

export default function ContactHero() {
  return (
    <section aria-labelledby="contact-hero" className="relative bg-[#FAF9F6]">
      {/* ===== Full-width cinematic hero ===== */}
      <div className="relative isolate overflow-hidden bg-[#0f2645]">
        <Image
          src={heroImage.src}
          alt={heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Overlays */}
        {/* Mobile / tablet: top-to-bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2a22]/90 via-[#1a2a22]/75 to-[#1a2a22]/55 lg:hidden" />
        {/* Desktop: left-to-right gradient (unchanged) */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#1a2a22] via-[#1a2a22]/75 to-transparent lg:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a22]/60 via-transparent to-transparent" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-1/3 h-[380px] w-[380px] rounded-full bg-[#e2a10d]/10 blur-3xl"
        />

        <div className="relative mx-auto flex min-h-[620px] max-w-7xl flex-col justify-center px-5 pb-36 pt-20 sm:px-8 lg:min-h-[720px] lg:pb-44 lg:pt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <Eyebrow>Get in Touch</Eyebrow>

            <h1
              id="contact-hero"
              className={`${marcellus.className} mt-6 text-5xl font-normal leading-[1.05] text-[#FAF9F6] sm:text-6xl lg:text-[72px]`}
            >
              Let’s Start a Conversation
            </h1>

           

            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-[#FAF9F6]/75 sm:text-base">
              Have a question, project idea, or need expert guidance? Our team
              is here to help you with the right information and support.
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <BtnGold href="#enquiry-form">Send an Enquiry</BtnGold>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center rounded-full border border-[#FAF9F6]/40 px-7 py-3.5 text-sm font-medium text-[#FAF9F6] transition-all duration-300 hover:border-[#F5D77A] hover:bg-[#FAF9F6]/10 hover:text-[#F5D77A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5D77A]"
              >
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== Floating info bar overlapping the hero ===== */}
      <div className="relative z-10 mx-auto -mt-20 max-w-6xl px-5 pb-20 sm:px-8 lg:-mt-24 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="relative grid overflow-hidden rounded-3xl bg-[#FAF9F6] shadow-[0_30px_70px_-25px_rgba(15,38,69,0.45)] ring-1 ring-[#D4AF37]/30 lg:grid-cols-[1.25fr_1fr_1fr]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]"
          />

          {/* Call card */}
          <div className="flex items-center gap-4 p-6 sm:p-8">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[#0f2645]"
              style={{
                background: "linear-gradient(135deg, #ffcd39 0%, #e2a10d 100%)",
              }}
            >
              <Phone size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[#0f2645]">Call Us Directly</p>
              <p className="mt-0.5 truncate text-sm text-[#0f2645]/70">
                {PHONE}
              </p>
            </div>
            <a
              href={PHONE_HREF}
              aria-label="Call us"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f2645] text-[#FAF9F6] transition duration-300 hover:bg-gradient-to-br hover:from-[#F5D77A] hover:to-[#B8902F] hover:text-[#0f2645]"
            >
              <ArrowRight size={16} />
            </a>
          </div>

          {/* 24/7 */}
          <div className="flex items-center gap-4 border-t border-[#0f2645]/10 p-6 sm:p-8 lg:justify-center lg:border-l lg:border-t-0">
            <p
              className={`${marcellus.className} text-5xl font-normal leading-none text-[#0f2645]`}
            >
              24/7
            </p>
            <p className="text-xs text-[#0f2645]/70">We’re Here to Help</p>
          </div>

          {/* Tagline */}
          <div className="flex items-center border-t border-[#0f2645]/10 bg-[#F3F0E8] p-6 sm:p-8 lg:justify-center lg:border-l lg:border-t-0">
            <p
              className={`${marcellus.className} text-2xl leading-tight text-[#0f2645]/70`}
            >
              Quick Replies,
              <br />
              Real Guidance
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
