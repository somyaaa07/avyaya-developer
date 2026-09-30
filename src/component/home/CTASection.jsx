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
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const serif = `${marcellus.className} font-normal`;

// TODO: replace with your real details
const PHONE = "+91 7004397655";
const PHONE_HREF = "tel:+917004397655";
const WHATSAPP_URL = "https://wa.me/917004397655";
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
  "w-full rounded-xl border border-[#1a2a22]/15 bg-[#faf9f6] px-4 py-3 text-base text-[#1a2a22] placeholder:text-[#52685B]/70 transition focus:border-[#52685B] focus:outline-none focus:ring-2 focus:ring-[#52685B]/30 disabled:opacity-60";
const labelClass = "mb-1.5 block text-sm font-medium text-[#1a2a22]";

export default function CTACallback({ image = null }) {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="grid overflow-hidden rounded-3xl shadow-[0_25px_60px_-30px_rgba(26,42,34,0.5)] lg:grid-cols-2"
        >
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
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#52685B]/30 blur-3xl"
            />

            <div className="relative">
              <div className="flex items-center gap-3">
                <span
                  className="h-px w-10 bg-[#f3f0E8]/60"
                  aria-hidden="true"
                />
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f3f0E8]">
                  Talk to an Expert
                </span>
              </div>

              <h2
                id="cta-callback-heading"
                className={`${serif} mt-5 text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.12] tracking-tight text-[#faf9f6]`}
              >
                Let Us Call You Back
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#faf9f6]/70">
                Share your name and number. Our team will reach out with honest,
                no-pressure guidance on the right property for you.
              </p>

              <ul className="mt-9 space-y-5">
                {contactLinks.map(
                  ({ icon: Icon, label, value, href, external }) => (
                    <li key={label} className="flex items-center gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#faf9f6]/10 text-[#f3f0E8]">
                        <Icon size={19} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-widest text-[#faf9f6]/55">
                          {label}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            {...(external && {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            })}
                            className="break-words text-base text-[#faf9f6] transition hover:text-[#f3f0E8] focus:outline-none focus-visible:underline"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-base text-[#faf9f6]">{value}</p>
                        )}
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          {/* RIGHT — callback form */}
          <div className="bg-[#f3f0E8] p-7 sm:p-10 lg:p-14">
            <h3 className={`${serif} text-2xl text-[#1a2a22]`}>
              Request a Callback
            </h3>
            <p className="mt-1 text-sm text-[#52685B]">
              Takes less than a minute. Both fields are required.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
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
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a2a22] px-6 py-3.5 text-sm font-semibold text-[#faf9f6] transition hover:bg-[#52685B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#52685B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f0E8] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <CgSpinner
                      size={18}
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

              <div aria-live="polite">
                {status === "success" && (
                  <p className="flex items-start gap-2 rounded-xl bg-[#faf9f6] px-4 py-3 text-sm text-[#1a2a22]">
                    <FiCheckCircle
                      size={18}
                      className="mt-0.5 shrink-0 text-[#52685B]"
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
        </motion.div>
      </div>
    </section>
  );
}
