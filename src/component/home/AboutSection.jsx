"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Marcellus } from "next/font/google";
import {
  FiArrowRight,
  FiAward,
  FiCheck,
  FiHome,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const serif = `${marcellus.className} font-normal`;

/* ---------------- DATA ---------------- */
const ABOUT_IMAGE = {
  src: "/banner/about.jpeg",
  alt: "Luxury living room with floor-to-ceiling windows",
};

const points = [
  "Wide range of residential & commercial properties",
  "Expert market insights and personalized guidance",
  "Transparent process with verified listings",
  "Dedicated support from search to settlement",
];

// "Years of Experience" image badge me hai, isliye yahan 3 stats
const stats = [
  { icon: FiHome, value: "200+", label: "Properties Listed" },
  { icon: FiUsers, value: "600+", label: "Happy Clients" },
  { icon: FiMapPin, value: "10+", label: "Cities Covered" },
];

const goldBg = "bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";

/* ---------------- BUTTON (same as About / Home hero) ---------------- */
const BtnDark = ({ href, children }) => (
  <Link
    href={href}
    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#0f2645] py-2.5 pl-6 pr-2.5 text-sm font-normal text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
  >
    <span
      aria-hidden="true"
      className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
    />
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
    />
    <span className="relative z-10">{children}</span>
    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
      <FiArrowRight
        size={14}
        className="transition-transform duration-500 group-hover:-rotate-45"
        aria-hidden="true"
      />
    </span>
  </Link>
);

/* ---------------- COMPONENT ---------------- */
export default function AboutSection() {
  const reduce = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.7, delay, ease: "easeOut" },
  });

  return (
    <section
      className="relative overflow-hidden bg-[#faf9f6] py-16 sm:py-20 lg:py-28"
      aria-labelledby="about-heading"
    >
      {/* soft beige wash on the right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.92fr] lg:gap-20">
          {/* ===== Text side ===== */}
          <motion.div {...reveal()} className="min-w-0">
            <h2
              id="about-heading"
              className={`${serif} text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.08] tracking-tight text-[#0f2645]`}
            >
              Your Trusted Real Estate Partner
            </h2>
            <span
              aria-hidden="true"
              className={`mt-6 block h-[3px] w-16 rounded-full ${goldBg}`}
            />

            <p className="mt-7 max-w-xl text-base leading-[1.8] text-[#52685B]">
              At avyaya developer, we create and present thoughtfully planned residential, commercial, and investment opportunities in promising locations. With a focus on quality, transparency, and long-term value, we help our customers make confident property decisions and build a better future.
            </p>

            {/* points: 2 x 2 grid */}
            <ul className="mt-10 grid gap-x-8 sm:grid-cols-2">
              {points.map((point, i) => (
                <motion.li
                  key={point}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.55,
                    delay: 0.15 + i * 0.08,
                    ease: "easeOut",
                  }}
                  className="group relative border-t border-[#0f2645]/15 py-5 pr-2"
                >
                  {/* gold line grows on hover */}
                  <span
                    aria-hidden="true"
                    className={`absolute -top-px left-0 h-px w-0 transition-all duration-500 group-hover:w-full ${goldBg}`}
                  />
                  <div className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A] transition-transform duration-300 group-hover:scale-110">
                      <FiCheck size={12} strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-[15px] leading-snug text-[#1a2a22]">
                      {point}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8">
              <BtnDark href="/about">Learn More About Us</BtnDark>
            </div>
          </motion.div>

          {/* ===== Image side ===== */}
          <motion.div
            {...reveal(0.12)}
            className="relative mx-auto w-full max-w-[520px] min-w-0 lg:max-w-none"
          >
            {/* navy offset block */}
            <span
              aria-hidden="true"
              className="absolute -right-4 -top-4 h-[88%] w-[88%] rounded-[28px] bg-[#0f2645] sm:-right-6 sm:-top-6"
            />
            {/* gold hairline offset */}
            <span
              aria-hidden="true"
              className="absolute -bottom-4 -left-4 hidden h-[60%] w-[60%] rounded-[28px] border border-[#D4AF37]/60 sm:block"
            />

            <div className="group relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[#f3f0E8] shadow-[0_35px_70px_-30px_rgba(15,38,69,0.6)]">
              <img
                src={ABOUT_IMAGE.src}
                alt={ABOUT_IMAGE.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2645]/40 via-transparent to-transparent" />
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-6 left-4 flex items-center gap-4 rounded-2xl bg-[#faf9f6] px-5 py-4 shadow-[0_24px_50px_-20px_rgba(15,38,69,0.55)] ring-1 ring-[#D4AF37]/40 sm:-left-8 sm:px-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A]">
                <FiAward size={22} aria-hidden="true" />
              </span>
              <div>
                <p className={`${serif} text-3xl leading-none text-[#0f2645]`}>5+</p>
                <p className="mt-1.5 text-xs text-[#52685B]">Years of Experience</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== Stats ===== */}
        <motion.dl
          {...reveal()}
          className="relative mt-24 grid grid-cols-1 border-y border-[#0f2645]/15 sm:grid-cols-3 lg:mt-28"
        >
          <span
            aria-hidden="true"
            className={`absolute -top-px left-0 h-px w-1/3 ${goldBg}`}
          />
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div
              key={label}
              className={`group flex items-center gap-5 px-2 py-8 sm:justify-center sm:px-6 sm:py-10 ${
                i !== 0
                  ? "border-t border-[#0f2645]/15 sm:border-l sm:border-t-0"
                  : ""
              }`}
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/50 text-[#B8902F] transition-all duration-500 group-hover:border-transparent group-hover:bg-[#0f2645] group-hover:text-[#F5D77A]">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div>
                <dd
                  className={`${serif} text-4xl leading-none text-[#0f2645] sm:text-[46px]`}
                >
                  {value}
                </dd>
                <dt className="mt-2 text-sm text-[#52685B]">{label}</dt>
              </div>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}