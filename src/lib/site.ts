// Firm contact details — edit here to update every page.
export const SITE = {
  name: "Lawtribe Legal Consult",
  short: "Lawtribe",
  tagline: "Strategic legal counsel for individuals, businesses and institutions across Ghana.",
  address: ["5th Floor, 20 Old Bailey", "London EC4M 7AN", "United Kingdom"],
  // Placeholders — replace with the firm's confirmed details.
  phone: "+233 00 000 0000",
  email: "info@lawtribelegal.com",
  hours: ["Monday – Friday: 9:00 – 17:00", "Saturday – Sunday: Closed"],
  mapQuery: "20 Old Bailey, London EC4M 7AN",
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com" },
    { label: "X", href: "https://x.com" },
    { label: "Facebook", href: "https://www.facebook.com" },
  ],
};

export const CATEGORIES = [
  "Corporate Law", "Property Law", "Litigation", "Employment Law", "Family Law",
  "Legal Updates", "Ghanaian Legislation", "Business and Investment",
];

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Our Services" },
  { to: "/team", label: "Our Team" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function pageMeta(title: string, description: string) {
  const t = `${title} | ${SITE.name}`;
  return [
    { title: t },
    { name: "description", content: description },
    { property: "og:title", content: t },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}
