"use client";

import { useActionState } from "react";
import { submitContact } from "@/actions/contact";
import { emptyState } from "@/actions/state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/studio/field-error";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, emptyState);

  if (state.ok) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center">
        <p className="font-display text-2xl">Thank you</p>
        <p className="mt-2 text-muted-foreground">
          We&apos;ve received your message and will reply shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
          <FieldError errors={state.fieldErrors?.name} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" required />
          <FieldError errors={state.fieldErrors?.phone} />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" name="email" type="email" />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" className="min-h-32" required />
        <FieldError errors={state.fieldErrors?.message} />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
