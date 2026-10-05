"use client";
import { motion } from "framer-motion";
import { Marcellus } from "next/font/google";
import ContactMethods from "./ContactMethods";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export default function ContactIntro() {
  return (
    <section className="relative overflow-hidden bg-[#faf9f6] py-16 sm:py-24">
      {/* Soft blue glow, top right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full bg-[#0f2645]/[0.05] blur-3xl"
      />
      {/* Soft gold glow, bottom left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-[360px] w-[360px] rounded-full bg-[#e2a10d]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===== Header row ===== */}
        <div className="grid items-end gap-8 border-b border-[#0f2645]/15 pb-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            

            <h2
              className={`${marcellus.className} text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.08] tracking-tight text-[#0f2645]`}
            >
              We’re Here to Help
            </h2>
            <span
              aria-hidden="true"
              className="mt-6 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="max-w-md border-l-2 border-[#D4AF37] pl-5 text-base leading-relaxed text-[#0f2645]/70 sm:text-lg lg:justify-self-end"
          >
            Connect with our team through your preferred channel.
          </motion.p>
        </div>

        <div className="mt-12 sm:mt-14">
          <ContactMethods />
        </div>
      </div>
    </section>
  );
}