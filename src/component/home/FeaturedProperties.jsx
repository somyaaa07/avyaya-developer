'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Marcellus } from 'next/font/google';

const marcellus = Marcellus({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export default function PropertiesList({ type, heading, limit = 4 }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = type
      ? `/api/admin/properties?type=${type}`
      : `/api/admin/properties`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : [];

        const newest = [...list]
          .sort((a, b) => {
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return b.id - a.id;
          })
          .slice(0, limit);

        setProperties(newest);
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, [type, limit]);

  if (loading) {
    return (
      <section className="w-full bg-[#f3f0E8] py-14 sm:py-16 lg:py-20">
        <p className="text-center text-[15px] text-[#52685B]">Loading...</p>
      </section>
    );
  }

  if (!properties.length) {
    return (
      <section className="w-full bg-[#f3f0E8] py-14 sm:py-16 lg:py-20">
        <p className="text-center text-[15px] text-[#52685B]">
          No properties found.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#f3f0E8] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-10">
             <motion.h2
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className={`${marcellus.className} text-[34px] leading-tight text-[#1a2a22] sm:text-[42px] lg:text-[48px]`}
                  >
                    Featured Properties
                  </motion.h2>
                 
        {/* Heading */}
        <div className="text-center">
        
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className={`${marcellus.className} text-[34px] leading-tight text-[#1a2a22] sm:text-[42px] lg:text-[48px]`}
          >
            {heading}
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {properties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="overflow-hidden rounded-2xl bg-[#faf9f6] shadow-[0_2px_18px_rgba(26,42,34,0.06)]"
            >
              {property.images?.[0] && (
                <img
                  src={property.images[0].url}
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />
              )}

              <div className="px-6 pb-7 pt-6">
                <h3  className={`${marcellus.className} text-[34px] leading-tight text-[#1a2a22] sm:text-[32px] lg:text-[32px]`}>
                  {property.title}
                </h3>
                <p className="mt-2 text-[15px] text-[#52685B]">
                  {property.city}
                </p>
                <p className="mt-4 text-[17px] font-semibold text-[#D4A62A]">
                  {/* PKR {property.price} */}
                    {property.price}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}