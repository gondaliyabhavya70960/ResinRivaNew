"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { saveProduct } from "@/actions/products";
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
import {
  CustomizationFieldBuilder,
  type CustomField,
} from "./customization-field-builder";

type Category = { id: string; name: string };

export type FormProduct = {
  id: string;
  title: string;
  slug: string;
  shortTagline: string | null;
  description: string;
  priceMin: number | null;
  priceMax: number | null;
  showPrice: boolean;
  timeline: string | null;
  materials: string | null;
  dimensions: string | null;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  videoUrl: string | null;
  model3dUrl: string | null;
  categoryId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
  images: GalleryImage[];
  customFields: CustomField[];
};

export function ProductForm({
  product,
  categories,
}: {
  product?: FormProduct;
  categories: Category[];
}) {
  const action = saveProduct.bind(null, product?.id ?? null);
  const [state, formAction, pending] = useActionState(action, emptyState);
  const [images, setImages] = React.useState<GalleryImage[]>(product?.images ?? []);
  const [fields, setFields] = React.useState<CustomField[]>(product?.customFields ?? []);
  const [slug, setSlug] = React.useState(product?.slug ?? "");
  const [slugEdited, setSlugEdited] = React.useState(Boolean(product));

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="customFields" value={JSON.stringify(fields)} />

      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={product?.title}
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
            <Label htmlFor="shortTagline">Short tagline</Label>
            <Input id="shortTagline" name="shortTagline" defaultValue={product?.shortTagline ?? ""} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              className="min-h-32"
              required
            />
            <FieldError errors={state.fieldErrors?.description} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select id="categoryId" name="categoryId" defaultValue={product?.categoryId ?? ""}>
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
              <Select id="status" name="status" defaultValue={product?.status ?? "DRAFT"}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </Select>
            </div>
            <label className="flex items-center gap-2 pt-7 text-sm">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured}
                className="size-4 accent-[var(--color-ocean)]"
              />
              Featured
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="priceMin">Price min (₹)</Label>
              <Input id="priceMin" name="priceMin" type="number" min={0} defaultValue={product?.priceMin ?? ""} />
            </div>
            <div>
              <Label htmlFor="priceMax">Price max (₹)</Label>
              <Input id="priceMax" name="priceMax" type="number" min={0} defaultValue={product?.priceMax ?? ""} />
            </div>
            <label className="flex items-center gap-2 pt-7 text-sm">
              <input
                type="checkbox"
                name="showPrice"
                defaultChecked={product ? product.showPrice : true}
                className="size-4 accent-[var(--color-ocean)]"
              />
              Show price (else &ldquo;Enquire&rdquo;)
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="timeline">Timeline</Label>
              <Input id="timeline" name="timeline" defaultValue={product?.timeline ?? ""} placeholder="2–3 weeks" />
            </div>
            <div>
              <Label htmlFor="materials">Materials</Label>
              <Input id="materials" name="materials" defaultValue={product?.materials ?? ""} />
            </div>
            <div>
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input id="dimensions" name="dimensions" defaultValue={product?.dimensions ?? ""} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gallery & media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploader value={images} onChange={setImages} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="videoUrl">Video URL</Label>
              <Input id="videoUrl" name="videoUrl" defaultValue={product?.videoUrl ?? ""} placeholder="optional" />
            </div>
            <div>
              <Label htmlFor="model3dUrl">3D model URL (GLB/USDZ)</Label>
              <Input id="model3dUrl" name="model3dUrl" defaultValue={product?.model3dUrl ?? ""} placeholder="optional" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customization form builder</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            These fields render on the product page and flow into the WhatsApp order.
          </p>
          <CustomizationFieldBuilder value={fields} onChange={setFields} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="seoTitle">SEO title</Label>
            <Input id="seoTitle" name="seoTitle" defaultValue={product?.seoTitle ?? ""} />
          </div>
          <div>
            <Label htmlFor="seoDescription">SEO description</Label>
            <Textarea id="seoDescription" name="seoDescription" defaultValue={product?.seoDescription ?? ""} />
          </div>
          <div>
            <Label htmlFor="ogImage">OG image URL</Label>
            <Input id="ogImage" name="ogImage" defaultValue={product?.ogImage ?? ""} placeholder="optional" />
          </div>
        </CardContent>
      </Card>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save product"}
        </Button>
        <Button asChild variant="ghost">
          <Link href="/studio/products">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
