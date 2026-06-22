"use client";

import * as React from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { X, UploadCloud, Loader2 } from "lucide-react";

/** Public reference-image upload to Vercel Blob (under the `refs/` prefix). */
export function ReferenceUploader({
  value,
  onChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [busy, setBusy] = React.useState(false);

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
      const added: string[] = [];
      for (const file of Array.from(files)) {
        const blob = await upload(`refs/${Date.now()}-${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        added.push(blob.url);
      }
      onChange([...value, ...added]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-3">
        {value.map((u, i) => (
          <div key={u} className="relative size-20 overflow-hidden rounded-lg border bg-muted">
            <Image src={u} alt="" fill sizes="80px" className="object-cover" />
            <button
              type="button"
              aria-label="Remove"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-ink/70 text-ivory"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        <label className="grid size-20 cursor-pointer place-items-center rounded-lg border border-dashed text-muted-foreground transition hover:bg-foreground/5">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handle(e.target.files)}
            disabled={busy}
          />
        </label>
      </div>
      <p className="text-xs text-muted-foreground">
        Optional — share inspiration or your own design. Links are sent with your order on WhatsApp.
      </p>
    </div>
  );
}
