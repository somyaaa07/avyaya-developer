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

// Shared gold gradient (#e2a10d -> #ffcd39 -> #e2a10d)
const goldBg = "bg-gradient-to-br from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";
const goldText = `${goldBg} bg-clip-text text-transparent`;

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function Testimonials() {
  const [[index, direction], setPage] = useState([0, 1]);
  const reduceMotion = useReducedMotion();
  const total = testimonials.length;
  const current = testimonials[index];

  const go = (dir) =>
    setPage(([i]) => [(i + dir + total) % total, dir]);
  const goTo = (i) => setPage(([prev]) => [i, i > prev ? 1 : -1]);

  const slide = reduceMotion ? 0 : 36;
  const variants = {
    enter: (d) => ({ opacity: 0, x: d * slide }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d * -slide }),
  };

  const arrowClass =
    "group relative flex h-12 w-12 items-center justify-center rounded-full border border-[#ffcd39]/40 text-[#ffcd39] transition duration-300 hover:border-transparent hover:bg-gradient-to-br hover:from-[#e2a10d] hover:via-[#ffcd39] hover:to-[#e2a10d] hover:text-[#1a2a22] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcd39] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a2a22]";

  return (
    <section
      className="relative overflow-hidden bg-[#faf9f6] py-16 sm:py-20 lg:py-28"
      aria-labelledby="testimonials-heading"
    >
      {/* Gradient definition for the star icons */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        className="pointer-events-none absolute"
      >
        <defs>
          <linearGradient
            id="testimonial-gold"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="24"
            y2="24"
          >
            <stop offset="0%" stopColor="#e2a10d" />
            <stop offset="50%" stopColor="#ffcd39" />
            <stop offset="100%" stopColor="#e2a10d" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="testimonials-heading"
            className={`${marcellus.className} text-[clamp(1.9rem,4vw,3rem)] font-normal leading-tight tracking-tight text-[#1a2a22]`}
          >
            Trusted by Families and Investors
          </h2>
          <div
            aria-hidden="true"
            className={`mx-auto mt-5 h-[3px] w-16 rounded-full ${goldBg}`}
          />
          <p className="mt-5 text-base text-[#52685B]">
            Real experiences from people who found the right property with us.
          </p>
        </div>

        {/* Gradient-bordered card */}
        <div
          className={`mx-auto mt-12 max-w-7xl rounded-[28px] p-[1.5px] shadow-[0_24px_60px_-20px_rgba(26,42,34,0.45)] sm:mt-14`}
        >
          <div className="relative overflow-hidden rounded-[27px] bg-[#1a2a22] p-6 sm:p-10 lg:p-14">
            {/* Soft gold glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffcd39]/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-[#e2a10d]/10 blur-3xl"
            />

            <div className="relative">
              {/* Quote mark */}
              <span
                aria-hidden="true"
                className={`${marcellus.className} ${goldText} block h-14 text-8xl leading-[1.1] sm:h-16 sm:text-9xl`}
              >
                “
              </span>

              <div aria-live="polite" className="min-h-[300px] sm:min-h-[250px]">
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
                          style={
                            i < current.rating
                              ? {
                                  stroke: "url(#testimonial-gold)",
                                  fill: "url(#testimonial-gold)",
                                }
                              : { stroke: "rgba(250,249,246,0.3)" }
                          }
                        />
                      ))}
                    </div>

                    <blockquote
                      className={`${marcellus.className} mt-6 text-[clamp(1.2rem,2.4vw,1.75rem)] font-normal leading-[1.55] text-[#faf9f6]`}
                    >
                      {current.quote}
                    </blockquote>

                    <figcaption className="mt-9 flex items-center gap-4">
                      {/* Gradient ring avatar */}
                      <span
                        className={`flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full p-[2px] ${goldBg}`}
                        aria-hidden="true"
                      >
                        <span
                          className={`${marcellus.className} flex h-full w-full items-center justify-center rounded-full bg-[#1a2a22] text-lg`}
                        >
                          <span className={goldText}>
                            {getInitials(current.name)}
                          </span>
                        </span>
                      </span>
                      <div className="min-w-0">
                        <p
                          className={`${marcellus.className} text-lg font-normal text-[#faf9f6]`}
                        >
                          {current.name}
                        </p>
                        <p className="text-sm text-[#faf9f6]/60">
                          {current.role}
                        </p>
                      </div>
                    </figcaption>
                  </motion.figure>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="mt-10 flex items-center justify-between border-t border-[#faf9f6]/10 pt-6">
                <div
                  className="flex items-center gap-2"
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
                      className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcd39] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a2a22] ${
                        i === index
                          ? `w-9 ${goldBg}`
                          : "w-2 bg-[#faf9f6]/25 hover:bg-[#faf9f6]/50"
                      }`}
                    />
                  ))}
                </div>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}