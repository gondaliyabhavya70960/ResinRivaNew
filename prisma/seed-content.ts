/**
 * Phase 11 bulk content seed — 120+ products and 54 blog posts.
 *
 * ORIGINALITY: every title, description and article below is original ResinRiva
 * copy. Competitor research (see COMPETITOR.md) informed only product TYPES,
 * category structure, price bands and blog TOPICS — never wording or names.
 *
 * Idempotent: upserts by slug, so it can run on an already-seeded database
 * (it ADDS to the base seed; it does not delete the starter catalogue).
 * Run with:  npm run db:seed:content      (or SEED_FORCE handled by base seed)
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { categoryImage, categoryImageDesat, fallbackImage, blogCoverImage } from "./category-images";

const dbUrl = (
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.PRISMA_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL
)?.replace(/channel_binding=[^&]*&?/gi, "").replace(/[?&]$/, "");
const prisma = new PrismaClient(dbUrl ? { datasourceUrl: dbUrl } : undefined);

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const SWATCHES = [
  { label: "Ocean Blue", hex: "#0E3A53" },
  { label: "Teal", hex: "#1B6E7A" },
  { label: "Amber", hex: "#C8881F" },
  { label: "Gold Flake", hex: "#D4AF37" },
  { label: "Ivory", hex: "#F4EFE9" },
  { label: "Onyx Black", hex: "#14151D" },
  { label: "Blush Pink", hex: "#E7B7B0" },
  { label: "Emerald", hex: "#1E5C45" },
];

type SeedField = {
  label: string;
  type: "SELECT" | "TEXT" | "SWATCH" | "SIZE" | "NUMBER" | "FILE";
  options?: Prisma.InputJsonValue;
  required?: boolean;
  helpText?: string;
};

type Concept = { name: string; hook: string; tagline: string; min?: number; max?: number; featured?: boolean };

type CatCfg = {
  slug: string;
  noun: string; // for SEO ("Resin Wall Clock")
  timeline: string;
  materials: string;
  dimensions: string;
  showPrice?: boolean;
  priceMin: number;
  priceMax: number;
  context: string[];
  fields: SeedField[];
  concepts: Concept[];
};

/* ── New category (the brand is resin art AND 3D printing) ─────────────── */
const extraCategories = [
  { slug: "3d-printed-decor", name: "3D-Printed Decor", order: 10, description: "Custom 3D-printed lithophanes, figurines, nameplates and décor — designed with you." },
  { slug: "spiritual-festive", name: "Spiritual & Festive", order: 11, description: "Rangoli, pooja thali, mandir frames and festive diyas, finished in luxe resin." },
  { slug: "corporate-gifting", name: "Corporate Gifting", order: 12, description: "Premium branded desk pieces, awards and bulk gifts — design-led and consistent." },
  { slug: "resin-coasters", name: "Resin Coasters", order: 13, description: "Agate, marble and terrazzo coaster sets with metallic-leaf rims." },
  { slug: "nameplates", name: "Nameplates", order: 14, description: "Marble, ocean and geode resin nameplates for doors, desks and studios." },
];

/* ───────────────────────────────────────────────────────────────────────
   Product catalogue — concept-driven, all original copy.
   ─────────────────────────────────────────────────────────────────────── */
