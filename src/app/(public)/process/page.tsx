import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How ResinRiva works — from your brief to a finished, handmade heirloom delivered to your door.",
  alternates: { canonical: "/process" },
};

const steps = [
  { n: "01", title: "Consult", body: "Share your idea, occasion and references on WhatsApp. We suggest materials, sizes and finishes." },
  { n: "02", title: "Design", body: "We confirm colours, dimensions, engraving and a price. You approve before we begin." },
  { n: "03", title: "Pour & print", body: "Your piece is hand-poured in resin (or precision 3D-printed) in small, careful batches." },
  { n: "04", title: "Finish", body: "Cured, sanded and polished to a flawless gloss, then quality-checked by hand." },
  { n: "05", title: "Deliver", body: "Carefully packed and shipped pan-India, with updates the whole way." },
];

export default function ProcessPage() {
  return (
    <>
      <section className="mesh-ink text-ivory">
        <Container className="py-24 sm:py-28">
          <p className="mb-5 text-xs uppercase tracking-[0.24em] text-ivory/70">the process</p>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.05] text-balance sm:text-6xl">
            From idea to heirloom, made by hand.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ivory/75">
            A calm, personal process — no checkout, no guesswork. Just careful craft, confirmed with
            you at every step.
          </p>
        </Container>
      </section>

      <Section>
        <div className="space-y-4">
          {steps.map((s) => (
            <ScrollReveal key={s.n}>
              <div className="grid items-start gap-4 rounded-2xl border bg-card p-7 sm:grid-cols-[auto_1fr]">
                <span className="font-display text-4xl text-amber sm:w-20">{s.n}</span>
                <div>
                  <h3 className="font-display text-2xl">{s.title}</h3>
                  <p className="mt-2 text-muted-foreground">{s.body}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
        <div className="mt-10">
          <Button asChild>
            <Link href="/custom-order">Start your custom order</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
