import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { ParallaxImage } from "@/components/motion/parallax-image";
import { TiptapContent } from "@/components/blog/tiptap-content";
import { getPost, getRelatedPosts } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return { title: "Article" };
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.excerpt || undefined,
    openGraph: { type: "article", images: p.coverImage ? [p.coverImage] : undefined },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post.id, post.blogCategoryId, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.coverImage ? [post.coverImage] : undefined,
    datePublished: post.publishedAt?.toISOString(),
    author: { "@type": "Organization", name: post.authorName ?? siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    description: post.excerpt ?? undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <article>
        <Container className="py-10 lg:py-14">
          <div className="mx-auto max-w-3xl">
            {post.blogCategory && (
              <Link
                href={`/blog?category=${post.blogCategory.slug}`}
                className="text-xs uppercase tracking-[0.18em] text-amber"
              >
                {post.blogCategory.name}
              </Link>
            )}
            <h1 className="mt-2 font-display text-4xl leading-tight sm:text-5xl">{post.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>{post.authorName ?? "ResinRiva Studio"}</span>
              {post.publishedAt && <span>· {new Date(post.publishedAt).toLocaleDateString()}</span>}
            </div>
          </div>

          {post.coverImage && (
            <ParallaxImage
              src={post.coverImage}
              alt={post.title}
              sizes="(min-width:1024px) 60vw, 100vw"
              priority
              strength={9}
              className="mx-auto mt-8 aspect-[16/9] max-w-4xl rounded-2xl bg-muted"
            />
          )}

          <div className="mx-auto mt-10 max-w-3xl">
            {post.excerpt && <p className="mb-8 text-xl text-muted-foreground">{post.excerpt}</p>}
            <TiptapContent content={post.content} />
            {post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Link key={t.tagId} href={`/blog?tag=${t.tag.slug}`}>
                    <Badge variant="muted">#{t.tag.name}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      </article>

      {related.length > 0 && (
        <Section className="mesh-ivory" eyebrow="keep reading" title="Related articles">
          <div className="grid gap-8 md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                  {r.coverImage && (
                    <Image
                      src={r.coverImage}
                      alt={r.title}
                      fill
                      sizes="33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="mt-3 font-display text-lg">{r.title}</h3>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