const cats: CatCfg[] = [
  {
    slug: "art-craft",
    noun: "Resin Wall Art",
    timeline: "2–4 weeks",
    materials: "Epoxy resin, pigments, metallic leaf, sealed birch panel",
    dimensions: "12x18 to 36x48 inch",
    priceMin: 2800,
    priceMax: 26000,
    context: [
      "Hand-poured in layers so the depth and movement are unique to your piece.",
      "Finished with a flawless high-gloss coat that shifts beautifully with the light.",
      "Built on a sealed panel, ready to hang straight from the box.",
    ],
    fields: [
      { label: "Size", type: "SIZE", required: true, options: ["12x18 inch", "18x24 inch", "24x36 inch", "36x48 inch"] },
      { label: "Orientation", type: "SELECT", options: ["Landscape", "Portrait", "Square"] },
      { label: "Colour Story", type: "SWATCH", options: SWATCHES },
      { label: "Metallic Accent", type: "SELECT", options: ["Gold Leaf", "Silver Leaf", "Copper Leaf", "None"] },
      { label: "Personal Note (optional)", type: "TEXT", helpText: "A name, date or word to subtly engrave." },
    ],
    concepts: [
      { name: "Tidewater Ocean Wall Art", hook: "A breaking-wave seascape with foamy cells and a deep blue horizon.", tagline: "The sea, held still.", min: 3200, max: 18000, featured: true },
      { name: "Golden Geode Panel", hook: "Concentric agate rings edged in real gold leaf and raw crystal druzy.", tagline: "A slice of the earth, gilded." },
      { name: "Monsoon Sky Abstract", hook: "Charcoal and teal clouds drifting over a quiet amber break of light.", tagline: "Weather you can hang." },
      { name: "Coral Reef Study", hook: "Layered lagoon greens and corals that fade from shallows to deep.", tagline: "Dive without getting wet." },
      { name: "Petal Press Botanical", hook: "Real pressed blooms suspended in clear resin over a soft ivory ground.", tagline: "A garden, paused." },
      { name: "Aurora Drift", hook: "Ribbons of emerald and violet light pulled across a midnight field.", tagline: "Northern lights, indoors." },
      { name: "Marble Vein Diptych", hook: "A two-panel set of ivory marble laced with fine gold veining.", tagline: "Stone, twice over.", min: 5200, max: 24000 },
      { name: "Sandbar Minimalist", hook: "Warm neutral bands and a single metallic tideline for calm interiors.", tagline: "Quiet by design." },
      { name: "Galaxy Pour", hook: "Deep space blues scattered with white stars and a glint of gold dust.", tagline: "Your own corner of the cosmos." },
      { name: "Lotus Bloom Relief", hook: "A raised resin lotus rising from rippling water in soft pastels.", tagline: "Stillness in bloom." },
      { name: "Terrazzo Confetti", hook: "Playful chips of colour set in a creamy, polished resin terrazzo.", tagline: "Joy, scattered." },
      { name: "Riverstone Calm", hook: "Smooth grey pebbles and a clear resin stream for a spa-like wall.", tagline: "Breathe out." },
      { name: "Sunset Dunes", hook: "Rolling amber and blush gradients like light over evening sand.", tagline: "Golden hour, framed." },
      { name: "Inkwell Contemporary", hook: "Bold onyx and ivory pours with a single sweep of liquid gold.", tagline: "Drama in two tones." },
    ],
  },
  {
    slug: "resin-jewelry",
    noun: "Resin Jewellery",
    timeline: "5–10 days",
    materials: "Epoxy resin, dried florals, metal findings",
    dimensions: "Piece-dependent",
    priceMin: 150,
    priceMax: 1800,
    context: [
      "Each one is set by hand, so the inclusions sit a little differently every time.",
      "Sealed in crystal-clear resin and polished to a smooth, skin-friendly finish.",
      "A small, giftable keepsake that carries a little story.",
    ],
    fields: [
      { label: "Metal Tone", type: "SELECT", required: true, options: ["Gold", "Silver", "Rose Gold"] },
      { label: "Inclusion", type: "SELECT", options: ["Real Flower", "Gold Flake", "Glitter", "Cosmic Blue"] },
      { label: "Initial / Charm (optional)", type: "TEXT", helpText: "A letter or tiny word to set inside." },
    ],
    concepts: [
      { name: "Wildflower Stud Earrings", hook: "Tiny real blooms set in clear domes for an everyday touch of spring.", tagline: "Spring, on your ears.", min: 250, max: 700 },
      { name: "Pressed Petal Pendant", hook: "A single pressed flower floating in a gold-rimmed teardrop pendant.", tagline: "One bloom, kept close.", min: 350, max: 950, featured: true },
      { name: "Gold Fleck Bangle", hook: "A translucent bangle shot through with drifting flakes of gold.", tagline: "Light catches it first.", min: 450, max: 1200 },
      { name: "Cosmic Drop Earrings", hook: "Deep-blue galaxy domes flecked with white stars and a hint of shimmer.", tagline: "Carry the night sky.", min: 300, max: 800 },
      { name: "Initial Charm Keychain", hook: "A personalised initial set with petals and a touch of glitter.", tagline: "Yours at a glance.", min: 150, max: 500 },
      { name: "Botanical Bookmark", hook: "A slim, translucent bookmark with pressed ferns and a gold tassel.", tagline: "For slow readers.", min: 200, max: 600 },
      { name: "Rose Quartz Ring", hook: "A faceted blush-pink resin stone on a delicate adjustable band.", tagline: "Soft and unmissable.", min: 250, max: 750 },
      { name: "Ocean Wave Cufflinks", hook: "A pair of miniature blue-and-white wave domes for quiet occasions.", tagline: "The sea, to the suit.", min: 400, max: 1100 },
      { name: "Dried Lavender Necklace", hook: "Real lavender sprigs preserved in a clear rectangular pendant.", tagline: "Calm you can wear.", min: 350, max: 900 },
      { name: "Marble Statement Studs", hook: "Bold ivory-and-gold marble discs for an elevated everyday look.", tagline: "Stone, lightened.", min: 280, max: 760 },
      { name: "Memory Locket Keepsake", hook: "Set a tiny memento — a petal, a thread — in a clear keepsake locket.", tagline: "Hold the moment.", min: 400, max: 1500 },
      { name: "Hexagon Pendant Set", hook: "A matching pendant-and-earring set in geometric clear-and-gold hexes.", tagline: "Modern, matched.", min: 500, max: 1600 },
      { name: "Sunflower Brooch", hook: "A cheerful preserved sunflower set in a glossy round brooch.", tagline: "A little sunshine, pinned.", min: 300, max: 800 },
      { name: "Starlight Hair Pins", hook: "A pair of celestial resin pins with gold flecks for special evenings.", tagline: "Wear the stars.", min: 250, max: 700 },
      { name: "Amber Glow Bangle", hook: "A warm amber bangle with suspended gold leaf, like trapped light.", tagline: "Sunset on your wrist.", min: 450, max: 1200 },
      { name: "Forget-Me-Not Studs", hook: "Real blue forget-me-nots set in petite, polished clear studs.", tagline: "Small, and meant.", min: 250, max: 700 },
    ],
  },
  {
    slug: "home-decor",
    noun: "Resin Home Decor",
    timeline: "1–2 weeks",
    materials: "Epoxy resin, pigments, metallic leaf",
    dimensions: "Piece-dependent",
    priceMin: 400,
    priceMax: 4500,
    context: [
      "Made to order in your colours, so it sits perfectly with your space.",
      "Sealed and polished to a durable, easy-to-wipe high-gloss finish.",
      "A thoughtful housewarming or wedding gift that feels personal.",
    ],
    fields: [
      { label: "Colour", type: "SWATCH", required: true, options: SWATCHES },
      { label: "Personalisation (optional)", type: "TEXT", helpText: "Name, initials or a short message." },
      { label: "Quantity", type: "NUMBER", helpText: "For sets — e.g. coasters." },
    ],
    concepts: [
      { name: "Ocean Bookends Pair", hook: "A heavy pair of blue-wave bookends that hold a shelf together beautifully.", tagline: "Anchor your reading.", min: 1400, max: 3600, featured: true },
      { name: "Photo Memory Block", hook: "A favourite photo encased in a clear resin block that glows on a desk.", tagline: "A moment, paperweighted.", min: 700, max: 2200 },
      { name: "Floral Fridge Magnets", hook: "A set of petite pressed-flower magnets to brighten any kitchen.", tagline: "Little blooms, everywhere.", min: 400, max: 1100 },
      { name: "Geode Pen Stand", hook: "A desk pen stand with a crystal-druzy mouth and a polished base.", tagline: "Desks deserve nice things.", min: 800, max: 2400 },
      { name: "Resin Wall Hooks", hook: "A row of marble-effect hooks for keys, scarves and small things.", tagline: "Catch the everyday.", min: 600, max: 1800 },
      { name: "Lotus Tealight Trio", hook: "Three lotus-shaped holders that float warm light across a table.", tagline: "Glow, in threes.", min: 700, max: 1900 },
      { name: "Personalised Key Tray", hook: "A small entryway tray with your family name set in gold.", tagline: "Home starts here.", min: 800, max: 2200 },
      { name: "Constellation Night Light", hook: "A backlit resin panel scattered with stars for a calming bedside glow.", tagline: "Sleep under stars.", min: 1500, max: 4200 },
      { name: "Mandala Trivet", hook: "A heat-friendly trivet with a fine mandala in metallic leaf.", tagline: "Beauty under the pot.", min: 600, max: 1700 },
      { name: "Initial Shelf Sculpture", hook: "A free-standing initial with swirling colour for shelves and consoles.", tagline: "Your letter, elevated.", min: 800, max: 2500 },
      { name: "Seascape Soap Dish", hook: "A little blue-wave dish that turns a basin into a coastal moment.", tagline: "Small luxuries count.", min: 400, max: 1000 },
      { name: "Gilded Ring Dish", hook: "A trinket dish with a gold-leaf well for rings and tiny treasures.", tagline: "A home for the small.", min: 450, max: 1200 },
    ],
  },
  {
    slug: "resin-trays",
    noun: "Resin Tray",
    timeline: "1–2 weeks",
    materials: "Epoxy resin, metallic leaf, MDF base",
    dimensions: "6x6 to 14x10 inch",
    priceMin: 1200,
    priceMax: 5200,
    context: [
      "Styled on a console or used to serve, it earns its place either way.",
      "Sealed to a mirror gloss and finished with a smooth, wipeable surface.",
      "Pick your size, finish and handles for a piece that's entirely yours.",
    ],
    fields: [
      { label: "Size", type: "SIZE", required: true, options: ["6x6 inch", "8x8 inch", "10x10 inch", "14x10 inch"] },
      { label: "Metallic Finish", type: "SELECT", required: true, options: ["Gold Leaf", "Silver Leaf", "Rose Gold Leaf"] },
      { label: "Handles", type: "SELECT", options: ["Gold Handles", "Silver Handles", "No Handles"] },
      { label: "Accent Colour", type: "SWATCH", options: SWATCHES },
    ],
    concepts: [
      { name: "Ivory Marble Vanity Tray", hook: "A soft marble tray that gathers perfume and jewellery in quiet luxury.", tagline: "Order, made beautiful.", min: 1300, max: 3600, featured: true },
      { name: "Emerald Agate Bar Tray", hook: "A deep-green agate-edge tray built for evening drinks and good company.", tagline: "Pour something nice.", min: 1600, max: 4800 },
      { name: "Petal Tea Tray", hook: "A clear tray with pressed petals for slow afternoons and chai.", tagline: "Tea, with flowers.", min: 1200, max: 3200 },
      { name: "Onyx & Gold Serving Tray", hook: "A bold black tray veined in gold for a statement table setting.", tagline: "Serve with confidence.", min: 1500, max: 4200 },
      { name: "Ocean Breakfast Tray", hook: "A wide blue-wave tray that brings breakfast-in-bed to the seaside.", tagline: "Mornings by the sea.", min: 1800, max: 5200 },
      { name: "Blush Geode Catchall", hook: "A small pink-geode catchall for keys, coins and daily small things.", tagline: "A soft landing.", min: 1200, max: 2800 },
      { name: "Terrazzo Snack Platter", hook: "A playful terrazzo platter that makes even simple snacks feel styled.", tagline: "Snacks, upgraded.", min: 1300, max: 3400 },
      { name: "Gilded Perfume Tray", hook: "A petite gold-rimmed tray to display your favourite bottles.", tagline: "Scent, on a stage.", min: 1200, max: 3000 },
      { name: "Riverstone Bath Tray", hook: "A pebble-and-clear tray sized to span a tub for spa-night calm.", tagline: "Run the bath.", min: 1900, max: 5000 },
      { name: "Sunset Dessert Board", hook: "A warm amber-gradient board for cakes, fruit and celebrations.", tagline: "Sweeter, served.", min: 1400, max: 3800 },
      { name: "Monogram Welcome Tray", hook: "A console tray set with your initials for an elegant entryway.", tagline: "Greet your guests.", min: 1500, max: 3900 },
      { name: "Galaxy Catch Tray", hook: "A deep-blue starry tray that turns a desk corner into a small cosmos.", tagline: "Land among stars.", min: 1200, max: 3000 },
    ],
  },
  {
    slug: "candle-holders",
    noun: "Resin Candle Holder",
    timeline: "1–2 weeks",
    materials: "Heat-safe epoxy resin, pigments, metallic leaf",
    dimensions: "Piece-dependent",
    priceMin: 400,
    priceMax: 2600,
    context: [
      "Designed for tealights and pillar candles, with a steady, level base.",
      "The glow travels through the resin for a warm, layered light.",
      "Lovely solo or grouped as a centrepiece for festivals and dinners.",
    ],
    fields: [
      { label: "Set Size", type: "SELECT", required: true, options: ["Single", "Set of 2", "Set of 4"] },
      { label: "Colour", type: "SWATCH", options: SWATCHES },
      { label: "Style", type: "SELECT", options: ["Minimal", "Geode", "Marble", "Floral"] },
    ],
    concepts: [
      { name: "Diwali Diya Set of 4", hook: "Four festive diyas in jewel tones with gold leaf for the season of light.", tagline: "Light the festival.", min: 800, max: 2200, featured: true },
      { name: "Geode Pillar Holder", hook: "A chunky agate-style holder that frames a pillar candle in colour.", tagline: "A jewel for the flame.", min: 600, max: 1800 },
      { name: "Lotus Float Bowl", hook: "A wide lotus bowl for floating candles and a few fresh petals.", tagline: "Float a little light.", min: 700, max: 1900 },
      { name: "Marble Taper Pair", hook: "A refined pair of ivory-marble taper holders for the dinner table.", tagline: "Dinner, by candlelight.", min: 700, max: 2000 },
      { name: "Ocean Tealight Trio", hook: "Three blue-wave tealight cups that scatter a soft coastal glow.", tagline: "Sea-light, three ways.", min: 600, max: 1600 },
      { name: "Terrazzo Votive Set", hook: "Playful terrazzo votives that bring colour to a mantel or shelf.", tagline: "Joy, by the flame.", min: 700, max: 1900 },
      { name: "Gold Orb Holder", hook: "A sculptural sphere with a gilded interior that throws warm light.", tagline: "A small golden sun.", min: 800, max: 2400 },
      { name: "Floral Cluster Centrepiece", hook: "A clustered holder with pressed blooms for weddings and feasts.", tagline: "The table's heart.", min: 1000, max: 2600 },
      { name: "Minimal Cube Tealights", hook: "Clean translucent cubes that suit modern, pared-back interiors.", tagline: "Less, lit well.", min: 500, max: 1400 },
      { name: "Galaxy Glow Holder", hook: "A deep-blue starry holder that turns a tealight into a tiny cosmos.", tagline: "A flame among stars.", min: 600, max: 1700 },
      { name: "Blush Petal Votives", hook: "Soft pink votives with suspended petals for a gentle, romantic glow.", tagline: "Romance, lit.", min: 600, max: 1600 },
      { name: "Heritage Brass-Tone Diya", hook: "A diya with a warm brass-tone leaf finish for traditional altars.", tagline: "Tradition, glowing.", min: 500, max: 1500 },
    ],
  },
  {
    slug: "resin-wall-clocks",
    noun: "Resin Wall Clock",
    timeline: "2–3 weeks",
    materials: "Epoxy resin, pigments, silent quartz movement",
    dimensions: "12–24 inch diameter",
    priceMin: 2000,
    priceMax: 7500,
    context: [
      "Driven by a silent sweep movement, so it keeps time without a tick.",
      "Hand-poured, so the colour flow is one-of-a-kind to your clock.",
      "Add engraving on the rim to mark a name, date or milestone.",
    ],
    fields: [
      { label: "Diameter", type: "SIZE", required: true, options: ["12 inch", "16 inch", "20 inch", "24 inch"] },
      { label: "Pattern", type: "SELECT", required: true, options: ["Ocean Wave", "Geode", "Marble", "Galaxy", "Petal"] },
      { label: "Primary Colour", type: "SWATCH", options: SWATCHES },
      { label: "Engraving Text (optional)", type: "TEXT", helpText: "Name, date or short message on the rim." },
    ],
    concepts: [
      { name: "Geode Ring Wall Clock", hook: "Agate rings radiate from a crystal centre out to a gilded rim.", tagline: "Time, set in stone.", min: 2400, max: 6800, featured: true },
      { name: "Marble Minimal Clock", hook: "Clean ivory marble with gold veining and slim gold hands.", tagline: "Hours, quietly kept." },
      { name: "Galaxy Sweep Clock", hook: "A deep-space dial with star dust and a smooth, silent sweep.", tagline: "Tell time by the stars." },
      { name: "Petal Bloom Clock", hook: "Real pressed petals arranged around the dial in soft colour.", tagline: "A garden keeps time." },
      { name: "Monsoon Cloud Clock", hook: "Stormy teal-and-charcoal swirls broken by a thread of amber light.", tagline: "Weatherly hours." },
      { name: "Terrazzo Pop Clock", hook: "Colourful terrazzo chips on a creamy dial for cheerful rooms.", tagline: "Time with a smile." },
      { name: "Onyx Gold Clock", hook: "A dramatic black dial veined in liquid gold for bold interiors.", tagline: "Dark, and golden." },
      { name: "Coral Lagoon Clock", hook: "Layered lagoon greens fading from shallow to deep around the face.", tagline: "Reef o'clock." },
      { name: "Blush Marble Clock", hook: "A soft pink marble dial with rose-gold hands for gentle spaces.", tagline: "Time, softened." },
      { name: "Riverstone Zen Clock", hook: "Smooth pebbles and clear resin for a calm, spa-like wall.", tagline: "Unhurried time." },
      { name: "Sunset Gradient Clock", hook: "Warm amber-to-blush bands like the last light of the day.", tagline: "Always golden hour." },
      { name: "Emerald Agate Clock", hook: "Rich emerald agate banding with a fine gold edge and centre.", tagline: "Jewel-toned hours." },
    ],
  },
  {
    slug: "wedding-photo-frames",
    noun: "Wedding Photo Frame",
    timeline: "2–4 weeks",
    materials: "Teakwood, epoxy resin, optional LED",
    dimensions: "8x10 to 16x20 inch",
    priceMin: 1200,
    priceMax: 6500,
    context: [
      "Your photo is printed archival and set behind a glossy resin border.",
      "Add names, a date and a warm LED backlight to make it a centrepiece.",
      "A heartfelt gift for anniversaries, weddings and new beginnings.",
    ],
    fields: [
      { label: "Frame Size", type: "SIZE", required: true, options: ["8x10 inch", "11x14 inch", "12x16 inch", "16x20 inch"] },
      { label: "Wood Finish", type: "SELECT", required: true, options: ["Teakwood", "Walnut", "Matte White"] },
      { label: "Names & Date", type: "TEXT", required: true, helpText: "Exactly as you'd like it engraved." },
      { label: "LED Backlight", type: "SELECT", options: ["Yes", "No"] },
      { label: "Reference Photo", type: "FILE", helpText: "Upload the photo you'd like framed." },
    ],
    concepts: [
      { name: "Ocean Border Wedding Frame", hook: "A blue-wave resin border that frames your portrait like a coastal vow.", tagline: "Your day, by the sea.", min: 1600, max: 5200, featured: true },
      { name: "Gilded Vows Frame", hook: "A slim gold-leaf resin border for an elegant, timeless portrait.", tagline: "Forever, in gold.", min: 1400, max: 4800 },
      { name: "Floral Memory Frame", hook: "Pressed wedding-palette petals set into a soft, romantic border.", tagline: "Bloom-bordered love.", min: 1500, max: 5000 },
      { name: "LED Halo Couple Frame", hook: "A backlit resin frame that gives your photo a warm, glowing halo.", tagline: "Lit from within.", min: 2200, max: 6500 },
      { name: "Marble Heritage Frame", hook: "Ivory-and-gold marble resin for a refined, heirloom-worthy frame.", tagline: "Built to be passed on.", min: 1600, max: 5200 },
      { name: "Anniversary Date Frame", hook: "A teak frame with your date set in gold beneath a glossy resin edge.", tagline: "Mark the day.", min: 1300, max: 4200 },
      { name: "Galaxy Love Frame", hook: "A starry deep-blue border for couples who found their universe.", tagline: "Written in the stars.", min: 1500, max: 4800 },
      { name: "Blush Romance Frame", hook: "A soft blush-and-gold border for gentle, romantic portraits.", tagline: "Love, in soft focus.", min: 1400, max: 4600 },
      { name: "Dual-Photo Story Frame", hook: "Two photos side by side in a single resin-bordered keepsake.", tagline: "Then and now.", min: 1800, max: 5600 },
      { name: "Engraved Verse Frame", hook: "A wide lower border resin-set to hold a short vow or favourite line.", tagline: "Words that stay.", min: 1600, max: 5200 },
    ],
  },
  {
    slug: "varmala-preservation",
    noun: "Varmala Preservation Frame",
    timeline: "4–6 weeks",
    materials: "Preserved florals, epoxy resin, teakwood frame",
    dimensions: "12x12 to 24x24 inch",
    priceMin: 3500,
    priceMax: 15000,
    context: [
      "We dry, set and seal your garland so its colour and form are held for years.",
      "Built as a deep shadow-box so the flowers keep their natural dimension.",
      "Add an inset photo, names and your wedding date for a true heirloom.",
    ],
    fields: [
      { label: "Frame Size", type: "SIZE", required: true, options: ["12x12 inch", "16x16 inch", "20x20 inch", "24x24 inch"] },
      { label: "Frame Finish", type: "SELECT", required: true, options: ["Teakwood", "Walnut", "Matte White"] },
      { label: "Backing Colour", type: "SWATCH", options: SWATCHES },
      { label: "Names & Wedding Date", type: "TEXT", required: true, helpText: "As you'd like it engraved." },
      { label: "Photo Inset", type: "SELECT", options: ["Yes", "No"] },
      { label: "Reference Photo", type: "FILE", helpText: "A photo of the varmala helps us plan the layout." },
    ],
    concepts: [
      { name: "Classic Shadow-Box Varmala Frame", hook: "Your full garland arranged in a deep teak shadow-box with a name plate.", tagline: "Keep the garland, keep the day.", min: 4000, max: 14000, featured: true },
      { name: "Heart Layout Varmala Frame", hook: "The garland shaped into a soft heart around an inset wedding photo.", tagline: "Your love, in bloom." },
      { name: "Circle of Vows Varmala Frame", hook: "A circular arrangement that echoes the rounds taken at the mandap.", tagline: "The circle, unbroken." },
      { name: "Dual Garland Frame", hook: "Both partners' garlands preserved together in one wide keepsake.", tagline: "Two garlands, one story.", min: 5500, max: 15000 },
      { name: "Minimal Floating Varmala Frame", hook: "Key blooms floated in clear resin for a light, modern preservation.", tagline: "Less frame, more flower." },
      { name: "Gold-Leaf Accent Varmala Frame", hook: "Delicate gold leaf threaded through the petals for a gilded finish.", tagline: "Gilded memory." },
      { name: "Photo-Centre Varmala Frame", hook: "A central portrait ringed by your preserved garland and date.", tagline: "You, at the centre." },
      { name: "Compact Desk Varmala Block", hook: "A few signature blooms set in a clear block for a desk or shelf.", tagline: "A small piece of the day.", min: 3500, max: 8000 },
      { name: "Mandala Layout Varmala Frame", hook: "Petals arranged into a fine mandala for a meditative keepsake.", tagline: "Symmetry of a vow." },
      { name: "Heritage Engraved Varmala Frame", hook: "A wide engraved border holding your names, date and a short blessing.", tagline: "Words around the flowers." },
    ],
  },
  {
    slug: "3d-printed-decor",
    noun: "3D-Printed Decor",
    timeline: "1–3 weeks",
    materials: "PLA+ / SLA resin, hand-finished and sealed",
    dimensions: "Design-dependent",
    priceMin: 500,
    priceMax: 8000,
    context: [
      "Modelled to your brief and printed at high resolution, then hand-finished.",
      "Choose the material, colour and scale to suit the piece and the room.",
      "Pairs beautifully with our resin work for a fully bespoke commission.",
    ],
    fields: [
      { label: "Material", type: "SELECT", required: true, options: ["PLA+ (durable)", "SLA Resin (fine detail)", "Wood-fill"] },
      { label: "Colour", type: "SELECT", options: ["Ivory", "Black", "Gold", "Custom"] },
      { label: "Size", type: "SIZE", options: ["Small", "Medium", "Large"] },
      { label: "Personalisation", type: "TEXT", helpText: "Name, text or design notes." },
      { label: "Reference / Model File", type: "FILE", helpText: "Sketch, photo or STL if you have one." },
    ],
    concepts: [
      { name: "Custom Lithophane Lamp", hook: "A photo hidden in white until it's lit — then it glows into view.", tagline: "Your photo, in light.", min: 1500, max: 5000, featured: true },
      { name: "Personalised Desk Nameplate", hook: "A crisp 3D nameplate for a desk, studio or new corner office.", tagline: "Claim your desk.", min: 600, max: 2200 },
      { name: "Miniature Couple Figurine", hook: "A stylised cake-topper figurine modelled to look like the two of you.", tagline: "The little you's.", min: 1200, max: 4500 },
      { name: "Architectural Model Keepsake", hook: "A scaled model of a home or venue that means something to you.", tagline: "Hold the place.", min: 2500, max: 8000 },
      { name: "Geometric Planter Set", hook: "A trio of faceted planters for succulents and small green things.", tagline: "Grow, geometrically.", min: 900, max: 2800 },
      { name: "Custom Logo Sign", hook: "A clean, dimensional brand sign for a shop counter or studio wall.", tagline: "Your mark, in 3D.", min: 1500, max: 6000 },
      { name: "Desk Cable Organiser", hook: "A tidy, weighted organiser that ends the daily tangle of cables.", tagline: "Order, printed.", min: 500, max: 1600 },
      { name: "Topographic Map Art", hook: "A layered relief of a mountain or coastline that matters to you.", tagline: "Your place, in relief.", min: 1800, max: 6500 },
      { name: "Custom Cookie/Fondant Stamp", hook: "A personalised stamp for bakers who like their logo on everything.", tagline: "Stamp it sweet.", min: 600, max: 1800 },
      { name: "Light-Up Name Sign", hook: "A backlit 3D name sign for nurseries, parties and gifting.", tagline: "Names that glow.", min: 1500, max: 5000 },
      { name: "Bespoke Phone Stand", hook: "A sculptural, weighted phone stand modelled to your taste.", tagline: "Stand by.", min: 600, max: 2000 },
      { name: "Replica Keepsake Trophy", hook: "A custom award or trophy for teams, tournaments and milestones.", tagline: "Make it official.", min: 1200, max: 5000 },
    ],
  },
  {
    slug: "resin-furniture",
    noun: "Resin Furniture",
    timeline: "6–12 weeks",
    materials: "Live-edge hardwood, deep-pour epoxy, steel or brass base",
    dimensions: "Custom (made to order)",
    showPrice: false,
    priceMin: 18000,
    priceMax: 140000,
    context: [
      "Built to your exact dimensions and finished to furniture standard.",
      "Pricing is bespoke — share your size, wood and tint for a quote.",
      "A true centrepiece, made once, for one home.",
    ],
    fields: [
      { label: "Wood", type: "SELECT", required: true, options: ["Acacia", "Walnut", "Teak", "Mango", "Raintree"] },
      { label: "Resin Tint", type: "SWATCH", options: SWATCHES },
      { label: "Desired Dimensions", type: "TEXT", required: true, helpText: "Length × width × height in inches." },
      { label: "Base Finish", type: "SELECT", options: ["Black Steel", "Brass", "Wood"] },
      { label: "Reference", type: "FILE", helpText: "Any inspiration images you have." },
    ],
    concepts: [
      { name: "Live-Edge River Dining Table", hook: "A long live-edge dining table split by a deep, glassy resin river.", tagline: "Gather around the river.", featured: true },
      { name: "Ocean River Console Table", hook: "A slim console with a blue-wave channel for a hallway or entry.", tagline: "A coastline at the door." },
      { name: "Resin Inlay Side Table", hook: "A compact side table with a swirling resin inlay top.", tagline: "Small, and a statement." },
      { name: "Epoxy Bar Counter Top", hook: "A bespoke bar top with a deep tinted pour and live-edge front.", tagline: "Pour at the bar.", min: 35000, max: 140000 },
      { name: "Forest Floor Coffee Table", hook: "Greens and ambers like sunlight through leaves set in a low table.", tagline: "Bring the forest in." },
      { name: "Geode Edge Console", hook: "A console finished with a crystalline geode edge and gold leaf.", tagline: "Furniture as jewel." },
      { name: "Galaxy River Desk", hook: "A working desk with a starry resin river for late-night ideas.", tagline: "Work among stars." },
      { name: "Minimal Resin Bench", hook: "A clean bench pairing pale wood with a single clear resin seam.", tagline: "Sit with restraint." },
      { name: "Marble-Effect Dining Top", hook: "A dining top poured to mimic veined marble at a fraction of the weight.", tagline: "Stone, made lighter." },
      { name: "Statement Wall Panel", hook: "An oversized resin-and-wood panel to anchor a feature wall.", tagline: "The wall's centrepiece.", min: 25000, max: 120000 },
    ],
  },
  {
    slug: "spiritual-festive",
    noun: "Resin Spiritual Decor",
    timeline: "1–2 weeks",
    materials: "Epoxy resin, pigments, gold leaf, brass",
    dimensions: "Piece-dependent",
    priceMin: 500,
    priceMax: 4500,
    context: [
      "Hand-finished in luxe resin with real metallic leaf for a festive glow.",
      "Made to order in your colours, so it suits your home and your rituals.",
      "A thoughtful gift for housewarmings, weddings and festivals.",
    ],
    fields: [
      { label: "Colour", type: "SWATCH", options: SWATCHES },
      { label: "Personalisation (optional)", type: "TEXT", helpText: "Names, a date or a mantra." },
      { label: "Set Size", type: "SELECT", options: ["Single", "Set of 2", "Set of 5"] },
    ],
    concepts: [
      { name: "Lotus Mandala Rangoli Set", hook: "A reusable resin rangoli of lotus petals in jewel tones and gold leaf.", tagline: "Bloom at the threshold.", min: 700, max: 2400, featured: true },
      { name: "Gilded Pooja Thali", hook: "A pooja thali with a mandala base, gold rim and wells for diya and roli.", tagline: "Ritual, made radiant.", min: 900, max: 3200 },
      { name: "Mandir Backdrop Frame", hook: "A resin-and-teak backdrop panel to frame your home mandir in soft light.", tagline: "A worthy backdrop.", min: 1800, max: 4500 },
      { name: "Ganesha Relief Wall Art", hook: "A serene raised Ganesha in ivory and gold against a deep resin ground.", tagline: "Blessings on the wall.", min: 1500, max: 4200 },
      { name: "Om Gold-Leaf Wall Disc", hook: "A glossy Om symbol in gold leaf floating on an ocean-blue disc.", tagline: "Sound, made still.", min: 800, max: 2600 },
      { name: "Festive Diya Platter", hook: "A wide platter cradling five jewel-tone diyas for the season of light.", tagline: "Light, gathered.", min: 800, max: 2400 },
      { name: "Swastik Door Accent", hook: "A small auspicious swastik in gold and amber for the doorway.", tagline: "Welcome, blessed.", min: 500, max: 1600 },
      { name: "Marigold Resin Toran", hook: "A resin toran of marigold-style blooms and bells for festive doorways.", tagline: "Dress the doorway.", min: 900, max: 3000 },
    ],
  },
  {
    slug: "corporate-gifting",
    noun: "Corporate Gift",
    timeline: "2–3 weeks",
    materials: "Epoxy resin, wood, metal, custom branding",
    dimensions: "Custom",
    priceMin: 600,
    priceMax: 6500,
    context: [
      "Customised with your logo, names or brand colours and delivered consistently in bulk.",
      "Useful and beautiful, so it stays on the desk rather than in the drawer.",
      "One point of contact on WhatsApp from brief to delivery.",
    ],
    fields: [
      { label: "Material", type: "SELECT", options: ["Resin + Wood", "Resin + Metal", "Pure Resin"] },
      { label: "Branding (logo / name)", type: "TEXT", required: true, helpText: "What to engrave or set inside." },
      { label: "Quantity", type: "NUMBER", helpText: "Bulk orders welcome." },
      { label: "Brand Colour", type: "SWATCH", options: SWATCHES },
    ],
    concepts: [
      { name: "Branded Desk Nameplate Gift", hook: "A resin-and-walnut desk nameplate set with your logo and title.", tagline: "Own the desk.", min: 800, max: 2600, featured: true },
      { name: "Logo Suspension Paperweight", hook: "A crystal-clear resin paperweight with your brand mark suspended inside.", tagline: "Your mark, held.", min: 600, max: 1800 },
      { name: "Resin Achievement Award", hook: "A sculptural award in ocean-blue and gold for milestones and winners.", tagline: "Make it official.", min: 1200, max: 5000 },
      { name: "Executive Pen Stand Gift", hook: "A geode-edge pen stand that anchors any executive desk.", tagline: "Quietly senior.", min: 900, max: 2800 },
      { name: "Corporate Coaster Gift Box", hook: "A boxed set of branded agate coasters for clients and teams.", tagline: "Gift in good taste.", min: 1000, max: 3200 },
      { name: "Branded Desk Organiser", hook: "A tidy resin organiser for cards, pens and the daily desk clutter.", tagline: "Order, branded.", min: 800, max: 2400 },
      { name: "Milestone Wall Plaque", hook: "A wall plaque marking an anniversary, launch or recognition.", tagline: "Mark the moment.", min: 1500, max: 5500 },
      { name: "Welcome Kit Tray", hook: "A branded onboarding tray to present new-hire or client welcome kits.", tagline: "First impressions, set.", min: 1200, max: 4000 },
    ],
  },
  {
    slug: "resin-coasters",
    noun: "Resin Coaster Set",
    timeline: "5–10 days",
    materials: "Epoxy resin, metallic leaf, cork base",
    dimensions: "~4 inch each",
    priceMin: 600,
    priceMax: 3000,
    context: [
      "Sealed to a heat-friendly gloss with a soft cork base that protects surfaces.",
      "Made to order in your colours, with no two sets ever quite alike.",
      "A go-to housewarming or hostess gift that always lands.",
    ],
    fields: [
      { label: "Set Size", type: "SELECT", required: true, options: ["Set of 2", "Set of 4", "Set of 6"] },
      { label: "Metallic Finish", type: "SELECT", options: ["Gold Leaf", "Silver Leaf", "Rose Gold Leaf"] },
      { label: "Colour", type: "SWATCH", options: SWATCHES },
    ],
    concepts: [
      { name: "Agate Slice Coaster Set", hook: "Geode-edge coasters with gold rims that double as table jewellery.", tagline: "Drinks deserve a setting.", min: 900, max: 2600, featured: true },
      { name: "Ocean Wave Coaster Set", hook: "Breaking-wave blues and white foam for relaxed coastal tables.", tagline: "A little sea, set down.", min: 800, max: 2200 },
      { name: "Ivory Marble Coaster Set", hook: "Soft marble-and-gold coasters for a calm, classic table.", tagline: "Quietly classic.", min: 800, max: 2200 },
      { name: "Terrazzo Pop Coaster Set", hook: "Playful terrazzo chips in a creamy resin for cheerful hosting.", tagline: "Joy, by the cup.", min: 700, max: 1900 },
      { name: "Galaxy Coaster Set", hook: "Deep-blue starry coasters with gold dust for evening drinks.", tagline: "Cosmic coasters.", min: 800, max: 2200 },
      { name: "Blush Petal Coaster Set", hook: "Soft pink coasters with real pressed petals for a romantic table.", tagline: "Pretty, pressed.", min: 800, max: 2200 },
      { name: "Emerald Agate Coaster Set", hook: "Rich emerald agate banding edged in fine gold leaf.", tagline: "Jewel-toned.", min: 900, max: 2600 },
      { name: "Monogram Coaster Set", hook: "Finished with your initials in gold for a personal touch.", tagline: "Initially yours.", min: 900, max: 2800 },
    ],
  },
  {
    slug: "nameplates",
    noun: "Resin Nameplate",
    timeline: "2–3 weeks",
    materials: "Epoxy resin, teak, gold leaf, optional LED",
    dimensions: "8–16 inch",
    priceMin: 1000,
    priceMax: 5000,
    context: [
      "Your name set in crisp lettering behind a glossy resin finish, ready to mount.",
      "Made to order in your colours and size, with an optional warm LED backlight.",
      "A polished first impression for a home, studio or new office.",
    ],
    fields: [
      { label: "Size", type: "SIZE", required: true, options: ["8 inch", "10 inch", "12 inch", "16 inch"] },
      { label: "Mount", type: "SELECT", options: ["Door", "Desk", "Wall"] },
      { label: "Name & Text", type: "TEXT", required: true, helpText: "Exactly as you'd like it." },
      { label: "Finish", type: "SELECT", options: ["Marble", "Ocean", "Geode", "Minimal Ivory"] },
    ],
    concepts: [
      { name: "Ivory Marble Door Nameplate", hook: "A marble-effect nameplate with crisp gold lettering and a teak border.", tagline: "Arrive in style.", min: 1200, max: 3800, featured: true },
      { name: "Ocean Wave Nameplate", hook: "A blue-wave bordered nameplate for a coastal, welcoming entrance.", tagline: "Home by the sea.", min: 1200, max: 3600 },
      { name: "Geode Edge Nameplate", hook: "A crystalline geode edge frames your family name in gold.", tagline: "A jewelled welcome.", min: 1400, max: 4200 },
      { name: "Floral Press Nameplate", hook: "Real pressed blooms set around your name for a soft, personal plate.", tagline: "Named in bloom.", min: 1300, max: 3800 },
      { name: "Galaxy Nameplate", hook: "A starry deep-blue plate with gold lettering for a bold doorway.", tagline: "Written in stars.", min: 1300, max: 3800 },
      { name: "Minimal Ivory Nameplate", hook: "A clean ivory plate with slim modern lettering for pared-back homes.", tagline: "Less, named well.", min: 1000, max: 3000 },
      { name: "LED Backlit Nameplate", hook: "A nameplate with a warm LED glow that lifts your name after dark.", tagline: "Lit by name.", min: 2000, max: 5000 },
      { name: "Executive Desk Nameplate", hook: "A resin-and-walnut desk nameplate for an office, studio or cabin.", tagline: "Claim the desk.", min: 1000, max: 2800 },
    ],
  },
];

