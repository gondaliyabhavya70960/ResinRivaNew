"use client";

import { useActionState } from "react";
import type { SiteSettings } from "@prisma/client";
import { saveSettings } from "@/actions/settings";
import { emptyState } from "@/actions/state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function asRecord(v: unknown): Record<string, string> {
  return v && typeof v === "object" ? (v as Record<string, string>) : {};
}

export function SettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, action, pending] = useActionState(saveSettings, emptyState);
  const s = settings;
  const socials = asRecord(s?.socials);
  const seo = asRecord(s?.defaultSeo);

  return (
    <form action={action} className="max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="brandName">Brand name</Label>
              <Input id="brandName" name="brandName" defaultValue={s?.brandName ?? "ResinRiva"} />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" name="tagline" defaultValue={s?.tagline ?? ""} />
            </div>
          </div>
          <div>
            <Label htmlFor="announcement">Announcement bar</Label>
            <Input id="announcement" name="announcement" defaultValue={s?.announcement ?? ""} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input id="logoUrl" name="logoUrl" defaultValue={s?.logoUrl ?? ""} />
            </div>
            <div>
              <Label htmlFor="heroVideoUrl">Hero video URL</Label>
              <Input id="heroVideoUrl" name="heroVideoUrl" defaultValue={s?.heroVideoUrl ?? ""} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={s?.phone ?? ""} />
            </div>
            <div>
              <Label htmlFor="whatsappNumber">WhatsApp number (digits)</Label>
              <Input id="whatsappNumber" name="whatsappNumber" defaultValue={s?.whatsappNumber ?? ""} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" defaultValue={s?.email ?? ""} />
            </div>
            <div>
              <Label htmlFor="mapsUrl">Google Maps URL</Label>
              <Input id="mapsUrl" name="mapsUrl" defaultValue={s?.mapsUrl ?? ""} />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={s?.address ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Socials</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" name="instagram" defaultValue={socials.instagram ?? ""} />
          </div>
          <div>
            <Label htmlFor="facebook">Facebook</Label>
            <Input id="facebook" name="facebook" defaultValue={socials.facebook ?? ""} />
          </div>
          <div>
            <Label htmlFor="youtube">YouTube</Label>
            <Input id="youtube" name="youtube" defaultValue={socials.youtube ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="seoTitle">Default title</Label>
            <Input id="seoTitle" name="seoTitle" defaultValue={seo.title ?? ""} />
          </div>
          <div>
            <Label htmlFor="seoDescription">Default description</Label>
            <Textarea id="seoDescription" name="seoDescription" defaultValue={seo.description ?? ""} />
          </div>
          <div>
            <Label htmlFor="ogImage">Default OG image URL</Label>
            <Input id="ogImage" name="ogImage" defaultValue={seo.ogImage ?? ""} />
          </div>
        </CardContent>
      </Card>

      {state.ok && <p className="text-sm text-teal">Settings saved.</p>}
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  );
}
