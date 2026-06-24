import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ParallaxImage } from "@/components/motion/parallax-image";

export const metadata: Metadata = {
  title: "About",
  description:
    "ResinRiva is a luxury studio crafting bespoke resin art, custom 3D-printed décor and personalised keepsakes — handmade to order in India.",
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Made to order", body: "Nothing mass-produced. Every piece is created for one person, one moment." },
  { title: "Material-led", body: "Museum-grade resin, real metallic leaf, hardwood and precise 3D prints." },
  { title: "Finished by hand", body: "Hand-poured, hand-sanded and polished to a flawless, lasting gloss." },
];

export default function AboutPage() {
  return (
    <>
      <section className="mesh-ink text-ivory">
        <Container className="py-24 sm:py-32">
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-ivory/70">about resinriva</p>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.05] text-balance sm:text-6xl">
            A studio devoted to objects you&apos;ll keep forever.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ivory/75">
            We blend resin artistry with precision 3D printing to make bespoke art, décor and
            keepsakes for couples, collectors and brands across India.
          </p>
        </Container>
      </section>

      <Section index="01" eyebrow="our story" title="From a single keepsake to a studio.">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <ScrollReveal>
            <div className="space-y-4 text-muted-foreground">
              <p>
                ResinRiva started with one preserved wedding garland and a belief that the moments we
                treasure deserve to be held in something beautiful — not tucked away in a box.
              </p>
              <p>
                Today we craft river tables, ocean wall art, varmala frames, nameplates, jewellery and
                custom 3D-printed décor. Every commission is a conversation: you bring the story, we
                shape it into a piece made to last generations.
              </p>
              <p>
                There&apos;s no checkout and no rush. We finalise each order personally over WhatsApp so
                every detail is exactly right.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ParallaxImage
              src="https://res.cloudinary.com/dhaqpl1kz/image/upload/f_auto,q_auto/v1782289010/resinriva/about-preserved-flower-frame.jpg"
              alt="Handcrafted ResinRiva preserved-flower and gold-leaf resin keepsake frame"
              sizes="(min-width:1024px) 40vw, 90vw"
              className="aspect-[4/5] rounded-2xl bg-muted shadow-[var(--shadow-luxe)]"
            />
          </ScrollReveal>
        </div>
      </Section>

      <Section className="mesh-ivory" index="02" eyebrow="what we value" title="Craft over quantity.">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <ScrollReveal key={v.title}>
              <div className="h-full rounded-2xl border bg-card p-8">
                <h3 className="font-display text-2xl">{v.title}</h3>
                <p className="mt-3 text-muted-foreground">{v.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/shop">Explore the collection</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Get in touch</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
