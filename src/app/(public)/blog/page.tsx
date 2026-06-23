import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPosts, getBlogTaxonomies } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal",
  description: "Guides, gift ideas and behind-the-scenes stories from the ResinRiva studio.",
};

const PER = 12;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; tag?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const [{ posts, total }, tax] = await Promise.all([
    getPosts({ categorySlug: sp.category, tagSlug: sp.tag, skip: (page - 1) * PER, take: PER }),
    getBlogTaxonomies(),
  ]);
  const pages = Math.ceil(total / PER);

  const qs = (p: number) => {
    const params = new URLSearchParams();
    if (sp.category) params.set("category", sp.category);
    if (sp.tag) params.set("tag", sp.tag);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `/blog?${s}` : "/blog";
  };

  return (
    <>
      <section className="mesh-ink text-ivory">
        <Container className="py-16 sm:py-20">
          <h1 className="font-display text-4xl sm:text-5xl">The Journal</h1>
          <p className="mt-3 max-w-xl text-ivory/75">
            Guides, gift ideas and behind-the-scenes from the studio.
          </p>
        </Container>
      </section>

      <Container className="py-10">
        {tax.categories.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <Chip active={!sp.category} href="/blog" label="All" />
            {tax.categories.map((c) => (
              <Chip key={c.id} active={sp.category === c.slug} href={`/blog?category=${c.slug}`} label={c.name} />
            ))}
          </div>
        )}

        {posts.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                  {post.coverImage && (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(min-width:768px) 33vw, 90vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                {post.blogCategory && (
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-amber">{post.blogCategory.name}</p>
                )}
                <h2 className="mt-1 font-display text-xl leading-snug">{post.title}</h2>
                {post.excerpt && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                )}
                {post.publishedAt && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            {page > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link href={qs(page - 1)}>Previous</Link>
              </Button>
            )}
            <span className="text-sm text-muted-foreground">
              Page {page} of {pages}
            </span>
            {page < pages && (
              <Button asChild variant="outline" size="sm">
                <Link href={qs(page + 1)}>Next</Link>
              </Button>
            )}
          </div>
        )}
      </Container>
    </>
  );
}

function Chip({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-sm transition-colors",
        active ? "bg-ocean text-ivory" : "bg-muted text-muted-foreground hover:bg-foreground/10",
      )}
    >
      {label}
    </Link>
  );
}
