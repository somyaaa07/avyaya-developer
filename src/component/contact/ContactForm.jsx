"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Marcellus } from "next/font/google";
import { enquiryTypes } from "@/data/contactData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const initialState = { name: "", phone: "", email: "", enquiryType: "", message: "" };

const fieldClass =
  "w-full rounded-xl border border-[#e8e3d3] bg-[#faf9f6] px-4 py-3.5 text-base text-[#1a2a22] placeholder:text-[#52685B]/60 transition-all duration-300 hover:border-[#e2a10d]/60 focus:border-[#e2a10d] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#ffcd39]/20 disabled:opacity-60";
const labelClass =
  "mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-[#52685B]";

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // adjust keys if your API expects different names
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Something went wrong.");
      }
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setErrorMsg(err.message || "Unable to send. Please try again.");
      setStatus("error");
    }
  };

  const loading = status === "loading";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      className="relative min-w-0 overflow-hidden rounded-3xl border border-[#e8e3d3] bg-[#f3f0E8] p-6 sm:p-10"
      style={{ boxShadow: "0 30px 60px -35px rgba(26,42,34,0.35)" }}
    >
      {/* Top gold hairline: #e2a10d sides, #ffcd39 center */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background:
            "linear-gradient(90deg, rgba(226,161,13,0) 0%, #e2a10d 25%, #ffcd39 50%, #e2a10d 75%, rgba(226,161,13,0) 100%)",
        }}
      />

      <div className="flex items-center gap-3">
        <span
          className="h-px w-10"
          style={{ background: "linear-gradient(90deg, #e2a10d, #ffcd39)" }}
        />
        <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#52685B] sm:text-xs">
          Enquiry
        </span>
      </div>

      <h3
        className={`${marcellus.className} mt-4 text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.15] tracking-tight text-[#1a2a22]`}
      >
        Send us an enquiry
      </h3>
      <p className="mt-2 text-sm text-[#52685B]">Fields marked * are required.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate={false}>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>Full Name *</label>
            <input id="name" name="name" type="text" required autoComplete="name"
              value={form.name} onChange={handleChange} disabled={loading}
              placeholder="Your full name" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>Phone Number *</label>
            <input id="phone" name="phone" type="tel" required autoComplete="tel"
              inputMode="tel" pattern="[0-9+\-\s]{10,15}"
              title="Enter a valid phone number"
              value={form.phone} onChange={handleChange} disabled={loading}
              placeholder="+91 00000 00000" className={fieldClass} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className={labelClass}>Email Address</label>
            <input id="email" name="email" type="email" autoComplete="email"
              value={form.email} onChange={handleChange} disabled={loading}
              placeholder="you@example.com" className={fieldClass} />
          </div>
          <div>
            <label htmlFor="enquiryType" className={labelClass}>Enquiry Type</label>
            <select id="enquiryType" name="enquiryType"
              value={form.enquiryType} onChange={handleChange} disabled={loading}
              className={fieldClass}>
              <option value="">Select type</option>
              {enquiryTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>Message *</label>
          <textarea id="message" name="message" rows={5} required
            value={form.message} onChange={handleChange} disabled={loading}
            placeholder="Tell us about your requirements..."
            className={`${fieldClass} resize-y`} />
        </div>

        {/* Submit button — same design as hero BtnDark */}
        <button
          type="submit"
          disabled={loading}
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-6 pr-2.5 text-sm font-medium text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:ring-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {/* Golden fill */}
          <span
            aria-hidden="true"
            className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
          />

          {/* Shine */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
          />

          <span className="relative z-10">
            {loading ? "Sending..." : "Send Enquiry"}
          </span>

          {/* Arrow */}
          <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
            {loading ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRight
                size={14}
                className="transition-transform duration-500 group-hover:-rotate-45"
                aria-hidden="true"
              />
            )}
          </span>
        </button>

        <div aria-live="polite">
          {status === "success" && (
            <p
              className="flex items-start gap-2 rounded-xl px-4 py-3 text-sm text-[#1a2a22]"
              style={{
                background: "rgba(255,205,57,0.18)",
                border: "1px solid rgba(226,161,13,0.5)",
              }}
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#e2a10d]" aria-hidden="true" />
              Thank you! Your enquiry has been sent. We’ll get back to you shortly.
            </p>
          )}
          {status === "error" && (
            <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              {errorMsg}
            </p>
          )}
        </div>
      </form>
    </motion.div>
  );
}