"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Marcellus } from "next/font/google";
import {
  BarChart3,
  Home,
  FileText,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

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
      <div className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-10">
        {/* Top: heading left, text + CTA right */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col gap-8 border-b border-[#0f2645]/15 pb-10 lg:flex-row lg:items-end lg:justify-between lg:pb-12"
        >
          <div>
            <h2
              id="how-we-help-title"
              className={`${marcellus.className} text-[34px] leading-tight text-[#0f2645] sm:text-[42px] lg:text-[52px]`}
            >
              How We Help
            </h2>
            <span
              aria-hidden="true"
              className="mt-5 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]"
            />
          </div>

          <div className="flex max-w-md flex-col items-start gap-6">
            <p className="text-[15px] leading-relaxed text-[#52685B] sm:text-base">
              Straightforward support from your first search to the day you move
              in.
            </p>

            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#0f2645] py-2.5 pl-6 pr-2.5 text-sm text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
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
          </div>
        </motion.div>

        {/* Bottom: 4-step horizontal journey */}
        <ul className="relative mt-12 grid gap-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4 lg:gap-0">
          {/* connecting line (desktop) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-[#D4AF37]/70 via-[#0f2645]/15 to-[#D4AF37]/70 lg:block"
          />

          {services.map(({ icon: Icon, title, desc }, i) => (
            <motion.li
              key={title}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
              className="group relative list-none lg:px-6 lg:first:pl-0 lg:last:pr-0"
            >
              {/* big faint step number */}
              <span
                aria-hidden="true"
                className={`${marcellus.className} pointer-events-none absolute right-0 top-0 text-[72px] leading-none text-[#0f2645]/[0.06] lg:right-6`}
              >
                0{i + 1}
              </span>

              {/* node on the line */}
              <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A] ring-8 ring-[#f3f0E8] transition duration-300 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-[#F5D77A] group-hover:to-[#B8902F] group-hover:text-[#1a2a22]">
                <Icon size={24} strokeWidth={1.4} aria-hidden="true" />
              </span>

              <h3
                className={`${marcellus.className} mt-7 text-[22px] leading-snug text-[#0f2645]`}
              >
                {title}
              </h3>

              <span
                aria-hidden="true"
                className="mt-4 block h-[2px] w-8 bg-[#D4AF37] transition-all duration-500 group-hover:w-16"
              />

              <p className="mt-4 text-[15px] leading-relaxed text-[#52685B]">
                {desc}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
