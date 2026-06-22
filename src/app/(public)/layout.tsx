import { getSiteData } from "@/lib/queries";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Preloader } from "@/components/motion/preloader";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

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
      <Preloader />
      <LenisProvider>
        <AnnouncementBar announcement={site.announcement} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer site={site} />
      </LenisProvider>
    </>
  );
}
