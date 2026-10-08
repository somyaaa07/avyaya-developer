export const PHONE = "+91 7004397655";
export const PHONE_HREF = "tel:+917004397655";
export const EMAIL = "info@avyayadeveloper.com";
export const WHATSAPP_URL = "https://wa.me/917004397655";

export const heroImage = {
  src: "/banner/contact-banner.png",
  alt: "Modern residential towers at dusk",
};

export const contactMethods = [
  {
    id: "call",
    icon: "Phone",
    label: "Call Us",
    value: PHONE,
    note: " 9 AM – 8 PM",
    href: PHONE_HREF,
  },
  {
    id: "email",
    icon: "Mail",
    label: "Email Us",
    value: EMAIL,
    note: "We reply within business hours",
    href: `mailto:${EMAIL}`,
  },
  {
    id: "whatsapp",
    icon: "FaWhatsapp",
    label: "WhatsApp",
    value: "Chat with our team",
    note: "Quick answers, anytime",
    href: WHATSAPP_URL,
    external: true,
  },
  {
    id: "visit",
    icon: "MapPin",
    label: "Visit Us",
    value:`Office Number 1529, 15th Floor Galaxy Diamond Plaza, Sector 4 Greater Noida,
Uttar Pradesh - 201009`,
    note: "Please call before visiting",
    href: "#offices",
  },
];

export const enquiryTypes = [
  "Residential Project",
  "Commercial Project",
  "Land / Plotting",
  "Investment Advisory",
  "General Enquiry",
];

export const workingHours = " 9 AM – 8 PM";



// data/contactData.js — replace only the mapData export
export const mapData = {
  name: "avyaya developer",
  address:
    "Office Number 1529, 15th Floor, Galaxy Diamond Plaza, Sector 4, Greater Noida, Uttar Pradesh - 201009",
  src: "https://www.google.com/maps?q=Office+Number+1529,+15th+Floor,+Galaxy+Diamond+Plaza,+Sector+4,+Greater+Noida,+Uttar+Pradesh+201009&output=embed",
};
