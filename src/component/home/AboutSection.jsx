"use client";
import Link from "next/link";
import { motion } from "framer-motion";
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
  src: "/banner/about.png", // put your living-room image in /public/banner/
  alt: "Luxury living room with floor-to-ceiling windows",
};

const points = [
  "Wide range of residential & commercial properties",
  "Expert market insights and personalized guidance",
  "Transparent process with verified listings",
  "Dedicated support from search to settlement",
];

const stats = [
  { icon: FiHome, value: "500+", label: "Properties Listed" },
  { icon: FiUsers, value: "300+", label: "Happy Clients" },
  { icon: FiMapPin, value: "10+", label: "Cities Covered" },
  { icon: FiAward, value: "5+", label: "Years of Experience" },
];

/* ---------------- STYLES ---------------- */
// Yellow gradient: darker gold on the sides, bright yellow in the centre
const goldBg = "bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";
const goldText = `${goldBg} bg-clip-text text-transparent`;
// Icons are stroke-based, so they use the SVG gradient defined in the component
const goldStroke = { stroke: "url(#about-gold)" };

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
});

/* Decorative leaves (bottom-left) */
function Leaves() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 140"
      className="pointer-events-none absolute -bottom-6 -left-6 hidden h-36 w-32 text-[#52685B]/30 lg:block"
      fill="currentColor"
    >
      <path d="M10 140C0 100 8 60 40 20c6 40-2 80-30 120Z" />
      <path d="M40 140C34 105 48 70 80 45c2 35-10 68-40 95Z" opacity=".7" />
      <path d="M70 140c-2-28 10-52 36-68 0 28-12 52-36 68Z" opacity=".5" />
    </svg>
  );
}

/* ---------------- COMPONENT ---------------- */
export default function AboutSection() {
  return (
    <section
      className="relative overflow-hidden bg-[#faf9f6] py-16 sm:py-20 lg:py-24"
      aria-labelledby="about-heading"
    >
      {/* Gradient definition used by the stroke icons (keep width/height 0, not display:none) */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        className="pointer-events-none absolute"
      >
        <defs>
          <linearGradient
            id="about-gold"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="24"
            y2="0"
          >
            <stop offset="0%" stopColor="#e2a10d" />
            <stop offset="50%" stopColor="#ffcd39" />
            <stop offset="100%" stopColor="#e2a10d" />
          </linearGradient>
        </defs>
      </svg>

      <Leaves />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===== TOP: text + image ===== */}
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text */}
          <motion.div {...reveal()} className="min-w-0">
            <span
              className={`${goldText} text-xs font-semibold uppercase tracking-[0.3em]`}
            >
              About Bringo
            </span>

            <h2
              id="about-heading"
              className={`${serif} mt-4 text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.1] tracking-tight text-[#1a2a22]`}
            >
              Your Trusted <br className="hidden sm:block" />
              Real <span className={goldText}>Estate</span> Partner
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#52685B]">
              Bringo Real Estate Services is committed to making property
              decisions simple, transparent and rewarding. Whether you are
              looking for your dream home, a commercial space, or a smart
              investment, our expert team is here to guide you at every step.
            </p>

            <ul className="mt-7 space-y-3.5">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a2a22] text-[#faf9f6]">
                    <FiCheck size={13} strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span className="text-base text-[#1a2a22]">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Image + badge */}
          <motion.div {...reveal(0.1)} className="relative min-w-0">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-[#f3f0E8] shadow-[0_25px_60px_-30px_rgba(26,42,34,0.5)] lg:aspect-[5/4] lg:rounded-l-[180px] lg:rounded-r-3xl">
              <img
                src={ABOUT_IMAGE.src}
                alt={ABOUT_IMAGE.alt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-6 left-4 flex items-center gap-3 rounded-2xl bg-[#faf9f6] px-5 py-4 shadow-xl ring-1 ring-[#1a2a22]/5 sm:left-8 lg:-left-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ">
                <FiHome size={22} aria-hidden="true" style={goldStroke} />
              </span>
              <div>
                <p className={`${serif} text-3xl leading-none text-[#1a2a22]`}>
                  5+
                </p>
                <p className="mt-1 text-xs text-[#52685B]">
                  Years of Experience
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ===== BOTTOM: button + stats ===== */}
        <div className="mt-16 grid items-center gap-10 lg:mt-20 lg:grid-cols-2 lg:gap-16">
          <motion.div {...reveal()}>
            <Link
              href="/about"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a2a22] px-8 py-4 text-sm font-semibold text-[#faf9f6] shadow-lg transition hover:bg-[#52685B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#52685B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f6] sm:w-auto"
            >
              Learn More About Us
              <FiArrowRight
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </motion.div>

          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <motion.div
                key={label}
                {...reveal(i * 0.08)}
                className="flex items-center gap-3"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ">
                  <Icon size={20} aria-hidden="true" style={goldStroke} />
                </span>
                <div className="min-w-0">
                  <dd
                    className={`${serif} text-xl leading-none text-[#1a2a22]`}
                  >
                    {value}
                  </dd>
                  <dt className="mt-1 text-xs leading-snug text-[#52685B]">
                    {label}
                  </dt>
                </div>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}