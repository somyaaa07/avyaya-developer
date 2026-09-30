"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { enquiryTypes } from "@/data/contactData";

const initialState = { name: "", phone: "", email: "", enquiryType: "", message: "" };

const fieldClass =
  "w-full rounded-xl border border-[#dce5df] bg-white px-4 py-3 text-base text-[#1b2b23] placeholder:text-[#66736c]/70 transition focus:border-[#2e5d42] focus:outline-none focus:ring-2 focus:ring-[#2e5d42]/25 disabled:opacity-60";
const labelClass = "mb-1.5 block text-sm font-medium text-[#1b2b23]";

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
      transition={{ duration: 0.55, delay: 0.1 }}
      className="min-w-0 rounded-2xl border border-[#dce5df] bg-white p-6 shadow-[0_10px_40px_-15px_rgba(23,61,42,0.2)] sm:p-8"
    >
      <h3 className="text-xl font-semibold text-[#1b2b23]">Send us an enquiry</h3>
      <p className="mt-1 text-sm text-[#66736c]">Fields marked * are required.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate={false}>
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

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2e5d42] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#173d2a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2e5d42] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              Sending...
            </>
          ) : (
            "Send Enquiry"
          )}
        </button>

        <div aria-live="polite">
          {status === "success" && (
            <p className="flex items-start gap-2 rounded-xl bg-[#dce9e1] px-4 py-3 text-sm text-[#173d2a]">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
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