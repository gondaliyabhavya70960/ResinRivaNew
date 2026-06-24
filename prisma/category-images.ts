/**
 * Original resin-art imagery for the seeded catalogue.
 *
 * These are 100% original images generated with ImagineArt (no copied content)
 * and hosted on the owner's Cloudinary. One representative, on-brand image per
 * product category, reused across the catalogue ("curated set"). `f_auto,q_auto`
 * lets Cloudinary auto-pick the best format + quality per request.
 *
 * To swap any image later: upload a new file to the same Cloudinary public_id
 * (e.g. `resinriva/cat-resin-trays`) — every product in that category updates
 * at once. Individual products can also get their own photos via /studio.
 */
const CLD = "https://res.cloudinary.com/dhaqpl1kz/image/upload";
const opt = (slug: string) => `${CLD}/f_auto,q_auto/resinriva/cat-${slug}.jpg`;
// Desaturated variant used as the "before" frame in portfolio before/after sliders.
const desat = (slug: string) => `${CLD}/f_auto,q_auto,e_saturation:-72/resinriva/cat-${slug}.jpg`;

export const categoryImage: Record<string, string> = {
  "art-craft": opt("art-craft"),
  "resin-jewelry": opt("resin-jewelry"),
  "home-decor": opt("home-decor"),
  "resin-trays": opt("resin-trays"),
  "candle-holders": opt("candle-holders"),
  "resin-wall-clocks": opt("resin-wall-clocks"),
  "wedding-photo-frames": opt("wedding-photo-frames"),
  "varmala-preservation": opt("varmala-preservation"),
  "3d-printed-decor": opt("3d-printed-decor"),
  "resin-furniture": opt("resin-furniture"),
};

export const categoryImageDesat: Record<string, string> = {
  "art-craft": desat("art-craft"),
  "resin-jewelry": desat("resin-jewelry"),
  "home-decor": desat("home-decor"),
  "resin-trays": desat("resin-trays"),
  "candle-holders": desat("candle-holders"),
  "resin-wall-clocks": desat("resin-wall-clocks"),
  "wedding-photo-frames": desat("wedding-photo-frames"),
  "varmala-preservation": desat("varmala-preservation"),
  "3d-printed-decor": desat("3d-printed-decor"),
  "resin-furniture": desat("resin-furniture"),
};

/** Sensible default when a category has no dedicated image. */
export const fallbackImage = opt("art-craft");

/** Thematic cover image per blog category. */
export const blogCoverImage: Record<string, string> = {
  guides: categoryImage["art-craft"],
  gifting: categoryImage["resin-jewelry"],
  "behind-the-scenes": categoryImage["resin-furniture"],
  inspiration: categoryImage["art-craft"],
  weddings: categoryImage["varmala-preservation"],
  printing: categoryImage["3d-printed-decor"],
};

export const productImage = (slug?: string | null) =>
  (slug && categoryImage[slug]) || fallbackImage;
