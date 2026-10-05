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
  { icon: Users, value: "200+", label: "Happy Clients" },
  { icon: Home, value: "5.8k+", label: "Successful Matches", highlight: true },
  { icon: Award, value: "5+", label: "Years Experience" },
  { icon: Handshake, value: "40+", label: "Homes Closed" },
];

export default function PropertyGuidance() {
  return (
    <section className="relative w-full overflow-hidden bg-[#faf9f6] py-14 sm:py-20 lg:py-28">
      {/* Large soft backdrop panel behind the right side */}
      {/* <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[42%] bg-[#f3f0E8] lg:block" /> */}

      <div className="relative mx-auto grid max-w-[1300px] grid-cols-1 items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-10">
        {/* LEFT */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="block h-px w-12 bg-[#D4A62A]" />
            <span className="block h-1.5 w-1.5 rotate-45 bg-[#D4A62A]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`${marcellus.className} text-[36px] leading-[1.1] text-[#0f2645] sm:text-[46px] lg:text-[56px]`}
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
            className="mt-5 border-l-2 border-[#D4A62A] pl-4 text-[16px] text-[#52685B] sm:text-[18px]"
          >
            Curated homes and clear advice for every move.
          </motion.p>

          {/* Stats: editorial grid with hairline dividers */}
          <div className="mt-12 grid grid-cols-1 border-t border-[#0f2645]/15 sm:grid-cols-2">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                  className={`group relative flex flex-col gap-6 border-b border-[#0f2645]/15 px-2 py-8 transition-colors duration-500 sm:px-6 ${
                    i % 2 === 0 ? "sm:border-r" : ""
                  } ${
                    s.highlight
                      ? "bg-[#0f2645] sm:-my-px sm:border-[#0f2645]"
                      : "hover:bg-[#f3f0E8]"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <Icon
                      size={30}
                      strokeWidth={1.3}
                      className="text-[#D4A62A]"
                    />
                    <span
                      className={`${marcellus.className} text-[13px] tracking-widest ${
                        s.highlight ? "text-[#D4A62A]" : "text-[#0f2645]/30"
                      }`}
                    >
                      0{i + 1}
                    </span>
                  </div>

                  <div>
                    <p
                      className={`${marcellus.className} text-[40px] font-semibold leading-none sm:text-[44px] ${
                        s.highlight ? "text-[#faf9f6]" : "text-[#0f2645]"
                      }`}
                    >
                      {s.value}
                    </p>
                    <p
                      className={`mt-3 text-[15px] ${
                        s.highlight ? "text-[#faf9f6]" : "text-[#52685B]"
                      }`}
                    >
                      {s.label}
                    </p>
                  </div>

                  {/* Gold underline that grows on hover */}
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#D4A62A] transition-all duration-500 group-hover:w-full" />
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
          className="relative mx-auto h-[440px] w-full max-w-[620px] sm:h-[540px] lg:h-[580px]"
        >
          {/* Outline arch behind main image */}
          <div className="pointer-events-none absolute left-4 top-4 h-[86%] w-[62%] rounded-t-[999px] rounded-b-md border border-[#D4A62A]/60" />

          {/* Building: arch */}
          <div className="absolute left-0 top-0 h-[86%] w-[62%] overflow-hidden rounded-t-[999px] rounded-b-md">
            <Image
              src="/building.png"
              alt="Modern residential building"
              fill
              sizes="(max-width: 1024px) 62vw, 390px"
              className="object-cover"
            />
          </div>

          {/* Family: offset block with cut corner */}
          <div className="absolute bottom-0 right-0 h-[52%] w-[50%] overflow-hidden rounded-tl-[90px] rounded-br-md border-[6px] border-[#faf9f6] bg-[#f3f0E8]">
            <Image
              src="/building1.png"
              alt="Modern residential building"
              fill
              sizes="(max-width: 1024px) 50vw, 310px"
              className="object-cover"
            />
          </div>

          {/* Tagline */}
          <div className="absolute right-0 top-[4%] hidden w-[30%] pl-6 sm:block">
            <span className="block h-px w-12 bg-[#D4A62A]" />
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
            <span className="block h-px w-12 bg-[#D4A62A]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
