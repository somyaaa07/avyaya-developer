export const PHONE = "+91 9999300301";
export const PHONE_HREF = "tel:+919999300301";
export const EMAIL = "bringo.realstates@gmail.com";
export const WHATSAPP_URL = "https://wa.me/919999300301";

export const heroImage = {
  src: "/building1.png",
  alt: "Modern residential towers at dusk",
};

export const contactMethods = [
  {
    id: "call",
    icon: "Phone",
    label: "Call Us",
    value: PHONE,
    note: "Mon – Sat, 10 AM – 7 PM",
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
    value: "FF01,FF02 Kaveri City Center,Delta 1.Greater Noida,Gautam Buddha Nagar,UP 201306",
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

export const workingHours = "Mon – Sat, 10 AM – 7 PM";

// TODO: replace with your real office details
// export const offices = [
//   {
//     city: "Noida",
//     tag: "Head Office",
//     address:
//       "FF01,FF02 Kaveri City Center,Delta 1.Greater Noida,Gautam Buddha Nagar,UP 201306",
//     phone: PHONE,
//     email: EMAIL,
//     hours: workingHours,
//   },
//   {
//     city: "Greater Noida",
//     tag: "Branch Office",
//     address: "FF01,FF02 Kaveri City Center,Delta 1.Greater Noida,Gautam Buddha Nagar,UP 201306",
//     phone: PHONE,
//     email: EMAIL,
//     hours: workingHours,
//   },
//   {
//     city: "Delhi",
//     tag: "Branch Office",
//     address: "Add full Delhi office address here, New Delhi",
//     phone: PHONE,
//     email: "",
//     hours: workingHours,
//   },
// ];

// data/contactData.js — replace only the mapData export
export const mapData = {
  name: "Bringo Real Estates",
  address:
    "FF01, FF02 Kaveri City Center, Delta 1, Greater Noida, Gautam Buddha Nagar, UP 201306",
  src: "https://www.google.com/maps?q=Bringo+Real+Estates,+Kaveri+City+Center,+Delta+1,+Greater+Noida&output=embed",
};
