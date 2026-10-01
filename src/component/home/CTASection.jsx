"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Marcellus } from "next/font/google";
import {
  FiPhone,
  FiMessageCircle,
  FiClock,
  FiArrowRight,
  FiCheckCircle,
  FiAlertCircle,
  FiLock,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const serif = `${marcellus.className} font-normal`;

// Shared gold gradient (#e2a10d -> #ffcd39 -> #e2a10d)
const goldBg = "bg-gradient-to-br from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";
const goldText = `${goldBg} bg-clip-text text-transparent`;
// Icons are stroke-based, so they use the SVG gradient defined in the component
const goldStroke = { stroke: "url(#cta-gold)" };

// TODO: replace with your real details
const PHONE = "+91 9999300301";
const PHONE_HREF = "tel:+9999300301";
const WHATSAPP_URL = "https://wa.me/919999300301";
const HOURS = "Mon – Sat, 10 AM – 7 PM";

const contactLinks = [
  { icon: FiPhone, label: "Call us", value: PHONE, href: PHONE_HREF },
  {
    icon: FiMessageCircle,
    label: "WhatsApp",
    value: "Chat with our team",
    href: WHATSAPP_URL,
    external: true,
  },
  { icon: FiClock, label: "Working hours", value: HOURS },
];

const fieldClass =
  "w-full rounded-xl border border-[#1a2a22]/15 bg-[#faf9f6] px-4 py-3.5 text-base text-[#1a2a22] placeholder:text-[#52685B]/70 shadow-sm transition focus:border-[#e2a10d] focus:outline-none focus:ring-4 focus:ring-[#ffcd39]/30 disabled:opacity-60";
const labelClass = "mb-1.5 block text-sm font-medium text-[#1a2a22]";

export default function CTACallback({ image = null }) {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [status, setStatus] = useState("idle"); 
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          email: "",
          enquiryType: "General Enquiry",
          message: "Callback request from website CTA",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || data.error || "Something went wrong.");
      }
      setStatus("success");
      setForm({ name: "", phone: "" });
    } catch (err) {
      setErrorMsg(err.message || "Unable to send. Please try again.");
      setStatus("error");
    }
  };

  const loading = status === "loading";

  return (
    <section
      className="bg-[#faf9f6] py-16 sm:py-20 lg:py-24"
      aria-labelledby="cta-callback-heading"
    >
      {/* Gradient definition used by the stroke icons (keep width/height 0, not display:none) */}
      <svg
        width="0"
        height="0"
        aria-hidden="true"
        className="pointer-events-none absolute"
      >
        <defs>
          <linearGradient
            id="cta-gold"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="24"
            y2="24"
          >
            <stop offset="0%" stopColor="#e2a10d" />
            <stop offset="50%" stopColor="#ffcd39" />
            <stop offset="100%" stopColor="#e2a10d" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Gradient-bordered card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className={`rounded-[28px] p-[1.5px] shadow-[0_30px_70px_-30px_rgba(26,42,34,0.55)] `}
        >
          <div className="grid overflow-hidden rounded-[27px] lg:grid-cols-2">
            {/* LEFT — message + contact details */}
            <div className="relative bg-[#1a2a22] p-7 sm:p-10 lg:p-14">
              {image && (
                <>
                  <img
                    src={image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full object-cover opacity-25"
                  />
                  <div className="absolute inset-0 bg-[#1a2a22]/80" />
                </>
              )}
              {/* Gold glows */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ffcd39]/15 blur-3xl"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-[#e2a10d]/15 blur-3xl"
              />

              <div className="relative">
                <p className={`${goldText} inline-block text-sm font-semibold`}>
                  Talk to an expert
                </p>

                <h2
                  id="cta-callback-heading"
                  className={`${serif} mt-3 text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.12] tracking-tight text-[#faf9f6]`}
                >
                  Let Us Call You Back
                </h2>
                <div
                  aria-hidden="true"
                  className={`mt-5 h-[3px] w-16 rounded-full ${goldBg}`}
                />
                <p className="mt-5 max-w-md text-base leading-relaxed text-[#faf9f6]/70">
                  Share your name and number. Our team will reach out with
                  honest, no-pressure guidance on the right property for you.
                </p>

                <ul className="mt-9 space-y-3">
                  {contactLinks.map(
                    ({ icon: Icon, label, value, href, external }) => {
                      const content = (
                        <>
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#ffcd39]/30 bg-[#faf9f6]/[0.06]">
                            <Icon
                              size={20}
                              aria-hidden="true"
                              style={goldStroke}
                            />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-xs text-[#faf9f6]/55">
                              {label}
                            </span>
                            <span className="block break-words text-base text-[#faf9f6]">
                              {value}
                            </span>
                          </span>
                        </>
                      );
                      const rowClass =
                        "flex items-center gap-4 rounded-2xl border border-[#faf9f6]/10 bg-[#faf9f6]/[0.04] p-3";
                      return (
                        <li key={label}>
                          {href ? (
                            <a
                              href={href}
                              {...(external && {
                                target: "_blank",
                                rel: "noopener noreferrer",
                              })}
                              className={`${rowClass} transition hover:border-[#ffcd39]/50 hover:bg-[#faf9f6]/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcd39]`}
                            >
                              {content}
                            </a>
                          ) : (
                            <div className={rowClass}>{content}</div>
                          )}
                        </li>
                      );
                    },
                  )}
                </ul>
              </div>
            </div>

            {/* RIGHT — callback form */}
            <div className="bg-[#f3f0E8] p-7 sm:p-10 lg:p-14">
              <h3 className={`${serif} text-2xl text-[#1a2a22] sm:text-3xl`}>
                Request a Callback
              </h3>
              <p className="mt-2 text-sm text-[#52685B]">
                Takes less than a minute. Both fields are required.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="cta-name" className={labelClass}>
                    Full Name *
                  </label>
                  <input
                    id="cta-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Your full name"
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="cta-phone" className={labelClass}>
                    Phone Number *
                  </label>
                  <input
                    id="cta-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    pattern="[0-9+\-\s]{10,15}"
                    title="Enter a valid phone number"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="+91 00000 00000"
                    className={fieldClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`group inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold text-[#1a2a22] shadow-[0_10px_25px_-10px_rgba(226,161,13,0.8)] transition hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_14px_30px_-10px_rgba(226,161,13,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a2a22] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f0E8] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 ${goldBg}`}
                >
                  {loading ? (
                    <>
                      <CgSpinner
                        size={20}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Request Callback
                      <FiArrowRight
                        className="transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>

                <p className="flex items-center justify-center gap-2 text-xs text-[#52685B]">
                  <FiLock size={13} aria-hidden="true" />
                  Your details stay private. We never share your number.
                </p>

                <div aria-live="polite">
                  {status === "success" && (
                    <p className="flex items-start gap-2 rounded-xl border border-[#e2a10d]/40 bg-[#faf9f6] px-4 py-3 text-sm text-[#1a2a22]">
                      <FiCheckCircle
                        size={18}
                        className="mt-0.5 shrink-0"
                        style={goldStroke}
                        aria-hidden="true"
                      />
                      Thank you! We’ll call you back shortly.
                    </p>
                  )}
                  {status === "error" && (
                    <p
                      role="alert"
                      className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      <FiAlertCircle
                        size={18}
                        className="mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      {errorMsg}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
