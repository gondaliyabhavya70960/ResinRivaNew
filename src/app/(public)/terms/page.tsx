import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/ui/section";
import { TiptapContent } from "@/components/blog/tiptap-content";
import { getContentPage } from "@/lib/content-pages";
import { mdToTiptap } from "@/lib/import/markdown";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms",
  description: "The terms for commissioning and purchasing from ResinRiva.",
  alternates: { canonical: "/terms" },
};

export default async function TermsPage() {
  const page = await getContentPage("terms");
  if (!page) notFound();
  return (
    <Section title={page.title} eyebrow="legal">
      <div className="max-w-2xl">
        <TiptapContent content={mdToTiptap(page.body)} />
      </div>
    </Section>
  );
}
