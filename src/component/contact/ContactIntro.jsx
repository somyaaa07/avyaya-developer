"use client";
import { motion } from "framer-motion";
import ContactMethods from "./ContactMethods";

export default function ContactIntro() {
  return (
    <section className="bg-[#f0f4f1] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-tight text-[#1b2b23]">
            We’re Here to Help
          </h2>
          <p className="mt-3 text-base text-[#66736c]">
            Connect with our team through your preferred channel.
          </p>
        </motion.div>
        <ContactMethods />
      </div>
    </section>
  );
}