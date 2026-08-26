"use client";

import React from "react";
import { motion } from "framer-motion";

const AboutMission = () => {
  return (
    <section className="w-full bg-[#fafaef] py-10 sm:py-5 px-5 sm:px-8 lg:px-16 overflow-hidden">
      
      {/* CENTER HEADING */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#2e5d42]">
          Our Mission & Vision
        </h2>
        <div className="w-16 h-[2px] bg-[#2e5d42] mx-auto mt-3"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* LEFT - IMAGE */}
        <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[500px] overflow-hidden">
          
          {/* Main Image */}
          <img
            src="https://images.pexels.com/photos/14603131/pexels-photo-14603131.jpeg"
            alt="real estate"
            className="w-full h-full object-cover rounded-2xl shadow-2xl"
          />

          {/* Overlay Box */}
          <div className="absolute bottom-4  bg-[#2e5d42] text-[#fafaef] p-5 sm:p-6 rounded-md shadow-xl hidden sm:block max-w-[300px]">
            <p className="text-sm leading-relaxed">
              Delivering excellence through every property we represent.
            </p>
          </div>
        </div>

        {/* RIGHT - CONTENT */}
        <div className="space-y-6 sm:space-y-8">

          {/* Section Tag */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#2e5d42]/70"
          >
            Our Purpose
          </motion.p>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#2e5d42] leading-[1.2]"
          >
            Mission & Vision That <br /> Define Our Direction
          </motion.h2>

          {/* MISSION */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="border-l-4 border-[#2e5d42] pl-5"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-[#2e5d42] mb-2">
              Our Mission
            </h3>
            <p className="text-[#2e5d42]/80 text-sm leading-relaxed">
              To deliver exceptional real estate solutions by understanding
              client needs, offering premium properties, and ensuring a smooth,
              transparent experience from start to finish.
            </p>
          </motion.div>

          {/* VISION */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="border-l-4 border-[#2e5d42] pl-5"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-[#2e5d42] mb-2">
              Our Vision
            </h3>
            <p className="text-[#2e5d42]/80 text-sm leading-relaxed">
              To be a trusted leader in the real estate industry, known for
              innovation, integrity, and delivering long-term value to every
              client and investor we serve.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutMission;