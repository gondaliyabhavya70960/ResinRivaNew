import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/studio/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl">Site settings</h1>
        <p className="mt-1 text-muted-foreground">Brand, contact, socials and SEO defaults.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
