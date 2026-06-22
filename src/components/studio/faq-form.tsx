"use client";

import { useActionState } from "react";
import { saveFaq } from "@/actions/faqs";
import { emptyState } from "@/actions/state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FieldError } from "./field-error";

type F = { id: string; question: string; answer: string; order: number };

export function FaqForm({ faq }: { faq?: F }) {
  const [state, action, pending] = useActionState(
    saveFaq.bind(null, faq?.id ?? null),
    emptyState,
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" defaultValue={faq?.question} required />
        <FieldError errors={state.fieldErrors?.question} />
      </div>
      <div>
        <Label htmlFor="answer">Answer</Label>
        <Textarea id="answer" name="answer" defaultValue={faq?.answer} className="min-h-28" required />
        <FieldError errors={state.fieldErrors?.answer} />
      </div>
      <div>
        <Label htmlFor="order">Order</Label>
        <Input id="order" name="order" type="number" min={0} defaultValue={faq?.order ?? 0} />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : faq ? "Save changes" : "Create FAQ"}
      </Button>
    </form>
  );
}
