import { prisma } from "@/lib/db";
import { BlogPostForm } from "@/components/studio/blog-post-form";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-display text-3xl">New post</h1>
      <BlogPostForm categories={categories} />
    </div>
  );
}
