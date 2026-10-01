import Image from "next/image";
import Link from "next/link";
import { Marcellus } from "next/font/google";
import {
  ArrowRight,
  Building2,
  Eye,
  Handshake,
  Home,
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


const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-marcellus",
  display: "swap",
});

/* ---------------------------------------------------------------
   COLORS
   Primary  : #1A2A22
   Secondary: #52685B
   BG       : #FAF9F6  &  #F3F0E8
---------------------------------------------------------------- */

/* ---------------------------------------------------------------
   BUSINESS DETAILS  
---------------------------------------------------------------- */
const SITE_URL = "https://www.bringorealestates.com"; 

const BUSINESS = {
  name: "Bringo Real Estates",
  phoneDisplay: "9999300301",
  phoneTel: "+919999300301",
  email: "bringo.realstates@gmail.com",
  addressLines: [
    "FF01, FF02 Kaveri City Center, Delta 1,",
    "Greater Noida, Gautam Buddha Nagar,",
    "Uttar Pradesh 201306",
  ],
  schemaAddress: {
    "@type": "PostalAddress",
    streetAddress: "FF01, FF02 Kaveri City Center, Delta 1",
    addressLocality: "Greater Noida",
    addressRegion: "Uttar Pradesh",
    postalCode: "201306",
    addressCountry: "IN",
  },
};

/* ---------------------------------------------------------------
   SEO
---------------------------------------------------------------- */
export const metadata = {
  title: "About Bringo Real Estates | Property Dealers in Greater Noida",
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
    title: "About Bringo Real Estates",
    description: "More than properties, we build futures.",
    images: ["/image/about.png"],
  },
};

/* ---------------------------------------------------------------
   CONTENT
   NOTE: stats 
---------------------------------------------------------------- */
const stats = [
  { icon: Home, value: "500+", label: "Properties Sold" },
  { icon: Users, value: "10,000+", label: "Happy Customers" },
  { icon: Building2, value: "50+", label: "Ongoing Projects" },
  { icon: Star, value: "4.8/5", label: "Customer Rating" },
];

const values = [
  { icon: Handshake, title: "Trusted & Transparent", text: "Fair deals and clear processes" },
  { icon: Settings, title: "Quality Construction", text: "Built with excellence" },
  { icon: Users, title: "Customer-Centric", text: "Your goals, our priority" },
];

const reasons = [
  { icon: MapPin, title: "Prime Locations", text: "Well-connected projects across Greater Noida" },
  { icon: Building2, title: "Modern Design", text: "Thoughtfully designed for modern living" },
  { icon: Leaf, title: "Sustainable Living", text: "Eco-friendly and future-ready spaces" },
  { icon: ShieldCheck, title: "End-to-End Support", text: "From search to ownership, we're with you" },
];

// FAke partners
const partners = ["TATA", "Godrej", "HDFC", "DLF", "PRESTIGE", "SOBHA"];

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
   SMALL REUSABLE PIECES
---------------------------------------------------------------- */
const Eyebrow = ({ children, line = false }) => (
  <p className="flex items-center gap-3 text-[11px] font-normal uppercase tracking-[0.25em] text-[#52685B]">
    {children}
    {line && <span className="h-px w-12 bg-[#52685B]/40" />}
  </p>
);

const BtnDark = ({ href, children }) => (
  <Link
    href={href}
    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#1A2A22] py-2.5 pl-6 pr-2.5 text-sm font-normal text-[#FAF9F6] ring-1 ring-[#D4AF37]/40 transition-all duration-500 hover:text-[#1A2A22] hover:shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:ring-[#F5D77A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
  >
    {/* Golden fill slides in from left */}
    <span
      aria-hidden="true"
      className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#D4AF37] via-[#F5D77A] to-[#D4AF37] transition-transform duration-500 ease-out group-hover:scale-x-100"
    />

    {/* Glass shine sweep */}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -translate-x-full -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-[450%] group-hover:opacity-100"
    />

    <span className="relative z-10">{children}</span>

    {/* Arrow circle */}
    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F5D77A] to-[#B8902F] text-[#1A2A22] transition-all duration-500 group-hover:bg-none group-hover:bg-[#1A2A22] group-hover:text-[#F5D77A]">
      <ArrowRight
        size={14}
        className="transition-transform duration-500 group-hover:-rotate-45"
      />
    </span>
  </Link>
);

