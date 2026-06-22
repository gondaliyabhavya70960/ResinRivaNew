"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { savePortfolio } from "@/actions/portfolio";
import { emptyState } from "@/actions/state";
import { slugify } from "@/lib/validations/studio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldError } from "./field-error";
import { ImageUploader, type GalleryImage } from "./image-uploader";
import { SingleImagePicker } from "./single-image-picker";
import { ResultsMetaBuilder, type MetaRow } from "./results-meta-builder";

type Category = { id: string; name: string };

export type FormPortfolio = {
  id: string;
  title: string;
  slug: string;
  story: string | null;
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
  videoUrl: string | null;
  categoryId: string | null;
  status: "DRAFT" | "PUBLISHED";
  images: GalleryImage[];
  resultsMeta: MetaRow[];
};

export function PortfolioForm({
  portfolio,
  categories,
}: {
  portfolio?: FormPortfolio;
  categories: Category[];
}) {
  const [state, action, pending] = useActionState(
    savePortfolio.bind(null, portfolio?.id ?? null),
    emptyState,
  );
  const [images, setImages] = React.useState<GalleryImage[]>(portfolio?.images ?? []);
  const [meta, setMeta] = React.useState<MetaRow[]>(portfolio?.resultsMeta ?? []);
  const [slug, setSlug] = React.useState(portfolio?.slug ?? "");
  const [slugEdited, setSlugEdited] = React.useState(Boolean(portfolio));

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="resultsMeta" value={JSON.stringify(meta)} />

      <Card>
        <CardHeader>
          <CardTitle>Case study</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={portfolio?.title}
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
            <Label htmlFor="story">Story</Label>
            <Textarea id="story" name="story" defaultValue={portfolio?.story ?? ""} className="min-h-32" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select id="categoryId" name="categoryId" defaultValue={portfolio?.categoryId ?? ""}>
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={portfolio?.status ?? "DRAFT"}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Before / After & video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-8">
            <div>
              <Label>Before</Label>
              <SingleImagePicker name="beforeImageUrl" defaultUrl={portfolio?.beforeImageUrl ?? ""} folder="portfolio" />
            </div>
            <div>
              <Label>After</Label>
              <SingleImagePicker name="afterImageUrl" defaultUrl={portfolio?.afterImageUrl ?? ""} folder="portfolio" />
            </div>
          </div>
          <div>
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input id="videoUrl" name="videoUrl" defaultValue={portfolio?.videoUrl ?? ""} placeholder="optional" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploader value={images} onChange={setImages} folder="portfolio" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Results metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">e.g. Type, Material, Size, Timeline.</p>
          <ResultsMetaBuilder value={meta} onChange={setMeta} />
        </CardContent>
      </Card>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save case study"}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/studio/portfolio">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
