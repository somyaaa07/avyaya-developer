"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function FaqAccordion({ items, faqs }) {
  const list = items || faqs || [];
  const [open, setOpen] = useState();

  return (
    <ul className="mt-6 space-y-3">
      {list.map((item, i) => {
        const isOpen = open === i;
        return (
          <li
            key={item.q}
            className="rounded-xl bg-white shadow-[0_4px_20px_rgba(31,77,54,0.06)]"
          >
            <h3>
              <button
                type="button"
                id={`faq-btn-${i}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-left text-[15px] font-semibold text-[#1b2b22] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f4d36]"
              >
                {item.q}
                <Plus
                  size={18}
                  className={`shrink-0 transition-transform duration-300 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              aria-labelledby={`faq-btn-${i}`}
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-[#55635b]">
                  {item.a}
                </p>
              </div>
          
            </div>
          </li>
        );
      })}
    </ul>


  );
}