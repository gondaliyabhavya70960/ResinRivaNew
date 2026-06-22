"use client";

import * as React from "react";
import { useActionState } from "react";
import { saveBlogCategory } from "@/actions/blog";
import { emptyState } from "@/actions/state";
import { slugify } from "@/lib/validations/studio";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FieldError } from "./field-error";

type BC = { id: string; name: string; slug: string };

export function BlogCategoryForm({ category }: { category?: BC }) {
  const [state, action, pending] = useActionState(
    saveBlogCategory.bind(null, category?.id ?? null),
    emptyState,
  );
  const [slug, setSlug] = React.useState(category?.slug ?? "");
  const [edited, setEdited] = React.useState(Boolean(category));

  return (
    <form action={action} className="space-y-3">
      <div>
        <Label htmlFor="bc-name">Name</Label>
        <Input
          id="bc-name"
          name="name"
          defaultValue={category?.name}
          required
          onChange={(e) => {
            if (!edited) setSlug(slugify(e.target.value));
          }}
        />
        <FieldError errors={state.fieldErrors?.name} />
      </div>
      <div>
        <Label htmlFor="bc-slug">Slug</Label>
        <Input
          id="bc-slug"
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setEdited(true);
          }}
          required
        />
        <FieldError errors={state.fieldErrors?.slug} />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : category ? "Save" : "Add category"}
      </Button>
    </form>
  );
}
