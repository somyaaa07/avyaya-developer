"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  return (
    <div className="fixed right-6 bottom-6 z-[9999] group">
      <span
        className="
          absolute right-16 top-1/2 -translate-y-1/2
          whitespace-nowrap
          bg-black text-white text-sm
          px-3 py-2 rounded-lg
          opacity-0 group-hover:opacity-100
          group-active:opacity-100
          transition-opacity duration-300
          pointer-events-none
        "
      >
        Chat With Us
      </span>

      <a
        href="https://wa.me/917004397655?text=Hi%20I%20am%20interested"
        target="_blank"
        rel="noopener noreferrer"
        className="
          w-14 h-14 rounded-full
          bg-[#25D366] text-white
          flex items-center justify-center
          shadow-lg hover:scale-110
          transition-all duration-300
        "
        aria-label="WhatsApp"
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  );
}
