export const PHONE = "+91 7004397655";
export const PHONE_HREF = "tel:+917004397655";
export const EMAIL = "info@avyayadevelopers.com";
export const WHATSAPP_URL = "https://wa.me/917004397655";

export const heroImage = {
  src: "/images/contact-hero.jpg", // put your image in /public/images/
  alt: "Modern residential towers at dusk",
};

export const contactMethods = [
  { id: "call", icon: "Phone", label: "Call Us", value: PHONE, note: "Mon – Sat, 10 AM – 7 PM", href: PHONE_HREF },
  { id: "email", icon: "Mail", label: "Email Us", value: EMAIL, note: "We reply within business hours", href: `mailto:${EMAIL}` },
  { id: "whatsapp", icon: "MessageCircle", label: "WhatsApp", value: "Chat with our team", note: "Quick answers, anytime", href: WHATSAPP_URL, external: true },
  { id: "visit", icon: "MapPin", label: "Visit Us", value: "Noida, Uttar Pradesh", note: "Please call before visiting", href: "#offices" },
];

export const enquiryTypes = [
  "Residential Project",
  "Commercial Project",
  "Land / Plotting",
  "Investment Advisory",
  "General Enquiry",
];

export const workingHours = "Mon – Sat, 10 AM – 7 PM";

// TODO: replace with your real office details
export const offices = [
  {
    city: "Noida",
    tag: "Head Office",
    address: "Add full Noida office address here, Sector XX, Noida, Uttar Pradesh",
    phone: PHONE,
    email: EMAIL,
    hours: workingHours,
  },
  {
    city: "Greater Noida",
    tag: "Branch Office",
    address: "Add full Greater Noida office address here, Uttar Pradesh",
    phone: PHONE,
    email: EMAIL,
    hours: workingHours,
  },
  {
    city: "Delhi",
    tag: "Branch Office",
    address: "Add full Delhi office address here, New Delhi",
    phone: PHONE,
    email: "",
    hours: workingHours,
  },
];

export const mapData = {
  name: "Avyaya Developers – Noida Office",
  // TODO: paste the src from your existing Google Maps iframe
  src: "https://www.google.com/maps/embed?pb=REPLACE_WITH_YOUR_EMBED_URL",
};