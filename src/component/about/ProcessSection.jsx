"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  KeyRound,
  Phone,
  ShieldCheck,
} from "lucide-react";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]";

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us what you need",
    text: "Share your budget, preferred area and whether it is a home or an investment. A short call is enough.",
  },
  {
    icon: ShieldCheck,
    title: "Get verified options",
    text: "We shortlist only RERA registered projects that match your brief and share the registration details up front.",
  },
  {
    icon: CalendarCheck,
    title: "Visit with us",
    text: "We arrange a guided site visit at a time that suits you, so you can compare in person.",
  },
  {
    icon: KeyRound,
    title: "Book and move in",
    text: "We help with home loan options, paperwork and handover support until you receive the keys.",
  },
];

const Label = ({ children, light = false }) => (
  <p className={`flex items-center gap-3 text-sm ${light ? "text-[#F5D77A]" : "text-[#52685B]"}`}>
    <span className={`h-px w-8 ${light ? "bg-[#F5D77A]/60" : "bg-[#D4A62A]"}`} aria-hidden="true" />
    {children}
  </p>
);

export default function ProcessSection({ phoneTel }) {
  const reduce = useReducedMotion();

  return (
    <section
      id="process"
      aria-labelledby="process-title"
      className="scroll-mt-32 bg-[#0f2645] text-[#FAF9F6]"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16 lg:py-28">
        {/* LEFT: sticky heading */}
        <div className="lg:sticky lg:top-40 lg:self-start">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Label light>How we work</Label>

            <h2 id="process-title" className="mt-5 text-4xl leading-tight sm:text-5xl">
              From first call to your keys
            </h2>

            <p className="mt-4 max-w-sm text-base leading-relaxed text-[#FAF9F6]/80">
              Four clear steps, one dedicated team. You always know what happens next.
            </p>

            <div className="mt-8">
              <a
                href={`tel:${phoneTel}`}
                className={`group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] py-2.5 pl-6 pr-2.5 text-sm text-[#1A2A22] transition-all duration-500 hover:shadow-[0_10px_30px_rgba(212,175,55,0.45)] ${focusRing}`}
              >
                Start with a call
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A] transition-transform duration-500 group-hover:-rotate-45">
                  <Phone size={14} />
                </span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: timeline */}
        <ol className="relative space-y-6">
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-6 top-6 w-px bg-[#F5D77A]/30"
          />

          {steps.map(({ icon: Icon, title, text }, i) => (
            <motion.li
              key={title}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: reduce ? 0 : i * 0.08,
                ease: "easeOut",
              }}
              className="relative flex gap-5"
            >
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] shadow-lg">
                <Icon size={20} strokeWidth={1.6} />
              </span>

              <div className="flex-1 rounded-2xl bg-[#FAF9F6]/[0.07] p-6 transition-colors duration-300 hover:bg-[#FAF9F6]/[0.10]">
                <p className="text-xs font-medium uppercase tracking-wider text-[#F5D77A]">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 text-xl font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#FAF9F6]/80">{text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}