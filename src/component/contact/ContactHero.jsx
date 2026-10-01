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
    <span className="text-xs font-medium uppercase tracking-[0.3em] text-[#52685B]">
      {children}
    </span>
  </div>
);

const BtnDark = ({ href, children }) => (
  <a
    href={href}
    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-6 pr-2.5 text-sm font-medium text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:ring-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
  >
    {/* Golden fill */}
    <span
      aria-hidden="true"
      className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
    />

    {/* Shine */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
    />

    <span className="relative z-10">{children}</span>

    {/* Arrow */}
    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
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
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-2 lg:pb-32 lg:pt-16">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10"
        >
          <Eyebrow>Get in Touch</Eyebrow>

          <h1
            id="contact-hero"
            className={`${marcellus.className} mt-5 text-5xl font-normal leading-[1.05] text-[#1A2A22] sm:text-6xl lg:text-[64px]`}
          >
            Let’s Start a Conversation
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#52685B]">
            Have a question, project idea, or need expert guidance? Our team is
            here to help you with the right information and support. Reach out
            and we’ll get back to you with the right guidance.
          </p>

          <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <BtnDark href="#enquiry-form">Send an Enquiry</BtnDark>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center justify-center rounded-full border border-[#52685B]/40 px-7 py-3.5 text-sm font-medium text-[#1A2A22] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#F3F0E8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              Call Us
            </a>
          </div>

          <div className="mt-8 flex items-center gap-8">
            <div>
              <p
                className={`${marcellus.className} text-5xl font-normal text-[#1A2A22]`}
              >
                24/7
              </p>
              <p className="text-xs text-[#52685B]">We’re Here to Help</p>
            </div>
            <span className="hidden h-14 w-px bg-[#52685B]/25 sm:block" />
            <p
              className={`${marcellus.className} text-2xl leading-tight text-[#52685B]`}
            >
              Quick Replies,
              <br />
              Real Guidance
            </p>
          </div>
        </motion.div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-3xl lg:rounded-tl-[220px] lg:rounded-br-[80px]">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Floating call card */}
          <div className="absolute -bottom-8 left-4 right-4 flex items-center gap-4 rounded-2xl bg-[#FAF9F6] p-3 shadow-[0_20px_50px_rgba(26,42,34,0.15)] sm:left-0 sm:right-auto sm:w-[340px] lg:-left-10">
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-[#1A2A22]"
              style={{
                background: "linear-gradient(135deg, #ffcd39 0%, #e2a10d 100%)",
              }}
            >
              <Phone size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[#1A2A22]">Call Us Directly</p>
              <p className="truncate text-sm text-[#52685B]">{PHONE}</p>
            </div>
            <a
              href={PHONE_HREF}
              aria-label="Call us"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1A2A22] text-[#FAF9F6] transition hover:bg-[#52685B]"
            >
              <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
