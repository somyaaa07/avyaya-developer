"use client";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/data/contactData";

export default function WhatsAppCTA() {
  return (
    <section className="bg-[#173d2a] py-14 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
            <MessageCircle size={24} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold text-white">
              Prefer a quick conversation?
            </h2>
            <p className="mt-1 text-base text-white/80">
              Chat with our team directly on WhatsApp.
            </p>
          </div>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#173d2a] transition hover:scale-[1.02] hover:bg-[#dce9e1] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#173d2a] md:w-auto"
        >
          <MessageCircle size={18} aria-hidden="true" />
          Chat on WhatsApp
        </a>
      </motion.div>
    </section>
  );
}