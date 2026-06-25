/** Shared, serializable types for the bulk importer (safe to import anywhere). */

export type ImportAction = "create" | "update";

export type ImportColumn = {
  name: string;
  required?: boolean;
  note?: string;
};

/** The serializable description of an importable entity, handed to the client. */
export type EntityMeta = {
  key: string;
  label: string;
  description: string;
  /** Human note on how existing rows are matched (e.g. "slug"). */
  matchBy: string;
  columns: ImportColumn[];
  /** Example rows used to build a downloadable template. */
  sample: Record<string, string>[];
};

export type ImportSource = { kind: "sheet"; value: string } | { kind: "csv"; value: string };

export type RowOutcome = {
  row: number;
  status: ImportAction | "error";
  title: string;
  message?: string;
};

export type ImportReport = {
  ok: boolean;
  error?: string;
  entity: string;
  total: number;
  created: number;
  updated: number;
  failed: number;
  outcomes: RowOutcome[];
  headers: string[];
  dryRun: boolean;
};
