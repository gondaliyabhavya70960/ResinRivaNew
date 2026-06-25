"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { mainNav } from "@/lib/site";
import { waLink, defaultEnquiry } from "@/lib/whatsapp";

// Run the measure before paint on the client (no SSR warning).
const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * Adaptive glass navigation.
 *
 * • Floats over (and frosts) the hero — the first full-bleed dark section is
 *   pulled up under the bar via a CSS rule, so there's no gap above the hero.
 * • Section-aware theme: it watches which full-bleed section sits behind the
 *   bar. Over a dark section (`.mesh-ink` / `[data-header-theme="dark"]`) it
 *   switches to a LIGHT logo + white nav; over light content it switches to a
 *   DARK logo + dark nav — always high-contrast, on every background.
 * • Frosts harder and lifts a shadow once scrolled.
 */
export function Header() {
  const ref = React.useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  // The primary pages all open on a dark hero, so default to the light treatment.
  const [onDark, setOnDark] = React.useState(true);
  const [open, setOpen] = React.useState(false);

  // Close the mobile menu whenever the route changes — a render-time reset
  // (React's recommended alternative to a state-syncing effect).
  const [lastPath, setLastPath] = React.useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useIsoLayoutEffect(() => {
    let raf = 0;
    // Full-bleed dark backdrops only — `<section>`/`<footer>` surfaces or any
    // element explicitly tagged. Scoping to those tags ignores the fixed
    // preloader overlay and small inset `.mesh-ink` cards.
    const collect = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>(
          'section.mesh-ink, footer.mesh-ink, [data-header-theme="dark"]',
        ),
      );
    let darkNodes = collect();

    const measure = () => {
      raf = 0;
      setScrolled(window.scrollY > 8);
      const el = ref.current;
      // Detect the section sitting at the bar's lower edge.
      const line = el ? el.getBoundingClientRect().bottom - 8 : 64;
      const vw = window.innerWidth;
      const overDark = darkNodes.some((n) => {
        const r = n.getBoundingClientRect();
        // Only full-bleed surfaces flip the theme (ignore inset dark cards).
        return r.width >= vw * 0.9 && r.top <= line && r.bottom > line;
      });
      setOnDark(overDark);
    };

    // Always measure on the next frame so state is never set synchronously
    // during the effect (avoids cascading-render churn).
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    // Re-collect once late images/fonts have settled section positions.
    const settle = window.setTimeout(() => {
      darkNodes = collect();
      schedule();
    }, 350);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearTimeout(settle);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Background tint animates (background-color is transition-able) → no flicker.
  const surface = onDark
    ? scrolled
      ? "bg-white/15"
      : "bg-white/10"
    : scrolled
      ? "bg-card/90"
      : "bg-card/70";
  const ring = onDark ? "border-white/20" : "border-border";
  const elevation = scrolled
    ? onDark
      ? "shadow-[0_16px_50px_-18px_rgba(0,0,0,0.6)]"
      : "shadow-[var(--shadow-luxe)]"
    : "shadow-[var(--shadow-glass)]";
  const hover = onDark ? "hover:bg-white/15" : "hover:bg-foreground/10";

  return (
    <header
      ref={ref}
      data-on-dark={onDark}
      className={cn("sticky top-0 z-50 transition-[padding] duration-500", scrolled ? "py-2" : "py-3")}
    >
      <Container>
        <div
          className={cn(
            "relative flex h-14 items-center justify-between rounded-full border px-4 backdrop-blur-xl backdrop-saturate-150 sm:px-5",
            // gradient-glass sheen (constant) over the animated tint
            "bg-gradient-to-b from-white/20 to-transparent",
            "transition-[background-color,border-color,box-shadow,color] duration-500 ease-out",
            surface,
            ring,
            elevation,
            // Light text + a soft glow so the logo/links stay legible over any
            // hero imagery (a per-glyph shadow, not a heavy backdrop overlay).
            onDark
              ? "text-ivory [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]"
              : "text-foreground",
          )}
        >
          <Link href="/" aria-label="ResinRiva home" className="shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-7 text-sm lg:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="opacity-80 transition-opacity hover:opacity-100"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/search"
              aria-label="Search"
              className={cn("grid size-9 place-items-center rounded-full transition-colors", hover)}
            >
              <Search className="size-4" />
            </Link>
            <Button asChild variant="gold" size="sm">
              <a href={waLink(defaultEnquiry)} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                WhatsApp
              </a>
            </Button>
          </div>

          <button
            type="button"
            className={cn("grid size-9 place-items-center rounded-full transition-colors lg:hidden", hover)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </Container>

      {open && (
        <Container>
          <div
            className={cn(
              "mt-2 flex flex-col gap-1 rounded-2xl border p-4 backdrop-blur-xl backdrop-saturate-150 lg:hidden",
              onDark ? "border-white/15 bg-ink/70 text-ivory" : "border-border bg-card/95 text-foreground",
            )}
          >
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn("rounded-lg px-2 py-2 transition-colors", hover)}
              >
                {item.title}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className={cn("rounded-lg px-2 py-2 transition-colors", hover)}
            >
              Search
            </Link>
            <Button asChild variant="gold" className="mt-2">
              <a href={waLink(defaultEnquiry)} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                WhatsApp
              </a>
            </Button>
          </div>
        </Container>
      )}
    </header>
  );
}
