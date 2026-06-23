import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { FaqAccordion } from "@/components/sections/faq-accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { faqLd } from "@/lib/structured-data";
import { getFaqs } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about ordering, customisation, delivery and payment at ResinRiva.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqLd(faqs)} />}
      <Section eyebrow="help" title="Frequently asked questions" description="Everything you need to know before you order.">
        <div className="max-w-2xl">
          <FaqAccordion items={faqs} />
        </div>
      </Section>
    </>
  );
}