export function buildProducts() {
  const out: {
    title: string; slug: string; shortTagline: string; description: string;
    priceMin?: number; priceMax?: number; showPrice: boolean; featured: boolean;
    timeline: string; materials: string; dimensions: string;
    seoTitle: string; seoDescription: string; categorySlug: string;
    images: { url: string; alt: string }[]; fields: SeedField[];
  }[] = [];
  for (const cat of cats) {
    cat.concepts.forEach((c, i) => {
      const slug = slugify(c.name);
      const description = `${c.hook} ${cat.context[i % cat.context.length]}`;
      out.push({
        title: c.name,
        slug,
        shortTagline: c.tagline,
        description,
        priceMin: cat.showPrice === false ? undefined : c.min ?? cat.priceMin,
        priceMax: cat.showPrice === false ? undefined : c.max ?? cat.priceMax,
        showPrice: cat.showPrice !== false,
        featured: c.featured ?? false,
        timeline: cat.timeline,
        materials: cat.materials,
        dimensions: cat.dimensions,
        seoTitle: `${c.name} — Handmade ${cat.noun} | ResinRiva`,
        seoDescription: `${c.hook} Custom colour, size and finish — made to order in India. Enquire on WhatsApp.`,
        categorySlug: cat.slug,
        images: [{ url: categoryImage[cat.slug] ?? fallbackImage, alt: c.name }],
        fields: cat.fields,
      });
    });
  }
  return out;
}

