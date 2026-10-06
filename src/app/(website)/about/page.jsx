'use-client'

import Image from "next/image";
import Link from "next/link";
import { Marcellus } from "next/font/google";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarCheck,
  ClipboardList,
  Eye,
  Handshake,
  Home,
  KeyRound,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Settings,
  ShieldCheck,
  Star,
  Target,
  Users,
} from "lucide-react";
import FaqAccordion from "@/component/about/FaqAccordion";
import ProcessSection from "@/component/about/ProcessSection";
const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

/* ---------------------------------------------------------------
   COLORS (unchanged)
   Ink #1A2A22 | Moss #52685B | Navy #0f2645
   Paper #FAF9F6 | Sand #F3F0E8
   Gold #D4AF37 / #F5D77A / #D4A62A / #B8902F
---------------------------------------------------------------- */

const SITE_URL = "https://www.bringorealestates.com";

/* Change this if your site navbar height is different (sticky section menu sits below it) */
const STICKY_TOP = "top-16 lg:top-20";

const BUSINESS = {
  name: "Bringo Real Estates",
  phoneDisplay: "7004397655",
  phoneTel: "+917004397655",
  email: "nfo@avyayadeveloper.com",
  addressLines: [
    'Office Number 1529, 15th Floor Galaxy Diamond Plaza, Sector 4 Greater Noida,Uttar Pradesh - 201009'
  ],
  schemaAddress: {
    "@type": "PostalAddress",
    streetAddress: "Office Number 1529, 15th Floor Galaxy Diamond Plaza, Sector 4",
    addressLocality: "Greater Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201009",
    addressCountry: "IN",
  },
};

const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  "Bringo Real Estates, Kaveri City Center, Delta 1, Greater Noida"
)}`;

export const metadata = {
  title: "About Avyaya Developer | Property Dealers in Greater Noida",
  description:
    "Bringo Real Estates helps families and investors buy, sell and invest in residential and commercial properties in Greater Noida. Transparent deals, verified projects and end-to-end support. Call 99993 00301.",
  keywords: [
    "Bringo Real Estates",
    "real estate Greater Noida",
    "property dealers in Greater Noida",
    "buy flat in Greater Noida",
    "commercial property Greater Noida",
    "Kaveri City Center Delta 1",
    "RERA approved properties",
  ],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "About Bringo Real Estates | More Than Properties, We Build Futures",
    description:
      "Trusted real estate consultants in Greater Noida for homes, plots and commercial spaces.",
    url: `${SITE_URL}/about`,
    siteName: BUSINESS.name,
    images: [{ url: "/image/about.png", width: 1200, height: 630 }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Avyaya Developer",
    description: "More than properties, we build futures.",
    images: ["/image/about.png"],
  },
};

/* ---------------------------------------------------------------
   CONTENT  (verify stats are real before going live)
---------------------------------------------------------------- */
const stats = [
  { icon: Home, value: "500+", label: "Properties sold" },
  { icon: Users, value: "10,000+", label: "Happy customers" },
  { icon: Building2, value: "50+", label: "Ongoing projects" },
  { icon: Star, value: "4.8/5", label: "Customer rating" },
];

const values = [
  { icon: Handshake, title: "Trusted & transparent", text: "Fair deals and clear processes" },
  { icon: Settings, title: "Quality construction", text: "Built with excellence" },
  { icon: Users, title: "Customer-centric", text: "Your goals, our priority" },
];

const steps = [
  {
    icon: ClipboardList,
    title: "Tell us what you need",
    text: "Share your budget, preferred area and whether it is a home or an investment. A short call is enough.",
  },
  {
    icon: ShieldCheck,
    title: "Get verified options",
    text: "We shortlist only RERA registered projects that match your brief and share the registration details up front.",
  },
  {
    icon: CalendarCheck,
    title: "Visit with us",
    text: "We arrange a guided site visit at a time that suits you, so you can compare in person.",
  },
  {
    icon: KeyRound,
    title: "Book and move in",
    text: "We help with home loan options, paperwork and handover support until you receive the keys.",
  },
];

const reasons = [
  { icon: MapPin, title: "Prime locations", text: "Well-connected projects across Greater Noida" },
  { icon: Building2, title: "Modern design", text: "Thoughtfully designed for modern living" },
  { icon: Leaf, title: "Sustainable living", text: "Eco-friendly and future-ready spaces" },
  { icon: ShieldCheck, title: "End-to-end support", text: "From search to ownership, we're with you" },
];

const faqs = [
  {
    q: "What types of properties do you offer?",
    a: "We offer apartments, villas, plots and commercial spaces in Greater Noida and nearby areas, all selected for location, quality and long-term value.",
  },
  {
    q: "How can I schedule a property visit?",
    a: "Call us on 99993 00301 or use the Contact page. We will confirm a convenient time and arrange a guided site visit for you.",
  },
  {
    q: "Do you provide financing assistance?",
    a: "Yes. We help you compare home loan options from leading banks and guide you through the paperwork.",
  },
  {
    q: "Are your properties RERA approved?",
    a: "We only recommend RERA registered projects, and we share the registration details before you make any booking.",
  },
  {
    q: "What makes your company different?",
    a: "Transparent pricing, verified projects and a dedicated team that supports you from your first enquiry to handover and beyond.",
  },
];

const navLinks = [
  { href: "#story", label: "Our story" },
  { href: "#process", label: "How we work" },
  { href: "#why", label: "Why Bringo" },
  { href: "#vision", label: "Vision" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": `${SITE_URL}/#business`,
      name: BUSINESS.name,
      url: SITE_URL,
      telephone: BUSINESS.phoneTel,
      email: BUSINESS.email,
      image: `${SITE_URL}/image/about.png`,
      address: BUSINESS.schemaAddress,
      areaServed: ["Greater Noida", "Noida", "Gautam Buddha Nagar"],
      description:
        "Bringo Real Estates helps families, businesses and investors buy, sell and invest in residential and commercial properties in Greater Noida.",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "About", item: `${SITE_URL}/about` },
      ],
    },
  ],
};

