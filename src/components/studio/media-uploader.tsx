"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { UploadCloud, Loader2 } from "lucide-react";
import { recordMedia } from "@/actions/media";

export function MediaUploader({ folder = "library" }: { folder?: string }) {
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  async function handle(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    try {
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
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-4 py-2.5 text-sm text-muted-foreground transition hover:bg-foreground/5">
      {busy ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
      Upload files
      <input
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handle(e.target.files)}
        disabled={busy}
      />
    </label>
  );
}