/* ───────────────────────────────────────────────────────────────────────
   Blog — original articles. Rich Tiptap JSON via small node helpers.
   ─────────────────────────────────────────────────────────────────────── */
type TNode = { type: string; content?: TNode[]; text?: string; marks?: { type: string }[]; attrs?: Record<string, unknown> };
const tx = (text: string): TNode => ({ type: "text", text });
const para = (text: string): TNode => ({ type: "paragraph", content: [tx(text)] });
const h2 = (text: string): TNode => ({ type: "heading", attrs: { level: 2 }, content: [tx(text)] });
const li = (text: string): TNode => ({ type: "listItem", content: [para(text)] });
const ul = (items: string[]): TNode => ({ type: "bulletList", content: items.map(li) });
const quote = (text: string): TNode => ({ type: "blockquote", content: [para(text)] });

type Section = { h: string; p: string; list?: string[] };
type PostSpec = {
  title: string; excerpt: string; categorySlug: string; tags: string[]; date: string;
  intro: string; sections: Section[]; pull?: string; outro: string;
};

export function buildDoc(s: PostSpec): object {
  const nodes: TNode[] = [para(s.intro)];
  s.sections.forEach((sec, i) => {
    nodes.push(h2(sec.h), para(sec.p));
    if (sec.list) nodes.push(ul(sec.list));
    if (s.pull && i === 0) nodes.push(quote(s.pull));
  });
  nodes.push(h2("In short"), para(s.outro));
  return { type: "doc", content: nodes };
}

const blogCategories = [
  { slug: "guides", name: "Guides & Care" },
  { slug: "gifting", name: "Gift Ideas" },
  { slug: "behind-the-scenes", name: "Behind the Scenes" },
  { slug: "inspiration", name: "Inspiration & Trends" },
  { slug: "weddings", name: "Weddings & Occasions" },
  { slug: "printing", name: "3D Printing" },
];

