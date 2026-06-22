import { siteConfig } from "@/lib/site";
import { waLink, defaultEnquiry } from "@/lib/whatsapp";

/** Slim top announcement bar (static for Phase 2; DB-driven from Phase 5). */
export function AnnouncementBar() {
  return (
    <div className="bg-ink px-4 py-2 text-center text-xs tracking-wide text-ivory/90 sm:text-[13px]">
      <span>
        {siteConfig.announcement}{" "}
        <a
          href={waLink(defaultEnquiry)}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-gold/60 underline-offset-4 transition-colors hover:text-gold"
        >
          Chat on WhatsApp →
        </a>
      </span>
    </div>
  );
}
