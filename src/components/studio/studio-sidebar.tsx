"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Images,
  Newspaper,
  Inbox,
  Image as ImageIcon,
  Quote,
  HelpCircle,
  Settings,
  Users,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/logo";

const links = [
  { href: "/studio", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/studio/products", label: "Products", icon: Package, exact: false },
  { href: "/studio/categories", label: "Categories", icon: FolderTree, exact: false },
  { href: "/studio/portfolio", label: "Portfolio", icon: Images, exact: false },
  { href: "/studio/blog", label: "Blog", icon: Newspaper, exact: false },
  { href: "/studio/inquiries", label: "Inquiries", icon: Inbox, exact: false },
  { href: "/studio/media", label: "Media", icon: ImageIcon, exact: false },
  { href: "/studio/testimonials", label: "Testimonials", icon: Quote, exact: false },
  { href: "/studio/faqs", label: "FAQs", icon: HelpCircle, exact: false },
  { href: "/studio/settings", label: "Settings", icon: Settings, exact: false },
  { href: "/studio/users", label: "Users", icon: Users, exact: false },
  { href: "/studio/activity", label: "Activity", icon: ScrollText, exact: false },
];

export function StudioSidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex shrink-0 border-b bg-card md:sticky md:top-0 md:h-dvh md:w-56 md:flex-col md:overflow-y-auto md:border-r md:border-b-0">
      <div className="hidden p-5 md:block">
        <Link href="/studio" aria-label="ResinRiva Studio">
          <Logo />
        </Link>
      </div>
      <nav className="flex w-full gap-1 overflow-x-auto p-3 md:flex-col">
        {links.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
                active ? "bg-ocean/10 text-ocean" : "text-foreground/70 hover:bg-foreground/5",
              )}
            >
              <Icon className="size-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