export const posts: PostSpec[] = [
  // ── Guides & Care ──────────────────────────────────────────────
  {
    title: "How to Clean Resin Art Without Dulling the Gloss",
    excerpt: "The gentle weekly routine that keeps resin pieces crystal-clear for years.",
    categorySlug: "guides", tags: ["care", "resin art"], date: "2026-01-08",
    intro: "Resin is wonderfully low-maintenance, but a few gentle habits keep that signature gloss looking showroom-fresh. Here's the routine we recommend to every client.",
    sections: [
      { h: "Dust little and often", p: "A soft, dry microfibre cloth is all you need for weekly dusting. Avoid paper towels, which can leave fine scratches over time.", list: ["Use a clean microfibre cloth", "Wipe in light, straight passes", "Skip abrasive sponges entirely"] },
      { h: "For marks and fingerprints", p: "Dampen a cloth with plain water, wipe the spot, then dry immediately. Steer clear of glass cleaners and anything with alcohol or ammonia, which can haze the surface." },
    ],
    pull: "Treat resin like a fine watch face: gentle, dry, and free of harsh chemicals.",
    outro: "Dust dry, spot-clean with water, keep it out of harsh sun — that's genuinely the whole job. Looked after this simply, a ResinRiva piece stays clear and glossy for many years.",
  },
  {
    title: "Does Resin Art Yellow Over Time? What Actually Matters",
    excerpt: "Why quality resin and a little shade keep your colours true.",
    categorySlug: "guides", tags: ["care", "materials"], date: "2026-01-20",
    intro: "It's the most common question we get: will it yellow? The honest answer is that it depends almost entirely on the resin used and where you place the piece.",
    sections: [
      { h: "The resin grade does the heavy lifting", p: "We use UV-stabilised, art-grade epoxy specifically formulated to resist ambering. Cheap craft resin is where most yellowing stories begin." },
      { h: "Placement is the other half", p: "Even the best resin appreciates a little shade. A few easy choices protect your colours for the long run.", list: ["Avoid hours of direct midday sun", "Keep pieces away from harsh halogen heat", "Rotate display spots occasionally"] },
    ],
    outro: "With art-grade, UV-stabilised resin and sensible placement, yellowing simply isn't the issue it once was. Ask us about the materials in any piece — we're happy to share exactly what we pour.",
  },
  {
    title: "How We Preserve a Wedding Varmala, Step by Step",
    excerpt: "From fresh garland to sealed heirloom — the full preservation journey.",
    categorySlug: "guides", tags: ["varmala", "weddings", "process"], date: "2026-02-02",
    intro: "Preserving a varmala is part science, part patience. Here's how a fresh garland becomes a frame you'll keep for decades.",
    sections: [
      { h: "Drying without losing colour", p: "As soon as we receive the garland, we begin a slow, controlled drying process that locks in shape and colour before any resin touches it." },
      { h: "Setting and sealing", p: "Once fully dry, blooms are arranged by hand and sealed in clear resin within a deep shadow-box, so they keep their natural dimension.", list: ["Controlled drying (the longest step)", "Hand arrangement to your layout", "Deep-set resin and final framing"] },
    ],
    pull: "The flowers from your most important day, held exactly as they were.",
    outro: "It's a four-to-six week labour of love, but the result is an heirloom. Send us a photo of your garland and we'll plan the perfect layout together.",
  },
  {
    title: "Resin vs. 3D Printing: Which Suits Your Idea?",
    excerpt: "A simple guide to choosing the right craft for your custom piece.",
    categorySlug: "guides", tags: ["3d printing", "resin art", "custom"], date: "2026-02-16",
    intro: "We work in both resin and 3D printing, and often combine them. If you're not sure which fits your idea, this quick guide helps.",
    sections: [
      { h: "Choose resin for colour and depth", p: "Flowing colour, gloss, preserved flowers and that liquid, glassy depth are all resin's strengths — think art, trays and clocks." },
      { h: "Choose 3D printing for precise form", p: "When you need an exact shape, fine geometry or a faithful replica, 3D printing wins.", list: ["Lithophanes from your photos", "Nameplates and signage", "Figurines and architectural models"] },
    ],
    outro: "Colour and flow lean resin; precise, repeatable form leans 3D printing — and the best commissions often use both. Tell us your idea and we'll suggest the right approach.",
  },
  {
    title: "How to Hang Heavy Resin Wall Art Safely",
    excerpt: "Simple, secure mounting for pieces that deserve to stay put.",
    categorySlug: "guides", tags: ["care", "resin art"], date: "2026-03-01",
    intro: "A large resin panel carries real weight, so a few minutes of proper mounting protects both your art and your wall.",
    sections: [
      { h: "Match the fixing to the wall", p: "Solid masonry takes a wall plug and screw; drywall needs a rated anchor. When in doubt, find a stud." },
      { h: "Our panels make it easy", p: "Every ResinRiva panel ships ready to hang, but these basics keep it safe for years.", list: ["Use two fixing points for balance", "Check it sits level before letting go", "Re-check the fixings once a year"] },
    ],
    outro: "Right anchor, two points, a quick level check — done. If you tell us your wall type when ordering, we'll fit the most suitable hanging hardware.",
  },
  {
    title: "Caring for Resin Jewellery So It Lasts",
    excerpt: "Small habits that keep wearable resin clear and comfortable.",
    categorySlug: "guides", tags: ["care", "jewellery"], date: "2026-03-18",
    intro: "Resin jewellery is light, hypoallergenic and lovely to wear — and it lasts even longer with a couple of easy habits.",
    sections: [
      { h: "Keep it away from perfume and pools", p: "Spray perfume first and let it dry before putting jewellery on, and remove pieces before swimming or long showers." },
      { h: "Store it kindly", p: "A soft pouch or lined box prevents knocks and keeps the surface smooth.", list: ["Perfume and lotion first, jewellery second", "Off before pools and saunas", "Store in a soft pouch, away from heat"] },
    ],
    outro: "Last on, first off — that old jewellery rule is perfect for resin too. Follow it and your pieces stay bright for years.",
  },
  {
    title: "Why Made-to-Order Beats Off-the-Shelf",
    excerpt: "What you really gain when a piece is built for you.",
    categorySlug: "guides", tags: ["custom", "studio"], date: "2026-04-02",
    intro: "Everything we make is created after you order it. That's slower than buying off a shelf — and that's exactly the point.",
    sections: [
      { h: "It fits your space and story", p: "Your colours, your dimensions, your engraving. A made-to-order piece belongs to your room rather than to a warehouse." },
      { h: "It's made with intention", p: "Small-batch, by hand, with materials we stand behind.", list: ["No mass production, no shortcuts", "Choices tailored to you", "A real person crafting your piece"] },
    ],
    outro: "Made-to-order means your piece is one of one. Browse a design, customise it, and we'll build it just for you.",
  },
  {
    title: "A Quick Glossary of Resin Art Terms",
    excerpt: "Geode, druzy, deep-pour and more — decoded in plain language.",
    categorySlug: "guides", tags: ["resin art", "education"], date: "2026-04-20",
    intro: "Shopping for resin art can come with unfamiliar words. Here's a friendly glossary so every product page makes sense.",
    sections: [
      { h: "The terms you'll see most", p: "These come up across our clocks, trays and wall art.", list: ["Geode — agate-like rings of colour", "Druzy — the sparkling crystal centre", "Deep-pour — thick, glassy resin layers", "Cells — the organic lacy patterns in waves"] },
      { h: "Finishes and add-ons", p: "Metallic leaf is real gold, silver or copper applied by hand; a high-gloss top coat is the final mirror-like seal." },
    ],
    outro: "Now the product pages read like plain English. Still curious about a term? Ask us on WhatsApp anytime.",
  },
  {
    title: "How Long Does a Custom Resin Order Take?",
    excerpt: "Realistic timelines for every kind of ResinRiva commission.",
    categorySlug: "guides", tags: ["custom", "process"], date: "2026-05-05",
    intro: "Handmade takes time, and good preservation takes more. Here's what to expect so you can plan gifts and occasions.",
    sections: [
      { h: "Typical windows by type", p: "Curing and finishing simply can't be rushed without cutting corners.", list: ["Jewellery and keychains: 5–10 days", "Trays, clocks and decor: 1–3 weeks", "Wall art and frames: 2–4 weeks", "Varmala and furniture: 4–12 weeks"] },
      { h: "Planning around a date", p: "Tell us your deadline up front. Where possible we'll prioritise, and we'll always be honest if a date isn't realistic." },
    ],
    outro: "When in doubt, order early — especially for weddings. Message us with your date and we'll confirm a timeline before you commit.",
  },
  // ── Gift Ideas ─────────────────────────────────────────────────
  {
    title: "12 Personalised Gifts That Aren't Clichés",
    excerpt: "Thoughtful, keep-forever ideas beyond the usual hampers.",
    categorySlug: "gifting", tags: ["gifts", "personalised"], date: "2026-01-12",
    intro: "The best gifts feel personal and last. If you're tired of predictable hampers, here are ideas people genuinely treasure.",
    sections: [
      { h: "For the couple", p: "Mark a beginning with something made for them.", list: ["A varmala preservation frame", "A name-and-date wall clock", "A dual-photo story frame"] },
      { h: "For the friend who has everything", p: "Lean into personality with colour and a small engraving they'll smile at every day." },
    ],
    outro: "A name, a date, a colour they love — small personal touches turn a gift into a keepsake. Tell us who it's for and we'll help you choose.",
  },
  {
    title: "Corporate Gifting That Doesn't End Up in a Drawer",
    excerpt: "Premium, customisable pieces your clients will actually display.",
    categorySlug: "gifting", tags: ["corporate", "gifts"], date: "2026-02-09",
    intro: "Branded mugs get forgotten. A handcrafted desk piece with a tasteful logo stays on display — and keeps your name in view.",
    sections: [
      { h: "Pieces that earn desk space", p: "Useful and beautiful is the winning combination for corporate gifts.", list: ["Engraved desk nameplates", "Geode pen stands and trays", "Custom 3D-printed logo awards"] },
      { h: "Easy in bulk", p: "We handle volume orders with consistent quality and a single point of contact on WhatsApp." },
    ],
    outro: "Pick something useful, add a subtle logo, and it lives on a desk rather than in a drawer. Message us for bulk pricing and timelines.",
  },
  {
    title: "Anniversary Gifts by Year, the Resin Way",
    excerpt: "A modern take on traditional anniversary themes.",
    categorySlug: "gifting", tags: ["gifts", "anniversary", "weddings"], date: "2026-03-10",
    intro: "Traditional anniversary themes are a lovely prompt — here's how to reinterpret a few of them in resin and 3D printing.",
    sections: [
      { h: "Early years", p: "Soft, personal and photo-led pieces suit the first anniversaries beautifully.", list: ["First year: a photo memory block", "Fifth year: an ocean wall clock", "Tenth year: a marble heritage frame"] },
      { h: "Milestone years", p: "For the big ones, go bigger: a statement wall panel or a preserved keepsake that anchors a whole room." },
    ],
    outro: "Match the theme loosely and the meaning closely. Tell us the year and the couple, and we'll suggest something fitting.",
  },
  {
    title: "Last-Minute Gifts You Can Still Personalise",
    excerpt: "Quick-turnaround keepsakes for when the date crept up on you.",
    categorySlug: "gifting", tags: ["gifts", "personalised"], date: "2026-04-08",
    intro: "Forgot a date? Some of our most-loved pieces have short lead times and still feel completely personal.",
    sections: [
      { h: "Fast and heartfelt", p: "These come together quickly without feeling rushed.", list: ["Personalised keychains (5–7 days)", "Initial ring dishes", "Pressed-flower pendants"] },
      { h: "Tell us the deadline", p: "Message us your date first. We'll only say yes if we can genuinely make it on time." },
    ],
    outro: "Short lead time doesn't have to mean less thoughtful. Ping us with your deadline and we'll find something that lands in time.",
  },
  {
    title: "Housewarming Gifts for People with Great Taste",
    excerpt: "Elevated, useful pieces for a brand-new home.",
    categorySlug: "gifting", tags: ["gifts", "home"], date: "2026-05-14",
    intro: "A new home is a blank canvas. These pieces add warmth and personality without clashing with whatever style they're building.",
    sections: [
      { h: "Safe-but-special bets", p: "Neutral palettes with a metallic touch flatter almost any interior.", list: ["An agate coaster set", "A marble nameplate", "A gilded ring or key tray"] },
      { h: "When you know their colours", p: "If you've seen their moodboard, a made-to-order tray or clock in their palette is unbeatable." },
    ],
    outro: "Useful, neutral, and quietly luxurious wins most housewarmings. Not sure of their style? We'll help you play it perfectly.",
  },
  {
    title: "Festive Gifting: Diwali Pieces That Glow",
    excerpt: "Diyas, candle sets and decor for the season of light.",
    categorySlug: "gifting", tags: ["gifts", "diwali", "festive"], date: "2026-05-28",
    intro: "Few things suit Diwali like handcrafted light. Our festive pieces bring colour and glow to the season — and make generous gifts.",
    sections: [
      { h: "Sets that impress", p: "Gifting in sets feels generous and looks beautiful grouped on a table.", list: ["Jewel-tone diya sets of four", "Lotus float bowls", "Gold-leaf tealight trios"] },
      { h: "Order ahead for the season", p: "Festival weeks are busy — placing orders early means we can include the colours and gold finishes you want." },
    ],
    outro: "Give light this Diwali: handmade, colourful and glowing. Order early so we can craft your festive set in time.",
  },
  {
    title: "Baby & Newborn Keepsakes Parents Adore",
    excerpt: "Gentle, personal pieces to mark a new arrival.",
    categorySlug: "gifting", tags: ["gifts", "baby", "personalised"], date: "2026-06-04",
    intro: "New parents are flooded with practical gifts. A small, personal keepsake stands out — and gets kept.",
    sections: [
      { h: "Soft and sentimental", p: "Names, soft colours and a gentle glow suit nursery shelves perfectly.", list: ["A light-up name sign", "A constellation night light", "A pressed-flower keepsake from the baby shower"] },
      { h: "Make it theirs", p: "Add the baby's name and birth date for a piece that grows into a childhood treasure." },
    ],
    outro: "A name, a date, a soft glow — that's a keepsake parents hold onto. Tell us the details and we'll craft it gently.",
  },
  {
    title: "Return Gifts That Guests Won't Toss",
    excerpt: "Small, beautiful favours for weddings and big celebrations.",
    categorySlug: "gifting", tags: ["gifts", "weddings", "favours"], date: "2026-06-12",
    intro: "Return gifts are tricky: lovely but affordable, memorable but bulk-friendly. Small resin keepsakes thread that needle nicely.",
    sections: [
      { h: "Favours that feel premium", p: "Tiny and tasteful beats large and forgettable.", list: ["Pressed-flower keychains", "Botanical bookmarks", "Petite ring dishes"] },
      { h: "Personalise the batch", p: "Add your names and date, or the event hashtag, across the whole set for a cohesive touch." },
    ],
    outro: "Small, pretty and personal favours actually make it home with your guests. Message us with your headcount for batch pricing.",
  },
  // ── Behind the Scenes ──────────────────────────────────────────
  {
    title: "Inside the Studio: From Brief to Finished Piece",
    excerpt: "A walk through how a ResinRiva commission comes to life.",
    categorySlug: "behind-the-scenes", tags: ["studio", "process"], date: "2026-01-16",
    intro: "Ever wondered what happens between your WhatsApp message and the parcel at your door? Here's the journey.",
    sections: [
      { h: "Brief and design", p: "We start with your idea, references and colours, then confirm size, finish and a price before anything is poured." },
      { h: "Pour, cure and finish", p: "The making is patient work — and the curing is the part you can't rush.", list: ["Hand-pour in colour layers", "Cure fully (often days)", "Sand, polish and quality-check"] },
    ],
    pull: "Most of the magic is patience: good resin rewards those who wait.",
    outro: "Every piece passes a hand inspection before it's packed. That's how we keep the gloss flawless and the details right.",
  },
  {
    title: "Why We Pour in Small Batches",
    excerpt: "The case for slow, careful making over mass production.",
    categorySlug: "behind-the-scenes", tags: ["studio", "craft"], date: "2026-02-23",
    intro: "We could make more, faster. We choose not to — and here's why small batches are central to how we work.",
    sections: [
      { h: "Quality you can see", p: "Small pours let us watch every cell and colour transition, catching anything that isn't perfect." },
      { h: "Room for your details", p: "Batch-of-one thinking means your engraving, colour and size get real attention.", list: ["Closer quality control", "True customisation", "Less waste, more care"] },
    ],
    outro: "Slower making is better making. It's why no two ResinRiva pieces are ever quite the same.",
  },
  {
    title: "The Tools Behind the Gloss",
    excerpt: "A peek at the kit that turns resin into mirror-finish art.",
    categorySlug: "behind-the-scenes", tags: ["studio", "materials"], date: "2026-03-22",
    intro: "People are often surprised by how much craft sits behind that glassy surface. Here's a friendly look at our toolkit.",
    sections: [
      { h: "From pour to polish", p: "Each stage has its own tools, and the finishing is where patience pays off.", list: ["Calibrated scales for exact resin ratios", "Heat tools to clear tiny bubbles", "Fine abrasives and polish for the final gloss"] },
      { h: "Safety first, always", p: "We work with proper ventilation and protective gear so every pour is done responsibly." },
    ],
    outro: "The mirror finish isn't luck — it's the right tools and a lot of careful finishing. That's the part you don't see, but always feel.",
  },
  {
    title: "Meet the Materials: What Goes Into a ResinRiva Piece",
    excerpt: "Art-grade resin, real metallic leaf, hardwood and more.",
    categorySlug: "behind-the-scenes", tags: ["materials", "craft"], date: "2026-04-14",
    intro: "We're proud of what we pour. Knowing the materials helps you understand why a handmade piece is built to last.",
    sections: [
      { h: "The essentials", p: "Good inputs are the foundation of a piece that stays beautiful.", list: ["UV-stabilised, art-grade epoxy", "Real gold, silver and copper leaf", "Seasoned hardwoods for furniture and frames"] },
      { h: "Honest about everything", p: "Ask us what's in any piece and we'll tell you exactly — no mystery, no shortcuts." },
    ],
    outro: "Better materials, better pieces, longer life. It really is that simple — and we're always happy to talk specifics.",
  },
  {
    title: "How We Pack Fragile Art for Safe Travel",
    excerpt: "The careful packing that gets your piece home intact.",
    categorySlug: "behind-the-scenes", tags: ["studio", "shipping"], date: "2026-05-19",
    intro: "Making something beautiful is only half the job — getting it to you unscathed is the other half. Here's how we pack.",
    sections: [
      { h: "Layers of protection", p: "Each piece is wrapped, cushioned and boxed to handle the bumps of transit.", list: ["Soft inner wrap against scratches", "Shock-absorbing cushioning", "Rigid outer box, clearly marked fragile"] },
      { h: "Tracked all the way", p: "We share tracking so you know exactly when to expect your parcel." },
    ],
    outro: "Careful packing is non-negotiable for us. If anything ever arrives less than perfect, we'll make it right.",
  },
  {
    title: "A Day in the Life at the ResinRiva Studio",
    excerpt: "Pours, polish and a lot of patient waiting.",
    categorySlug: "behind-the-scenes", tags: ["studio"], date: "2026-06-02",
    intro: "No two studio days are identical, but they share a rhythm set by curing times and the morning's pours.",
    sections: [
      { h: "Morning pours", p: "Fresh resin goes down early when the studio is calm and dust-free, then it's left to cure undisturbed." },
      { h: "Afternoon finishing", p: "While new pieces cure, yesterday's get sanded, polished and inspected.", list: ["Pour in the morning calm", "Finish and inspect in the afternoon", "Pack and label for dispatch"] },
    ],
    outro: "It's a slow, satisfying loop of pour, wait and polish. That patience is exactly what you feel when you unwrap the result.",
  },
  // ── Inspiration & Trends ───────────────────────────────────────
  {
    title: "Resin Art Trends to Watch This Year",
    excerpt: "The palettes and textures shaping standout pieces right now.",
    categorySlug: "inspiration", tags: ["trends", "resin art"], date: "2026-01-26",
    intro: "Resin art keeps evolving. Here are the directions we're most excited to pour into commissions this year.",
    sections: [
      { h: "Calmer, earthier palettes", p: "Riverstone neutrals, sandbar ambers and soft sage are replacing high-contrast brights in many homes." },
      { h: "Texture and dimension", p: "Flat is out; raised, sculptural surfaces are in.", list: ["Three-dimensional florals", "Layered geode druzy", "Subtle metallic relief"] },
    ],
    outro: "Earthy calm plus tactile texture is the mood of the moment. Want a piece that fits it? We'll tailor the palette to your room.",
  },
  {
    title: "Choosing a Colour Palette for Your Space",
    excerpt: "A practical way to pick resin colours that actually fit your room.",
    categorySlug: "inspiration", tags: ["interiors", "colour"], date: "2026-02-12",
    intro: "The right palette makes a piece feel built for your home. Here's the simple method we walk clients through.",
    sections: [
      { h: "Start from what's fixed", p: "Look at your largest unchangeable elements — flooring, big furniture — and pull one tone from them to anchor the piece." },
      { h: "Add an accent and a metal", p: "Then choose one accent and a single metallic to keep things cohesive.", list: ["One anchor tone from the room", "One accent you love", "One metal: gold, silver or copper"] },
    ],
    outro: "Anchor, accent, metal — three choices and you're done. Share a photo of your space and we'll suggest a palette that sings.",
  },
  {
    title: "Statement vs. Subtle: Picking the Right Piece",
    excerpt: "When to go bold and when to whisper with your decor.",
    categorySlug: "inspiration", tags: ["interiors", "styling"], date: "2026-03-15",
    intro: "Should a piece shout or murmur? It depends on the room — and on what else is already competing for attention.",
    sections: [
      { h: "Go statement in calm rooms", p: "A bold ocean panel or onyx-and-gold clock shines on an otherwise quiet wall." },
      { h: "Go subtle in busy ones", p: "If a room is already rich with pattern, choose something tonal and textural instead.", list: ["Busy room? Choose subtle and tonal", "Calm room? A bold centrepiece works", "Never let two statements fight"] },
    ],
    outro: "Read the room first, then choose your volume. Tell us about the space and we'll recommend bold or quiet accordingly.",
  },
  {
    title: "Styling Resin Trays Like an Interior Designer",
    excerpt: "Three foolproof ways to style a decorative tray.",
    categorySlug: "inspiration", tags: ["styling", "interiors"], date: "2026-04-11",
    intro: "A beautiful tray is only half the story — styling it well is what makes a console look considered. Try these three formulas.",
    sections: [
      { h: "The classic trio", p: "Group items in odd numbers with varied heights for an effortless, balanced look.", list: ["Something tall (a candle or vase)", "Something soft (flowers or a book)", "Something personal (a keepsake)"] },
      { h: "Function with flair", p: "On a bar or vanity, let the tray corral the things you use daily — beauty and order together." },
    ],
    outro: "Odd numbers, varied heights, a personal touch — that's the designer secret. A made-to-order tray gives you the perfect base to start.",
  },
  {
    title: "Bringing the Ocean Indoors",
    excerpt: "How coastal resin art creates calm in any home.",
    categorySlug: "inspiration", tags: ["trends", "resin art", "interiors"], date: "2026-05-09",
    intro: "There's a reason ocean pieces are perennial favourites: water imagery is deeply calming, and resin captures it like nothing else.",
    sections: [
      { h: "Why it works", p: "Blue-green tones lower the visual temperature of a room and pair with almost any palette." },
      { h: "Where to place it", p: "Coastal pieces shine in spaces meant for rest.", list: ["Above the bed for a calm anchor", "In a bathroom for spa energy", "On a work wall to ease the day"] },
    ],
    outro: "A little ocean goes a long way toward a calmer home. Ask us to tune the blues and greens to your exact space.",
  },
  {
    title: "Mixing Resin and Wood in Modern Interiors",
    excerpt: "Why the resin-and-timber pairing feels so right.",
    categorySlug: "inspiration", tags: ["interiors", "furniture", "trends"], date: "2026-06-08",
    intro: "Glassy resin against warm, grainy wood is one of those combinations that simply works. Here's how to use it well at home.",
    sections: [
      { h: "Contrast is the point", p: "The smooth, liquid clarity of resin makes timber's grain look richer, and vice versa — opposites flattering each other." },
      { h: "Start small, then commit", p: "Test the pairing before a big furniture piece.", list: ["Begin with a resin-and-wood tray", "Add a side table or frame", "Commit to a river table centrepiece"] },
    ],
    outro: "Let resin and wood play off each other and a room instantly feels designed. When you're ready for the big piece, we build to your dimensions.",
  },
  // ── Weddings & Occasions ───────────────────────────────────────
  {
    title: "How to Preserve Your Wedding Flowers Beautifully",
    excerpt: "Your options for keeping bouquet and garland blooms forever.",
    categorySlug: "weddings", tags: ["weddings", "varmala", "preservation"], date: "2026-01-30",
    intro: "Wedding flowers are gorgeous and fleeting — but they don't have to be. Here's how to turn them into something lasting.",
    sections: [
      { h: "Act quickly, store cool", p: "The sooner blooms reach us, the better the colour we can preserve. Keep them cool and loosely covered until then." },
      { h: "Choose your keepsake", p: "Different formats suit different flowers and budgets.", list: ["A full shadow-box varmala frame", "A floating-bloom minimalist frame", "A compact desk keepsake block"] },
    ],
    pull: "The flowers from your most important day, kept exactly as they were.",
    outro: "Move fast, keep them cool, and send us photos. We'll guide you to the preservation that suits your flowers and your home.",
  },
  {
    title: "A Wedding Gifting Guide for Every Budget",
    excerpt: "Meaningful resin gifts from modest to grand.",
    categorySlug: "weddings", tags: ["weddings", "gifts"], date: "2026-02-27",
    intro: "Whether you're spending a little or a lot, a handmade gift says more than something off a shelf. Here's a guide by budget.",
    sections: [
      { h: "Thoughtful at every level", p: "Personalisation matters more than price.", list: ["Modest: a personalised keychain or pendant", "Mid-range: a name-and-date clock or frame", "Grand: a varmala frame or statement panel"] },
      { h: "When in doubt, personalise", p: "Even the simplest piece feels special with the couple's names and wedding date added." },
    ],
    outro: "Spend what you like — just make it personal. Tell us the couple and budget, and we'll match the perfect piece.",
  },
  {
    title: "Personalised Wedding Decor Worth Keeping",
    excerpt: "Decor that does double duty as a lasting keepsake.",
    categorySlug: "weddings", tags: ["weddings", "decor"], date: "2026-03-26",
    intro: "The best wedding decor doesn't end up in a bin the next morning. Choose pieces that become keepsakes after the celebration.",
    sections: [
      { h: "Decorate, then treasure", p: "Look for items that work on the day and at home afterward.", list: ["Monogram letters for the sweetheart table", "Welcome trays for the entrance", "Light-up name signs for the backdrop"] },
      { h: "Plan colours early", p: "Sharing your palette early lets us match decor to your theme precisely." },
    ],
    outro: "Decor you keep is decor worth buying. Send us your theme and date, and we'll craft pieces that live on after the wedding.",
  },
  {
    title: "Engagement Gift Ideas for the Newly Promised",
    excerpt: "Mark the 'yes' with something they'll keep.",
    categorySlug: "weddings", tags: ["weddings", "gifts", "engagement"], date: "2026-04-23",
    intro: "An engagement is the start of the story. These pieces help the couple mark the moment in a way that lasts.",
    sections: [
      { h: "Romantic and personal", p: "Soft palettes and personal details suit this tender milestone.", list: ["A dual-photo story frame", "A pressed-flower keepsake from the proposal", "A blush romance photo frame"] },
      { h: "Add the date", p: "The proposal date, set in gold, turns any piece into a memento of the exact day." },
    ],
    outro: "Capture the 'yes' with something personal and lasting. Tell us their story and we'll help you choose.",
  },
  {
    title: "Planning Wedding Keepsakes: A Timeline",
    excerpt: "When to order so everything's ready in time.",
    categorySlug: "weddings", tags: ["weddings", "planning"], date: "2026-05-21",
    intro: "Wedding keepsakes have lead times, and varmala preservation especially can't be rushed. Use this timeline to stay ahead.",
    sections: [
      { h: "Before the day", p: "Some pieces are best arranged in advance.", list: ["6–8 weeks out: order decor and signage", "2 weeks out: confirm preservation plans", "Day of: keep the garland cool for us"] },
      { h: "After the day", p: "Send the garland to us as soon as possible — fresh flowers preserve far better than wilted ones." },
    ],
    outro: "Plan decor early and send flowers fast. Message us with your wedding date and we'll map the timeline together.",
  },
  {
    title: "Festival Decor Ideas Beyond Diwali",
    excerpt: "Handcrafted touches for celebrations all year round.",
    categorySlug: "weddings", tags: ["festive", "decor", "occasions"], date: "2026-06-15",
    intro: "Diwali gets the glow, but every celebration deserves a handcrafted touch. Here are ideas for occasions across the calendar.",
    sections: [
      { h: "Year-round glow", p: "Candlelight and personal touches suit any gathering.", list: ["Lotus float bowls for Navratri tables", "Name signs for birthdays and showers", "Coaster sets for festive hosting"] },
      { h: "Make it specific", p: "Add the occasion, names or date to any piece so it remembers the moment, not just the season." },
    ],
    outro: "Any celebration is better with something handmade. Tell us the occasion and we'll craft a fitting piece.",
  },
  // ── 3D Printing ────────────────────────────────────────────────
  {
    title: "What Is a Lithophane, and Why Is It Magic?",
    excerpt: "The 3D-printed photo that only appears when it's lit.",
    categorySlug: "printing", tags: ["3d printing", "lithophane"], date: "2026-02-05",
    intro: "A lithophane looks like a plain white panel — until you light it from behind and a photograph blooms into view. It's one of our favourite tricks.",
    sections: [
      { h: "How it works", p: "We translate your photo into varying thicknesses of material; thin areas glow bright, thick areas stay dark, recreating the image in light." },
      { h: "Best photos to use", p: "Clear, high-contrast images give the most striking result.", list: ["Good lighting and sharp focus", "Strong contrast between subject and background", "Faces close and unobstructed"] },
    ],
    outro: "Send us a favourite photo and we'll turn it into a glowing keepsake. It genuinely surprises everyone who sees it lit.",
  },
  {
    title: "From Sketch to Object: How Custom 3D Printing Works",
    excerpt: "The journey from your idea to a finished printed piece.",
    categorySlug: "printing", tags: ["3d printing", "process", "custom"], date: "2026-03-08",
    intro: "Have an idea but no 3D file? No problem. Here's how we take a rough concept all the way to a finished object.",
    sections: [
      { h: "Model, print, finish", p: "Most of the craft is in the modelling and the hand-finishing at the end.", list: ["We model your idea in 3D", "Print at high resolution", "Sand, prime and finish by hand"] },
      { h: "What we need from you", p: "A sketch, a reference photo, or even just a clear description is enough to begin." },
    ],
    outro: "You bring the idea; we handle the technical bits. Describe what you'd like and we'll guide it from sketch to shelf.",
  },
  {
    title: "PLA vs. Resin Printing: A Plain-English Comparison",
    excerpt: "Which 3D-printing material suits your project.",
    categorySlug: "printing", tags: ["3d printing", "materials"], date: "2026-04-17",
    intro: "We print in a few materials, and the right choice depends on your piece. Here's the difference without the jargon.",
    sections: [
      { h: "Durable vs. detailed", p: "Each material has a sweet spot.", list: ["PLA+: tough, great for functional pieces", "SLA resin: ultra-fine detail for figurines", "Wood-fill: a warm, timber-like finish"] },
      { h: "We'll recommend for you", p: "Tell us what the piece is for and we'll match the material to the job — strength, detail or look." },
    ],
    outro: "Function leans PLA+, fine detail leans resin, warmth leans wood-fill. Unsure? Describe your idea and we'll pick the best fit.",
  },
  {
    title: "Combining 3D Printing with Resin Art",
    excerpt: "How two crafts come together in one bespoke piece.",
    categorySlug: "printing", tags: ["3d printing", "resin art", "custom"], date: "2026-05-23",
    intro: "Some of our most interesting commissions use both crafts: a printed form completed with a resin finish, or resin set into a printed frame.",
    sections: [
      { h: "Best of both", p: "3D printing gives precise structure; resin adds colour, gloss and depth.", list: ["Printed bases with resin inlays", "Resin art in custom-printed frames", "Hybrid signage and awards"] },
      { h: "One brief, one maker", p: "Because we do both in-house, you get a single, coherent piece rather than two parts glued together." },
    ],
    outro: "When precise form meets liquid colour, you get something genuinely one-of-a-kind. Bring us an ambitious idea — we love the hybrids.",
  },
  {
    title: "Great Use Cases for Custom 3D-Printed Gifts",
    excerpt: "Personal, precise gifts only 3D printing can make.",
    categorySlug: "printing", tags: ["3d printing", "gifts"], date: "2026-06-10",
    intro: "When a gift needs to be exact — a specific shape, a real place, a particular face — 3D printing is the craft for the job.",
    sections: [
      { h: "Ideas people love", p: "These land because they're impossible to buy off a shelf.", list: ["A lithophane lamp of a treasured photo", "A scale model of a first home", "A figurine that actually looks like them"] },
      { h: "Personal by definition", p: "Every printed gift starts from something specific to the recipient, which is exactly what makes it memorable." },
    ],
    outro: "If a gift needs to be precisely theirs, printing makes it possible. Tell us the idea and we'll bring it to life.",
  },
  {
    title: "Caring for Your 3D-Printed Pieces",
    excerpt: "Simple upkeep to keep printed decor looking sharp.",
    categorySlug: "printing", tags: ["3d printing", "care"], date: "2026-06-18",
    intro: "3D-printed decor is sturdy and low-maintenance, but a few easy habits keep it looking crisp for years.",
    sections: [
      { h: "Heat and sun are the enemies", p: "Most printed plastics soften in high heat, so keep pieces out of hot cars and away from direct, intense sun." },
      { h: "Cleaning is easy", p: "A soft brush or cloth handles dust; a barely-damp wipe handles the rest.", list: ["Dust with a soft brush", "Wipe gently with a damp cloth", "Avoid prolonged heat and harsh solvents"] },
    ],
    outro: "Keep them cool and dust them now and then — that's it. Looked after simply, printed pieces stay sharp for the long run.",
  },
  // ── More guides ────────────────────────────────────────────────
  {
    title: "Are Resin Decor Pieces Food-Safe?",
    excerpt: "What's safe for serving, and how to use trays and coasters well.",
    categorySlug: "guides", tags: ["care", "materials"], date: "2026-05-30",
    intro: "It's a fair question for trays, coasters and platters. Here's a clear, honest answer about resin and food contact.",
    sections: [
      { h: "Cured resin is inert, with limits", p: "Fully cured art resin is stable and doesn't leach in normal use, but it isn't certified for direct, prolonged contact with hot or oily food." },
      { h: "Use it the smart way", p: "A few habits keep serving pieces beautiful and worry-free.", list: ["Serve dry or pre-plated food", "Use a liner for oily or hot items", "Hand-wash; never microwave or oven"] },
    ],
    outro: "Treat resin trays like fine serveware — present on them, don't cook on them. Used that way, they stay safe and gorgeous.",
  },
  // ── More gift ideas ────────────────────────────────────────────
  {
    title: "Birthday Gifts for the Person Who Has Everything",
    excerpt: "Personal, one-of-a-kind ideas that sidestep the obvious.",
    categorySlug: "gifting", tags: ["gifts", "personalised"], date: "2026-06-20",
    intro: "When someone already owns every gadget, the answer isn't another thing — it's a personal thing. Here's where to start.",
    sections: [
      { h: "Make it about them", p: "Tie the gift to a memory, a place or an inside joke they'll instantly recognise.", list: ["A lithophane of a shared photo", "A clock in their signature colour", "A keepsake from a place they love"] },
      { h: "Small can be mighty", p: "A tiny, perfectly personal piece often beats something large and generic." },
    ],
    outro: "Personal always beats pricey. Tell us about them and we'll help you land something they didn't know they wanted.",
  },
  {
    title: "Teacher & Mentor Gifts That Mean Something",
    excerpt: "Lasting ways to say thank you to someone who shaped you.",
    categorySlug: "gifting", tags: ["gifts", "personalised"], date: "2026-06-22",
    intro: "A heartfelt thank-you outlasts any voucher. For the teachers and mentors in your life, choose something they'll keep on a desk for years.",
    sections: [
      { h: "Desk-worthy and personal", p: "Useful pieces with a small engraving hit the right note.", list: ["An engraved nameplate", "A geode pen stand", "A quote frame with their favourite line"] },
      { h: "Add the words", p: "A short message of thanks, set in gold, turns a nice object into a keepsake." },
    ],
    outro: "Say thank you in something lasting. Share a few words and we'll craft a gift that carries them.",
  },
  // ── More behind the scenes ─────────────────────────────────────
  {
    title: "How We Choose a Colour Palette for Every Pour",
    excerpt: "The thinking behind those calm, cohesive resin colours.",
    categorySlug: "behind-the-scenes", tags: ["studio", "colour", "craft"], date: "2026-06-24",
    intro: "Our pieces tend to feel calm and cohesive, and that's no accident. Here's how we approach colour in the studio.",
    sections: [
      { h: "Restraint over rainbow", p: "We keep most pieces to a few related tones and a single metallic, which is what reads as luxurious rather than busy." },
      { h: "Tested before committed", p: "Colours are sampled and checked in different light before a full pour.", list: ["A few related tones, one metallic", "Samples checked in daylight and lamplight", "Adjust, then commit to the pour"] },
    ],
    outro: "Fewer, better colours — that's our quiet rule. It's why pieces sit so easily in a real home.",
  },
  {
    title: "The Story Behind the Name ResinRiva",
    excerpt: "Where the studio started and what 'Riva' means to us.",
    categorySlug: "behind-the-scenes", tags: ["studio"], date: "2026-06-26",
    intro: "People often ask about the name. Like the work, it began with something personal and grew from there.",
    sections: [
      { h: "From one keepsake to a studio", p: "ResinRiva started with a single preserved memento and a belief that meaningful moments deserve to be held in something beautiful." },
      { h: "A nod to the riverline", p: "The 'Riva' speaks to the flowing rivers of resin that run through our signature pieces — colour in motion, frozen mid-flow." },
    ],
    outro: "A name born from a keepsake and a river of resin. We hope a little of that story flows into everything we make for you.",
  },
  // ── More inspiration ───────────────────────────────────────────
  {
    title: "Small Spaces, Big Impact: Decor for Compact Homes",
    excerpt: "How to add personality to apartments without the clutter.",
    categorySlug: "inspiration", tags: ["interiors", "styling"], date: "2026-06-28",
    intro: "Compact homes reward careful choices. A few well-placed handmade pieces add warmth without crowding a small space.",
    sections: [
      { h: "Choose a single hero", p: "One striking wall clock or art panel gives a small room a focal point without piling on objects." },
      { h: "Go vertical and functional", p: "Use walls and dual-purpose pieces to add character while saving surfaces.", list: ["One hero piece per room", "Wall art over extra shelf clutter", "Trays that organise and decorate"] },
    ],
    outro: "In small spaces, edit ruthlessly and choose well. One beautiful, personal piece beats five forgettable ones.",
  },
  {
    title: "Five Ways to Refresh a Room Without Renovating",
    excerpt: "Low-effort, high-impact changes you can make this weekend.",
    categorySlug: "inspiration", tags: ["interiors", "styling"], date: "2026-06-29",
    intro: "You don't need a renovation to fall back in love with a room. A handful of small moves can transform a space in an afternoon.",
    sections: [
      { h: "Swap, don't rebuild", p: "Changing accents shifts a room's whole mood for very little effort.", list: ["Add a statement piece of wall art", "Restyle a console with a new tray", "Introduce warm candlelight in the evenings"] },
      { h: "Lead with one new colour", p: "Bring a single fresh accent colour into accessories and let it tie the refresh together." },
    ],
    outro: "Small swaps, big difference. Pick one corner to start, and a made-to-order accent can anchor the whole refresh.",
  },
  // ── More weddings ──────────────────────────────────────────────
  {
    title: "Choosing Colours for Your Wedding Keepsakes",
    excerpt: "Match your keepsakes to your theme without overthinking it.",
    categorySlug: "weddings", tags: ["weddings", "colour", "planning"], date: "2026-06-30",
    intro: "Your wedding has a palette — your keepsakes should nod to it. Here's a simple way to choose colours you'll still love years on.",
    sections: [
      { h: "Echo, don't match exactly", p: "Pull one or two tones from your theme rather than replicating it precisely; it ages better and feels intentional." },
      { h: "Add a timeless metal", p: "A single metallic keeps things elegant for the long haul.", list: ["One main tone from your palette", "One soft secondary tone", "Gold, silver or rose-gold to finish"] },
    ],
    outro: "Echo your theme, add a timeless metal, and your keepsakes will feel right for decades. Share your palette and we'll tune it.",
  },
  {
    title: "Gifts for the Couple Who Said 'No Gifts'",
    excerpt: "Respect their wishes while still marking the moment.",
    categorySlug: "weddings", tags: ["weddings", "gifts"], date: "2026-07-02",
    intro: "Some couples ask for no gifts — and you still want to mark the day. The trick is something small, personal and clearly heartfelt rather than extravagant.",
    sections: [
      { h: "Sentiment over scale", p: "A tiny, meaningful keepsake honours their wishes while showing you cared.", list: ["A pressed-flower keepsake from the day", "A small dated photo block", "A single engraved trinket dish"] },
      { h: "Make it impossible to re-gift", p: "Personalise it with their names or date so it's unmistakably, only theirs." },
    ],
    outro: "Keep it small, personal and clearly from the heart. We'll help you find something that respects the 'no gifts' — and still says plenty.",
  },
  // ── More 3D printing ───────────────────────────────────────────
  {
    title: "Turning a Child's Drawing into a 3D Keepsake",
    excerpt: "How we bring kids' artwork to life as a printed object.",
    categorySlug: "printing", tags: ["3d printing", "gifts", "custom"], date: "2026-07-04",
    intro: "A child's wobbly drawing is pure magic — and it makes one of the most heart-melting gifts when we turn it into a real, holdable object.",
    sections: [
      { h: "From paper to object", p: "We translate the drawing into a clean 3D form while keeping its original charm and proportions intact." },
      { h: "Lovely ways to keep it", p: "Parents and grandparents adore these.", list: ["A standing figure of the drawing", "A keyring of a first masterpiece", "A relief plaque for the wall"] },
    ],
    outro: "Childhood scribbles don't last — but a keepsake can. Send us a clear photo of the drawing and we'll bring it to life.",
  },
];

