import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PortfolioForm } from "@/components/studio/portfolio-form";
import type { MetaRow } from "@/components/studio/results-meta-builder";

export const dynamic = "force-dynamic";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [portfolio, categories] = await Promise.all([
    prisma.portfolio.findUnique({
      where: { id },
      include: { images: { orderBy: { order: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!portfolio) notFound();

  const formPortfolio = {
    ...portfolio,
    images: portfolio.images.map((im) => ({ url: im.url, alt: im.alt ?? "" })),
    resultsMeta: Array.isArray(portfolio.resultsMeta)
      ? (portfolio.resultsMeta as MetaRow[])
      : [],
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-display text-3xl">Edit case study</h1>
      <PortfolioForm portfolio={formPortfolio} categories={categories} />
    </div>
  );
}
