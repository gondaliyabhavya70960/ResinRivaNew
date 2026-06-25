"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BulkDeleteResult } from "@/actions/bulk";

type BulkContext = {
  selected: Set<string>;
  toggle: (id: string) => void;
  setMany: (ids: string[], on: boolean) => void;
  clear: () => void;
};

const Ctx = React.createContext<BulkContext | null>(null);

/** Shares row-selection state between the checkboxes and the action bar. */
export function BulkProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set());

  const toggle = React.useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const setMany = React.useCallback((ids: string[], on: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (on) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }, []);

  const clear = React.useCallback(() => setSelected(() => new Set()), []);

  const value = React.useMemo(
    () => ({ selected, toggle, setMany, clear }),
    [selected, toggle, setMany, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function useBulk() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("Bulk components must be rendered inside <BulkProvider>");
  return ctx;
}

/** Per-row selection checkbox. */
export function BulkCheckbox({ id, className }: { id: string; className?: string }) {
  const { selected, toggle } = useBulk();
  return (
    <input
      type="checkbox"
      aria-label="Select row"
      checked={selected.has(id)}
      onChange={() => toggle(id)}
      onClick={(e) => e.stopPropagation()}
      className={cn("size-4 cursor-pointer align-middle accent-ocean", className)}
    />
  );
}

/** Header "select all" checkbox (shows an indeterminate state for a partial selection). */
export function BulkSelectAll({ ids, className }: { ids: string[]; className?: string }) {
  const { selected, setMany } = useBulk();
  const ref = React.useRef<HTMLInputElement>(null);
  const all = ids.length > 0 && ids.every((id) => selected.has(id));
  const some = ids.some((id) => selected.has(id));
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = some && !all;
  }, [some, all]);
  return (
    <input
      ref={ref}
      type="checkbox"
      aria-label="Select all"
      checked={all}
      onChange={(e) => setMany(ids, e.target.checked)}
      className={cn("size-4 cursor-pointer align-middle accent-ocean", className)}
    />
  );
}

/** Floating action bar + confirmation dialog. Appears once a row is selected. */
export function BulkBar({
  entity,
  noun,
  action,
}: {
  entity: string;
  noun: string;
  action: (entity: string, keys: string[]) => Promise<BulkDeleteResult>;
}) {
  const { selected, clear } = useBulk();
  const router = useRouter();
  const [confirming, setConfirming] = React.useState(false);
  const [pending, start] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const count = selected.size;

  // The bar (and dialog) only render while something is selected.
  if (count === 0) return null;

  const onConfirm = () =>
    start(async () => {
      setError(null);
      const res = await action(entity, Array.from(selected));
      if (res.ok) {
        setConfirming(false);
        clear();
        router.refresh();
      } else {
        setError(res.error ?? "Couldn’t delete the selected items.");
      }
    });

  return (
    <>
      <div className="fixed bottom-6 left-1/2 z-40 flex w-[min(92vw,28rem)] -translate-x-1/2 items-center gap-2 rounded-full border bg-card/95 px-3 py-2 shadow-[var(--shadow-luxe)] backdrop-blur">
        <span className="px-1 text-sm font-medium">
          {count} selected
        </span>
        <button
          type="button"
          onClick={clear}
          className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-foreground/5"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-destructive px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-destructive/90"
        >
          <Trash2 className="size-4" />
          Delete
        </button>
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => !pending && setConfirming(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-[var(--shadow-luxe)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="size-5" />
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-xl">
                  Delete {count} {noun}
                  {count === 1 ? "" : "s"}?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This permanently removes the selected {noun}
                  {count === 1 ? "" : "s"}. This action can’t be undone.
                </p>
                {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
              </div>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                aria-label="Close"
                className="ml-auto rounded-md p-1 text-muted-foreground transition-colors hover:bg-foreground/5"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={pending}
                className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-foreground/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={pending}
                className="inline-flex items-center gap-1.5 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-destructive/90 disabled:opacity-50"
              >
                {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                {pending ? "Deleting…" : `Delete ${count}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