/* ───────────────────────────────────────────────────────────────────────
   Portfolio — original case studies (populates /portfolio).
   ─────────────────────────────────────────────────────────────────────── */
type SeedPortfolio = {
  title: string;
  slug: string;
  story: string;
  categorySlug?: string;
  resultsMeta: { label: string; value: string }[];
  gallery: number;
};

const portfolios: SeedPortfolio[] = [
  {
    title: "A Live-Edge River Dining Table for a Surat Home",
    slug: "river-dining-table-surat-home",
    categorySlug: "resin-furniture",
    story:
      "A family wanted a dining table that could seat eight and become the heart of their new home. We paired a single live-edge acacia slab with a deep ocean-blue resin river, then finished it to a furniture-grade gloss. The result anchors the room and starts a conversation at every dinner.",
    resultsMeta: [
      { label: "Piece", value: "8-seater river dining table" },
      { label: "Materials", value: "Acacia + deep-pour epoxy" },
      { label: "Timeline", value: "9 weeks" },
      { label: "Location", value: "Surat" },
    ],
    gallery: 3,
  },
  {
    title: "Preserving a 2019 Wedding Varmala",
    slug: "preserving-2019-wedding-varmala",
    categorySlug: "varmala-preservation",
    story:
      "A couple sent us their wedding garland, carefully stored for years, hoping it could be saved. We gently dried, arranged and sealed the blooms in a deep teak shadow-box with their names and date. What was fading in a drawer now hangs proudly in their hallway.",
    resultsMeta: [
      { label: "Service", value: "Varmala preservation" },
      { label: "Frame", value: "20×20 inch teak shadow-box" },
      { label: "Timeline", value: "6 weeks" },
      { label: "Location", value: "Ahmedabad" },
    ],
    gallery: 2,
  },
  {
    title: "Ocean Wall Art for a Coastal-Themed Living Room",
    slug: "ocean-wall-art-coastal-living-room",
    categorySlug: "art-craft",
    story:
      "An interior designer briefed us for a calming focal piece above a long sofa. We poured a three-panel breaking-wave seascape in layered blues and foamy whites, scaled to the wall. It set the tone for the whole room.",
    resultsMeta: [
      { label: "Piece", value: "Triptych ocean wall art" },
      { label: "Size", value: "Combined 60×30 inch" },
      { label: "Timeline", value: "3 weeks" },
      { label: "For", value: "Interior design project" },
    ],
    gallery: 3,
  },
  {
    title: "A Geode Clock for a 25th Anniversary",
    slug: "geode-clock-25th-anniversary",
    categorySlug: "resin-wall-clocks",
    story:
      "A client wanted a silver-anniversary gift that felt as special as the milestone. We crafted a geode-ring wall clock in emerald and ivory with real gold leaf and a silent movement, engraved with the couple's names and wedding year.",
    resultsMeta: [
      { label: "Piece", value: "20-inch geode wall clock" },
      { label: "Finish", value: "Emerald agate + gold leaf" },
      { label: "Timeline", value: "2 weeks" },
      { label: "Occasion", value: "25th anniversary" },
    ],
    gallery: 2,
  },
  {
    title: "A Lithophane Lamp from a Family Portrait",
    slug: "lithophane-lamp-family-portrait",
    categorySlug: "3d-printed-decor",
    story:
      "A son wanted a surprise gift for his parents using an old family photograph. We turned the portrait into a 3D-printed lithophane lamp — plain white by day, glowing into the full image when lit at night. There were happy tears at the reveal.",
    resultsMeta: [
      { label: "Piece", value: "Custom lithophane lamp" },
      { label: "Process", value: "Photo → 3D print" },
      { label: "Timeline", value: "10 days" },
      { label: "Occasion", value: "Surprise gift" },
    ],
    gallery: 2,
  },
  {
    title: "Bespoke Awards for a Tech Team Offsite",
    slug: "bespoke-awards-tech-team-offsite",
    categorySlug: "3d-printed-decor",
    story:
      "A company needed twelve matching-but-personalised awards for an annual offsite. We designed a clean 3D-printed trophy with each recipient's name and added a resin-set base in the brand colours. Consistent, premium, and delivered ahead of the deadline.",
    resultsMeta: [
      { label: "Project", value: "12 personalised awards" },
      { label: "Mix", value: "3D print + resin base" },
      { label: "Timeline", value: "3 weeks" },
      { label: "For", value: "Corporate offsite" },
    ],
    gallery: 3,
  },
  {
    title: "A Heart-Layout Varmala Frame for a Destination Wedding",
    slug: "heart-varmala-frame-destination-wedding",
    categorySlug: "varmala-preservation",
    story:
      "After a destination wedding, a couple flew their garlands home and asked us to keep the memory alive. We shaped both varmalas into a soft heart around an inset portrait, finished with a gentle gold-leaf accent. A keepsake as romantic as the day.",
    resultsMeta: [
      { label: "Service", value: "Dual-garland preservation" },
      { label: "Layout", value: "Heart with photo inset" },
      { label: "Timeline", value: "5 weeks" },
      { label: "Location", value: "Goa → Mumbai" },
    ],
    gallery: 2,
  },
  {
    title: "A Statement Console for a Boutique Hotel Lobby",
    slug: "statement-console-boutique-hotel-lobby",
    categorySlug: "resin-furniture",
    story:
      "A boutique hotel wanted a lobby piece that guests would remember and photograph. We built a slim live-edge console with a galaxy-blue resin channel and a brass base, scaled to the entry wall. It quickly became the hotel's most-tagged corner.",
    resultsMeta: [
      { label: "Piece", value: "Live-edge console table" },
      { label: "Finish", value: "Galaxy resin + brass base" },
      { label: "Timeline", value: "8 weeks" },
      { label: "For", value: "Hospitality project" },
    ],
    gallery: 3,
  },
  {
    title: "A Personalised Nameplate Set for a New Home",
    slug: "personalised-nameplate-set-new-home",
    categorySlug: "home-decor",
    story:
      "New homeowners wanted a coordinated welcome at their door and entryway. We made a marble-effect nameplate with crisp gold lettering plus a matching key tray in the same palette. A small, polished first impression for every visitor.",
    resultsMeta: [
      { label: "Set", value: "Nameplate + key tray" },
      { label: "Finish", value: "Ivory marble + gold" },
      { label: "Timeline", value: "2 weeks" },
      { label: "Occasion", value: "Housewarming" },
    ],
    gallery: 2,
  },
  {
    title: "A Floral Preservation Frame from a Bridal Bouquet",
    slug: "floral-preservation-frame-bridal-bouquet",
    categorySlug: "varmala-preservation",
    story:
      "A bride wanted her bouquet to outlast the wedding week. We preserved the key blooms and floated them in a clean, modern frame with a soft ivory backing. Years on, it still brings the day back the moment she looks at it.",
    resultsMeta: [
      { label: "Service", value: "Bouquet preservation" },
      { label: "Style", value: "Floating-bloom modern frame" },
      { label: "Timeline", value: "5 weeks" },
      { label: "Location", value: "Vadodara" },
    ],
    gallery: 2,
  },
];