/* ---------------------------------------------------------------
   SMALL PIECES
---------------------------------------------------------------- */
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]";

const Label = ({ children, light = false }) => (
  <p className={`flex items-center gap-3 text-sm ${light ? "text-[#F5D77A]" : "text-[#52685B]"}`}>
    <span className={`h-px w-8 ${light ? "bg-[#F5D77A]/60" : "bg-[#D4A62A]"}`} aria-hidden="true" />
    {children}
  </p>
);

const BtnGold = ({ href, children, icon: Icon = ArrowRight, external = false }) => {
  const cls = `group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] py-2.5 pl-6 pr-2.5 text-sm text-[#1A2A22] transition-all duration-500 hover:shadow-[0_10px_30px_rgba(212,175,55,0.45)] ${focusRing}`;
  const inner = (
    <>
      {children}
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f2645] text-[#F5D77A] transition-transform duration-500 group-hover:-rotate-45">
        <Icon size={14} />
      </span>
    </>
  );
  return external || href.startsWith("tel:") || href.startsWith("mailto:") ? (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
};

const BtnNavy = ({ href, children }) => (
  <Link
    href={href}
    className={`group inline-flex items-center gap-3 rounded-full bg-[#0f2645] py-2.5 pl-6 pr-2.5 text-sm text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:ring-[#F5D77A] hover:shadow-[0_10px_30px_rgba(15,38,69,0.35)] ${focusRing}`}
  >
    {children}
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-transform duration-500 group-hover:-rotate-45">
      <ArrowRight size={14} />
    </span>
  </Link>
);

/* ---------------------------------------------------------------
   PAGE
---------------------------------------------------------------- */
export default function AboutPage() {
  return (
    <main
      className={`${marcellus.variable} scroll-smooth overflow-x-clip bg-[#FAF9F6] pb-20 font-[family-name:var(--font-marcellus)] font-normal text-[#1A2A22] lg:pb-0`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============ 1. FULL-BLEED HERO ============ */}
      <section aria-labelledby="about-hero" className="relative isolate min-h-[88vh] text-[#FAF9F6]">
        <Image
          src="/image/hero.png"
          alt="Modern sustainable villa with glass balconies surrounded by greenery"
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0f2645] via-[#0f2645]/55 to-[#0f2645]/20"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0f2645]/70 via-transparent to-transparent"
        />

        <div className="mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 pb-10 pt-28 sm:px-8">
          <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <Label light>About Bringo Real Estates</Label>
              <h1
                id="about-hero"
                className="mt-5 max-w-3xl text-[2.9rem] leading-[1.03] sm:text-6xl lg:text-7xl"
              >
                More than properties, we build futures
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-[#FAF9F6]/85">
                Real estate is about people, dreams and a better tomorrow. From our office in Greater
                Noida, we help families, businesses and investors find modern, sustainable and
                high-value spaces.
              </p>
            </div>

            {/* Glass quick-action panel */}
            <div className="rounded-3xl border border-[#FAF9F6]/20 bg-[#FAF9F6]/10 p-6 backdrop-blur-md">
              <p className="text-xl">Looking for a property?</p>
              <p className="mt-1 text-sm text-[#FAF9F6]/80">
                Talk to an advisor or browse verified projects.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <BtnGold href={`tel:${BUSINESS.phoneTel}`} icon={Phone}>
                  Call {BUSINESS.phoneDisplay}
                </BtnGold>
                <Link
                  href="/projects"
                  className={`inline-flex items-center justify-center gap-2 rounded-full border border-[#FAF9F6]/40 px-6 py-3 text-sm transition hover:bg-[#FAF9F6] hover:text-[#1A2A22] ${focusRing}`}
                >
                  View projects
                </Link>
              </div>
            </div>
          </div>

          {/* Stats strip inside hero */}
          <dl className="mt-12 grid grid-cols-2 gap-y-6 border-t border-[#FAF9F6]/25 pt-6 lg:grid-cols-4">
            {stats.map(({ icon: Icon, value, label }, i) => (
              <div
                key={label}
                className={`flex items-center gap-3 ${i % 2 === 1 ? "pl-4" : ""} ${
                  i !== 0 ? "lg:border-l lg:border-[#FAF9F6]/20 lg:pl-8" : ""
                }`}
              >
                <Icon size={22} strokeWidth={1.4} className="shrink-0 text-[#F5D77A]" />
                <div>
                  <dd className="text-2xl leading-none">{value}</dd>
                  <dt className="mt-1 text-xs text-[#FAF9F6]/75">{label}</dt>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============ 2. STICKY SECTION MENU ============ */}
      <nav
        aria-label="On this page"
        className={`  z-30 border-b border-[#52685B]/15 bg-[#FAF9F6]/90 backdrop-blur`}
      >
        <ul className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 sm:px-8 [scrollbar-width:none]">
          {navLinks.map((l) => (
            <li key={l.href} className="shrink-0">
              <a
                href={l.href}
                className={`block rounded-full px-4 py-1.5 text-sm text-[#52685B] transition hover:bg-[#0f2645] hover:text-[#FAF9F6] ${focusRing}`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ============ 3. STORY: statement + mosaic ============ */}
      <section id="story" aria-labelledby="story-title" className="mx-auto max-w-7xl scroll-mt-32 px-5 py-20 sm:px-8 lg:py-28">
        <Label>Our story</Label>
        <h2
          id="story-title"
          className="mt-5 max-w-5xl text-3xl leading-[1.25] text-[#0f2645] sm:text-4xl lg:text-5xl"
        >
          We started with a simple vision: to transform the way people experience real estate in
          Greater Noida.
        </h2>

        <div className="mt-14 grid gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          {/* Tall arch image */}
          <div className="relative min-h-[360px] overflow-hidden rounded-t-[160px] rounded-b-3xl lg:col-span-4 lg:row-span-2 lg:min-h-[560px]">
            <Image
              src="/image/about.png"
              alt="Contemporary home exterior with large windows"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Story text */}
          <div className="rounded-3xl bg-[#F3F0E8] p-8 lg:col-span-5 lg:p-10">
            <p className="text-base leading-[1.8] text-[#52685B]">
              From residential homes to commercial spaces, we help you choose value-driven
              properties that blend modern design, strategic locations and long-term growth
              potential.
            </p>
            <p className="mt-4 text-base leading-[1.8] text-[#52685B]">
              Our focus is on verified projects, transparent processes and a customer-first
              approach, so every client finds a space that truly feels like home.
            </p>
            <div className="mt-7">
              <BtnNavy href="/contact">Talk to our team</BtnNavy>
            </div>
          </div>

          {/* Small image */}
          <div className="relative min-h-[240px] overflow-hidden rounded-3xl lg:col-span-3">
            <Image
              src="/image/about1.jpeg"
              alt="Bright living room with sofa and indoor plants"
              fill
              sizes="(min-width: 1024px) 25vw, 100vw"
              className="object-cover"
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-[#FAF9F6] px-4 py-2 text-xs text-[#1A2A22]">
              <Leaf size={14} className="text-[#D4A62A]" /> Sustainable living
            </div>
          </div>

          {/* Values row */}
          <ul className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
            {values.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-3xl border border-[#52685B]/20 p-6">
                <Icon className="text-[#D4A62A]" size={28} strokeWidth={1.4} />
                <h3 className="mt-4 text-base text-[#1A2A22]">{title}</h3>
                <p className="mt-1 text-sm text-[#52685B]">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

{/* ============ 4. PROCESS: sticky heading + vertical timeline ============ */}

{/* ============ 4. PROCESS ============ */}
<ProcessSection phoneTel={BUSINESS.phoneTel} />


      {/* ============ 5. WHY: image-led split with list ============ */}
      <section id="why" aria-labelledby="why-title" className="mx-auto max-w-7xl scroll-mt-32 px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid items-stretch gap-10 lg:grid-cols-2">
          <div className="relative min-h-[380px] overflow-hidden rounded-3xl lg:min-h-full">
            <Image
              src="/image/heroo.jpeg"
              alt="Sustainable community project"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
            <Link
              href="/projects"
              className={`group absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-[#FAF9F6] p-4 transition hover:-translate-y-1 ${focusRing}`}
            >
              <span>
                <span className="block text-sm">Creating</span>
                <span className="block text-sm text-[#52685B]">Sustainable communities</span>
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0f2645] text-[#FAF9F6] transition group-hover:bg-[#D4AF37] group-hover:text-[#1A2A22]">
                <ArrowUpRight size={16} />
              </span>
            </Link>
          </div>

          <div className="flex flex-col justify-center">
            <Label>Why choose Bringo</Label>
            <h2 id="why-title" className="mt-4 text-3xl leading-tight text-[#0f2645] sm:text-4xl">
              A better way to find your perfect space
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[#52685B]">
              We combine experience, local market knowledge and customer focus to deliver real
              estate solutions that make a difference.
            </p>

            <ul className="mt-8 divide-y divide-[#52685B]/20 border-y border-[#52685B]/20">
              {reasons.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-center gap-5 py-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F3F0E8] text-[#D4A62A]">
                    <Icon size={22} strokeWidth={1.4} />
                  </span>
                  <div>
                    <h3 className="text-lg text-[#1A2A22]">{title}</h3>
                    <p className="text-sm text-[#52685B]">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ 6. VISION / MISSION over full-width image ============ */}
      <section id="vision" aria-labelledby="vision-title" className="relative isolate scroll-mt-32 text-[#FAF9F6]">
        <Image
          src="/image/cta.jpeg"
          alt="Dining area with large windows and indoor plants"
          fill
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[#1A2A22]/75" />
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-2xl">
            <Label light>Our people</Label>
            <h2 id="vision-title" className="mt-5 text-4xl leading-tight sm:text-5xl">
              Driven by people. Inspired by possibilities.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#FAF9F6]/85">
              Our team of real estate experts, designers and strategists work together to create
              exceptional spaces that enrich lives and communities.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-3xl border border-[#FAF9F6]/20 bg-[#FAF9F6]/10 p-8 backdrop-blur-md">
              <Eye size={30} strokeWidth={1.4} className="text-[#F5D77A]" />
              <h3 className="mt-5 text-2xl">Vision</h3>
              <p className="mt-2 text-base leading-relaxed text-[#FAF9F6]/85">
                To create sustainable and future-ready communities.
              </p>
            </div>
            <div className="rounded-3xl border border-[#FAF9F6]/20 bg-[#FAF9F6]/10 p-8 backdrop-blur-md">
              <Target size={30} strokeWidth={1.4} className="text-[#F5D77A]" />
              <h3 className="mt-5 text-2xl">Mission</h3>
              <p className="mt-2 text-base leading-relaxed text-[#FAF9F6]/85">
                To deliver high-quality spaces with trust, innovation and care.
              </p>
            </div>
          </div>

          <div className="mt-10">
            <BtnGold href="/team">Meet our team</BtnGold>
          </div>
        </div>
      </section>

      {/* ============ 7. FAQ: sticky heading left, accordion right ============ */}
      <section id="faq" aria-labelledby="faq-title" className="mx-auto max-w-7xl scroll-mt-32 px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div className="lg:sticky lg:top-40 lg:self-start">
            <Label>FAQ</Label>
            <h2 id="faq-title" className="mt-4 text-4xl leading-tight text-[#0f2645] sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-[#52685B]">
              Quick answers to what we hear most. Can&apos;t find yours?
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl">
              <div className="relative aspect-[17/10]">
                <Image
                  src="/image/faq.jpg"
                  alt="Spacious living room with cream sofa and natural light"
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="mt-5">
              <BtnNavy href="/contact">Ask us directly</BtnNavy>
            </div>
          </div>

          <div className="rounded-3xl bg-[#F3F0E8] p-4 sm:p-8">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      {/* ============ 8. CONTACT: split card ============ */}
      <section id="contact" aria-labelledby="cta-title" className="mx-auto max-w-7xl scroll-mt-32 px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="grid overflow-hidden rounded-3xl lg:grid-cols-[1.1fr_1fr]">
          <div className="relative isolate bg-[#0f2645] p-8 text-[#FAF9F6] sm:p-12">
            <Image
              src="/image/ctaa.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="-z-20 object-cover opacity-25 mix-blend-luminosity"
              aria-hidden="true"
            />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0f2645]/60 to-[#0f2645]" />
            <Label light>Let&apos;s find your perfect space</Label>
            <h2 id="cta-title" className="mt-5 text-4xl leading-tight sm:text-5xl">
              Ready to find your dream property?
            </h2>
            <p className="mt-4 max-w-md text-base text-[#FAF9F6]/85">
              Get expert guidance and property options tailored to your needs.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BtnGold href={`tel:${BUSINESS.phoneTel}`} icon={Phone}>
                Call now
              </BtnGold>
              <Link
                href="/contact"
                className={`inline-flex items-center gap-2 rounded-full border border-[#FAF9F6]/40 px-6 py-3 text-sm transition hover:bg-[#FAF9F6] hover:text-[#1A2A22] ${focusRing}`}
              >
                Send an enquiry
              </Link>
            </div>
          </div>

          <address className="flex flex-col justify-center divide-y divide-[#52685B]/20 bg-[#F3F0E8] px-8 py-6 not-italic sm:px-12">
            <a href={`tel:${BUSINESS.phoneTel}`} className={`group flex items-center gap-4 py-5 ${focusRing}`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FAF9F6] text-[#D4A62A]">
                <Phone size={18} />
              </span>
              <span className="flex-1">
                <span className="block text-xs text-[#52685B]">Call us</span>
                <span className="block text-lg text-[#0f2645]">{BUSINESS.phoneDisplay}</span>
              </span>
              <ArrowUpRight size={18} className="text-[#52685B] transition group-hover:text-[#0f2645]" />
            </a>
            <a href={`mailto:${BUSINESS.email}`} className={`group flex items-center gap-4 py-5 ${focusRing}`}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FAF9F6] text-[#D4A62A]">
                <Mail size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs text-[#52685B]">Email us</span>
                <span className="block break-all text-base text-[#0f2645]">{BUSINESS.email}</span>
              </span>
              <ArrowUpRight size={18} className="text-[#52685B] transition group-hover:text-[#0f2645]" />
            </a>
            <a
              href={MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-start gap-4 py-5 ${focusRing}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FAF9F6] text-[#D4A62A]">
                <MapPin size={18} />
              </span>
              <span className="flex-1">
                <span className="block text-xs text-[#52685B]">Visit our office</span>
                <span className="block text-sm leading-relaxed text-[#0f2645]">
                  {BUSINESS.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </span>
              <ArrowUpRight size={18} className="mt-1 text-[#52685B] transition group-hover:text-[#0f2645]" />
            </a>
          </address>
        </div>
      </section>

      {/* ============ MOBILE STICKY ACTION BAR ============ */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#52685B]/15 bg-[#FAF9F6]/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md gap-3">
          <a
            href={`tel:${BUSINESS.phoneTel}`}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full bg-[#0f2645] py-3 text-sm text-[#FAF9F6] ${focusRing}`}
          >
            <Phone size={16} /> Call now
          </a>
          <Link
            href="/contact"
            className={`flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] py-3 text-sm text-[#1A2A22] ${focusRing}`}
          >
            Enquire
          </Link>
        </div>
      </div>
    </main>
  );
}