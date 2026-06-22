import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Placeholder images via picsum (always render). Replaced with real ResinRiva
// photos before launch — alt text is tagged "placeholder".
const img = (seed: string, i = 1) =>
  `https://picsum.photos/seed/${seed}-${i}/1200/1200`;

const doc = (...paras: string[]) => ({
  type: "doc",
  content: paras.map((text) => ({
    type: "paragraph",
    content: [{ type: "text", text }],
  })),
});

type SeedField = {
  label: string;
  type: "SELECT" | "TEXT" | "SWATCH" | "SIZE" | "NUMBER" | "FILE";
  options?: Prisma.InputJsonValue;
  required?: boolean;
  helpText?: string;
};

type SeedProduct = {
  title: string;
  slug: string;
  shortTagline: string;
  description: string;
  priceMin?: number;
  priceMax?: number;
  showPrice?: boolean;
  featured?: boolean;
  timeline?: string;
  materials?: string;
  dimensions?: string;
  seoTitle?: string;
  seoDescription?: string;
  categorySlug: string;
  images: { url: string; alt: string }[];
  fields: SeedField[];
};

const categories = [
  { slug: "resin-furniture", name: "Resin Furniture", order: 1, description: "Epoxy river tables, console tops and bespoke statement furniture." },
  { slug: "art-craft", name: "Art & Craft Pieces", order: 2, description: "Ocean, geode and abstract resin wall art — one-of-a-kind." },
  { slug: "varmala-preservation", name: "Varmala Preservation", order: 3, description: "Museum-grade wedding garland & flower preservation frames." },
  { slug: "wedding-photo-frames", name: "Wedding Photo Frames", order: 4, description: "Teakwood and LED-lit resin frames with custom printing." },
  { slug: "resin-trays", name: "Resin Trays & Platters", order: 5, description: "Decorative and serving trays with metallic-leaf finishes." },
  { slug: "candle-holders", name: "Candle & Tea Light Holders", order: 6, description: "Diwali collections, diyas and minimalist holders." },
  { slug: "resin-wall-clocks", name: "Resin Wall Clocks", order: 7, description: "Marble, geode and ocean-wave clocks with silent movement." },
  { slug: "resin-jewelry", name: "Resin Jewelry & Keychains", order: 8, description: "Dried-flower earrings, charms, keychains and keepsakes." },
  { slug: "home-decor", name: "Home Decor & Accessories", order: 9, description: "Monograms, keepsakes, coasters and bespoke decor." },
];

const SWATCHES = [
  { label: "Ocean Blue", hex: "#0E3A53" },
  { label: "Teal", hex: "#1B6E7A" },
  { label: "Amber", hex: "#C8881F" },
  { label: "Gold Flake", hex: "#D4AF37" },
  { label: "Ivory", hex: "#F4EFE9" },
  { label: "Onyx Black", hex: "#14151D" },
];

