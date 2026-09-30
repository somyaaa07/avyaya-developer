"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Marcellus } from "next/font/google";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import { testimonials } from "@/data/testimonialData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const current = testimonials[index];

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  const arrowClass =
    "flex h-11 w-11 items-center justify-center rounded-full border border-[#1a2a22]/20 text-[#1a2a22] transition hover:bg-[#1a2a22] hover:text-[#faf9f6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#52685B] focus-visible:ring-offset-2";

  return (
    <section
      className="bg-[#faf9f6] py-16 sm:py-20 lg:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#52685B]">
            Testimonials
          </span>
          <h2
            id="testimonials-heading"
            className={`${marcellus.className} mt-4 text-[clamp(1.9rem,4vw,3rem)] font-normal leading-tight tracking-tight text-[#1a2a22]`}
          >
            Trusted by Families and Investors
          </h2>
          <p className="mt-4 text-base text-[#52685B]">
            Real experiences from people who found the right property with us.
          </p>
        </div>

        {/* Card */}
        <div className="mx-auto mt-12 max-w-4xl rounded-3xl bg-[#f3f0E8] p-6 sm:p-10 lg:p-14">
          <span
            aria-hidden="true"
            className={`${marcellus.className} block text-7xl leading-none text-[#52685B]/40 sm:text-8xl`}
          >
            “
          </span>

          <div aria-live="polite" className="min-h-[260px] sm:min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={current.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <div
                  className="flex gap-1"
                  role="img"
                  aria-label={`${current.rating} out of 5 stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      size={16}
                      aria-hidden="true"
                      className={
                        i < current.rating
                          ? "fill-[#1a2a22] text-[#1a2a22]"
                          : "text-[#52685B]/40"
                      }
                    />
                  ))}
                </div>

                <blockquote
                  className={`${marcellus.className} mt-5 text-[clamp(1.2rem,2.4vw,1.75rem)] font-normal leading-[1.5] text-[#1a2a22]`}
                >
                  {current.quote}
                </blockquote>

                <figcaption className="mt-8 flex items-center gap-4">
                  <span
                    className={`${marcellus.className} flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1a2a22] text-base text-[#faf9f6]`}
                    aria-hidden="true"
                  >
                    {getInitials(current.name)}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`${marcellus.className} text-lg font-normal text-[#1a2a22]`}
                    >
                      {current.name}
                    </p>
                    <p className="text-sm text-[#52685B]">{current.role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-10 flex items-center justify-between border-t border-[#1a2a22]/10 pt-6">
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
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#52685B] focus-visible:ring-offset-2 ${
                    i === index
                      ? "w-8 bg-[#1a2a22]"
                      : "w-2 bg-[#52685B]/40 hover:bg-[#52685B]"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className={arrowClass}
              >
                <FiChevronLeft size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className={arrowClass}
              >
                <FiChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
