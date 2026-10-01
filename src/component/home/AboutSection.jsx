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
  src: "/banner/about.png",
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
  { icon: FiHome, value: "500+", label: "Properties Listed" },
  { icon: FiUsers, value: "300+", label: "Happy Clients" },
  { icon: FiMapPin, value: "10+", label: "Cities Covered" },
];

const goldBg = "bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";

/* ---------------- BUTTON (same as About / Home hero) ---------------- */
const BtnDark = ({ href, children }) => (
  <Link
    href={href}
    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-6 pr-2.5 text-sm font-normal text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
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
    transition: { duration: 0.65, delay, ease: "easeOut" },
  });

  return (
    <section
      className="relative overflow-hidden bg-[#faf9f6] py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* ===== Image side ===== */}
          <motion.div {...reveal()} className="relative order-2 min-w-0 lg:order-1">
            {/* offset gold frame */}
            <span
              aria-hidden="true"
              className="absolute -left-3 -top-3 hidden h-full w-full rounded-t-[220px] rounded-b-3xl border border-[#D4AF37]/50 lg:block"
            />
            <div className="relative aspect-[4/4.4] overflow-hidden rounded-3xl bg-[#f3f0E8] shadow-[0_25px_60px_-30px_rgba(26,42,34,0.5)] lg:rounded-b-3xl lg:rounded-t-[220px]">
              <img
                src="https://i.pinimg.com/736x/df/4f/3c/df4f3cff511a1ba9edb0de5023b8f683.jpg"
                alt={ABOUT_IMAGE.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#1a2a22]/40 to-transparent" />
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-6 right-4 flex items-center gap-4 rounded-2xl bg-[#1a2a22] px-6 py-4 text-[#faf9f6] shadow-xl ring-1 ring-[#D4AF37]/40 sm:right-8 lg:-right-6">
              <FiAward size={26} className="text-[#F5D77A]" aria-hidden="true" />
              <div>
                <p className={`${serif} text-3xl leading-none text-[#F5D77A]`}>5+</p>
                <p className="mt-1 text-xs text-[#faf9f6]/75">Years of Experience</p>
              </div>
            </div>
          </motion.div>

          {/* ===== Text side ===== */}
          <motion.div {...reveal(0.1)} className="order-1 min-w-0 lg:order-2">
            <h2
              id="about-heading"
              className={`${serif} text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.1] tracking-tight text-[#1a2a22]`}
            >
              Your Trusted Real Estate Partner
            </h2>
            <span
              aria-hidden="true"
              className={`mt-5 block h-[3px] w-16 rounded-full ${goldBg}`}
            />

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#52685B]">
              Bringo Real Estate Services is committed to making property
              decisions simple, transparent and rewarding. Whether you are
              looking for your dream home, a commercial space, or a smart
              investment, our expert team is here to guide you at every step.
            </p>

            <ul className="mt-7 space-y-3.5">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a2a22] text-[#F5D77A]">
                    <FiCheck size={13} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="text-base text-[#1a2a22]">{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <BtnDark href="/about">Learn More About Us</BtnDark>
            </div>
          </motion.div>
        </div>

        {/* ===== Stats band ===== */}
        <motion.dl
          {...reveal()}
          className="relative mt-20 grid grid-cols-1 overflow-hidden rounded-3xl bg-[#1a2a22] px-6 py-8 text-[#faf9f6] sm:grid-cols-3 sm:px-4 lg:mt-24"
        >
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`}
          />
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div
              key={label}
              className={`flex items-center justify-center gap-4 py-4 sm:py-2 ${
                i !== 0 ? "border-t border-[#faf9f6]/15 sm:border-l sm:border-t-0" : ""
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#faf9f6]/10 text-[#F5D77A]">
                <Icon size={22} aria-hidden="true" />
              </span>
              <div>
                <dd className={`${serif} text-3xl leading-none text-[#F5D77A]`}>
                  {value}
                </dd>
                <dt className="mt-1.5 text-sm text-[#faf9f6]/70">{label}</dt>
              </div>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}