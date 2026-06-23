import { getSiteData } from "@/lib/queries";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Preloader } from "@/components/motion/preloader";
import { GlassDefs } from "@/components/motion/glass-defs";
import { CursorGlow } from "@/components/motion/cursor-glow";
import { PageTransition } from "@/components/motion/page-transition";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationLd, websiteLd } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

/** Public site chrome — header, footer, smooth scroll, preloader. DB-driven. */
export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteData();
  return (
    <>
      <JsonLd data={[organizationLd(site), websiteLd(site)]} />
      <GlassDefs />
      <Preloader />
      <CursorGlow />
      <LenisProvider>
        <AnnouncementBar announcement={site.announcement} />
        <Header />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <Footer site={site} />
      </LenisProvider>
    </>
  );
}
