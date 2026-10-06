"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Marcellus } from "next/font/google";
import {
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Phone,
} from "lucide-react";
import { enquiryTypes, PHONE, PHONE_HREF } from "@/data/contactData";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  enquiryType: "",
  message: "",
};

const inputBase =
  "w-full rounded-xl border bg-[#faf9f6] px-4 py-3 text-base text-[#0f2645] placeholder:text-[#0f2645]/45 transition-all duration-300 hover:border-[#e2a10d]/60 focus:bg-white focus:outline-none focus:ring-4 disabled:opacity-60";
const okBorder =
  "border-[#0f2645]/15 focus:border-[#e2a10d] focus:ring-[#ffcd39]/20";
const badBorder = "border-red-300 focus:border-red-400 focus:ring-red-200/60";
const labelClass =
  "mb-1.5 block text-[11px] font-medium uppercase tracking-[0.2em] text-[#0f2645]/70";

function validate(data) {
  const errors = {};
  if (!data.name.trim()) errors.name = "Please enter your name.";
  const digits = data.phone.replace(/\D/g, "");
  if (!data.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (digits.length < 10) errors.phone = "Phone number looks too short.";
  if (data.email.trim() && !/^\S+@\S+\.\S+$/.test(data.email.trim()))
    errors.email = "Please enter a valid email address.";
  return errors;
}

function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
      <AlertCircle size={13} aria-hidden="true" />
      {message}
    </p>
  );
}

