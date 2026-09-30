"use client";
import { motion } from "framer-motion";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { PHONE, PHONE_HREF, EMAIL, workingHours } from "@/data/contactData";

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
      transition={{ duration: 0.55 }}
      className="min-w-0"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#2e5d42]">
        Contact Us
      </span>
      <h2 className="mt-3 text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight text-[#1b2b23]">
        Let’s Discuss Your Requirements
      </h2>
      <p className="mt-4 max-w-lg text-base leading-relaxed text-[#66736c]">
        Call us, send an email, or fill out the enquiry form and our team will
        get back to you with the right guidance.
      </p>

      <ul className="mt-8 space-y-5">
        {items.map(({ icon: Icon, label, value, href }) => (
          <li key={label} className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#dce9e1] text-[#2e5d42]">
              <Icon size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#66736c]">{label}</p>
              {href ? (
                <a
                  href={href}
                  className="break-words text-base font-semibold text-[#1b2b23] transition hover:text-[#2e5d42] focus:outline-none focus-visible:underline"
                >
                  {value}
                </a>
              ) : (
                <p className="text-base font-semibold text-[#1b2b23]">{value}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}