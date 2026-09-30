"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Marcellus } from "next/font/google";
import { Users, Home, Award, Handshake } from "lucide-react";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const stats = [
  { icon: Users, value: "25+", label: "Happy Clients" },
  { icon: Home, value: "4.8k+", label: "Successful Matches", highlight: true },
  { icon: Award, value: "08+", label: "Years Experience" },
  { icon: Handshake, value: "40+", label: "Homes Closed" },
];

export default function PropertyGuidance() {
  return (
    <section className="w-full bg-[#faf9f6] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:px-10">
        {/* LEFT */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`${marcellus.className} text-[36px] leading-[1.1] text-[#1a2a22] sm:text-[46px] lg:text-[56px]`}
          >
            Property Guidance
            <br />
            You Can Trust
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 text-[16px] text-[#52685B] sm:text-[18px]"
          >
            Curated homes and clear advice for every move.
          </motion.p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                  className={`flex items-center gap-5 rounded-2xl px-6 py-7 ${
                    s.highlight ? "bg-[#f3f0E8]" : "bg-[#f3f0E8]"
                  }`}
                >
                  <Icon
                    size={34}
                    strokeWidth={1.4}
                    className="text-[#D4A62A]"
                  />
                  <div>
                    <p className="text-[30px] font-semibold leading-none text-[#1a2a22]">
                      {s.value}
                    </p>
                    <p
                      className={`mt-2 text-[15px] ${
                        s.highlight ? "text-[#1a2a22]" : "text-[#52685B]"
                      }`}
                    >
                      {s.label}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mx-auto h-[420px] w-full max-w-[620px] sm:h-[520px] lg:h-[560px]"
        >
          {/* Building */}
          <div className="absolute left-0 top-0 h-[82%] w-[64%] overflow-hidden rounded-2xl">
            <Image
              src="/building.png"
              alt="Modern residential building"
              fill
              sizes="(max-width: 1024px) 64vw, 400px"
              className="object-cover"
            />
          </div>

          {/* Family */}
          <div className="absolute bottom-0 right-0 h-[62%] w-[60%] overflow-hidden rounded-2xl border-4 border-[#faf9f6] bg-[#f3f0E8]">
            <Image
              src="/building1.png"
              alt="Modern residential building"
              fill
              sizes="(max-width: 1024px) 60vw, 375px"
              className="object-cover"
            />
          </div>

          {/* Tagline */}
          <div className="absolute right-0 top-[6%] hidden w-[16%] sm:block">
            <span className="block h-px w-full bg-[#D4A62A]/50" />
            <p
              className={`${marcellus.className} my-4 text-[20px] italic leading-[1.4] text-[#52685B] lg:text-[24px]`}
            >
              A<br />
              Place
              <br />
              to Call
              <br />
              Home
            </p>
            <span className="block h-px w-full bg-[#D4A62A]/50" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
