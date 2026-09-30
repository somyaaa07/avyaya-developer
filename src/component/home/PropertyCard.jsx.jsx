"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMapPin, FiHome, FiMaximize, FiArrowUpRight } from "react-icons/fi";

export default function PropertyCard({ property, index = 0 }) {
  const { slug, title, location, type, status, price, beds, area, image } = property;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#dce5df] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#2e5d42] hover:shadow-md"
    >
      {/* Image */}
      <Link href={`/properties/${slug}`} className="relative block aspect-[4/3] overflow-hidden bg-[#dce9e1]" tabIndex={-1} aria-hidden="true">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#173d2a]/40 via-transparent to-transparent" />
      </Link>
      <div className="pointer-events-none relative">
        {status && (
          <span className="absolute -top-[calc(100%+0px)] left-0" />
        )}
      </div>

      {/* Badges over image */}
      <div className="relative">
        <div className="absolute -top-[calc(75%+0.75rem)] left-4 right-4 hidden" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#f0f4f1] px-3 py-1 text-xs font-semibold text-[#2e5d42]">
            {type}
          </span>
          {status && (
            <span className="text-xs font-semibold uppercase tracking-widest text-[#66736c]">
              {status}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-lg font-semibold leading-snug text-[#1b2b23] sm:text-xl">
          <Link
            href={`/properties/${slug}`}
            className="focus:outline-none focus-visible:underline"
          >
            {title}
          </Link>
        </h3>

        {location && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-[#66736c]">
            <FiMapPin size={14} className="shrink-0 text-[#2e5d42]" aria-hidden="true" />
            <span className="truncate">{location}</span>
          </p>
        )}

        {(beds || area) && (
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#dce5df] pt-4 text-sm text-[#66736c]">
            {beds && (
              <li className="flex items-center gap-1.5">
                <FiHome size={15} className="text-[#2e5d42]" aria-hidden="true" />
                {beds} BHK
              </li>
            )}
            {area && (
              <li className="flex items-center gap-1.5">
                <FiMaximize size={15} className="text-[#2e5d42]" aria-hidden="true" />
                {area}
              </li>
            )}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-[#66736c]">Starting from</p>
            <p className="truncate text-lg font-semibold text-[#2e5d42]">
              {price || "On request"}
            </p>
          </div>
          <Link
            href={`/properties/${slug}`}
            aria-label={`View details of ${title}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2e5d42] text-white transition hover:bg-[#173d2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e5d42] focus-visible:ring-offset-2"
          >
            <FiArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}