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
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
        isOpen
          ? "border-[#D4AF37]/50 bg-[#0f2645]"
          : "border-[#0f2645]/10 bg-[#f3f0E8] hover:border-[#D4AF37]/50"
      }`}
      style={{
        boxShadow: isOpen
          ? "0 28px 60px -28px rgba(15,38,69,0.6)"
          : "0 10px 30px -25px rgba(15,38,69,0.2)",
      }}
    >
      {/* Top gold hairline */}
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

      {/* Gold edge bar, grows on hover (closed state) */}
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-[3px] origin-top bg-gradient-to-b from-[#e2a10d] via-[#ffcd39] to-[#e2a10d] transition-transform duration-500 ${
          isOpen ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
        }`}
      />

      <h3>
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e2a10d] sm:px-7 sm:py-6"
        >
          <span className="flex min-w-0 items-center gap-4 sm:gap-5">
            <span
              className={`${marcellus.className} shrink-0 text-sm tracking-[0.15em] transition-colors duration-500 ${
                isOpen ? "text-[#ffcd39]" : "text-[#0f2645]/40"
              }`}
            >
              {number}
            </span>
            <span
              aria-hidden="true"
              className={`hidden h-6 w-px shrink-0 transition-colors duration-500 sm:block ${
                isOpen ? "bg-[#faf9f6]/20" : "bg-[#0f2645]/15"
              }`}
            />
            <span
              className={`${marcellus.className} text-lg leading-snug transition-colors duration-500 sm:text-[20px] ${
                isOpen ? "text-[#faf9f6]" : "text-[#0f2645]"
              }`}
            >
              {question}
            </span>
          </span>

          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            style={
              isOpen
                ? {
                    background: "linear-gradient(135deg, #ffcd39 0%, #e2a10d 100%)",
                    color: "#0f2645",
                    border: "1px solid transparent",
                  }
                : {
                    color: "#B8902F",
                    border: "1px solid rgba(226,161,13,0.55)",
                    background: "#faf9f6",
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
            <div className="mx-5 border-t border-[#faf9f6]/10 pb-7 pt-5 sm:mx-7">
              <p className="text-[15px] leading-[1.8] text-[#faf9f6]/75 sm:pl-[4.25rem]">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}