const products: SeedProduct[] = [
  {
    title: "Ocean Wave Resin Wall Clock",
    slug: "ocean-wave-resin-wall-clock",
    shortTagline: "A tide of colour, frozen in gloss.",
    description:
      "A statement wall clock with hand-poured ocean-wave resin layers and a silent quartz movement. Each piece is unique — the foam, depth and colour flow are formed by hand, so no two clocks are ever identical. Finished with a flawless high-gloss coat that catches the light.",
    priceMin: 2200,
    priceMax: 6500,
    featured: true,
    timeline: "2–3 weeks",
    materials: "Epoxy resin, pigments, silent quartz movement",
    dimensions: "12–24 inch diameter",
    seoTitle: "Ocean Wave Resin Wall Clock — Handmade | ResinRiva",
    seoDescription: "Hand-poured ocean-wave resin wall clock with silent movement. Custom size, colour and engraving. Made to order in India.",
    categorySlug: "resin-wall-clocks",
    images: [
      { url: img("clock", 1), alt: "placeholder — ocean wave resin wall clock" },
      { url: img("clock", 2), alt: "placeholder — resin clock detail" },
    ],
    fields: [
      { label: "Diameter", type: "SIZE", required: true, options: ["12 inch", "16 inch", "20 inch", "24 inch"] },
      { label: "Pattern", type: "SELECT", required: true, options: ["Ocean Wave", "Geode", "Marble"] },
      { label: "Primary Colour", type: "SWATCH", options: SWATCHES },
      { label: "Engraving Text (optional)", type: "TEXT", helpText: "Name, date or short message on the rim." },
    ],
  },
  {
    title: "Heritage Varmala Preservation Frame",
    slug: "heritage-varmala-preservation-frame",
    shortTagline: "Keep the garland, keep the day.",
    description:
      "Museum-grade preservation of your wedding varmala in a deep shadow-box resin frame. We dry, set and seal the flowers so their colour and form are held for years. Add an inset photo, names and your wedding date for a true heirloom.",
    priceMin: 3500,
    priceMax: 12000,
    featured: true,
    timeline: "4–6 weeks",
    materials: "Preserved florals, epoxy resin, teakwood frame",
    dimensions: "12x12 to 24x24 inch",
    seoTitle: "Varmala Preservation Frame — Wedding Garland | ResinRiva",
    seoDescription: "Preserve your wedding varmala in a museum-grade resin frame. Custom size, finish, engraving and photo inset. Made to order.",
    categorySlug: "varmala-preservation",
    images: [
      { url: img("varmala", 1), alt: "placeholder — varmala preservation frame" },
      { url: img("varmala", 2), alt: "placeholder — preserved garland detail" },
    ],
    fields: [
      { label: "Frame Size", type: "SIZE", required: true, options: ["12x12 inch", "16x16 inch", "20x20 inch", "24x24 inch"] },
      { label: "Frame Finish", type: "SELECT", required: true, options: ["Teakwood", "Walnut", "Matte White"] },
      { label: "Backing Colour", type: "SWATCH", options: SWATCHES },
      { label: "Names & Wedding Date", type: "TEXT", required: true, helpText: "As you'd like it engraved." },
      { label: "Photo Inset", type: "SELECT", options: ["Yes", "No"] },
      { label: "Reference Photo", type: "FILE", helpText: "Upload a photo of the varmala if you have one." },
    ],
  },
  {
    title: "Geode Serving Tray with Gold Leaf",
    slug: "geode-serving-tray-gold-leaf",
    shortTagline: "Serve in quiet luxury.",
    description:
      "A decorative and serving tray with a geode-edge of real metallic leaf and a mirror-gloss resin surface. Perfect as an engagement or housewarming gift, or styled on a console. Choose your size, finish and handle option.",
    priceMin: 1500,
    priceMax: 4500,
    featured: true,
    timeline: "1–2 weeks",
    materials: "Epoxy resin, metallic leaf, MDF base",
    dimensions: "6x6 to 12x12 inch",
    seoTitle: "Geode Resin Serving Tray with Gold Leaf | ResinRiva",
    seoDescription: "Handcrafted geode resin serving tray with gold/silver/rose-gold leaf. Custom size and handles. Made to order in India.",
    categorySlug: "resin-trays",
    images: [
      { url: img("tray", 1), alt: "placeholder — geode resin tray with gold leaf" },
      { url: img("tray", 2), alt: "placeholder — resin tray edge detail" },
    ],
    fields: [
      { label: "Size", type: "SIZE", required: true, options: ["6x6 inch", "8x8 inch", "10x10 inch", "12x12 inch"] },
      { label: "Metallic Finish", type: "SELECT", required: true, options: ["Gold Leaf", "Silver Leaf", "Rose Gold Leaf"] },
      { label: "Handles", type: "SELECT", options: ["Gold Handles", "Silver Handles", "No Handles"] },
      { label: "Accent Colour", type: "SWATCH", options: SWATCHES },
    ],
  },
  {
    title: "Bespoke Epoxy River Coffee Table",
    slug: "bespoke-epoxy-river-coffee-table",
    shortTagline: "A river of resin through live-edge wood.",
    description:
      "A made-to-order epoxy river coffee table pairing live-edge hardwood with a deep, tinted resin channel. Built to your dimensions and finished to furniture standard. Pricing is bespoke — enquire with your size and wood preference.",
    showPrice: false,
    featured: true,
    timeline: "6–10 weeks",
    materials: "Live-edge hardwood, deep-pour epoxy resin, steel legs",
    dimensions: "Custom (made to order)",
    seoTitle: "Bespoke Epoxy River Coffee Table | ResinRiva",
    seoDescription: "Custom epoxy river coffee table in live-edge hardwood. Made to your dimensions. Enquire on WhatsApp.",
    categorySlug: "resin-furniture",
    images: [
      { url: img("river-table", 1), alt: "placeholder — epoxy river coffee table" },
      { url: img("river-table", 2), alt: "placeholder — river table resin detail" },
    ],
    fields: [
      { label: "Wood", type: "SELECT", required: true, options: ["Acacia", "Walnut", "Teak", "Mango"] },
      { label: "Resin Tint", type: "SWATCH", options: SWATCHES },
      { label: "Desired Dimensions", type: "TEXT", required: true, helpText: "Length × width × height in inches." },
      { label: "Leg Finish", type: "SELECT", options: ["Black Steel", "Brass", "Wood"] },
    ],
  },
  {
    title: "Dried Flower Resin Keychain",
    slug: "dried-flower-resin-keychain",
    shortTagline: "A little garden you can carry.",
    description:
      "A delicate keychain set with real dried flowers and a touch of gold glitter, sealed in crystal-clear resin. A lovely small gift or wedding favour. Personalise with an initial.",
    priceMin: 150,
    priceMax: 600,
    timeline: "5–7 days",
    materials: "Epoxy resin, dried flowers, metal hardware",
    dimensions: "Approx. 5–7 cm",
    seoTitle: "Dried Flower Resin Keychain — Personalised | ResinRiva",
    seoDescription: "Personalised dried-flower resin keychain with initial and glitter. Great wedding favour. Made to order in India.",
    categorySlug: "resin-jewelry",
    images: [
      { url: img("keychain", 1), alt: "placeholder — dried flower resin keychain" },
    ],
    fields: [
      { label: "Shape", type: "SELECT", required: true, options: ["Heart", "Circle", "Hexagon", "Rectangle"] },
      { label: "Flower", type: "SELECT", options: ["Rose", "Baby's Breath", "Lavender", "Mixed"] },
      { label: "Initial", type: "TEXT", helpText: "A single letter to set inside." },
    ],
  },
  {
    title: "Resin Monogram Letter — Home Decor",
    slug: "resin-monogram-letter-home-decor",
    shortTagline: "Your initial, in liquid gold.",
    description:
      "A decorative resin monogram letter with swirling colour and optional warm LED backlight. Beautiful on a shelf, nursery wall or at a wedding sweetheart table. Choose your letter, colour and size.",
    priceMin: 800,
    priceMax: 2500,
    timeline: "1–2 weeks",
    materials: "Epoxy resin, pigments, optional LED strip",
    dimensions: "6–12 inch height",
    seoTitle: "Resin Monogram Letter with LED — Decor | ResinRiva",
    seoDescription: "Custom resin monogram letter with optional LED backlight. Choose letter, colour and size. Made to order in India.",
    categorySlug: "home-decor",
    images: [
      { url: img("monogram", 1), alt: "placeholder — resin monogram letter" },
      { url: img("monogram", 2), alt: "placeholder — monogram LED detail" },
    ],
    fields: [
      { label: "Letter", type: "TEXT", required: true, helpText: "The letter or initials to create." },
      { label: "Colour", type: "SWATCH", required: true, options: SWATCHES },
      { label: "Height", type: "SIZE", options: ["6 inch", "8 inch", "10 inch", "12 inch"] },
      { label: "LED Backlight", type: "SELECT", options: ["On", "Off"] },
    ],
  },
];

