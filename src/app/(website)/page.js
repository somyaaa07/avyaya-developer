import HomeHero from "@/component/home/HeroSection";
import FeaturedProperties from "@/component/home/FeaturedProperties";
import Testimonial from "@/component/home/Testimonial";
import CTASection from "@/component/home/CTASection";
import Propertyguidance from "@/component/home/Propertyguidance";
import HowWeHelp from "@/component/home/HowWeHelp";
import AboutSection from "@/component/home/AboutSection";

export const metadata = {
  title: "Avyaya developer| Premium Properties in Greater Noida",
  description:
    "Avyaya developer helps you discover premium residential and commercial properties in Greater Noida. Visit us at FF01, FF02 Kaveri City Center, Delta 1, Greater Noida, Gautam Buddha Nagar, UP 201306.",
  keywords: [
    "avyaya developer Real Estates",
    "real estate Greater Noida",
    "properties in Greater Noida",
    "property dealer Greater Noida",
    "residential property Greater Noida",
    "commercial property Greater Noida",
    
  ],
  authors: [{ name: "avyaya developer" }],
  creator: "avyaya developer",
  publisher: "avyaya developer",

  openGraph: {
    title: "avyaya developer Real Estates | Premium Properties in Greater Noida",
    description:
      "Explore residential and commercial properties with avyaya developer in Greater Noida.",
    type: "website",
    locale: "en_IN",
    siteName: "avyaya developer",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AboutSection />
      <FeaturedProperties />
      <Propertyguidance />
      <HowWeHelp />
      <Testimonial />
      <CTASection />
    </>
  );
}