import Link from "next/link";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/studio/delete-button";
import { BlogCategoryForm } from "@/components/studio/blog-category-form";
import { deleteBlogPost, deleteBlogCategory } from "@/actions/blog";
import { bulkDelete } from "@/actions/bulk";
import { BulkProvider, BulkBar, BulkCheckbox, BulkSelectAll } from "@/components/studio/bulk/bulk-select";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [posts, cats] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: { createdAt: "desc" }, include: { blogCategory: true } }),
    prisma.blogCategory.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Blog</h1>
        <Button asChild>
          <Link href="/studio/blog/new">New post</Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <BulkProvider>
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              {posts.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">No posts yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="w-10 p-4">
                        <BulkSelectAll ids={posts.map((p) => p.id)} />
                      </th>
                      <th className="p-4 font-medium">Title</th>
                      <th className="hidden p-4 font-medium sm:table-cell">Category</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {posts.map((p) => (
                      <tr key={p.id}>
                        <td className="p-4">
                          <BulkCheckbox id={p.id} />
                        </td>
                        <td className="p-4">
                          <p className="font-medium">{p.title}</p>
                          <p className="text-xs text-muted-foreground">{p.slug}</p>
                        </td>
                        <td className="hidden p-4 text-muted-foreground sm:table-cell">
                          {p.blogCategory?.name ?? "—"}
                        </td>
                        <td className="p-4">
                          <Badge variant={p.status === "PUBLISHED" ? "success" : "muted"}>{p.status}</Badge>
                        </td>
                        <td className="whitespace-nowrap p-4 text-right">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/studio/blog/${p.id}/edit`}>Edit</Link>
                          </Button>
                          <DeleteButton action={deleteBlogPost.bind(null, p.id)} confirmText={`Delete "${p.title}"?`} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
          <BulkBar entity="blogPost" noun="post" action={bulkDelete} />
        </BulkProvider>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cats.length > 0 && (
              <ul className="space-y-1 text-sm">
                {cats.map((c) => (
                  <li key={c.id} className="flex items-center justify-between">
                    <span>
                      {c.name} <span className="text-muted-foreground">({c._count.posts})</span>
                    </span>
                    <DeleteButton
                      action={deleteBlogCategory.bind(null, c.id)}
                      className="px-1 py-1"
                      confirmText={`Delete category "${c.name}"?`}
                    />
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t pt-4">
              <BlogCategoryForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
