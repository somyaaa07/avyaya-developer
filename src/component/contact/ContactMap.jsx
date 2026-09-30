"use client";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { mapData } from "@/data/contactData";

export default function ContactMap() {
  return (
    <section className="bg-white pb-16 sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-[#dce5df] bg-white shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-[#dce5df] px-5 py-4 sm:px-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#dce9e1] text-[#2e5d42]">
              <MapPin size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-[#1b2b23]">Find Us on the Map</h2>
              <p className="truncate text-sm text-[#66736c]">{mapData.name}</p>
            </div>
          </div>
          <div className="h-[300px] w-full sm:h-[350px] lg:h-[400px]">
            <iframe
              src={mapData.src}
              title={`Map showing ${mapData.name}`}
              className="h-full w-full border-0"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}