/* ───────────────────────────────────────────────────────────────────────
   Upsert
   ─────────────────────────────────────────────────────────────────────── */
async function main() {
  // Re-seed until the catalogue reaches its full size, then skip so later
  // deploys don't overwrite /studio edits. (Self-adjusting: when new products
  // are added here, it re-runs once to apply them.) SEED_FORCE=1 always re-runs.
  const force = process.env.SEED_FORCE === "1";
  const products = buildProducts();
  const existing = await prisma.product.count().catch(() => 0);
  if (!force && existing >= products.length) {
    console.log(`ℹ  Bulk content seed skipped — ${existing}/${products.length} products already present (SEED_FORCE=1 to re-run).`);
    return;
  }

  // Ensure the extra category exists (base seed owns the first nine).
  for (const c of extraCategories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c });
  }
  const catBySlug = Object.fromEntries(
    (await prisma.category.findMany()).map((c) => [c.slug, c.id]),
  );

  let pCount = 0;
  for (const p of products) {
    const catId = catBySlug[p.categorySlug];
    if (!catId) {
      console.warn(`⚠  Missing category ${p.categorySlug} — run the base seed first. Skipping ${p.slug}.`);
      continue;
    }
    const { categorySlug, images, fields, ...data } = p;
    void categorySlug;
    const product = await prisma.product.upsert({
      where: { slug: data.slug },
      update: { ...data, status: "PUBLISHED", categoryId: catId },
      create: { ...data, status: "PUBLISHED", categoryId: catId },
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
    pCount++;
  }

  // Blog categories + tags + posts
  for (const bc of blogCategories) {
    await prisma.blogCategory.upsert({ where: { slug: bc.slug }, update: bc, create: bc });
  }
  const blogCatBySlug = Object.fromEntries(
    (await prisma.blogCategory.findMany()).map((c) => [c.slug, c.id]),
  );

  // Upsert all tags first
  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)));
  for (const name of allTags) {
    await prisma.tag.upsert({
      where: { slug: slugify(name) },
      update: { name },
      create: { name, slug: slugify(name) },
    });
  }
  const tagBySlug = Object.fromEntries((await prisma.tag.findMany()).map((t) => [t.slug, t.id]));

  let bCount = 0;
  for (const post of posts) {
    const slug = slugify(post.title);
    const created = await prisma.blogPost.upsert({
      where: { slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: buildDoc(post) as Prisma.InputJsonValue,
        coverImage: blogCoverImage[post.categorySlug] ?? fallbackImage,
        authorName: "ResinRiva Studio",
        status: "PUBLISHED",
        publishedAt: new Date(post.date),
        seoTitle: `${post.title} | ResinRiva`,
        seoDescription: post.excerpt,
        blogCategoryId: blogCatBySlug[post.categorySlug],
      },
      create: {
        title: post.title,
        slug,
        excerpt: post.excerpt,
        content: buildDoc(post) as Prisma.InputJsonValue,
        coverImage: blogCoverImage[post.categorySlug] ?? fallbackImage,
        authorName: "ResinRiva Studio",
        status: "PUBLISHED",
        publishedAt: new Date(post.date),
        seoTitle: `${post.title} | ResinRiva`,
        seoDescription: post.excerpt,
        blogCategoryId: blogCatBySlug[post.categorySlug],
      },
    });
    // Reset + attach tags
    await prisma.blogPostTag.deleteMany({ where: { postId: created.id } });
    await prisma.blogPostTag.createMany({
      data: post.tags
        .map((t) => tagBySlug[slugify(t)])
        .filter(Boolean)
        .map((tagId) => ({ postId: created.id, tagId })),
      skipDuplicates: true,
    });
    bCount++;
  }

  // Portfolio case studies (+ before/after + gallery images)
  let folioCount = 0;
  for (const pf of portfolios) {
    const catImg = (pf.categorySlug && categoryImage[pf.categorySlug]) || fallbackImage;
    const before = (pf.categorySlug && categoryImageDesat[pf.categorySlug]) || catImg;
    const after = catImg;
    const folio = await prisma.portfolio.upsert({
      where: { slug: pf.slug },
      update: {
        title: pf.title,
        story: pf.story,
        beforeImageUrl: before,
        afterImageUrl: after,
        resultsMeta: pf.resultsMeta as Prisma.InputJsonValue,
        status: "PUBLISHED",
        categoryId: pf.categorySlug ? catBySlug[pf.categorySlug] ?? null : null,
      },
      create: {
        title: pf.title,
        slug: pf.slug,
        story: pf.story,
        beforeImageUrl: before,
        afterImageUrl: after,
        resultsMeta: pf.resultsMeta as Prisma.InputJsonValue,
        status: "PUBLISHED",
        categoryId: pf.categorySlug ? catBySlug[pf.categorySlug] ?? null : null,
      },
    });
    await prisma.portfolioImage.deleteMany({ where: { portfolioId: folio.id } });
    await prisma.portfolioImage.createMany({
      data: [{ url: catImg, alt: pf.title, order: 0, portfolioId: folio.id }],
    });
    folioCount++;
  }

  console.log(
    `✅ Bulk content seed complete — ${pCount} products, ${bCount} blog posts, ${folioCount} portfolios, ${allTags.length} tags.`,
  );
}

// Only hit the database when run directly (e.g. `tsx prisma/seed-content.ts`),
// not when imported for testing/validation.
if (process.argv[1] && /seed-content\.[tj]s$/.test(process.argv[1])) {
  main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
