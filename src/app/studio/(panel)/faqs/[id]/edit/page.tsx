import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { FaqForm } from "@/components/studio/faq-form";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl">Edit FAQ</h1>
      <Card>
        <CardContent className="pt-6">
          <FaqForm faq={faq} />
        </CardContent>
      </Card>
    </div>
  );
}
