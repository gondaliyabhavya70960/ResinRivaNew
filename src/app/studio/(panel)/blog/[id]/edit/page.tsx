import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BlogPostForm } from "@/components/studio/blog-post-form";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id }, include: { tags: { include: { tag: true } } } }),
    prisma.blogCategory.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!post) notFound();

  const formPost = {
    ...post,
    content:
      post.content && typeof post.content === "object"
        ? (post.content as Record<string, unknown>)
        : null,
    publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 10) : null,
    tags: post.tags.map((t) => t.tag.name).join(", "),
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="font-display text-3xl">Edit post</h1>
      <BlogPostForm post={formPost} categories={categories} />
    </div>
  );
}