const testimonials = [
  { name: "Aarohi & Kabir", location: "Ahmedabad", quote: "Our varmala frame is breathtaking — it's the first thing guests notice. It feels like our wedding day is still with us.", rating: 5, order: 1 },
  { name: "Sneha Patel", location: "Surat", quote: "The ocean wave clock is a work of art. The colours are deep and the finish is flawless. Worth every rupee.", rating: 5, order: 2 },
  { name: "Rahul Mehta", location: "Mumbai", quote: "Ordered corporate gifts — the team customised everything over WhatsApp and delivered ahead of time. Premium quality.", rating: 5, order: 3 },
];

const faqs = [
  { question: "How do I place an order?", answer: "Browse a product, customise it on the page, add your details and reference images, then tap Place Order — it opens WhatsApp with your full request pre-filled. We confirm price, timeline and delivery there.", order: 1 },
  { question: "Do you ship across India?", answer: "Yes. We pack each piece carefully and ship pan-India. Delivery timelines depend on the product and are confirmed on WhatsApp.", order: 2 },
  { question: "Can everything be customised?", answer: "Almost everything — size, colour, finish, engraving and more. If you have a specific idea, send us a reference on WhatsApp and we'll craft it.", order: 3 },
  { question: "How long does an order take?", answer: "Most pieces take 1–3 weeks; varmala preservation and furniture take longer. Each product page lists an indicative timeline.", order: 4 },
  { question: "How do payments work?", answer: "There is no online checkout. Once details are finalised on WhatsApp, we share payment options directly. This keeps every order personal and made-to-order.", order: 5 },
];

const blogCategories = [
  { slug: "guides", name: "Guides & Care" },
  { slug: "gifting", name: "Gift Ideas" },
  { slug: "behind-the-scenes", name: "Behind the Scenes" },
];

