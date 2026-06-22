"use client";

import * as React from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { X, UploadCloud, Loader2 } from "lucide-react";
import { recordMedia } from "@/actions/media";

export function SingleImagePicker({
  name,
  defaultUrl,
  folder = "library",
}: {
  name: string;
  defaultUrl?: string;
  folder?: string;
}) {
  const [url, setUrl] = React.useState(defaultUrl ?? "");
  const [busy, setBusy] = React.useState(false);

  async function handle(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    try {
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
      setUrl(blob.url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      {url ? (
        <div className="relative inline-block">
          <Image
            src={url}
            alt=""
            width={112}
            height={112}
            className="size-28 rounded-lg border object-cover"
          />
          <button
            type="button"
            aria-label="Remove"
            onClick={() => setUrl("")}
            className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-ink text-ivory"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <label className="grid size-28 cursor-pointer place-items-center rounded-lg border border-dashed text-muted-foreground transition hover:bg-foreground/5">
          {busy ? <Loader2 className="size-5 animate-spin" /> : <UploadCloud className="size-5" />}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handle(e.target.files)}
            disabled={busy}
          />
        </label>
      )}
    </div>
  );
}
