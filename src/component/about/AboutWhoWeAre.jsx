"use client";

import React from "react";
import { motion } from "framer-motion";

const AboutWhoWeAre = () => {
  return (
    <section className="w-full bg-[#fafaef] py-16 sm:py-20 lg:py-24 px-5 sm:px-8 lg:px-12">

      {/* CENTER HEADING */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center mb-12"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#2e5d42]">
          Built on Trust & Luxury
        </h1>
        <div className="w-16 h-[2px] bg-[#2e5d42] mx-auto mt-3"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="text-[#2e5d42] uppercase tracking-[0.3em] text-xs mb-4">
            Who We Are
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#2e5d42] leading-tight">
            Redefining Real Estate <br /> With Trust & Elegance
          </h2>

          <p className="mt-6 text-gray-700 text-sm sm:text-base leading-relaxed max-w-xl">
            We are a modern real estate company dedicated to delivering
            premium property experiences. From luxury homes to smart
            investments, we guide you with market expertise, transparency,
            and a commitment to excellence.
          </p>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-3 gap-6 max-w-md">
            {[
              { num: "500+", label: "Properties Sold" },
              { num: "10+", label: "Years Experience" },
              { num: "98%", label: "Happy Clients" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold text-[#2e5d42]">
                  {item.num}
                </h3>
                <p className="text-xs text-gray-600">{item.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 bg-[#2e5d42] text-[#fafaef] px-6 py-3 rounded-md text-sm"
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Right Image + Card */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <motion.img
              src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"
              alt="Real Estate"
              className="w-full h-[350px] sm:h-[450px] object-cover"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Floating Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
            className="absolute -bottom-6 -left-6 bg-[#2e5d42] text-[#fafaef] p-5 rounded-md shadow-lg max-w-xs"
          >
            <p className="text-sm leading-relaxed">
              We don’t just sell properties — we create long-term value and
              trusted relationships.
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutWhoWeAre;