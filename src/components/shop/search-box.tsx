"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBox({ initial = "" }: { initial?: string }) {
  const router = useRouter();
  const [q, setQ] = React.useState(initial);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        router.push(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
      }}
      className="relative"
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search resin art, guides, commissions…"
        className="h-11 pl-9"
        autoFocus
      />
    </form>
  );
}
