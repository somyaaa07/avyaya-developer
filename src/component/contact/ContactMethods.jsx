"use client";
import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { contactMethods } from "@/data/contactData";

const icons = { Phone, Mail, MessageCircle, MapPin };

export default function ContactMethods() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {contactMethods.map((m, i) => {
        const Icon = icons[m.icon];
        return (
          <motion.a
            key={m.id}
            href={m.href}
            {...(m.external && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="group flex min-w-0 flex-col rounded-2xl border border-[#dce5df] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#2e5d42] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e5d42]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dce9e1] text-[#2e5d42] transition group-hover:bg-[#2e5d42] group-hover:text-white">
              <Icon size={20} aria-hidden="true" />
            </span>
            <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#2e5d42]">
              {m.label}
            </span>
            <span className="mt-1 break-words text-base font-semibold text-[#1b2b23]">
              {m.value}
            </span>
            <span className="mt-1 text-sm text-[#66736c]">{m.note}</span>
          </motion.a>
        );
      })}
    </div>
  );
}
