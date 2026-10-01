"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Marcellus } from "next/font/google";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import { testimonials } from "@/data/testimonialData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const goldBg = "bg-gradient-to-br from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const pad = (n) => String(n).padStart(2, "0");

export default function Testimonials() {
  const [[index, direction], setPage] = useState([0, 1]);
  const reduceMotion = useReducedMotion();
  const total = testimonials.length;
  const current = testimonials[index];

  const go = (dir) => setPage(([i]) => [(i + dir + total) % total, dir]);
  const goTo = (i) => setPage(([prev]) => [i, i > prev ? 1 : -1]);

  const slide = reduceMotion ? 0 : 36;
  const variants = {
    enter: (d) => ({ opacity: 0, x: d * slide }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d * -slide }),
  };

  const arrowClass =
    "flex h-12 w-12 items-center justify-center rounded-full border border-[#1a2a22]/20 bg-[#faf9f6] text-[#1a2a22] transition duration-300 hover:border-transparent hover:bg-gradient-to-br hover:from-[#e2a10d] hover:via-[#ffcd39] hover:to-[#e2a10d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f0E8]";

  return (
    <section
      className="relative overflow-hidden bg-[#faf9f6] py-16 sm:py-20 lg:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.3fr] lg:gap-16 lg:px-8">
        {/* ===== Left: heading + controls ===== */}
        <div>
          <h2
            id="testimonials-heading"
            className={`${marcellus.className} text-[clamp(1.9rem,4vw,3rem)] font-normal leading-tight tracking-tight text-[#1a2a22]`}
          >
            Trusted by Families and Investors
          </h2>
          <span
            aria-hidden="true"
            className={`mt-5 block h-[3px] w-16 rounded-full ${goldBg}`}
          />
          <p className="mt-5 max-w-sm text-base leading-relaxed text-[#52685B]">
            Real experiences from people who found the right property with us.
          </p>

          <div className="mt-8 flex items-center gap-5">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                className={arrowClass}
              >
                <FiChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                className={arrowClass}
              >
                <FiChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
            <p
              className={`${marcellus.className} text-lg text-[#52685B]`}
              aria-hidden="true"
            >
              <span className="text-[#1a2a22]">{pad(index + 1)}</span> / {pad(total)}
            </p>
          </div>
        </div>

        {/* ===== Right: quote card ===== */}
        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-[28px] bg-[#1a2a22] p-6 shadow-[0_24px_60px_-24px_rgba(26,42,34,0.55)] sm:p-10 lg:p-12">
            <span
              aria-hidden="true"
              className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`}
            />
            {/* big faded quote mark */}
            <span
              aria-hidden="true"
              className={`${marcellus.className} pointer-events-none absolute -right-2 -top-6 select-none text-[11rem] leading-none text-[#ffcd39]/10 sm:text-[14rem]`}
            >
              ”
            </span>

            <div aria-live="polite" className="relative min-h-[300px] sm:min-h-[260px]">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.figure
                  key={current.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  drag={reduceMotion ? false : "x"}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) go(1);
                    else if (info.offset.x > 80) go(-1);
                  }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <div
                    className="flex gap-1"
                    role="img"
                    aria-label={`${current.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        size={18}
                        aria-hidden="true"
                        className={
                          i < current.rating
                            ? "fill-[#ffcd39] text-[#ffcd39]"
                            : "text-[#faf9f6]/30"
                        }
                      />
                    ))}
                  </div>

                  <blockquote
                    className={`${marcellus.className} mt-6 text-[clamp(1.2rem,2.3vw,1.7rem)] font-normal leading-[1.55] text-[#faf9f6]`}
                  >
                    {current.quote}
                  </blockquote>

                  <figcaption className="mt-8 flex items-center gap-4 border-t border-[#faf9f6]/10 pt-6">
                    <span
                      aria-hidden="true"
                      className={`${marcellus.className} flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg text-[#1a2a22] ${goldBg}`}
                    >
                      {getInitials(current.name)}
                    </span>
                    <div className="min-w-0">
                      <p className={`${marcellus.className} text-lg text-[#faf9f6]`}>
                        {current.name}
                      </p>
                      <p className="text-sm text-[#faf9f6]/60">{current.role}</p>
                    </div>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>

          {/* Dots */}
          <div
            className="mt-6 flex items-center justify-center gap-2 lg:justify-start"
            role="tablist"
            aria-label="Select testimonial"
          >
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show testimonial from ${t.name}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f0E8] ${
                  i === index
                    ? `w-9 ${goldBg}`
                    : "w-2 bg-[#1a2a22]/25 hover:bg-[#1a2a22]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}