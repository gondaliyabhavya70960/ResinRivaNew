/**
 * Static site configuration for Phase 2.
 * NOTE: From Phase 5 these values are sourced from the `SiteSettings` DB record
 * (editable in /studio). This file is the build-time default / fallback.
 * The business identity values below are the EXACT ResinRiva values and must
 * not be changed.
 */
export const siteConfig = {
  name: "ResinRiva",
  tagline: "An heirloom you'll keep forever.",
  description:
    "ResinRiva crafts luxury resin art, custom 3D-printed décor, and personalized keepsakes — bespoke, handmade to order in India. Enquire on WhatsApp.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shop.bhavyagondaliya.co.in",
  // Contact (exact values)
  phone: "+91 7096036250",
  phoneTel: "+917096036250",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917096036250",
  email: "gondaliyabhavya70960@gmail.com",
  mapsUrl: "https://maps.app.goo.gl/L2NHDt9Akgqs2ZoT6",
  address: "Made-to-order studio · India",
  announcement:
    "Handcrafted resin art & 3D printing — made to order. Every piece is bespoke.",
  // Behold (behold.so) Instagram feed id — powers the live <InstagramFeed/>.
  instagramFeedId: "oq8gkyez0lDCZYoAWtiL",
  // Socials are placeholders until set in Site Settings (Phase 5).
  socials: {
    instagram: "#",
    facebook: "#",
  },
} as const;

export type NavItem = { title: string; href: string };

/** Primary navigation shown in the header. */
export const mainNav: NavItem[] = [
  { title: "About", href: "/about" },
  { title: "Shop", href: "/shop" },
  { title: "Portfolio", href: "/portfolio" },
  { title: "Process", href: "/process" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

/** Footer link columns. */
export const footerNav: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Explore",
    items: [
      { title: "Shop", href: "/shop" },
      { title: "Portfolio", href: "/portfolio" },
      { title: "Custom Order", href: "/custom-order" },
      { title: "Process", href: "/process" },
    ],
  },
  {
    heading: "Studio",
    items: [
      { title: "About", href: "/about" },
      { title: "Blog", href: "/blog" },
      { title: "FAQ", href: "/faq" },
      { title: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    items: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
    ],
  },
];