export default function EnquiryModal({ open, onClose }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [serverError, setServerError] = useState("");
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll, close on Escape, focus first field
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstFieldRef.current?.focus(), 350);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  // Reset state after the modal has closed
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setStatus("idle");
      setServerError("");
      setErrors({});
    }, 300);
    return () => clearTimeout(t);
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "loading") return;

    const found = validate(formData);
    setErrors(found);
    if (Object.keys(found).length) {
      const firstBad = Object.keys(found)[0];
      dialogRef.current?.querySelector(`[name="${firstBad}"]`)?.focus();
      return;
    }

    setStatus("loading");
    setServerError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          enquiryType: formData.enquiryType,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");

      setStatus("success");
    } catch (error) {
      console.error("Enquiry submission error:", error);
      setServerError(
        error.message || "Unable to submit enquiry. Please try again."
      );
      setStatus("error");
    }
  };

  const handleDone = () => {
    setFormData(initialFormData);
    onClose();
  };

  if (!mounted) return null;

  const loading = status === "loading";
  const firstName = formData.name.trim().split(" ")[0];

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="enquiry-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enquiry-modal-title"
        >
          {/* Backdrop */}
          <div
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 bg-[#0f2645]/70 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            ref={dialogRef}
            initial={reduce ? false : { opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative my-auto grid w-full max-w-4xl overflow-hidden rounded-[28px] bg-[#faf9f6] shadow-[0_40px_90px_-30px_rgba(15,38,69,0.7)] lg:grid-cols-[0.85fr_1.2fr]"
          >
            {/* Top gold hairline */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 z-20 h-[3px] bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]"
            />

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close enquiry form"
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-[#0f2645]/20 bg-[#faf9f6] text-[#0f2645] transition duration-300 hover:rotate-90 hover:border-transparent hover:bg-gradient-to-br hover:from-[#F5D77A] hover:to-[#B8902F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            >
              <X size={18} aria-hidden="true" />
            </button>

            {/* ===== Left: navy info panel ===== */}
            <div className="relative hidden overflow-hidden bg-[#0f2645] p-10 text-[#faf9f6] lg:block">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#e2a10d]/15 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#e2a10d]/10 blur-3xl"
              />

              <div className="relative flex h-full flex-col">
                <span aria-hidden="true" className="mb-6 flex items-center gap-3">
                  <span className="block h-px w-12 bg-[#D4AF37]" />
                  <span className="block h-1.5 w-1.5 rotate-45 bg-[#D4AF37]" />
                </span>

                <h2
                  className={`${marcellus.className} text-[34px] leading-[1.12] text-[#faf9f6]`}
                >
                  Let’s Discuss Your Requirements
                </h2>
                <span
                  aria-hidden="true"
                  className="mt-5 block h-[3px] w-16 rounded-full bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]"
                />
                <p className="mt-5 text-[15px] leading-relaxed text-[#faf9f6]/70">
                  Share a few details and our team will get back to you with the
                  right guidance.
                </p>

                <a
                  href={PHONE_HREF}
                  className="group mt-auto flex items-center gap-4 rounded-2xl border border-[#faf9f6]/10 bg-[#faf9f6]/[0.04] px-4 py-3.5 transition duration-300 hover:border-[#D4AF37]/50 hover:bg-[#faf9f6]/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcd39]"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#F5D77A] transition duration-300 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-[#F5D77A] group-hover:to-[#B8902F] group-hover:text-[#0f2645]">
                    <Phone size={19} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-[#faf9f6]/55">
                      Call us directly
                    </span>
                    <span className="block truncate text-base text-[#faf9f6]">
                      {PHONE}
                    </span>
                  </span>
                </a>
              </div>
            </div>

            {/* ===== Right: form ===== */}
            <div className="min-w-0 p-6 sm:p-10">
              {status === "success" ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="flex min-h-[420px] flex-col items-center justify-center text-center"
                >
                  <motion.span
                    initial={reduce ? false : { scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 16 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#e2a10d] via-[#ffcd39] to-[#e2a10d] text-[#0f2645] ring-8 ring-[#D4AF37]/15"
                  >
                    <CheckCircle2 size={28} aria-hidden="true" />
                  </motion.span>
                  <h3
                    id="enquiry-modal-title"
                    className={`${marcellus.className} mt-6 text-3xl text-[#0f2645]`}
                  >
                    {firstName ? `Thank you, ${firstName}` : "Thank you"}
                  </h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#0f2645]/70">
                    Your enquiry has been submitted. Our team will get in touch
                    with you soon.
                  </p>
                  <button
                    type="button"
                    onClick={handleDone}
                    className="mt-7 inline-flex items-center rounded-full bg-[#0f2645] px-8 py-3 text-sm font-medium text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition hover:bg-gradient-to-r hover:from-[#D4AF37] hover:via-[#F5D77A] hover:to-[#D4AF37] hover:text-[#0f2645] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span
                      className="h-px w-10"
                      style={{
                        background: "linear-gradient(90deg, #e2a10d, #ffcd39)",
                      }}
                    />
                    <span className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#0f2645]/70">
                      Enquiry
                    </span>
                  </div>

                  <h3
                    id="enquiry-modal-title"
                    className={`${marcellus.className} mt-4 pr-12 text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.15] tracking-tight text-[#0f2645]`}
                  >
                    Send us an enquiry
                  </h3>
                 

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="mt-7 space-y-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="modal-name" className={labelClass}>
                          Full Name *
                        </label>
                        <input
                          ref={firstFieldRef}
                          id="modal-name"
                          name="name"
                          type="text"
                          required
                          autoComplete="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="Your full name"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "err-name" : undefined}
                          className={`${inputBase} ${errors.name ? badBorder : okBorder}`}
                        />
                        <FieldError id="err-name" message={errors.name} />
                      </div>
                      <div>
                        <label htmlFor="modal-phone" className={labelClass}>
                          Phone Number *
                        </label>
                        <input
                          id="modal-phone"
                          name="phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          inputMode="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="+91 00000 00000"
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? "err-phone" : undefined}
                          className={`${inputBase} ${errors.phone ? badBorder : okBorder}`}
                        />
                        <FieldError id="err-phone" message={errors.phone} />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="modal-email" className={labelClass}>
                          Email Address
                        </label>
                        <input
                          id="modal-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={loading}
                          placeholder="you@example.com"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "err-email" : undefined}
                          className={`${inputBase} ${errors.email ? badBorder : okBorder}`}
                        />
                        <FieldError id="err-email" message={errors.email} />
                      </div>
                      <div>
                        <label htmlFor="modal-type" className={labelClass}>
                          Enquiry Type
                        </label>
                        <select
                          id="modal-type"
                          name="enquiryType"
                          value={formData.enquiryType}
                          onChange={handleChange}
                          disabled={loading}
                          className={`${inputBase} ${okBorder}`}
                        >
                          <option value="">Select type</option>
                          {enquiryTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="modal-message" className={labelClass}>
                        Message
                      </label>
                      <textarea
                        id="modal-message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Tell us about your requirements..."
                        className={`${inputBase} ${okBorder} resize-y`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative mt-1 inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#0f2645] py-2.5 pl-6 pr-2.5 text-sm font-medium text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#0f2645] hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:ring-[#D4AF37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
                      />
                      <span className="relative z-10">
                        {loading ? "Submitting…" : "Send Enquiry"}
                      </span>
                      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#0f2645] transition-all duration-500 group-hover:bg-none group-hover:bg-[#0f2645] group-hover:text-[#F5D77A]">
                        {loading ? (
                          <Loader2
                            size={14}
                            className="animate-spin"
                            aria-hidden="true"
                          />
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
                      {status === "error" && (
                        <p
                          role="alert"
                          className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                          <AlertCircle
                            size={18}
                            className="mt-0.5 shrink-0"
                            aria-hidden="true"
                          />
                          {serverError}
                        </p>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}