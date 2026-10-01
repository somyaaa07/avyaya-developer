"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Marcellus } from "next/font/google";
import { BarChart3, Home, FileText, ShieldCheck, ArrowRight } from "lucide-react";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const services = [
  {
    icon: BarChart3,
    title: "Smart Price Advice",
    desc: "Know what a property is really worth with guidance based on current market rates.",
  },
  {
    icon: Home,
    title: "Verified Listings",
    desc: "Every home is carefully reviewed before it reaches you, so you only see real options.",
  },
  {
    icon: FileText,
    title: "Simple Buying Process",
    desc: "Clear steps and handled paperwork, so there is less hassle from visit to booking.",
  },
  {
    icon: ShieldCheck,
    title: "Home Protection",
    desc: "We stay available after closing for handover, documents and any follow-up questions.",
  },
];

export default function HowWeHelp() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-labelledby="how-we-help-title"
      className="w-full bg-[#f3f0E8] py-14 sm:py-16 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1300px] gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.7fr] lg:gap-16 lg:px-10">
        {/* Left: heading + CTA */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <h2
            id="how-we-help-title"
            className={`${marcellus.className} text-[34px] leading-tight text-[#1a2a22] sm:text-[42px] lg:text-[48px]`}
          >
            How We Help
          </h2>
          <span
            aria-hidden="true"
            className="mt-5 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]"
          />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#52685B] sm:text-base">
            Straightforward support from your first search to the day you move in.
          </p>

          <Link
            href="/contact"
            className="group relative mt-8 inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-6 pr-2.5 text-sm text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
            />
            <span className="relative z-10">Talk to an Expert</span>
            <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
              <ArrowRight
                size={14}
                className="transition-transform duration-500 group-hover:-rotate-45"
                aria-hidden="true"
              />
            </span>
          </Link>
        </motion.div>

        {/* Right: 2x2 cards */}
        <ul className="grid gap-5 sm:grid-cols-2">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <motion.li
              key={title}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              className="group relative list-none overflow-hidden rounded-[22px] border border-[#1a2a22]/10 bg-[#faf9f6] p-7 transition duration-300 hover:border-[#D4AF37]/60 hover:shadow-[0_18px_40px_-18px_rgba(26,42,34,0.35)] sm:p-8"
            >
              {/* gold top accent, appears on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D] transition-transform duration-500 group-hover:scale-x-100"
              />

              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a2a22] text-[#F5D77A] transition duration-300 group-hover:bg-gradient-to-br group-hover:from-[#F5D77A] group-hover:to-[#B8902F] group-hover:text-[#1a2a22]">
                <Icon size={26} strokeWidth={1.4} aria-hidden="true" />
              </span>

              <h3
                className={`${marcellus.className} mt-6 text-[22px] leading-snug text-[#1a2a22]`}
              >
                {title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[#52685B]">
                {desc}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}