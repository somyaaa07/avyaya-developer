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
  const [openIndex, setOpenIndex] = useState();

  const half = Math.ceil(faqs.length / 2);
  const columns = [
    faqs.slice(0, half).map((faq, i) => ({ faq, index: i })),
    faqs.slice(half).map((faq, i) => ({ faq, index: half + i })),
  ];

  return (
    <section className="relative overflow-hidden bg-[#faf9f6] py-16 sm:py-20 lg:py-24">
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
          {/* <div className="mb-5 flex items-center justify-center gap-3">
            <span
              className="h-px w-8 sm:w-12"
              style={{ background: "linear-gradient(90deg, transparent, #e2a10d)" }}
            />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#52685B] sm:text-xs">
              FAQ
            </span>
            <span
              className="h-px w-8 sm:w-12"
              style={{ background: "linear-gradient(90deg, #e2a10d, transparent)" }}
            />
          </div> */}

          <h2
            className={`${marcellus.className} text-[clamp(1.9rem,4vw,2.9rem)] leading-[1.15] tracking-tight text-[#1a2a22]`}
          >
            Frequently Asked Questions
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

          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[#52685B] sm:text-lg">
            Find quick answers to common questions about our projects, enquiries and services.
          </p>
        </motion.div>

        {/* Two independent columns so opening one item never stretches its neighbour */}
        <div className="mt-12 grid items-start gap-4 lg:grid-cols-2 lg:gap-6">
          {columns.map((col, c) => (
            <div key={c} className="flex min-w-0 flex-col gap-4 lg:gap-6">
              {col.map(({ faq, index }) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index % half) * 0.08, ease: "easeOut" }}
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
          ))}
        </div>
      </div>
    </section>
  );
}