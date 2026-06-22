import Image from "next/image";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MediaUploader } from "@/components/studio/media-uploader";
import { DeleteButton } from "@/components/studio/delete-button";
import { deleteMedia } from "@/actions/media";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" }, take: 120 });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Media library</h1>
        <MediaUploader />
      </div>

      {media.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No media yet. Upload images, video or 3D files — they&apos;re stored on Vercel Blob.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              <div className="relative aspect-square bg-muted">
                {m.type === "IMAGE" ? (
                  <Image src={m.url} alt={m.pathname} fill className="object-cover" sizes="220px" />
                ) : (
                  <div className="grid h-full place-items-center text-xs font-medium text-muted-foreground">
                    {m.type}
                  </div>
                )}
              </div>
              <CardContent className="space-y-2 p-3">
                <p className="truncate text-xs text-muted-foreground" title={m.pathname}>
                  {m.pathname}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="muted">{m.type}</Badge>
                  <DeleteButton action={deleteMedia.bind(null, m.url)} confirmText="Delete this file from Blob?" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
