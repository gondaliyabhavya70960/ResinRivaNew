import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { CustomOrderForm } from "@/components/product/custom-order-form";

export const metadata: Metadata = {
  title: "Custom Order",
  description: "Commission a bespoke resin or 3D-printed piece from ResinRiva — finalised on WhatsApp.",
  alternates: { canonical: "/custom-order" },
};

export default function CustomOrderPage() {
  return (
    <>
      <section className="mesh-ink text-ivory">
        <Container className="py-16 sm:py-20">
          <h1 className="font-display text-4xl sm:text-5xl">Start a custom order</h1>
          <p className="mt-3 max-w-xl text-ivory/75">
            Tell us what you&apos;d love — we&apos;ll shape it into a one-of-a-kind piece. No checkout;
            every order is finalised on WhatsApp.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <div className="mx-auto max-w-2xl rounded-2xl border bg-card p-6 sm:p-8">
          <CustomOrderForm />
        </div>
      </Container>
    </>
  );
}
