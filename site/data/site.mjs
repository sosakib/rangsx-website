// Global facts. Every value here is taken from the live beta.rangsx.com site.
export const SITE = {
  url: "https://rangsx.com", // production origin for canonicals / sitemap
  name: "RangsX",
  legalName: "Rangs Motors Ltd.",
  tagline: "Drive Next",
  description:
    "Electric vehicles for Bangladesh from Rangs Group. Dongfeng electric cargo vans and microbuses for business, RX electric two-wheelers for everyday riders.",
  hotline: "16758",
  whatsapp: "8801332832892",
  whatsappDisplay: "+880 1332-832892",
  email: "info@rangsx.com",
  hours: "Sunday to Thursday, 9:00 AM to 6:00 PM",
  address: {
    building: "Rangs Bhaban",
    street: "117/A, 4th Floor, Old Airport Road, Bijoy Sarani",
    locality: "Tejgaon, Dhaka 1215",
    city: "Dhaka",
    postalCode: "1215",
    country: "Bangladesh",
  },
  parent: { name: "Rangs Group", url: "https://rangsgroup.com" },
  // Set to a real endpoint (Formspree, a Next.js route, etc.) to receive form posts.
  // Empty = forms validate, then hand the message off to WhatsApp.
  formEndpoint: "",
  // Online booking advance for an RX bike (taka), paid at checkout; the balance is paid at the showroom.
  // ponytail: default taken from the employee EMI minimum deposit. Confirm with sales before launch.
  bikeBooking: 10000,
};

export const wa = (text = "Hi RangsX, I have a question.") =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

// Primary navigation. Labels and order match the live site.
export const NAV = [
  { label: "Electric Fleet", href: "/dongfeng", flyout: "fleet" },
  { label: "Electric Bikes", href: "/electric-bikes", flyout: "bikes" },
  { label: "RX Gear Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Service", href: "/service" },
  { label: "Dealers", href: "/dealers" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER = [
  {
    title: "Products",
    links: [
      { label: "Dongfeng EM-26", note: "Electric Cargo Van", href: "/electric-vans/em26" },
      { label: "Dongfeng EM-27", note: "Electric Microbus", href: "/electric-microbus/em27" },
      { label: "RX ZS", note: "Electric Bike", href: "/electric-bikes/rx/zs" },
      { label: "RX ES3", note: "Electric Bike", href: "/electric-bikes/rx/es3" },
      { label: "RX T60", note: "Electric Bike", href: "/electric-bikes/rx/t60" },
      { label: "RX Gear Shop", note: "Accessories & Apparel", href: "/shop" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "All Electric Bikes", href: "/electric-bikes" },
      { label: "Electric Fleet", href: "/dongfeng" },
      { label: "Book Test Ride", href: "/electric-bikes/rx/zs#test-ride-form" },
      { label: "Compare Models", href: "/electric-bikes/rx/zs#compare" },
      { label: "Savings Calculator", href: "/electric-vans/em26#savings" },
      { label: "FAQ", href: "/electric-bikes/rx/zs#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Rangs Group", href: "https://rangsgroup.com", external: true },
      { label: "About RangsX", href: "/about" },
      { label: "Service & Support", href: "/service" },
      { label: "Dealer Network", href: "/dealers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

// Shared FAQ (service, dealers, contact). Source: live FAQSection defaults.
export const GENERAL_FAQS = [
  ["How long does charging take?", "Dongfeng EM-26/EM-27 vans and RX e-bikes both charge in 4-6 hours on a standard AC socket. For fleet operators, overnight depot charging ensures a full battery every morning with no downtime."],
  ["Are RangsX vehicles suitable for Bangladeshi roads and Dhaka traffic?", "Yes. Every model is designed around local conditions: narrow profiles for congested roads, ground clearance and suspension for uneven surfaces, speed breakers and potholes, silent electric operation, and cargo capacity tuned for last-mile delivery and daily commuting alike."],
  ["What warranty comes with the vehicle?", "Every Dongfeng van and RX bike comes with a standard manufacturer's warranty covering the frame, motor, and battery. Full documentation is provided at purchase. Contact our team for current terms."],
  ["How do I book a test ride or drive?", "Use the booking form on this page, or WhatsApp our team directly. We have showrooms across Dhaka and can arrange a slot at a time that suits you, typically within 24-48 hours of booking."],
  ["Is EMI available?", "Yes. Rangs Group partners with leading Bangladesh banks to offer flexible EMI plans for both fleet vans and e-bikes. Tenures range from 12 to 36 months. Contact our sales team for a personalised quote."],
  ["Where can I service my vehicle?", "Rangs Group operates authorized service centres across Bangladesh. Genuine parts are stocked locally for fast turnaround. Our after-sales team is reachable by phone and WhatsApp for any service queries."],
];

export const CONTACT_SUBJECTS = ["General Enquiry", "Fleet Purchase: Dongfeng", "Two-Wheeler Purchase: RX", "Book a Test Ride", "Service & Warranty", "Dealer / Partnership", "Press & Media"];

// Warranty coverage by component: [part, years, distance]. Source: beta /service. Used on /service and /account.
export const WARRANTY = [["Vehicle Body & Frame", 2, "40,000 km"], ["Battery Pack", 3, "60,000 km"], ["Electric Motor", 5, "80,000 km"], ["Electrical Components", 2, "40,000 km"], ["Charging System", 1, "20,000 km"]];
