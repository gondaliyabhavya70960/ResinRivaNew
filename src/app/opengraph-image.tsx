import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = "ResinRiva — Luxury Resin Art & 3D Printing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Branded default social card used for any page without its own OG image. */
export default function OpengraphImage() {
  const host = siteConfig.url.replace(/^https?:\/\//, "");
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          color: "#F4EFE9",
          backgroundColor: "#14151D",
          backgroundImage:
            "radial-gradient(circle at 14% 18%, rgba(14,58,83,0.85), transparent 45%), radial-gradient(circle at 86% 24%, rgba(27,110,122,0.55), transparent 42%), radial-gradient(circle at 50% 96%, rgba(200,136,31,0.35), transparent 55%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 8, color: "rgba(244,239,233,0.7)" }}>
          LUXURY RESIN ART · CUSTOM 3D PRINTING
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 132, fontWeight: 700, letterSpacing: -2 }}>
            {siteConfig.name}
          </div>
          <div style={{ display: "flex", width: 220, height: 8, marginTop: 18, backgroundColor: "#D4AF37" }} />
          <div style={{ display: "flex", marginTop: 30, fontSize: 40, color: "rgba(244,239,233,0.82)" }}>
            {siteConfig.tagline}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "rgba(244,239,233,0.62)" }}>
          <div style={{ display: "flex" }}>{host}</div>
          <div style={{ display: "flex" }}>Made to order · India</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
