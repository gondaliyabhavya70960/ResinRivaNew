import type { Metadata } from "next";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ResinRiva collects, uses and protects your information.",
};

export default function PrivacyPage() {
  return (
    <Section title="Privacy Policy" eyebrow="legal">
      <div className="max-w-2xl space-y-5 text-muted-foreground">
        <p>
          This Privacy Policy explains how ResinRiva (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles the
          information you share when you enquire about or order a piece. We collect only what we need
          to craft and deliver your order.
        </p>
        <div>
          <h2 className="font-display text-xl text-foreground">What we collect</h2>
          <p className="mt-2">
            Your name, phone number, optional email, the details and reference images you submit, and
            the contents of your enquiry. Orders are finalised over WhatsApp.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground">How we use it</h2>
          <p className="mt-2">
            Solely to discuss, create and deliver your order, and to respond to your messages. We do
            not sell your data. Reference images are stored securely to fulfil your request.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground">Your choices</h2>
          <p className="mt-2">
            You can ask us to update or delete your information at any time by contacting us at the
            email or phone number on our Contact page.
          </p>
        </div>
        <p className="text-sm">
          This is a general template and should be reviewed by a professional before launch.
        </p>
      </div>
    </Section>
  );
}
