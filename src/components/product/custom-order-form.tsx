"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ReferenceUploader } from "./reference-uploader";
import { createInquiry } from "@/actions/order";
import { buildOrderMessage, waLink, type OrderSelection } from "@/lib/whatsapp";

const MATERIALS = ["Resin", "Epoxy + Wood", "3D Printed", "Mixed media", "Not sure"];
const BUDGETS = ["Under ₹2,000", "₹2,000–₹5,000", "₹5,000–₹15,000", "₹15,000–₹50,000", "₹50,000+"];
const TIMELINES = ["Flexible", "Within 2 weeks", "Within 1 month", "Specific date (note below)"];

export function CustomOrderForm() {
  const router = useRouter();
  const [idea, setIdea] = React.useState("");
  const [material, setMaterial] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const [timeline, setTimeline] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [refs, setRefs] = React.useState<string[]>([]);
  const [customer, setCustomer] = React.useState({ name: "", phone: "", email: "" });
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const selections: OrderSelection[] = [
    { label: "Idea", value: idea },
    { label: "Material", value: material },
  ];
  const message = buildOrderMessage({
    selections,
    referenceImageUrls: refs,
    notes,
    budgetRange: budget || undefined,
    timeline: timeline || undefined,
    customer: {
      name: customer.name || "—",
      phone: customer.phone || "—",
      email: customer.email || undefined,
    },
  });

  async function place() {
    setError(null);
    if (!customer.name.trim() || !customer.phone.trim()) {
      setError("Please add your name and phone number.");
      return;
    }
    if (!idea.trim()) {
      setError("Please describe your idea.");
      return;
    }
    setPending(true);
    const waUrl = waLink(message);
    const w = typeof window !== "undefined" ? window.open("", "_blank") : null;
    const res = await createInquiry({
      source: "CUSTOM_ORDER",
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email || undefined,
      selections,
      referenceImageUrls: refs,
      budgetRange: budget || undefined,
      timeline: timeline || undefined,
      notes: notes || undefined,
      whatsappMessage: message,
    });
    setPending(false);
    if (!res.ok) {
      if (w) w.close();
      setError(res.error ?? "Something went wrong — please try again.");
      return;
    }
    if (w) w.location.href = waUrl;
    try {
      sessionStorage.setItem("rr_order", JSON.stringify({ message, waUrl, productTitle: "Custom order" }));
    } catch {
      /* ignore */
    }
    router.push("/whatsapp-order");
  }

  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="idea">Your idea *</Label>
        <Textarea
          id="idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="min-h-28"
          placeholder="Describe what you'd like us to make…"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="material">Material</Label>
          <Select id="material" value={material} onChange={(e) => setMaterial(e.target.value)}>
            <option value="">Any</option>
            {MATERIALS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Select id="budget" value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="">Select…</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="timeline">Timeline</Label>
          <Select id="timeline" value={timeline} onChange={(e) => setTimeline(e.target.value)}>
            <option value="">Select…</option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label>Reference images</Label>
        <ReferenceUploader value={refs} onChange={setRefs} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cuname">Your name *</Label>
          <Input id="cuname" value={customer.name} onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="cuphone">Phone *</Label>
          <Input id="cuphone" value={customer.phone} onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="cuemail">Email (optional)</Label>
          <Input id="cuemail" type="email" value={customer.email} onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))} />
        </div>
      </div>
      <div>
        <Label htmlFor="cunotes">Special instructions</Label>
        <Textarea id="cunotes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div>
        <Label>Order preview — sent on WhatsApp</Label>
        <pre className="mt-1 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border bg-muted p-4 text-xs">
          {message}
        </pre>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={place} disabled={pending} variant="gold" size="lg" className="w-full">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle />}
        {pending ? "Saving…" : "Send my custom request"}
      </Button>
    </div>
  );
}
