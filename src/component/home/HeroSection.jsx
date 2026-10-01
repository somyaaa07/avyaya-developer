"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Marcellus } from "next/font/google";
import {
  FiArrowRight,
  FiMapPin,
  FiHome,
  FiSearch,
  FiTag,
} from "react-icons/fi";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const HERO_IMAGE = {
  src: "/banner/home-banner.png",
  alt: "Premium residential towers in Greater Noida",
};

const stats = [
  { value: "10+", label: "Years of Experience" },
  { value: "50+", label: "Projects Delivered" },
  { value: "1000+", label: "Happy Families" },
];

const locations = ["Noida", "Greater Noida", "Ghaziabad", "Delhi"];
const propertyTypes = ["Residential", "Commercial", "Plots / Land"];
const budgets = [
  "Under ₹50 Lac",
  "₹50 Lac – ₹1 Cr",
  "₹1 Cr – ₹2 Cr",
  "Above ₹2 Cr",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: 0.1 + i * 0.12, ease: "easeOut" },
  }),
};

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.2, duration: 0.7, ease: "easeOut" },
  }),
};

// Gold gradient: #E2A10D on left & right edges, #FFCD39 in the center
const goldBg = "bg-gradient-to-r from-[#E2A10D] via-[#FFCD39] to-[#E2A10D]";
const goldText = `${goldBg} bg-clip-text text-transparent`;

const fieldClass =
  "w-full appearance-none rounded-xl border border-[#1a2a22]/15 bg-[#faf9f6] py-3 pl-10 pr-4 text-sm text-[#1a2a22] transition focus:border-[#E2A10D] focus:outline-none focus:ring-2 focus:ring-[#FFCD39]/40";
const labelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#52685B]";
const iconClass =
  "pointer-events-none absolute bottom-3.5 left-3.5 text-[#52685B]";

/* ---------------------------------------------------------------
   BUTTON — About page wala BtnDark (same look + hover animation)
---------------------------------------------------------------- */
const BtnDark = ({ href, children }) => (
  <Link
    href={href}
    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-6 pr-2.5 text-sm font-normal text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
  >
    {/* Golden fill slides in from left */}
    <span
      aria-hidden="true"
      className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
    />

    {/* Glass shine sweep */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
    />

    <span className="relative z-10">{children}</span>

    {/* Arrow circle */}
    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
      <FiArrowRight
        size={14}
        className="transition-transform duration-500 group-hover:-rotate-45"
        aria-hidden="true"
      />
    </span>
  </Link>
);

export default function HomeHero() {
  return (
    <section className="relative bg-[#faf9f6] pb-12 sm:pb-16">
      {/* ================= HERO ================= */}
      <div className="relative min-h-[640px] overflow-hidden bg-[#1a2a22] lg:min-h-[760px]">
        {/* Background image */}
        <motion.img
          src={HERO_IMAGE.src}
          alt={HERO_IMAGE.alt}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full object-cover object-right"
        />

        {/* Mobile/tablet: even overlay for readability */}
        <div className="absolute inset-0 bg-[#1a2a22]/75 lg:hidden" />
        {/* Desktop: dark on the LEFT (text side), image clear on the RIGHT */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-[#1a2a22] via-[#1a2a22]/75 to-transparent lg:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a22]/60 via-transparent to-transparent" />

        {/* TEXT — left side, right side stays empty */}
        <div className="relative mx-auto -mt-12 flex w-full max-w-7xl items-center px-4 pb-44 pt-32 sm:px-6 lg:min-h-[760px] lg:px-8 lg:pb-48 lg:pt-36">
          <div className="max-w-2xl">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              className="flex items-center gap-3"
            >
              <span className={`h-px w-10 ${goldBg}`} aria-hidden="true" />
              <span
                className={`text-xs font-semibold uppercase tracking-[0.28em] ${goldText}`}
              >
                Trusted Bringo Real Estate · Greater Noida
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className={`${marcellus.className} mt-6 text-[clamp(2.4rem,5.5vw,4.5rem)] font-normal leading-[1.06] tracking-tight text-[#faf9f6]`}
            >
              Find a Place You’ll Be{" "}
              <span className={` pr-1 ${goldText}`}>Proud</span> to Call
              Home
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-6 max-w-xl text-base leading-relaxed text-[#faf9f6]/80 sm:text-lg"
            >
              Premium residential, commercial and plotting opportunities backed
              by transparent guidance and long-term value.
            </motion.p>

            {/* Buttons — About page jaisa BtnDark */}
            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={2}
              >
                <BtnDark href="/properties">Explore Properties</BtnDark>
              </motion.div>

              <motion.div
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={3}
              >
                <BtnDark href="/contact">Talk to an Expert</BtnDark>
              </motion.div>
            </div>

            <motion.dl
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-12 grid max-w-lg grid-cols-3 divide-x divide-[#faf9f6]/20"
            >
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={i === 0 ? "pr-4 sm:pr-6" : "px-4 sm:px-6"}
                >
                  <dd
                    className={`${marcellus.className} inline-block text-2xl font-normal sm:text-3xl ${goldText}`}
                  >
                    {s.value}
                  </dd>
                  <dt className="mt-1 text-[11px] leading-snug text-[#faf9f6]/65 sm:text-sm">
                    {s.label}
                  </dt>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>
      </div>

      {/* ================= SEARCH CARD ================= */}
      <motion.form
        variants={fadeUp}
        initial="hidden"
        animate="show"
        custom={6}
        action="/properties"
        method="GET"
        role="search"
        aria-label="Search properties"
        className="relative z-20 mx-4 -mt-24 grid max-w-6xl gap-4 overflow-hidden rounded-2xl border border-[#1a2a22]/10 bg-[#f3f0E8] p-5 shadow-[0_25px_60px_-25px_rgba(26,42,34,0.5)] sm:mx-6 sm:grid-cols-2 sm:p-6 lg:mx-auto lg:-mt-20 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
      >
        {/* Gold gradient top accent */}
        <span
          className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`}
          aria-hidden="true"
        />

        <div className="relative">
          <label htmlFor="hero-location" className={labelClass}>
            Location
          </label>
          <FiMapPin className={iconClass} aria-hidden="true" />
          <select
            id="hero-location"
            name="location"
            defaultValue=""
            className={fieldClass}
          >
            <option value="">All Locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <label htmlFor="hero-type" className={labelClass}>
            Property Type
          </label>
          <FiHome className={iconClass} aria-hidden="true" />
          <select
            id="hero-type"
            name="type"
            defaultValue=""
            className={fieldClass}
          >
            <option value="">All Types</option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <label htmlFor="hero-budget" className={labelClass}>
            Budget
          </label>
          <FiTag className={iconClass} aria-hidden="true" />
          <select
            id="hero-budget"
            name="budget"
            defaultValue=""
            className={fieldClass}
          >
            <option value="">Any Budget</option>
            {budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#1a2a22] px-8 text-sm font-semibold text-[#faf9f6] transition hover:bg-gradient-to-r hover:from-[#E2A10D] hover:via-[#FFCD39] hover:to-[#E2A10D] hover:text-[#1a2a22] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFCD39] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f0E8] sm:col-span-2 lg:col-span-1 lg:w-auto"
        >
          <FiSearch aria-hidden="true" />
          Search
        </button>
      </motion.form>
    </section>
  );
}