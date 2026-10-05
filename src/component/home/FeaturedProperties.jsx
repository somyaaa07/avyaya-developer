'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Marcellus } from 'next/font/google';
import {
  ArrowRight,
  ArrowUpRight,
  Bath,
  BedDouble,
  Camera,
  ImageOff,
  MapPin,
  Ruler,
  SearchX,
} from 'lucide-react';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const TYPE_BADGE = {
  buy: 'bg-[#1A2A22] text-[#F5D77A]',
  sell: 'bg-gradient-to-r from-[#D4AF37] to-[#F5D77A] text-[#1A2A22]',
  rent: 'bg-[#FAF9F6] text-[#1A2A22]',
};

const formatPrice = (price) => {
  const n = Number(price);
  return Number.isFinite(n) && price !== '' && price !== null
    ? `₹${n.toLocaleString('en-IN')}`
    : price;
};

/* ---------------------------------------------------------------
   CARD
---------------------------------------------------------------- */
function Card({ property, index, reduce }) {
  const image = property.images?.[0]?.url;
  const stats = [
    property.bedrooms && { icon: BedDouble, text: `${property.bedrooms} Beds` },
    property.bathrooms && { icon: Bath, text: `${property.bathrooms} Baths` },
    property.area && { icon: Ruler, text: `${property.area} sqft` },
  ].filter(Boolean);

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: 'easeOut' }}
      className="list-none"
    >
      <Link
        href={`/properties/${property.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-[#1a2a22]/10 bg-[#faf9f6] p-2.5 transition duration-300 hover:border-[#D4AF37]/60 hover:shadow-[0_18px_40px_-18px_rgba(26,42,34,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#f3f0E8]">
          {image ? (
            <img
              src={image}
              alt={property.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#52685B]">
              <ImageOff size={26} strokeWidth={1.4} />
              <span className="text-xs">No image</span>
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f2645]/55 to-transparent" />

          {property.type && (
            <span
              className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs capitalize shadow-sm ${
                TYPE_BADGE[property.type] || TYPE_BADGE.rent
              }`}
            >
              For {property.type}
            </span>
          )}

          {property.images?.length > 1 && (
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-[#0f2645]/65 px-2.5 py-1 text-[11px] text-[#faf9f6] backdrop-blur">
              <Camera size={12} aria-hidden="true" />
              {property.images.length}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col px-3.5 pb-3 pt-5">
          <h3
            className={`${marcellus.className} line-clamp-1 text-[22px] leading-snug text-[#0f2645]`}
          >
            {property.title}
          </h3>

          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#52685B]">
            <MapPin size={14} className="shrink-0 text-[#B8902F]" aria-hidden="true" />
            <span className="line-clamp-1">
              {[property.location, property.city].filter(Boolean).join(', ')}
            </span>
          </p>

          {stats.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[#52685B]/15 pt-4 text-[13px] text-[#52685B]">
              {stats.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-1.5">
                  <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto flex items-end justify-between pt-5">
            <p className={`${marcellus.className} text-2xl leading-none text-[#0f2645]`}>
              {formatPrice(property.price)}
              {property.type === 'rent' && (
                <span className="ml-1 font-sans text-sm text-[#52685B]">/mo</span>
              )}
            </p>
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A] transition duration-300 group-hover:bg-gradient-to-br group-hover:from-[#F5D77A] group-hover:to-[#B8902F] group-hover:text-[#1a2a22]"
            >
              <ArrowUpRight size={17} />
            </span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}

/* ---------------------------------------------------------------
   SKELETON
---------------------------------------------------------------- */
const SkeletonCard = () => (
  <li className="list-none animate-pulse overflow-hidden rounded-[22px] border border-[#1a2a22]/10 bg-[#faf9f6] p-2.5">
    <div className="aspect-[4/3] rounded-2xl bg-[#52685B]/15" />
    <div className="space-y-3 px-3.5 pb-4 pt-5">
      <div className="h-5 w-3/4 rounded-full bg-[#52685B]/15" />
      <div className="h-4 w-1/2 rounded-full bg-[#52685B]/10" />
      <div className="h-7 w-2/5 rounded-full bg-[#52685B]/15" />
    </div>
  </li>
);

/* ---------------------------------------------------------------
   MAIN
---------------------------------------------------------------- */
export default function PropertiesList({
  type,
  heading = 'Featured Properties',
  subheading = 'Recently added homes, plots and commercial spaces, picked for location and value.',
  limit = 4,
  viewAllHref,
}) {
  const reduce = useReducedMotion();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

useEffect(() => {
  let ignore = false;
  setLoading(true);
  setError(false);

  const params = new URLSearchParams();
  if (type) params.set('type', type);
  params.set('limit', String(limit));

  fetch(`/api/properties?${params.toString()}`)
    .then((res) => {
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (ignore) return;
      // Server already created_at DESC order me bhej raha hai
      setProperties(Array.isArray(data) ? data.slice(0, limit) : []);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Fetch error:', err);
      if (ignore) return;
      setError(true);
      setLoading(false);
    });

  return () => {
    ignore = true;
  };
}, [type, limit]);
  const href = viewAllHref || (type ? `/properties?type=${type}` : '/properties');

  return (
    <section
      aria-labelledby="properties-list-title"
      className="w-full bg-[#f3f0E8] py-14 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2
              id="properties-list-title"
              className={`${marcellus.className} text-[34px] leading-tight text-[#0f2645] sm:text-[42px] lg:text-[48px]`}
            >
              {heading}
            </h2>
            {subheading && (
              <p className="mt-3 text-[15px] leading-relaxed text-[#52685B]">
                {subheading}
              </p>
            )}
          </div>

          <Link
            href={href}
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-[#0f2645]/20 bg-[#faf9f6] py-2 pl-5 pr-2 text-sm text-[#0f2645] transition hover:border-[#D4AF37] hover:shadow-[0_8px_24px_rgba(212,175,55,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            View all properties
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A] transition group-hover:bg-gradient-to-br group-hover:from-[#F5D77A] group-hover:to-[#B8902F] group-hover:text-[#1a2a22]">
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:-rotate-45" />
            </span>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {Array.from({ length: limit }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </ul>
        ) : error || !properties.length ? (
          <div className="mt-10 flex flex-col items-center rounded-3xl border border-[#1a2a22]/10 bg-[#faf9f6] px-6 py-16 text-center lg:mt-12">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f0E8] text-[#B8902F]">
              <SearchX size={28} strokeWidth={1.3} aria-hidden="true" />
            </span>
            <p className={`${marcellus.className} mt-5 text-2xl text-[#0f2645]`}>
              {error ? 'Could not load properties' : 'No properties listed yet'}
            </p>
            <p className="mt-2 max-w-sm text-sm text-[#52685B]">
              {error
                ? 'Check your connection and refresh the page.'
                : 'New listings are added regularly. Please check back soon.'}
            </p>
          </div>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {properties.map((property, i) => (
              <Card key={property.id} property={property} index={i} reduce={reduce} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}