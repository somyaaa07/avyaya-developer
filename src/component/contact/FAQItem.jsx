"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

export default function FAQItem({ id, question, answer, isOpen, onToggle }) {
  return (
    <div
      className={`rounded-2xl border bg-white transition-colors duration-300 ${
        isOpen ? "border-[#2e5d42] shadow-sm" : "border-[#dce5df]"
      }`}
    >
      <h3>
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={isOpen}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e5d42] sm:px-6 sm:py-5"
        >
          <span
            className={`text-base font-semibold sm:text-lg ${
              isOpen ? "text-[#2e5d42]" : "text-[#1b2b23]"
            }`}
          >
            {question}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25 }}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              isOpen ? "bg-[#2e5d42] text-white" : "bg-[#dce9e1] text-[#2e5d42]"
            }`}
          >
            <Plus size={18} aria-hidden="true" />
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-base leading-relaxed text-[#66736c] sm:px-6">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}