const posts = [
  {
    title: "How to Care for Your Resin Art So It Lasts a Lifetime",
    slug: "how-to-care-for-resin-art",
    excerpt: "Simple, gentle habits that keep resin pieces glossy and clear for years.",
    coverImage: img("blog-care", 1),
    authorName: "ResinRiva Studio",
    status: "PUBLISHED" as const,
    publishedAt: new Date("2026-02-10"),
    seoTitle: "How to Care for Resin Art — Cleaning & Tips | ResinRiva",
    seoDescription: "A simple guide to cleaning and protecting resin art so it stays glossy and clear for years.",
    categorySlug: "guides",
    content: doc(
      "Resin art is durable, but a little care keeps it looking new. Here's how we recommend looking after your ResinRiva piece.",
      "Dust gently with a soft, dry microfibre cloth. For fingerprints, use a slightly damp cloth and dry immediately — avoid harsh chemicals or abrasive pads.",
      "Keep pieces out of prolonged direct sunlight to preserve colour, and avoid placing hot items directly on resin surfaces. With these simple habits, your piece will stay beautiful for many years.",
    ),
  },
  {
    title: "10 Heartfelt Wedding Gifts That Aren't Clichés",
    slug: "heartfelt-wedding-gift-ideas",
    excerpt: "Personalised, keep-forever gift ideas for couples — beyond the usual.",
    coverImage: img("blog-gifts", 1),
    authorName: "ResinRiva Studio",
    status: "PUBLISHED" as const,
    publishedAt: new Date("2026-03-05"),
    seoTitle: "10 Heartfelt Wedding Gift Ideas | ResinRiva",
    seoDescription: "Personalised, keep-forever wedding gift ideas — from varmala preservation to custom resin art.",
    categorySlug: "gifting",
    content: doc(
      "The best wedding gifts feel personal and last. Here are ten ideas couples genuinely treasure.",
      "Varmala preservation frames turn the wedding garland into a permanent keepsake. Custom name clocks and monogram art make a new home feel like theirs.",
      "Whatever you choose, a handmade, personalised piece says more than anything off a shelf. Tell us the couple's story and we'll help you craft the perfect gift.",
    ),
  },
];

async function main() {
  // Site settings (singleton)
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      brandName: "ResinRiva",
      tagline: "An heirloom you'll keep forever.",
      announcement: "Handcrafted resin art & 3D printing — made to order. Every piece is bespoke.",
      phone: "+91 7096036250",
      whatsappNumber: "917096036250",
      email: "gondaliyabhavya70960@gmail.com",
      mapsUrl: "https://maps.app.goo.gl/L2NHDt9Akgqs2ZoT6",
      address: "Made-to-order studio · India",
      socials: { instagram: "", facebook: "" },
      defaultSeo: {
        title: "ResinRiva — Luxury Resin Art & 3D Printing",
        description:
          "ResinRiva crafts luxury resin art, custom 3D-printed décor, and personalized keepsakes — bespoke, handmade to order in India.",
      },
    },
  });

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? "gondaliyabhavya70960@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ResinRiva@2026";
  if (!process.env.ADMIN_PASSWORD) {
    console.warn("⚠  ADMIN_PASSWORD not set — seeding dev default 'ResinRiva@2026'. Change it before launch.");
  }
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { hashedPassword, role: "ADMIN" },
    create: { email: adminEmail, name: "ResinRiva Admin", hashedPassword, role: "ADMIN" },
  });

  // Categories
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c });
  }
  const catBySlug = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id]),
  );

  // Products (+ images + customization fields)
  for (const p of products) {
    const { categorySlug, images, fields, ...data } = p;
    const product = await prisma.product.upsert({
      where: { slug: data.slug },
      update: { ...data, status: "PUBLISHED", categoryId: catBySlug[categorySlug] },
      create: { ...data, status: "PUBLISHED", categoryId: catBySlug[categorySlug] },
    });
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.customizationField.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: images.map((im, i) => ({ ...im, order: i, productId: product.id })),
    });
    await prisma.customizationField.createMany({
      data: fields.map((f, i) => ({
        productId: product.id,
        order: i,
        label: f.label,
        type: f.type,
        required: f.required ?? false,
        helpText: f.helpText,
        options: f.options,
      })),
    });
  }

  // Testimonials + FAQs (reset for idempotency)
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({ data: testimonials });
  await prisma.faq.deleteMany();
  await prisma.faq.createMany({ data: faqs });

  // Blog
  for (const bc of blogCategories) {
    await prisma.blogCategory.upsert({ where: { slug: bc.slug }, update: bc, create: bc });
  }
  const blogCatBySlug = Object.fromEntries(
    (await prisma.blogCategory.findMany()).map((c) => [c.slug, c.id]),
  );
  for (const post of posts) {
    const { categorySlug, ...data } = post;
    await prisma.blogPost.upsert({
      where: { slug: data.slug },
      update: { ...data, blogCategoryId: blogCatBySlug[categorySlug] },
      create: { ...data, blogCategoryId: blogCatBySlug[categorySlug] },
    });
  }

  console.log(
    `✅ Seed complete — ${categories.length} categories, ${products.length} products, ${testimonials.length} testimonials, ${faqs.length} FAQs, ${posts.length} posts, 1 admin.`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
