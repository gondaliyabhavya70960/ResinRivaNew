import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Vercel Blob client-upload handler. Admin (studio) uploads require a session;
 * customer reference uploads (Phase 7) live under the `refs/` prefix and are
 * allowed anonymously.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        const isCustomerRef = pathname.startsWith("refs/");
        if (!isCustomerRef) {
          const session = await auth();
          if (!session?.user) throw new Error("Unauthorized");
        }
        return {
          allowedContentTypes: [
            "image/*",
            "video/*",
            "model/gltf-binary",
            "application/octet-stream",
          ],
          addRandomSuffix: true,
          maximumSizeInBytes: 50 * 1024 * 1024,
        };
      },
      onUploadCompleted: async () => {
        // Media rows are recorded by the client via a server action.
      },
    });
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
