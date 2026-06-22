"use client";

import * as React from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { recordMedia } from "@/actions/media";

export type GalleryImage = { url: string; alt?: string };

export function ImageUploader({
  value,
  onChange,
  folder = "products",
}: {
  value: GalleryImage[];
  onChange: (imgs: GalleryImage[]) => void;
  folder?: string;
}) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);
    try {
      const added: GalleryImage[] = [];
      for (const file of Array.from(files)) {
        const blob = await upload(`${folder}/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        await recordMedia({
          url: blob.url,
          pathname: blob.pathname,
          contentType: file.type,
          bytes: file.size,
          folder,
        });
        added.push({ url: blob.url, alt: "" });
      }
      onChange([...value, ...added]);
    } catch (e) {
      setError((e as Error).message || "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {value.map((img, i) => (
          <div
            key={img.url}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
          >
            <Image src={img.url} alt={img.alt || ""} fill className="object-cover" sizes="160px" />
            {i === 0 && (
              <span className="absolute left-1 top-1 rounded bg-ink/70 px-1.5 py-0.5 text-[10px] text-ivory">
                Main
              </span>
            )}
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-ink/70 text-ivory opacity-0 transition group-hover:opacity-100"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        <label className="grid aspect-square cursor-pointer place-items-center rounded-lg border border-dashed text-muted-foreground transition hover:bg-foreground/5">
          {busy ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <UploadCloud className="size-5" />
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            disabled={busy}
          />
        </label>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Uploads to Vercel Blob. The first image is the main/cover image.
      </p>
    </div>
  );
}