const Avatars = () => (
  <div className="flex -space-x-3">
    {[1, 2, 3, 4].map((n) => (
      <Image
        key={n}
        src={`/images/about/avatar-${n}.jpg`}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 rounded-full border-2 border-[#FAF9F6] object-cover"
      />
    ))}
  </div>
);

/* ---------------------------------------------------------------
   PAGE
---------------------------------------------------------------- */
export default function AboutPage() {
  return (
    <main
      className={`${marcellus.variable} overflow-x-hidden bg-[#FAF9F6] font-[family-name:var(--font-marcellus)] font-normal text-[#1A2A22]`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ============ HERO ============ */}
      <section aria-labelledby="about-hero" className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-24 pt-10 sm:px-8 lg:grid-cols-2 lg:pb-32 lg:pt-16">
          <div className="relative z-10">
            <Eyebrow line>About Us</Eyebrow>
            <h1
              id="about-hero"
              className="mt-5 text-5xl font-normal leading-[1.05] sm:text-6xl lg:text-[64px]"
            >
              More Than Properties, We Build Futures
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[#52685B]">
              At Bringo Real Estates, we believe real estate is not just about buildings,
              it&apos;s about people, dreams and a better tomorrow. From our office in Greater
              Noida, we help families, businesses and investors find modern, sustainable and
              high-value spaces.
            </p>

            <div className="mt-7">
              <BtnDark href="#our-story">Our Story</BtnDark>
            </div>


            <div className="mt-6 flex items-center gap-8">
              <div>
                <p className="text-5xl font-normal">10+</p>
                <p className="text-xs text-[#52685B]">Years of Experience</p>
              </div>
              <span className="hidden h-14 w-px bg-[#52685B]/25 sm:block" />
              <p className="text-2xl leading-tight text-[#52685B]">
                Spaces
                <br />
                That Inspire Life
              </p>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative">
            
            <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-3xl lg:rounded-tl-[220px] lg:rounded-br-[80px]">
              <Image
                src="/image/hero.png"
                alt="Modern sustainable villa with glass balconies surrounded by greenery"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-8 left-4 right-4 flex items-center gap-4 rounded-2xl bg-[#FAF9F6] p-3 shadow-[0_20px_50px_rgba(26,42,34,0.15)] sm:left-0 sm:right-auto sm:w-[340px] lg:-left-10">
              <div className="relative h-25 w-24 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src="/image/heroo.jpeg"
                  alt="Sustainable community project"
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm">Creating</p>
                <p className="text-sm text-[#52685B]">Sustainable Communities</p>
              </div>
              <Link
                href="/projects"
                aria-label="View our projects"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A2A22] text-[#FAF9F6] transition hover:bg-[#52685B]"
              >
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section aria-label="Bringo Real Estates in numbers" className="relative z-10 mx-auto -mt-10 max-w-7xl px-5 sm:px-8 lg:-mt-16">
        <dl className="grid grid-cols-2 gap-y-8 rounded-3xl bg-[#F3F0E8] px-4 py-8 shadow-[0_10px_40px_rgba(26,42,34,0.08)] lg:grid-cols-4 lg:py-7">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center text-center ${
                i !== 0 ? "lg:border-l lg:border-[#52685B]/25" : ""
              } ${i % 2 === 1 ? "border-l border-[#52685B]/25" : ""}`}
            >
              <Icon className="text-[#D4A62A]" size={28} strokeWidth={1.5} />
              <dd className="mt-2 text-2xl">{value}</dd>
              <dt className="text-xs text-[#52685B]">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ============ OUR STORY ============ */}
      <section id="our-story" aria-labelledby="story-title" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Image collage */}
          <div className="relative mx-auto h-[420px] w-full max-w-[560px] sm:h-[480px]">
            <div className="absolute left-0 top-0 h-[80%] w-[68%] overflow-hidden rounded-t-[200px] rounded-b-2xl">
              <Image
                src="/image/about.png"
                alt="Contemporary home exterior with large windows"
                fill
                sizes="(min-width: 1024px) 380px, 60vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 h-[46%] w-[58%] overflow-hidden rounded-2xl border-4 border-[#FAF9F6] shadow-xl">
              <Image
                src="/image/about1.jpeg"
                alt="Bright living room with sofa and indoor plants"
                fill
                sizes="(min-width: 1024px) 320px, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-6 left-0 w-[46%] rounded-xl bg-[#1A2A22] p-4 text-sm text-[#FAF9F6] shadow-lg sm:bottom-2">
              <p className="flex items-center justify-between gap-2">
                Modern Spaces <ArrowRight size={14} />
              </p>
              <p>Stronger</p>
              <p className="flex items-center gap-3">
                Communities <span className="h-px flex-1 bg-[#FAF9F6]/50" />
              </p>
            </div>

            {/* Circular text badge */}
            <div className="absolute right-0 top-2 flex h-28 w-28 items-center justify-center rounded-full bg-[#F3F0E8] sm:right-4">
              <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                  <path id="circlePath" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                </defs>
                <text className="fill-[#D4A62A] text-[9px] uppercase tracking-[0.28em]">
                  <textPath href="#circlePath">Sustainable • Modern Living •</textPath>
                </text>
              </svg>
              <Leaf className="text-[#D4A62A]" size={28} strokeWidth={1.5} />
            </div>
          </div>

          {/* Text */}
          <div>
            <Eyebrow>Our Story</Eyebrow>
            <h2 id="story-title" className="mt-4 text-4xl font-normal sm:text-5xl">
              About Our Company
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#52685B]">
              Bringo Real Estates was founded with a simple vision — to transform the way people
              experience real estate in Greater Noida. From residential homes to commercial
              spaces, we help you choose value-driven properties that blend modern design,
              strategic locations and long-term growth potential.
            </p>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#52685B]">
              Our focus is on verified projects, transparent processes and a customer-first
              approach, ensuring every client finds a space that truly feels like home.
            </p>
            <div className="mt-7">
              <BtnDark href="/contact">Know More</BtnDark>
            </div>
          </div>
        </div>

        {/* Values */}
        <ul className="mt-16 grid gap-8 sm:grid-cols-3">
          {values.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className={`flex flex-col items-center text-center ${
                i !== 0 ? "sm:border-l sm:border-[#52685B]/25" : ""
              }`}
            >
              <Icon className="text-[#D4A62A]" size={34} strokeWidth={1.4} />
              <h3 className="mt-3 text-sm text-[#1A2A22]">{title}</h3>
              <p className="mt-1 text-xs text-[#52685B]">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ============ WHY CHOOSE ============ */}
      <section aria-labelledby="why-title" className="bg-[#F3F0E8]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="text-center">
            <div className="flex justify-center">
              <Eyebrow>Why Choose Bringo</Eyebrow>
            </div>
            <h2 id="why-title" className="mt-4 text-3xl font-normal sm:text-4xl">
              A Better Way to Find Your Perfect Space
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[#52685B]">
              We combine experience, local market knowledge and customer focus to deliver real
              estate solutions that truly make a difference.
            </p>
          </div>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex flex-col items-center rounded-2xl bg-[#FAF9F6] px-6 py-8 text-center shadow-[0_8px_30px_rgba(26,42,34,0.06)]"
              >
                <Icon className="text-[#D4A62A]" size={32} strokeWidth={1.4} />
                <h3 className="mt-4 text-sm text-[#1A2A22]">{title}</h3>
                <p className="mt-2 max-w-[180px] text-xs leading-relaxed text-[#52685B]">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ PARTNERS ============ */}
      <section aria-labelledby="partners-title" className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-8">
        <div className="flex justify-center">
          <Eyebrow>Our Partners</Eyebrow>
        </div>
        <h2 id="partners-title" className="mt-3 text-3xl font-normal sm:text-4xl">
          Trusted by Leading Brands
        </h2>
        <ul className="mt-8 grid grid-cols-2 items-center gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((p, i) => (
            <li
              key={p}
              className={`px-4 text-xl tracking-wide text-[#52685B] ${
                i !== 0 ? "lg:border-l lg:border-[#52685B]/25" : ""
              }`}
            >
              {/* Real logo: <Image src={`/images/partners/${p}.svg`} alt={`${p} logo`} width={110} height={40} /> */}
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* ============ OUR PEOPLE + VISION/MISSION ============ */}
      <section aria-labelledby="people-title" className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow line>Our People</Eyebrow>
            <h2 id="people-title" className="mt-4 text-4xl font-normal leading-tight">
              Driven by People.
              <br />
              Inspired by Possibilities.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#52685B]">
              Our team of real estate experts, designers and strategists work together to create
              exceptional spaces that enrich lives and communities.
            </p>
            <div className="mt-6">
              <BtnDark href="/team">Meet Our Team</BtnDark>
            </div>
          </div>

          <div className="grid overflow-hidden rounded-2xl sm:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-[390px]">
              <Image
                src="/image/cta.jpeg"
                alt="Dining area with large windows and indoor plants"
                fill
                sizes="(min-width: 1024px) 300px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center gap-6 bg-[#1A2A22] p-7 text-[#FAF9F6]">
              <div>
                <p className="flex items-center gap-3">
                  <Eye size={22} strokeWidth={1.5} /> Vision
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#FAF9F6]/80">
                  To create sustainable and future-ready communities.
                </p>
              </div>
              <span className="h-px w-full bg-[#FAF9F6]/25" />
              <div>
                <p className="flex items-center gap-3">
                  <Target size={22} strokeWidth={1.5} /> Mission
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#FAF9F6]/80">
                  To deliver high-quality spaces with trust, innovation and care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section aria-labelledby="faq-title" className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[4/3.4]">
            <Image
              src="/image/faq.jpg"
              alt="Spacious living room with cream sofa and natural light"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 id="faq-title" className="mt-3 text-4xl font-normal">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-[#52685B]">
              Find quick answers to some common questions about our services.
            </p>
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      {/* ============ CTA + CONTACT ============ */}
      <section aria-labelledby="cta-title" className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#1A2A22] px-6 py-12 text-[#FAF9F6] sm:px-12 lg:py-16">
          <Image
            src="/image/ctaa.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right opacity-30 mix-blend-luminosity lg:opacity-45"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A2A22] via-[#1A2A22]/90 to-transparent" />

          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#FAF9F6]/80">
                Let&apos;s Find Your Perfect Space
              </p>
              <h2
                id="cta-title"
                className="mt-4 text-4xl font-normal leading-tight sm:text-5xl"
              >
                Ready to Find Your Dream Property?
              </h2>
              <p className="mt-4 text-sm text-[#FAF9F6]/85">
                Get expert guidance and exclusive property options tailored to your needs.
              </p>

              <address className="mt-6 space-y-3 text-sm not-italic text-[#FAF9F6]/90">
                <a
                  href={`tel:${BUSINESS.phoneTel}`}
                  className="flex items-center gap-3 hover:text-[#FAF9F6]"
                >
                  <Phone size={16} className="shrink-0" />
                  {BUSINESS.phoneDisplay}
                </a>
                <a
                  href={`mailto:${BUSINESS.email}`}
                  className="flex items-center gap-3 break-all hover:text-[#FAF9F6]"
                >
                  <Mail size={16} className="shrink-0" />
                  {BUSINESS.email}
                </a>
                <p className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 shrink-0" />
                  <span>
                    {BUSINESS.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </p>
              </address>

              <Link
                href="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#FAF9F6] px-6 py-3 text-sm font-normal text-[#1A2A22] transition hover:bg-[#F3F0E8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF9F6]"
              >
                Contact Us <ArrowRight size={16} />
              </Link>
            </div>

            <div className="flex items-center gap-4 rounded-full bg-[#FAF9F6]/10 px-4 py-3 backdrop-blur">
           
              <span className="h-8 w-px bg-[#FAF9F6]/30" />
              <div>
                <p className="text-lg  text-[#D4A62A] leading-none">4.8/5</p>
                <p className="text-[11px] text-[#D4A62A]">Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}