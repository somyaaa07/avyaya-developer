"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import FAQItem from "./FAQItem";
import { faqs } from "@/data/faqData";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#f0f4f1] py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-tight text-[#1b2b23]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-[#66736c]">
            Find quick answers to common questions about our projects, enquiries and services.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 max-w-[900px] space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={faq.question}
              id={`faq-${i}`}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}