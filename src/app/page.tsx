import Link from "next/link";
import { ArrowRight, MessageCircle, Star, Hand, Gem, Crown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { LiquidGlass } from "@/components/motion/liquid-glass";
import { MouseParallax } from "@/components/motion/mouse-parallax";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { waLink, defaultEnquiry } from "@/lib/whatsapp";

/**
 * Phase 2 placeholder home — demonstrates the design system & primitives.
 * The full, DB-driven home (all sections) is built in Phase 6.
 */

const pillars = [
  {
    icon: Hand,
    title: "Handcrafted",
    body: "Every piece is poured, cured and finished by hand in small batches — never mass-produced.",
  },
  {
    icon: Gem,
    title: "Bespoke",
    body: "Colours, scale, engraving and finish are tailored to you. Your brief becomes a one-of-a-kind object.",
  },
  {
    icon: Crown,
    title: "Heirloom-quality",
    body: "Museum-grade materials and a flawless gloss, made to be kept and passed on for generations.",
  },
];

const steps = [
  { n: "01", title: "Choose", body: "Browse the collection or start a custom brief." },
  { n: "02", title: "Customize", body: "Pick size, colour, finish and personalisation." },
  { n: "03", title: "Order on WhatsApp", body: "We confirm details, price and timeline directly." },
  { n: "04", title: "We craft & deliver", body: "Handmade to order and shipped with care." },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden mesh-ink text-ivory">
        <MouseParallax strength={14} className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -left-16 top-24 size-72 rounded-full bg-ocean/40 blur-3xl" />
            <div className="absolute right-0 top-8 size-80 rounded-full bg-teal/30 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-amber/20 blur-3xl" />
          </div>

          <Container className="relative flex min-h-[86vh] flex-col justify-center py-28">
            <ScrollReveal className="max-w-3xl">
              <p className="mb-6 flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-ivory/70">
                <span className="font-display text-amber-light">·</span>
                luxury resin art · custom 3d printing
              </p>
              <h1 className="font-display text-4xl leading-[1.04] text-balance sm:text-6xl lg:text-7xl">
                Bespoke <span className="italic text-amber-light">resin</span> art,
                made to outlast the moment.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-ivory/75">
                Handcrafted keepsakes, wall art, furniture and 3D-printed décor —
                designed with you and finished to an heirloom standard.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="gold" size="lg">
                  <a
                    href={waLink(defaultEnquiry)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle />
                    Start your piece on WhatsApp
                  </a>
                </Button>
                <Button asChild variant="glass" size="lg" className="text-ivory">
                  <Link href="/shop">
                    Explore the collection
                    <ArrowRight />
                  </Link>
                </Button>
              </div>

              <LiquidGlass className="mt-10 inline-flex items-center gap-3 rounded-full px-5 py-2.5 text-sm text-ivory">
                <span className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </span>
                <span className="text-ivory/80">
                  Loved by couples, gift-givers &amp; collectors across India
                </span>
              </LiquidGlass>
            </ScrollReveal>
          </Container>
        </MouseParallax>
      </section>

      {/* ── Why ResinRiva (value pillars) ──────────────────── */}
      <Section
        index="01"
        eyebrow="why resinriva"
        title="Crafted to be kept."
        description="Three promises behind every ResinRiva commission."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border bg-card p-8 shadow-[var(--shadow-luxe)]">
                <span className="grid size-12 place-items-center rounded-full bg-ocean/10 text-ocean">
                  <p.icon className="size-5" />
                </span>
                <h3 className="mt-6 font-display text-2xl">{p.title}</h3>
                <p className="mt-3 text-muted-foreground">{p.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* ── How it works ───────────────────────────────────── */}
      <Section
        className="mesh-ivory"
        index="02"
        eyebrow="how it works"
        title="From idea to heirloom."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border bg-card/70 p-7">
                <span className="font-display text-3xl text-amber">{s.n}</span>
                <h3 className="mt-4 font-display text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* ── WhatsApp CTA band ──────────────────────────────── */}
      <section className="mesh-ink text-ivory">
        <Container className="py-20 sm:py-24">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl text-balance sm:text-4xl lg:text-5xl">
              Have a piece in mind?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-ivory/75">
              Tell us your idea and we&apos;ll shape it into something worth keeping.
              No checkout — every order is finalised on WhatsApp.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild variant="gold" size="lg">
                <a
                  href={waLink(defaultEnquiry)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle />
                  Chat with the studio
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
