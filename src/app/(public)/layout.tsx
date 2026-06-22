import { LenisProvider } from "@/components/providers/lenis-provider";
import { Preloader } from "@/components/motion/preloader";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/** Public site chrome — header, footer, smooth scroll, preloader. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Preloader />
      <LenisProvider>
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </LenisProvider>
    </>
  );
}
