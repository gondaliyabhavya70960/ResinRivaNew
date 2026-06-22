import { prisma } from "@/lib/db";
import { PortfolioForm } from "@/components/studio/portfolio-form";

export const dynamic = "force-dynamic";

export default async function NewPortfolioPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-display text-3xl">New case study</h1>
      <PortfolioForm categories={categories} />
    </div>
  );
}
