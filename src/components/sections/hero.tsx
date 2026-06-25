"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { LiquidGlass } from "@/components/motion/liquid-glass";
import { MouseParallax } from "@/components/motion/mouse-parallax";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { waLink, defaultEnquiry } from "@/lib/whatsapp";

export function Hero({ videoUrl, imageUrl }: { videoUrl?: string | null; imageUrl?: string | null }) {
  return (
    <section className="relative isolate overflow-hidden mesh-ink text-ivory">
      {videoUrl && (
        <video
          aria-hidden
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
        >
          <source src={videoUrl} />
        </video>
      )}
      {imageUrl && !videoUrl && (
        <div aria-hidden className="absolute inset-0 -z-20">
          <Image src={imageUrl} alt="" fill priority sizes="100vw" className="object-cover object-right" />
          {/* Left scrim keeps the headline readable; right stays luminous */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
        </div>
      )}
      <MouseParallax strength={14} className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-16 top-24 size-72 rounded-full bg-ocean/40 blur-3xl" />
          <div className="absolute right-0 top-8 size-80 rounded-full bg-teal/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-amber/20 blur-3xl" />
        </div>
        <Container className="relative flex min-h-[88vh] flex-col justify-center py-28">
          <ScrollReveal className="max-w-3xl">
            <p className="mb-6 text-xs uppercase tracking-[0.24em] text-ivory/70">
              luxury resin art · custom 3d printing
            </p>
            <h1 className="font-display text-4xl leading-[1.04] text-balance sm:text-6xl lg:text-7xl">
              Bespoke <span className="italic text-amber-light">resin</span> art, made to outlast the moment.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-ivory/75">
              Handcrafted keepsakes, wall art, furniture and 3D-printed décor — designed with you and
              finished to an heirloom standard.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="gold" size="lg">
                <a href={waLink(defaultEnquiry)} target="_blank" rel="noopener noreferrer">
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
              <span className="text-ivory/80">Loved by couples, gift-givers &amp; collectors across India</span>
            </LiquidGlass>
          </ScrollReveal>
        </Container>
      </MouseParallax>
    </section>
  );
}
