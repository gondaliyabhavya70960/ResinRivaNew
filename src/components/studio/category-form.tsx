"use client";

import * as React from "react";
import { useActionState } from "react";
import { saveCategory } from "@/actions/categories";
import { emptyState } from "@/actions/state";
import { slugify } from "@/lib/validations/studio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FieldError } from "./field-error";

type Cat = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  order: number;
};

export function CategoryForm({ category }: { category?: Cat }) {
  const action = saveCategory.bind(null, category?.id ?? null);
  const [state, formAction, pending] = useActionState(action, emptyState);
  const [slug, setSlug] = React.useState(category?.slug ?? "");
  const [slugEdited, setSlugEdited] = React.useState(Boolean(category));

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={category?.name}
          required
          onChange={(e) => {
            if (!slugEdited) setSlug(slugify(e.target.value));
          }}
        />
        <FieldError errors={state.fieldErrors?.name} />
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
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" defaultValue={category?.description ?? ""} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="order">Display order</Label>
          <Input id="order" name="order" type="number" min={0} defaultValue={category?.order ?? 0} />
        </div>
        <div>
          <Label htmlFor="image">Image URL</Label>
          <Input id="image" name="image" defaultValue={category?.image ?? ""} placeholder="optional" />
        </div>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : category ? "Save changes" : "Create category"}
      </Button>
    </form>
  );
}
