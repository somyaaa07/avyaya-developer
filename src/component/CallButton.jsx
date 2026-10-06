"use client";

import { FaPhoneAlt } from "react-icons/fa";

export default function CallButton() {
  return (
    <div className="fixed left-6 bottom-6 z-[9999] group">
      <span
        className="
          absolute left-16 top-1/2 -translate-y-1/2
          whitespace-nowrap
          bg-black text-white text-sm
          px-3 py-2 rounded-lg
          opacity-0 group-hover:opacity-100
          group-active:opacity-100
          transition-opacity duration-300
          pointer-events-none
        "
      >
        Call Now
      </span>

      <a
        href="tel:+917004397655"
        className="
          w-14 h-14 rounded-full
          bg-[#C8972B] text-white
          flex items-center justify-center
          shadow-lg hover:scale-110
          transition-all duration-300
        "
        aria-label="Call Now"
      >
        <FaPhoneAlt size={22} />
      </a>
    </div>
  );
}
