"use client";

import { motion } from "framer-motion";
import { Marcellus } from "next/font/google";
import { BarChart3, Home, FileText, ShieldCheck } from "lucide-react";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const services = [
  {
    icon: BarChart3,
    title: "Smart Price Advice",
    desc: "Market-based guidance",
  },
  {
    icon: Home,
    title: "Verified Listings",
    desc: "Carefully reviewed homes",
  },
  {
    icon: FileText,
    title: "Simple Buying Process",
    desc: "Clear steps, less hassle",
  },
  {
    icon: ShieldCheck,
    title: "Home Protection",
    desc: "Support after closing",
  },
];

export default function HowWeHelp() {
  return (
    <section className="w-full bg-[#f3f0E8] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-10">
        {/* Heading */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`${marcellus.className} text-[34px] leading-tight text-[#1a2a22] sm:text-[42px] lg:text-[48px]`}
          >
            How We Help
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-3 text-[15px] text-[#52685B] sm:text-[16px]"
          >
            Straightforward support from search to move-in.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {services.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="rounded-2xl bg-[#faf9f6] px-7 pb-8 pt-9 shadow-[0_2px_18px_rgba(26,42,34,0.06)]"
              >
                <Icon size={38} strokeWidth={1.4} className="text-[#D4A62A]" />
                <h3 className="mt-8 text-[18px] font-semibold text-[#1a2a22]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[15px] text-[#52685B]">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}