import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Vercel Blob (public CDN) + placeholder image sources used during build.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
