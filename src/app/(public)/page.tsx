import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Hand, Gem, Crown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { InstagramFeed } from "@/components/sections/instagram-feed";
import { Hero } from "@/components/sections/hero";
import { StatCounters } from "@/components/sections/stat-counters";
import { Marquee } from "@/components/sections/marquee";
import { TestimonialsCarousel } from "@/components/sections/testimonials-carousel";
import { ProductCard } from "@/components/product/product-card";
import { waLink, defaultEnquiry } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site";
import { shopCategories } from "@/lib/shop-categories";
import {
  getSiteData,
  getFeaturedProducts,
  getTestimonials,
  getBlogHighlights,
  getPortfolioHighlights,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const pillars = [
  { icon: Hand, title: "Handcrafted", body: "Every piece is poured, cured and finished by hand in small batches — never mass-produced." },
  { icon: Gem, title: "Bespoke", body: "Colours, scale, engraving and finish are tailored to you. Your brief becomes a one-of-a-kind object." },
  { icon: Crown, title: "Heirloom-quality", body: "Museum-grade materials and a flawless gloss, made to be kept and passed on for generations." },
];

const steps = [
  { n: "01", title: "Choose", body: "Browse the collection or start a custom brief." },
  { n: "02", title: "Customize", body: "Pick size, colour, finish and personalisation." },
  { n: "03", title: "Order on WhatsApp", body: "We confirm details, price and timeline directly." },
  { n: "04", title: "We craft & deliver", body: "Handmade to order and shipped with care." },
];

const stats = [
  { label: "Years of craft", value: 6 },
  { label: "Pieces delivered", value: 500, suffix: "+" },
  { label: "5-star reviews", value: 120, suffix: "+" },
  { label: "Cities shipped to", value: 40, suffix: "+" },
];

export default async function Home() {
  const [site, featured, testimonials, posts, portfolio] = await Promise.all([
    getSiteData(),
    getFeaturedProducts(8),
    getTestimonials(),
    getBlogHighlights(3),
    getPortfolioHighlights(4),
  ]);

  return (
    <>
      <Hero videoUrl={site.heroVideoUrl} />

      {/* Brand story */}
      <Section index="01" eyebrow="the studio" title="An atelier for objects worth keeping.">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <ScrollReveal>
            <p className="text-lg text-muted-foreground">
              ResinRiva began with a simple belief — that the moments we treasure deserve to be held
              in something beautiful. We blend resin artistry with precision 3D printing to craft
              bespoke art, décor and keepsakes for couples, collectors and brands across India.
            </p>
            <p className="mt-4 text-muted-foreground">
              Each commission is made to order, by hand, with museum-grade materials and a finish
              that lasts a lifetime.
            </p>
            <div className="mt-7 flex gap-3">
              <Button asChild>
                <Link href="/about">Our story</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/process">The process</Link>
              </Button>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <ParallaxImage
              src="https://res.cloudinary.com/dhaqpl1kz/image/upload/f_auto,q_auto/v1782288799/resinriva/studio-ocean-wall-art.jpg"
              alt="Handcrafted ResinRiva ocean-wave resin wall art in a luxe interior"
              sizes="(min-width:1024px) 40vw, 90vw"
              className="aspect-[4/5] rounded-2xl bg-muted shadow-[var(--shadow-luxe)]"
            />
          </ScrollReveal>
        </div>
      </Section>

      <Marquee
        items={[
          "Resin Art",
          "Custom 3D Printing",
          "Varmala Preservation",
          "Wedding Frames",
          "River Tables",
          "Bespoke Gifts",
        ]}
      />

      {/* Shop by category */}
      <Section
        eyebrow="explore"
        title="Shop by category"
        description="Find your piece by type — every category is handcrafted and made to order."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shopCategories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className="group relative block overflow-hidden rounded-2xl bg-muted shadow-[var(--shadow-glass)]"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width:1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent" />
              </div>
              <span className="absolute inset-x-0 bottom-0 p-4 font-display text-lg leading-tight text-ivory">
                {c.name}
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild variant="outline">
            <Link href="/shop">
              Browse the full collection
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Featured products */}
      {featured.length > 0 && (
        <Section index="02" eyebrow="collection" title="Featured pieces" description="A glimpse of what we love making most.">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {featured.map((p, i) => (
              <ScrollReveal key={p.id} delay={(i % 4) * 0.06}>
                <ProductCard product={p} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="outline">
              <Link href="/shop">
                View the full collection
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </Section>
      )}

      {/* How it works */}
      <Section className="mesh-ivory" index="03" eyebrow="how it works" title="From idea to heirloom.">
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

      {/* Why ResinRiva */}
      <Section index="04" eyebrow="why resinriva" title="Crafted to be kept.">
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

      {/* Portfolio highlights */}
      {portfolio.length > 0 && (
        <Section className="mesh-ink text-ivory" eyebrow="portfolio" title="Recent commissions">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {portfolio.map((p) => (
              <Link key={p.id} href={`/portfolio/${p.slug}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink/40">
                  {(p.images[0]?.url || p.afterImageUrl) && (
                    <Image
                      src={p.images[0]?.url ?? p.afterImageUrl!}
                      alt={p.title}
                      fill
                      sizes="(min-width:1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="mt-3 font-display text-lg">{p.title}</h3>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="glass" className="text-ivory">
              <Link href="/portfolio">
                See the portfolio
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </Section>
      )}

      {/* Stats */}
      <Section>
        <StatCounters stats={stats} />
      </Section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Section className="mesh-ivory" index="05" eyebrow="loved" title="Words from our clients">
          <TestimonialsCarousel items={testimonials} />
        </Section>
      )}

      {/* Blog highlights */}
      {posts.length > 0 && (
        <Section index="06" eyebrow="journal" title="From the journal">
          <div className="grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                  {post.coverImage && (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(min-width:768px) 33vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                {post.blogCategory && (
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-amber">
                    {post.blogCategory.name}
                  </p>
                )}
                <h3 className="mt-1 font-display text-xl leading-snug">{post.title}</h3>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                )}
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Instagram — live feed via Behold */}
      <Section eyebrow="instagram" title="@resinriva" description="A daily look inside the studio.">
        <InstagramFeed feedId={siteConfig.instagramFeedId} />
        {site.socials.instagram && site.socials.instagram !== "#" && (
          <div className="mt-8">
            <Button asChild variant="outline">
              <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer">
                Follow on Instagram
                <ArrowRight />
              </a>
            </Button>
          </div>
        )}
      </Section>

      {/* WhatsApp CTA */}
      <section className="mesh-ink text-ivory">
        <Container className="py-20 sm:py-24">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl text-balance sm:text-4xl lg:text-5xl">
              Have a piece in mind?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-ivory/75">
              Tell us your idea and we&apos;ll shape it into something worth keeping. No checkout —
              every order is finalised on WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="gold" size="lg">
                <a href={waLink(defaultEnquiry)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  Chat with the studio
                </a>
              </Button>
              <Button asChild variant="glass" size="lg" className="text-ivory">
                <Link href="/custom-order">Start a custom order</Link>
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </>
  );
}
