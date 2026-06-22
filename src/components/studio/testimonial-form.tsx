"use client";

import { useActionState } from "react";
import { saveTestimonial } from "@/actions/testimonials";
import { emptyState } from "@/actions/state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FieldError } from "./field-error";

type T = {
  id: string;
  name: string;
  location: string | null;
  quote: string;
  rating: number;
  avatarUrl: string | null;
  order: number;
};

export function TestimonialForm({ testimonial }: { testimonial?: T }) {
  const [state, action, pending] = useActionState(
    saveTestimonial.bind(null, testimonial?.id ?? null),
    emptyState,
  );

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={testimonial?.name} required />
          <FieldError errors={state.fieldErrors?.name} />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={testimonial?.location ?? ""} />
        </div>
      </div>
      <div>
        <Label htmlFor="quote">Quote</Label>
        <Textarea id="quote" name="quote" defaultValue={testimonial?.quote} required />
        <FieldError errors={state.fieldErrors?.quote} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="rating">Rating</Label>
          <Select id="rating" name="rating" defaultValue={String(testimonial?.rating ?? 5)}>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} ★
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="order">Order</Label>
          <Input id="order" name="order" type="number" min={0} defaultValue={testimonial?.order ?? 0} />
        </div>
        <div>
          <Label htmlFor="avatarUrl">Avatar URL</Label>
          <Input id="avatarUrl" name="avatarUrl" defaultValue={testimonial?.avatarUrl ?? ""} />
        </div>
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : testimonial ? "Save changes" : "Create testimonial"}
      </Button>
    </form>
  );
}
