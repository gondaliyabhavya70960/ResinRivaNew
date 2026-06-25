"use client";

import * as React from "react";
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { previewImport, runImport } from "@/actions/import";
import { toCsv } from "@/lib/import/csv";
import type { EntityMeta, ImportReport, ImportSource } from "@/lib/import/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function BulkImport({ entities }: { entities: EntityMeta[] }) {
  const [entityKey, setEntityKey] = React.useState(entities[0]?.key ?? "");
  const [mode, setMode] = React.useState<"sheet" | "csv">("sheet");
  const [sheetUrl, setSheetUrl] = React.useState("");
  const [csvText, setCsvText] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [report, setReport] = React.useState<ImportReport | null>(null);
  const [pending, startTransition] = React.useTransition();

  const entity = entities.find((e) => e.key === entityKey) ?? entities[0];

  const hasSource = mode === "sheet" ? sheetUrl.trim().length > 0 : csvText.trim().length > 0;
  const source = (): ImportSource =>
    mode === "sheet" ? { kind: "sheet", value: sheetUrl } : { kind: "csv", value: csvText };

  function reset() {
    setReport(null);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setCsvText(await file.text());
    setReport(null);
  }

  function downloadTemplate() {
    const headers = entity.columns.map((c) => c.name);
    const csv = toCsv(headers, entity.sample);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resinriva-${entity.key}-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const doPreview = () =>
    startTransition(async () => setReport(await previewImport(entityKey, source())));
  const doImport = () =>
    startTransition(async () => setReport(await runImport(entityKey, source())));

  return (
    <div className="space-y-6">
      {/* Step 1 — what to import */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="entity">1 · What are you importing?</Label>
          <Select
            id="entity"
            value={entityKey}
            onChange={(e) => {
              setEntityKey(e.target.value);
              reset();
            }}
            className="max-w-sm"
          >
            {entities.map((e) => (
              <option key={e.key} value={e.key}>
                {e.label}
              </option>
            ))}
          </Select>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {entity.description} Existing rows are matched by{" "}
          <span className="font-medium text-foreground">{entity.matchBy}</span> and updated; new
          rows are created.
        </p>

        <div className="mt-4">
          <Button type="button" variant="outline" size="sm" onClick={downloadTemplate}>
            <Download className="size-4" />
            Download {entity.label} template (.csv)
          </Button>
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium">Columns</summary>
          <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
            {entity.columns.map((c) => (
              <li key={c.name} className="text-sm">
                <code className="rounded bg-muted px-1.5 py-0.5 text-[0.8rem]">{c.name}</code>
                {c.required && <span className="ml-1 text-destructive">*</span>}
                {c.note && <span className="ml-2 text-muted-foreground">— {c.note}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">* required · column order doesn’t matter · header names are case-insensitive</p>
        </details>
      </div>

      {/* Step 2 — where from */}
      <div className="rounded-xl border bg-card p-5">
        <Label className="mb-3 block">2 · Where’s the data?</Label>
        <div className="mb-4 inline-flex rounded-lg border p-1">
          {(
            [
              { k: "sheet", label: "Google Sheet", icon: FileSpreadsheet },
              { k: "csv", label: "Upload CSV", icon: Upload },
            ] as const
          ).map(({ k, label, icon: Icon }) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setMode(k);
                reset();
              }}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                mode === k ? "bg-ocean/10 text-ocean" : "text-muted-foreground hover:bg-foreground/5",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
        </div>

        {mode === "sheet" ? (
          <div className="space-y-2">
            <Input
              placeholder="https://docs.google.com/spreadsheets/d/…"
              value={sheetUrl}
              onChange={(e) => {
                setSheetUrl(e.target.value);
                reset();
              }}
            />
            <p className="text-xs text-muted-foreground">
              In Google Sheets: <strong>Share → General access → “Anyone with the link · Viewer”</strong>,
              then paste the link. The first row must be the column headers.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Input type="file" accept=".csv,text/csv" onChange={onFile} />
            {fileName && (
              <p className="text-xs text-muted-foreground">
                Loaded <span className="font-medium text-foreground">{fileName}</span>. Export from
                Google Sheets via <strong>File → Download → CSV</strong>.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Step 3 — actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={doPreview} disabled={!hasSource || pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          Preview
        </Button>
        <Button
          type="button"
          onClick={doImport}
          disabled={!hasSource || pending}
          title="Validates then saves valid rows"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          Import {entity.label.toLowerCase()}
        </Button>
        <span className="text-xs text-muted-foreground">
          Preview checks your data without saving. Import saves valid rows and skips any with errors.
        </span>
      </div>

      {report && <ReportView report={report} />}
    </div>
  );
}

function ReportView({ report }: { report: ImportReport }) {
  if (!report.ok) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div>
          <p className="font-medium text-destructive">Couldn’t read the data</p>
          <p className="mt-1 text-muted-foreground">{report.error}</p>
        </div>
      </div>
    );
  }

  const ok = report.created + report.updated;
  return (
    <div className="space-y-4 rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        {report.dryRun ? (
          <Badge variant="muted">Preview — nothing saved yet</Badge>
        ) : (
          <Badge variant="success">
            <CheckCircle2 className="size-3.5" />
            Imported
          </Badge>
        )}
        <span className="text-sm text-muted-foreground">
          {report.total} row{report.total === 1 ? "" : "s"} · {report.created} to create ·{" "}
          {report.updated} to update
          {report.failed > 0 && (
            <span className="text-destructive"> · {report.failed} with errors</span>
          )}
        </span>
      </div>

      {!report.dryRun && (
        <p className="text-sm">
          <span className="font-medium text-teal">{ok} saved</span>
          {report.failed > 0 && (
            <span className="text-muted-foreground"> · {report.failed} skipped (see below)</span>
          )}
        </p>
      )}

      <div className="max-h-80 overflow-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="w-16 px-3 py-2">Row</th>
              <th className="w-24 px-3 py-2">Status</th>
              <th className="px-3 py-2">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {report.outcomes.map((o) => (
              <tr key={o.row} className={o.status === "error" ? "bg-destructive/5" : undefined}>
                <td className="px-3 py-2 text-muted-foreground">{o.row}</td>
                <td className="px-3 py-2">
                  {o.status === "create" && <Badge variant="success">Create</Badge>}
                  {o.status === "update" && <Badge variant="gold">Update</Badge>}
                  {o.status === "error" && <Badge variant="danger">Error</Badge>}
                </td>
                <td className="px-3 py-2">
                  {o.status === "error" ? (
                    <span className="text-destructive">{o.message}</span>
                  ) : (
                    <span>{o.title}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
