import type { Metadata } from "next";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/sections/contact-form";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { getSiteData, getFaqs } from "@/lib/queries";
import { waLink, defaultEnquiry } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ResinRiva — WhatsApp, phone, email, and our studio location.",
};

export default async function ContactPage() {
  const [site, faqs] = await Promise.all([getSiteData(), getFaqs()]);
  const mapsQuery = encodeURIComponent(site.address || "India");

  return (
    <>
      <section className="mesh-ink text-ivory">
        <Container className="py-20 sm:py-24">
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-ivory/70">contact</p>
          <h1 className="max-w-2xl font-display text-4xl leading-[1.05] text-balance sm:text-5xl">
            Let&apos;s make something worth keeping.
          </h1>
          <p className="mt-5 max-w-xl text-ivory/75">
            Tell us your idea — we usually reply on WhatsApp within a few hours.
          </p>
        </Container>
      </section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl">Send a message</h2>
            <p className="mt-1 mb-6 text-sm text-muted-foreground">
              We&apos;ll get back to you shortly.
            </p>
            <ContactForm />
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border bg-card p-6">
              <ul className="space-y-4 text-sm">
                <li>
                  <a className="inline-flex items-center gap-3 hover:text-ocean" href={`tel:${site.phoneTel}`}>
                    <Phone className="size-4 text-amber" />
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a className="inline-flex items-center gap-3 hover:text-ocean" href={`mailto:${site.email}`}>
                    <Mail className="size-4 text-amber" />
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    className="inline-flex items-center gap-3 hover:text-ocean"
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="size-4 text-amber" />
                    {site.address}
                  </a>
                </li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild variant="gold" size="sm">
                  <a href={waLink(defaultEnquiry)} target="_blank" rel="noopener noreferrer">
                    <MessageCircle />
                    WhatsApp us
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                    Open in Google Maps
                  </a>
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border">
              <iframe
                title="ResinRiva location"
                src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
                className="aspect-[16/10] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </Section>

      {faqs.length > 0 && (
        <Section className="mesh-ivory" eyebrow="help" title="Quick answers">
          <div className="max-w-2xl">
            <FaqAccordion items={faqs} />
          </div>
        </Section>
      )}
    </>
  );
}
