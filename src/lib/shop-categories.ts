/**
 * Shop-by-category tiles for the homepage. Images are the original
 * resin-art shots hosted on Cloudinary (same set used across the catalogue),
 * cropped to a portrait tile on the fly via Cloudinary transforms.
 */
export type ShopCategory = { name: string; slug: string; image: string };

const tile = (slug: string) =>
  `https://res.cloudinary.com/dhaqpl1kz/image/upload/f_auto,q_auto,c_fill,g_auto,ar_4:5/resinriva/cat-${slug}.jpg`;

export const shopCategories: ShopCategory[] = [
  { name: "Resin Wall Art", slug: "art-craft", image: tile("art-craft") },
  { name: "Resin Wall Clocks", slug: "resin-wall-clocks", image: tile("resin-wall-clocks") },
  { name: "Varmala Preservation", slug: "varmala-preservation", image: tile("varmala-preservation") },
  { name: "Wedding Photo Frames", slug: "wedding-photo-frames", image: tile("wedding-photo-frames") },
  { name: "Resin Trays & Platters", slug: "resin-trays", image: tile("resin-trays") },
  { name: "Resin Coasters", slug: "resin-coasters", image: tile("resin-coasters") },
  { name: "Candle & Diya Holders", slug: "candle-holders", image: tile("candle-holders") },
  { name: "Resin Jewellery", slug: "resin-jewelry", image: tile("resin-jewelry") },
  { name: "Nameplates", slug: "nameplates", image: tile("nameplates") },
  { name: "Spiritual & Festive", slug: "spiritual-festive", image: tile("spiritual-festive") },
  { name: "Home Decor", slug: "home-decor", image: tile("home-decor") },
  { name: "Resin Furniture", slug: "resin-furniture", image: tile("resin-furniture") },
  { name: "3D-Printed Decor", slug: "3d-printed-decor", image: tile("3d-printed-decor") },
  { name: "Corporate Gifting", slug: "corporate-gifting", image: tile("corporate-gifting") },
];
