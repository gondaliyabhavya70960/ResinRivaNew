import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { getFaqs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about ordering, customisation, delivery and payment at ResinRiva.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <Section eyebrow="help" title="Frequently asked questions" description="Everything you need to know before you order.">
      <div className="max-w-2xl">
        <FaqAccordion items={faqs} />
      </div>
    </Section>
  );
}
