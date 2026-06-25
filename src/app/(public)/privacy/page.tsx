import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { TiptapContent } from "@/components/blog/tiptap-content";
import { getContentPage } from "@/lib/content-pages";
import { mdToTiptap } from "@/lib/import/markdown";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ResinRiva collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default async function PrivacyPage() {
  const page = await getContentPage("privacy");
  if (!page) notFound();
  return (
    <Section title={page.title} eyebrow="legal">
      <div className="max-w-2xl">
        <TiptapContent content={mdToTiptap(page.body)} />
      </div>
    </Section>
  );
}
