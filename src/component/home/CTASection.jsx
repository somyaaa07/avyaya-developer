"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Marcellus } from "next/font/google";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiPhone,
  
  FiClock,
  FiArrowRight,
  FiCheck,
  FiAlertCircle,
  FiLock,
  FiUser,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
const serif = `${marcellus.className} font-normal`;

const goldBg = "bg-gradient-to-r from-[#e2a10d] via-[#ffcd39] to-[#e2a10d]";

// TODO: replace with your real details
const PHONE = "+91 9999300301";
const PHONE_HREF = "tel:+9999300301";
const WHATSAPP_URL = "https://wa.me/919999300301";
const HOURS = "Mon – Sat, 10 AM – 7 PM";

const contactLinks = [
  { icon: FiPhone, label: "Call us", value: PHONE, href: PHONE_HREF },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: "Chat with our team",
    href: WHATSAPP_URL,
    external: true,
  },
  { icon: FiClock, label: "Working hours", value: HOURS },
];

const fieldClass =
  "w-full rounded-xl border border-[#1a2a22]/15 bg-[#f3f0E8]/60 py-3.5 pl-11 pr-4 text-base text-[#1a2a22] placeholder:text-[#52685B]/70 transition focus:border-[#D4AF37] focus:bg-[#faf9f6] focus:outline-none focus:ring-4 focus:ring-[#ffcd39]/30 disabled:opacity-60";
const labelClass = "mb-1.5 block text-sm text-[#1a2a22]";
const fieldIcon =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#52685B]";

export default function CTACallback({ image = null }) {
  const reduce = useReducedMotion();
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
      className="bg-[#f3f0E8] py-16 sm:py-20 lg:py-24"
      aria-labelledby="cta-callback-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[28px] bg-[#1a2a22] shadow-[0_30px_70px_-30px_rgba(26,42,34,0.55)]"
        >
          {/* top gold line */}
          <span
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 z-10 h-[3px] ${goldBg}`}
          />
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
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#e2a10d]/10 blur-3xl"
          />

          <div className="relative grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:p-14">
            {/* ===== LEFT: message + contact ===== */}
            <div className="min-w-0">
              <h2
                id="cta-callback-heading"
                className={`${serif} text-[clamp(1.9rem,3.8vw,3rem)] leading-[1.12] tracking-tight text-[#faf9f6]`}
              >
                Let Us Call You Back
              </h2>
              <span
                aria-hidden="true"
                className={`mt-5 block h-[3px] w-16 rounded-full ${goldBg}`}
              />
              <p className="mt-5 max-w-md text-base leading-relaxed text-[#faf9f6]/70">
                Share your name and number. Our team will reach out with honest,
                no-pressure guidance on the right property for you.
              </p>

              <ul className="mt-9 divide-y divide-[#faf9f6]/10 border-y border-[#faf9f6]/10">
                {contactLinks.map(({ icon: Icon, label, value, href, external }) => {
                  const content = (
                    <>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#faf9f6]/10 text-[#F5D77A] transition group-hover:bg-gradient-to-br group-hover:from-[#F5D77A] group-hover:to-[#B8902F] group-hover:text-[#1a2a22]">
                        <Icon size={20} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs text-[#faf9f6]/55">{label}</span>
                        <span className="block break-words text-base text-[#faf9f6]">
                          {value}
                        </span>
                      </span>
                      {href && (
                        <FiArrowRight
                          size={16}
                          aria-hidden="true"
                          className="shrink-0 text-[#faf9f6]/40 transition group-hover:translate-x-1 group-hover:text-[#F5D77A]"
                        />
                      )}
                    </>
                  );
                  const rowClass = "group flex items-center gap-4 py-4";
                  return (
                    <li key={label}>
                      {href ? (
                        <a
                          href={href}
                          {...(external && {
                            target: "_blank",
                            rel: "noopener noreferrer",
                          })}
                          className={`${rowClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffcd39]`}
                        >
                          {content}
                        </a>
                      ) : (
                        <div className={rowClass}>{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ===== RIGHT: form card ===== */}
            <div className="min-w-0 rounded-3xl bg-[#faf9f6] p-6 shadow-xl sm:p-9">
              {status === "success" ? (
                <div aria-live="polite" className="py-6 text-center">
                  <span
                    className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[#1a2a22] ${goldBg}`}
                  >
                    <FiCheck size={28} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <h3 className={`${serif} mt-6 text-2xl text-[#1a2a22] sm:text-3xl`}>
                    Request received
                  </h3>
                  <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-[#52685B]">
                    Thank you! We’ll call you back shortly on the number you shared.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-7 text-sm text-[#52685B] underline underline-offset-4 transition hover:text-[#1a2a22]"
                  >
                    Send another request
                  </button>
                </div>
              ) : (
                <>
                  <h3 className={`${serif} text-2xl text-[#1a2a22] sm:text-3xl`}>
                    Request a Callback
                  </h3>
                  <p className="mt-2 text-sm text-[#52685B]">
                    Takes less than a minute. Both fields are required.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                      <label htmlFor="cta-name" className={labelClass}>
                        Full name
                      </label>
                      <div className="relative">
                        <FiUser size={17} className={fieldIcon} aria-hidden="true" />
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
                    </div>

                    <div>
                      <label htmlFor="cta-phone" className={labelClass}>
                        Phone number
                      </label>
                      <div className="relative">
                        <FiPhone size={17} className={fieldIcon} aria-hidden="true" />
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
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="group relative inline-flex w-full items-center justify-between overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-7 pr-2.5 text-base text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-70"
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
                        {loading ? "Sending..." : "Request Callback"}
                      </span>
                      <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
                        {loading ? (
                          <CgSpinner size={20} className="animate-spin" aria-hidden="true" />
                        ) : (
                          <FiArrowRight
                            size={16}
                            className="transition-transform duration-500 group-hover:-rotate-45"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </button>

                    <p className="flex items-center justify-center gap-2 text-xs text-[#52685B]">
                      <FiLock size={13} aria-hidden="true" />
                      Your details stay private. We never share your number.
                    </p>

                    <div aria-live="polite">
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
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}