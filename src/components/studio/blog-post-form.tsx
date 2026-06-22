"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { saveBlogPost } from "@/actions/blog";
import { emptyState } from "@/actions/state";
import { slugify } from "@/lib/validations/studio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "./field-error";
import { TiptapEditor } from "./tiptap-editor";
import { SingleImagePicker } from "./single-image-picker";

type BlogCat = { id: string; name: string };

export type FormPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: Record<string, unknown> | null;
  coverImage: string | null;
  authorName: string | null;
  blogCategoryId: string | null;
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  tags: string;
};

export function BlogPostForm({
  post,
  categories,
}: {
  post?: FormPost;
  categories: BlogCat[];
}) {
  const [state, action, pending] = useActionState(
    saveBlogPost.bind(null, post?.id ?? null),
    emptyState,
  );
  const [slug, setSlug] = React.useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = React.useState(Boolean(post));

  return (
    <form action={action} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={post?.title}
                required
                onChange={(e) => {
                  if (!slugEdited) setSlug(slugify(e.target.value));
                }}
              />
              <FieldError errors={state.fieldErrors?.title} />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugEdited(true);
                }}
                required
              />
              <FieldError errors={state.fieldErrors?.slug} />
            </div>
          </div>
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} />
          </div>
          <div>
            <Label>Cover image</Label>
            <SingleImagePicker name="coverImage" defaultUrl={post?.coverImage ?? ""} folder="blog" />
          </div>
          <div>
            <Label>Content</Label>
            <TiptapEditor name="content" defaultContent={post?.content} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="authorName">Author</Label>
              <Input id="authorName" name="authorName" defaultValue={post?.authorName ?? "ResinRiva Studio"} />
            </div>
            <div>
              <Label htmlFor="blogCategoryId">Category</Label>
              <Select id="blogCategoryId" name="blogCategoryId" defaultValue={post?.blogCategoryId ?? ""}>
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" name="tags" defaultValue={post?.tags ?? ""} />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={post?.status ?? "DRAFT"}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="publishedAt">Publish date</Label>
            <Input id="publishedAt" name="publishedAt" type="date" defaultValue={post?.publishedAt ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="seoTitle">SEO title</Label>
            <Input id="seoTitle" name="seoTitle" defaultValue={post?.seoTitle ?? ""} />
          </div>
          <div>
            <Label htmlFor="seoDescription">SEO description</Label>
            <Textarea id="seoDescription" name="seoDescription" defaultValue={post?.seoDescription ?? ""} />
          </div>
        </CardContent>
      </Card>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save post"}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/studio/blog">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
