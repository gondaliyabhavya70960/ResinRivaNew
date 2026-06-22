import Link from "next/link";
import { MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { InstagramIcon, FacebookIcon } from "@/components/brand/social-icons";
import { footerNav } from "@/lib/site";
import { waLink, defaultEnquiry } from "@/lib/whatsapp";
import type { SiteData } from "@/lib/queries";

/** Luxury multi-column footer (DB-driven via SiteSettings). */
export function Footer({ site }: { site: SiteData }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto mesh-ink text-ivory">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo className="text-ivory" />
            <p className="mt-5 max-w-sm text-ivory/70">{site.tagline}</p>

            <ul className="mt-7 space-y-3 text-sm text-ivory/80">
              <li>
                <a className="inline-flex items-center gap-3 transition-colors hover:text-gold" href={`tel:${site.phoneTel}`}>
                  <Phone className="size-4 text-amber-light" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-3 transition-colors hover:text-gold" href={`mailto:${site.email}`}>
                  <Mail className="size-4 text-amber-light" />
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  className="inline-flex items-center gap-3 transition-colors hover:text-gold"
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="size-4 text-amber-light" />
                  View location on Google Maps
                </a>
              </li>
            </ul>

            <div className="mt-7">
              <Button asChild variant="gold" size="sm">
                <a href={waLink(defaultEnquiry)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  Enquire on WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {footerNav.map((col) => (
              <nav key={col.heading}>
                <h3 className="text-xs uppercase tracking-[0.2em] text-ivory/50">{col.heading}</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-ivory/80">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="transition-colors hover:text-gold">
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-ivory/10 pt-7 sm:flex-row">
          <p className="text-xs text-ivory/55">
            © {year} {site.brandName}. Handcrafted, made to order.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={site.socials.instagram || "#"}
              aria-label="Instagram"
              className="grid size-9 place-items-center rounded-full border border-ivory/15 text-ivory/80 transition-colors hover:border-gold/50 hover:text-gold"
            >
              <InstagramIcon className="size-4" />
            </a>
            <a
              href={site.socials.facebook || "#"}
              aria-label="Facebook"
              className="grid size-9 place-items-center rounded-full border border-ivory/15 text-ivory/80 transition-colors hover:border-gold/50 hover:text-gold"
            >
              <FacebookIcon className="size-4" />
            </a>
            <a
              href={waLink(defaultEnquiry)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid size-9 place-items-center rounded-full border border-ivory/15 text-ivory/80 transition-colors hover:border-gold/50 hover:text-gold"
            >
              <MessageCircle className="size-4" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
