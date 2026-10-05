// FAQSection.jsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Marcellus } from "next/font/google";
import FAQItem from "./FAQItem";
import { faqs } from "@/data/faqData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="relative overflow-hidden bg-[#faf9f6] py-16 sm:py-20 lg:py-28">
      {/* Soft blue glow, top left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#0f2645]/[0.05] blur-3xl"
      />
      {/* Soft gold glow, bottom right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-[360px] w-[360px] rounded-full bg-[#e2a10d]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.4fr] lg:gap-20">
          {/* ===== Left: sticky heading ===== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="min-w-0 lg:sticky lg:top-28 lg:self-start"
          >
         

            <h2
              className={`${marcellus.className} text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.1] tracking-tight text-[#0f2645]`}
            >
              Frequently Asked Questions
            </h2>

            <span
              aria-hidden="true"
              className="mt-6 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]"
            />

            <p className="mt-6 max-w-sm border-l-2 border-[#D4AF37] pl-5 text-base leading-relaxed text-[#0f2645]/70 sm:text-lg">
              Find quick answers to common questions about our projects, enquiries and services.
            </p>
          </motion.div>

          {/* ===== Right: accordion list ===== */}
          <div className="flex min-w-0 flex-col gap-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 6) * 0.07, ease: "easeOut" }}
              >
                <FAQItem
                  id={`faq-${index}`}
                  number={String(index + 1).padStart(2, "0")}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}