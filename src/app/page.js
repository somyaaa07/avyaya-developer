import HomeHero from "@/component/home/HeroSection";
import FeaturedProperties from "@/component/home/FeaturedProperties";
import Testimonial from "@/component/home/Testimonial";
import CTASection from "@/component/home/CTASection";
import Propertyguidance  from "@/component/home/Propertyguidance";
import HowWeHelp from "@/component/home/HowWeHelp";
import AboutSection from "@/component/home/AboutSection";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AboutSection/>
      <FeaturedProperties />
      <Propertyguidance />
      <HowWeHelp/>
      <Testimonial />
      <CTASection />
     
    </>
  );
}
