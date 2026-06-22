"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type MetaRow = { label: string; value: string };

export function ResultsMetaBuilder({
  value,
  onChange,
}: {
  value: MetaRow[];
  onChange: (rows: MetaRow[]) => void;
}) {
  const update = (i: number, patch: Partial<MetaRow>) =>
    onChange(value.map((r, j) => (j === i ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-2">
      {value.map((r, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={r.label}
            onChange={(e) => update(i, { label: e.target.value })}
            placeholder="Type"
            className="w-1/3"
          />
          <Input
            value={r.value}
            onChange={(e) => update(i, { value: e.target.value })}
            placeholder="e.g. Ocean resin"
          />
          <button
            type="button"
            aria-label="Remove"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="px-2 text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...value, { label: "", value: "" }])}
      >
        <Plus className="size-4" />
        Add result
      </Button>
    </div>
  );
}
