import type { Metadata } from "next";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for commissioning and purchasing from ResinRiva.",
};

export default function TermsPage() {
  return (
    <Section title="Terms &amp; Conditions" eyebrow="legal">
      <div className="max-w-2xl space-y-5 text-muted-foreground">
        <p>
          These terms apply to commissions and purchases from ResinRiva. By placing an enquiry or
          order, you agree to them.
        </p>
        <div>
          <h2 className="font-display text-xl text-foreground">Made to order</h2>
          <p className="mt-2">
            Every piece is handmade to order. Minor natural variations in colour, pattern and finish
            are part of the craft and not defects. Timelines are estimates confirmed per order.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground">Orders &amp; payment</h2>
          <p className="mt-2">
            There is no online checkout. Details, pricing and payment are agreed directly over
            WhatsApp before work begins. Custom orders may require an advance.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground">Shipping &amp; returns</h2>
          <p className="mt-2">
            We pack carefully and ship pan-India. As pieces are personalised and made to order, they
            are generally non-returnable except in the case of damage in transit — contact us
            promptly with photos.
          </p>
        </div>
        <p className="text-sm">
          This is a general template and should be reviewed by a professional before launch.
        </p>
      </div>
    </Section>
  );
}
