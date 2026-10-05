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
    "flex h-12 w-12 items-center justify-center rounded-full border border-[#1a2a22]/20 bg-[#faf9f6] text-[#1a2a22] transition duration-300 hover:border-transparent hover:bg-gradient-to-br hover:from-[#e2a10d] hover:via-[#ffcd39] hover:to-[#e2a10d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f6]";

  return (
    <section
      className="relative overflow-hidden bg-[#faf9f6] py-16 sm:py-20 lg:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ===== Header row ===== */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-xl">
            <h2
              id="testimonials-heading"
              className={`${marcellus.className} text-[clamp(1.9rem,4vw,3rem)] font-normal leading-tight tracking-tight text-[#0f2645]`}
            >
              Real Experiences. Lasting Trust.
            </h2>
            <span
              aria-hidden="true"
              className={`mt-5 block h-[3px] w-16 rounded-full ${goldBg}`}
            />
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#52685B]">
              Real experiences from people who found the right property with us.
            </p>
          </div>

          <div className="flex items-center gap-5">
            <p
              className={`${marcellus.className} text-lg text-[#52685B]`}
              aria-hidden="true"
            >
              <span className="text-[#1a2a22]">{pad(index + 1)}</span> / {pad(total)}
            </p>
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
        </motion.div>

        {/* ===== Body ===== */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-[1.7fr_1fr] lg:gap-8"
        >
          {/* Main quote card */}
          <div className="relative min-w-0">
            {/* stacked cards behind */}
            <span
              aria-hidden="true"
              className="absolute inset-x-6 -bottom-3 top-3 rounded-[28px] bg-[#0f2645]/20"
            />
            <span
              aria-hidden="true"
              className="absolute inset-x-3 -bottom-1.5 top-1.5 rounded-[28px] bg-[#0f2645]/50"
            />

            <div className="relative overflow-hidden rounded-[28px] bg-[#0f2645] p-6 shadow-[0_30px_60px_-28px_rgba(15,38,69,0.7)] sm:p-10 lg:p-14">
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 top-0 h-[3px] ${goldBg}`}
              />

              {/* large faded index number */}
              <span
                aria-hidden="true"
                className={`${marcellus.className} pointer-events-none absolute -bottom-2 right-4 select-none text-[6rem] leading-none text-[#faf9f6]/[0.05] sm:text-[10rem]`}
              >
                {pad(index + 1)}
              </span>

              <div
                aria-live="polite"
                className="relative min-h-[360px] sm:min-h-[330px]"
              >
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
                    className="flex min-h-[360px] cursor-grab flex-col justify-between active:cursor-grabbing sm:min-h-[330px]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          aria-hidden="true"
                          className={`${marcellus.className} flex h-12 w-12 items-center justify-center rounded-full pt-2 text-[2.2rem] leading-none text-[#1a2a22] ${goldBg}`}
                        >
                          “
                        </span>
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
                      </div>

                      <blockquote
                        className={`${marcellus.className} mt-8 text-[clamp(1.2rem,2.3vw,1.7rem)] font-normal leading-[1.55] text-[#faf9f6]`}
                      >
                        {current.quote}
                      </blockquote>
                    </div>

                    <figcaption className="mt-10 flex items-center gap-4 border-t border-[#faf9f6]/10 pt-6">
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
          </div>

          {/* Reviewer list */}
          <div
            role="tablist"
            aria-label="Select testimonial"
            className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:mx-0 lg:max-h-[460px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:px-0 lg:py-1 lg:pb-0 lg:pr-1"
          >
            {testimonials.map((t, i) => {
              const active = i === index;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Show testimonial from ${t.name}`}
                  onClick={() => goTo(i)}
                  className={`group relative flex min-w-[240px] shrink-0 items-center gap-4 overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf9f6] lg:min-w-0 ${
                    active
                      ? "border-[#D4AF37]/50 bg-[#f3f0E8] shadow-[0_14px_30px_-18px_rgba(15,38,69,0.4)]"
                      : "border-[#0f2645]/10 bg-transparent hover:border-[#D4AF37]/40 hover:bg-[#f3f0E8]/60"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-[3px] transition-opacity duration-300 ${goldBg} ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span
                    aria-hidden="true"
                    className={`${marcellus.className} flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base transition-colors duration-300 ${
                      active
                        ? `text-[#1a2a22] ${goldBg}`
                        : "bg-[#0f2645] text-[#F5D77A]"
                    }`}
                  >
                    {getInitials(t.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`${marcellus.className} block truncate text-[17px] text-[#0f2645]`}
                    >
                      {t.name}
                    </span>
                    <span className="block truncate text-sm text-[#52685B]">
                      {t.role}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`${marcellus.className} text-sm transition-colors duration-300 ${
                      active ? "text-[#e2a10d]" : "text-[#0f2645]/30"
                    }`}
                  >
                    {pad(i + 1)}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}