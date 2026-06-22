"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export type CustomField = {
  label: string;
  type: "SELECT" | "TEXT" | "SWATCH" | "SIZE" | "NUMBER" | "FILE";
  options: string;
  required: boolean;
  helpText: string;
};

const TYPES = ["SELECT", "TEXT", "SWATCH", "SIZE", "NUMBER", "FILE"] as const;
const needsOptions = (t: string) => ["SELECT", "SWATCH", "SIZE"].includes(t);

export function CustomizationFieldBuilder({
  value,
  onChange,
}: {
  value: CustomField[];
  onChange: (fields: CustomField[]) => void;
}) {
  const update = (i: number, patch: Partial<CustomField>) =>
    onChange(value.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const add = () =>
    onChange([
      ...value,
      { label: "", type: "TEXT", options: "", required: false, helpText: "" },
    ]);
  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      {value.map((f, i) => (
        <div key={i} className="rounded-xl border bg-muted/30 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Label</label>
              <Input
                value={f.label}
                onChange={(e) => update(i, { label: e.target.value })}
                placeholder="e.g. Size"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Type</label>
              <Select
                value={f.type}
                onChange={(e) => update(i, { type: e.target.value as CustomField["type"] })}
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {needsOptions(f.type) && (
            <div className="mt-3">
              <label className="mb-1 block text-xs text-muted-foreground">
                Options (one per line)
              </label>
              <Textarea
                value={f.options}
                onChange={(e) => update(i, { options: e.target.value })}
                placeholder={"12 inch\n16 inch\n20 inch"}
                className="min-h-24"
              />
            </div>
          )}

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Help text</label>
              <Input
                value={f.helpText}
                onChange={(e) => update(i, { helpText: e.target.value })}
                placeholder="optional"
              />
            </div>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input
                type="checkbox"
                checked={f.required}
                onChange={(e) => update(i, { required: e.target.checked })}
                className="size-4 accent-[var(--color-ocean)]"
              />
              Required field
            </label>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => remove(i)}
              className="inline-flex items-center gap-1 text-sm text-destructive hover:underline"
            >
              <Trash2 className="size-4" />
              Remove field
            </button>
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={add}>
        <Plus className="size-4" />
        Add customization field
      </Button>
    </div>
  );
}
