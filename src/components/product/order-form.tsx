"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ReferenceUploader } from "./reference-uploader";
import { createInquiry } from "@/actions/order";
import { buildOrderMessage, waLink, type OrderSelection } from "@/lib/whatsapp";

export type Opt = { label: string; hex?: string };
export type Field = {
  id: string;
  label: string;
  type: "SELECT" | "TEXT" | "SWATCH" | "SIZE" | "NUMBER" | "FILE";
  options: Opt[];
  required: boolean;
  helpText: string | null;
};
export type OrderProduct = { id: string; title: string; fields: Field[] };

export function OrderForm({ product }: { product: OrderProduct }) {
  const router = useRouter();
  const [values, setValues] = React.useState<Record<string, string>>({});
  const [refs, setRefs] = React.useState<string[]>([]);
  const [customer, setCustomer] = React.useState({ name: "", phone: "", email: "" });
  const [notes, setNotes] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const set = (label: string, v: string) => setValues((s) => ({ ...s, [label]: v }));

  const selections: OrderSelection[] = product.fields
    .filter((f) => f.type !== "FILE")
    .map((f) => ({ label: f.label, value: values[f.label] ?? "" }));

  const message = buildOrderMessage({
    productTitle: product.title,
    selections,
    referenceImageUrls: refs,
    notes,
    customer: {
      name: customer.name || "—",
      phone: customer.phone || "—",
      email: customer.email || undefined,
    },
  });

  async function placeOrder() {
    setError(null);
    if (!customer.name.trim() || !customer.phone.trim()) {
      setError("Please add your name and phone number.");
      return;
    }
    const missing = product.fields.find(
      (f) => f.required && f.type !== "FILE" && !(values[f.label] ?? "").trim(),
    );
    if (missing) {
      setError(`Please fill in: ${missing.label}`);
      return;
    }

    setPending(true);
    const waUrl = waLink(message);
    // Open the WhatsApp tab synchronously to preserve the user gesture.
    const waWindow = typeof window !== "undefined" ? window.open("", "_blank") : null;

    const res = await createInquiry({
      source: "PRODUCT",
      productId: product.id,
      customerName: customer.name,
      phone: customer.phone,
      email: customer.email || undefined,
      selections,
      referenceImageUrls: refs,
      notes: notes || undefined,
      whatsappMessage: message,
    });
    setPending(false);

    if (!res.ok) {
      if (waWindow) waWindow.close();
      setError(res.error ?? "Something went wrong — please try again.");
      return;
    }

    if (waWindow) waWindow.location.href = waUrl;
    try {
      sessionStorage.setItem("rr_order", JSON.stringify({ message, waUrl, productTitle: product.title }));
    } catch {
      /* ignore */
    }
    router.push("/whatsapp-order");
  }

  return (
    <div className="space-y-6">
      {product.fields.length > 0 && (
        <div className="space-y-4">
          {product.fields.map((f) => (
            <FieldRenderer key={f.id} field={f} value={values[f.label] ?? ""} onChange={(v) => set(f.label, v)} />
          ))}
        </div>
      )}

      <div>
        <Label>Reference images</Label>
        <ReferenceUploader value={refs} onChange={setRefs} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cname">Your name *</Label>
          <Input id="cname" value={customer.name} onChange={(e) => setCustomer((c) => ({ ...c, name: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="cphone">Phone *</Label>
          <Input id="cphone" value={customer.phone} onChange={(e) => setCustomer((c) => ({ ...c, phone: e.target.value }))} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="cemail">Email (optional)</Label>
          <Input id="cemail" type="email" value={customer.email} onChange={(e) => setCustomer((c) => ({ ...c, email: e.target.value }))} />
        </div>
      </div>

      <div>
        <Label htmlFor="cnotes">Additional notes</Label>
        <Textarea id="cnotes" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div>
        <Label>Order preview — this is sent on WhatsApp</Label>
        <pre className="mt-1 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border bg-muted p-4 text-xs">
          {message}
        </pre>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={placeOrder} disabled={pending} variant="gold" size="lg" className="w-full">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <MessageCircle />}
        {pending ? "Saving…" : "Place order on WhatsApp"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        No payment now — we confirm price &amp; details with you on WhatsApp.
      </p>
    </div>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </Label>

      {(field.type === "SELECT" || field.type === "SIZE") && (
        <Select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select…</option>
          {field.options.map((o) => (
            <option key={o.label} value={o.label}>
              {o.label}
            </option>
          ))}
        </Select>
      )}

      {field.type === "SWATCH" && (
        <div className="flex flex-wrap gap-2">
          {field.options.map((o) => (
            <button
              key={o.label}
              type="button"
              onClick={() => onChange(o.label)}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors",
                value === o.label ? "border-ocean ring-2 ring-ocean/30" : "border-input hover:bg-foreground/5",
              )}
            >
              {o.hex && <span className="size-4 rounded-full border" style={{ background: o.hex }} />}
              {o.label}
            </button>
          ))}
        </div>
      )}

      {field.type === "TEXT" && <Input value={value} onChange={(e) => onChange(e.target.value)} />}
      {field.type === "NUMBER" && (
        <Input type="number" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
      {field.type === "FILE" && (
        <p className="text-sm text-muted-foreground">Attach via &ldquo;Reference images&rdquo; below.</p>
      )}

      {field.helpText && <p className="mt-1 text-xs text-muted-foreground">{field.helpText}</p>}
    </div>
  );
}
