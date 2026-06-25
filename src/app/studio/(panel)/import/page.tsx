import { requireUser } from "@/lib/auth-helpers";
import { ENTITY_META } from "@/lib/import/entities";
import { BulkImport } from "@/components/studio/bulk-import";

export const dynamic = "force-dynamic";

export default async function ImportPage() {
  await requireUser();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Bulk import</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Add many products, posts, FAQs, testimonials and pages at once — straight from a Google
          Sheet or a CSV file. Pick a type, grab its template, fill in your rows, then preview and
          import. Re-importing updates existing entries instead of duplicating them.
        </p>
      </div>
      <BulkImport entities={ENTITY_META} />
    </div>
  );
}
