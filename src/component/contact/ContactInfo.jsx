"use client";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { Marcellus } from "next/font/google";
import { PHONE, PHONE_HREF, EMAIL, workingHours } from "@/data/contactData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const items = [
  { icon: Phone, label: "Phone", value: PHONE, href: PHONE_HREF },
  { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { icon: Clock, label: "Working Hours", value: workingHours },
  { icon: MapPin, label: "Location", value: "Noida, Uttar Pradesh" },
];

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative min-w-0 overflow-hidden rounded-3xl p-7 sm:p-10"
      style={{
        background: "#1a2a22",
        boxShadow: "0 30px 60px -30px rgba(26,42,34,0.55)",
      }}
    >
      {/* Top gold hairline: #e2a10d sides, #ffcd39 center */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(226,161,13,0) 0%, #e2a10d 25%, #ffcd39 50%, #e2a10d 75%, rgba(226,161,13,0) 100%)",
        }}
      />

      {/* Soft glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,205,57,0.12) 0%, rgba(255,205,57,0) 70%)",
        }}
      />

      <div className="relative">
        {/* Eyebrow */}
        <div className="flex items-center gap-3">
          <span
            className="h-px w-10"
            style={{
              background: "linear-gradient(90deg, #e2a10d, #ffcd39)",
            }}
          />
          <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#ffcd39] sm:text-xs">
            Contact Us
          </span>
        </div>

        <h2
          className={`${marcellus.className} mt-5 text-[clamp(1.85rem,3.6vw,2.7rem)] leading-[1.15] tracking-tight text-[#faf9f6]`}
        >
          Let’s Discuss Your Requirements
        </h2>

        <p className="mt-4 max-w-md text-base leading-relaxed text-[#f3f0E8]/70">
          Call us, send an email, or fill out the enquiry form and our team will
          get back to you with the right guidance.
        </p>

        <ul className="mt-9">
          {items.map(({ icon: Icon, label, value, href }, i) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
              className="group flex items-center gap-5 py-5"
              style={{
                borderTop:
                  i === 0 ? "none" : "1px solid rgba(243,240,232,0.1)",
              }}
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[#ffcd39] transition-all duration-300 group-hover:text-[#1a2a22]"
                style={{
                  border: "1px solid rgba(226,161,13,0.55)",
                  background: "rgba(255,205,57,0.06)",
                }}
              >
                <Icon size={19} strokeWidth={1.6} aria-hidden="true" />
              </span>

              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#e2a10d]">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    className="mt-1 block break-words text-base font-medium text-[#faf9f6] transition-colors duration-300 hover:text-[#ffcd39] focus:outline-none focus-visible:underline sm:text-[17px]"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 text-base font-medium text-[#faf9f6] sm:text-[17px]">
                    {value}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}