// FAQItem.jsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Marcellus } from "next/font/google";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function FAQItem({ id, number, question, answer, isOpen, onToggle }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-all duration-500 ${
        isOpen
          ? "border-[#e2a10d]/70 bg-[#faf9f6]"
          : "border-[#e8e3d3] bg-[#f3f0E8] hover:border-[#e2a10d]/50"
      }`}
      style={{
        boxShadow: isOpen
          ? "0 24px 50px -30px rgba(26,42,34,0.35)"
          : "0 10px 30px -25px rgba(26,42,34,0.2)",
      }}
    >
      {/* Top gold hairline: #e2a10d sides, #ffcd39 center */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-[2px] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "linear-gradient(90deg, rgba(226,161,13,0) 0%, #e2a10d 25%, #ffcd39 50%, #e2a10d 75%, rgba(226,161,13,0) 100%)",
        }}
      />

      <h3>
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full items-start justify-between gap-4 rounded-2xl px-5 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e2a10d] sm:px-6"
        >
          <span className="flex min-w-0 items-start gap-4">
            <span
              className={`${marcellus.className} mt-0.5 shrink-0 text-sm tracking-[0.15em] ${
                isOpen ? "text-[#e2a10d]" : "text-[#52685B]/70"
              }`}
            >
              {number}
            </span>
            <span
              className={`${marcellus.className} text-lg leading-snug text-[#1a2a22] sm:text-[19px]`}
            >
              {question}
            </span>
          </span>

          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#e2a10d]"
            style={
              isOpen
                ? {
                    background: "linear-gradient(135deg, #ffcd39 0%, #e2a10d 100%)",
                    color: "#1a2a22",
                    border: "1px solid transparent",
                  }
                : {
                    border: "1px solid rgba(226,161,13,0.55)",
                    background: "rgba(255,205,57,0.08)",
                  }
            }
          >
            <Plus size={17} strokeWidth={1.8} aria-hidden="true" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mx-5 border-t border-[#1a2a22]/10 pb-6 pt-4 sm:mx-6">
              <p className="pl-0 text-[15px] leading-relaxed text-[#52685B] sm:pl-9">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}