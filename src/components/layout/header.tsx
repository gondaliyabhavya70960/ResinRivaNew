"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, MessageCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { mainNav } from "@/lib/site";
import { waLink, defaultEnquiry } from "@/lib/whatsapp";

/** Glass sticky navigation. Transparent over the (dark) hero, frosts on scroll. */
export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Over the dark hero the bar is transparent with ivory text; once frosted
  // (scrolled) it switches to the page foreground colour.
  const tone = scrolled ? "text-foreground" : "text-ivory";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-3",
      )}
    >
      <Container>
        <div
          className={cn(
            "flex h-14 items-center justify-between rounded-full px-4 transition-all duration-500 sm:px-5",
            tone,
            scrolled ? "glass shadow-[var(--shadow-glass)]" : "bg-transparent",
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
              className="grid size-9 place-items-center rounded-full transition-colors hover:bg-foreground/10"
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
            className="lg:hidden"
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
          <div className="mt-2 flex flex-col gap-1 rounded-2xl glass p-4 text-foreground lg:hidden">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2 transition-colors hover:bg-foreground/5"
              >
                {item.title}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2 transition-colors hover:bg-foreground/5"
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
