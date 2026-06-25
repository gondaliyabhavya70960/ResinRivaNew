"use server";

import { revalidatePath } from "next/cache";
import { requireUser, logActivity } from "@/lib/auth-helpers";
import { ENTITY_BY_KEY, type ImportContext } from "@/lib/import/entities";
import { fetchSheetCsv } from "@/lib/import/sheets";
import { parseCsv, gridToRows } from "@/lib/import/csv";
import type { ImportSource, ImportReport, RowOutcome } from "@/lib/import/types";

async function loadCsv(source: ImportSource): Promise<string> {
  if (source.kind === "sheet") return fetchSheetCsv(source.value);
  return source.value ?? "";
}

async function runProcess(
  entityKey: string,
  source: ImportSource,
  dryRun: boolean,
): Promise<ImportReport> {
  const user = await requireUser();
  const base: Omit<ImportReport, "ok" | "error"> = {
    entity: entityKey,
    total: 0,
    created: 0,
    updated: 0,
    failed: 0,
    outcomes: [],
    headers: [],
    dryRun,
  };

  const entity = ENTITY_BY_KEY[entityKey];
  if (!entity) return { ok: false, error: "Unknown import type.", ...base };

  let csv: string;
  try {
    csv = await loadCsv(source);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Couldn't load the data.", ...base };
  }

  const { headers, rows } = gridToRows(parseCsv(csv));
  base.headers = headers;
  if (!rows.length) {
    return {
      ok: false,
      error: "No data rows found — make sure there's a header row and at least one row below it.",
      ...base,
    };
  }

  const ctx: ImportContext = {};
  if (entity.prepare) {
    try {
      await entity.prepare(ctx);
    } catch {
      // non-fatal — relations will just resolve to none
    }
  }

  const outcomes: RowOutcome[] = [];
  let created = 0;
  let updated = 0;
  let failed = 0;

  for (let i = 0; i < rows.length; i++) {
    const rowNo = i + 2; // +1 header, +1 to 1-index
    try {
      const { action, title } = await entity.process(rows[i], ctx, dryRun);
      if (action === "create") created++;
      else updated++;
      outcomes.push({ row: rowNo, status: action, title });
    } catch (e) {
      failed++;
      outcomes.push({
        row: rowNo,
        status: "error",
        title: "",
        message: e instanceof Error ? e.message : "Invalid row",
      });
    }
  }

  if (!dryRun && created + updated > 0) {
    await logActivity(user.id, "import", entity.label, undefined);
    for (const path of entity.revalidate) {
      try {
        revalidatePath(path);
      } catch {
        // ignore dynamic-path revalidation quirks
      }
    }
  }

  return { ok: true, ...base, total: rows.length, created, updated, failed, outcomes };
}

/** Validate + report without writing anything. */
export async function previewImport(
  entityKey: string,
  source: ImportSource,
): Promise<ImportReport> {
  return runProcess(entityKey, source, true);
}

/** Validate + upsert valid rows; invalid rows are skipped and reported. */
export async function runImport(entityKey: string, source: ImportSource): Promise<ImportReport> {
  return runProcess(entityKey, source, false);
}
