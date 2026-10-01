import ContactHero from "@/component/contact/ContactHero";
import ContactIntro from "@/component/contact/ContactIntro";
import ContactInfo from "@/component/contact/ContactInfo";
import ContactForm from "@/component/contact/ContactForm";
import WhatsAppCTA from "@/component/contact/WhatsAppCTA";
import ContactMap from "@/component/contact/ContactMap";
import FAQSection from "@/component/contact/FAQSection";

export const metadata = {
  title: "Contact Us | Bringo Real Estates ",
  description:
    "Get in touch with Bringo Real Estates for residential, commercial, land and investment enquiries.",
};

export default function ContactPage() {
  return (
    <main className="overflow-x-hidden bg-white text-[#1b2b23]">
      <ContactHero />
      <ContactIntro />
      <section id="enquiry-form" className="scroll-mt-20 bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <ContactInfo />
          <ContactForm />
        </div>
      </section>
      <WhatsAppCTA />
   
      <ContactMap />
      <FAQSection />

    </main>
  );
}