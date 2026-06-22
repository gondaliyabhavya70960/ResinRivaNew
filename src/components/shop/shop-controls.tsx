"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function ShopControls() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [q, setQ] = React.useState(sp.get("q") ?? "");

  function update(next: Record<string, string | null>) {
    const params = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update({ q: q || null });
        }}
        className="relative min-w-[200px] flex-1"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pieces…" className="pl-9" />
      </form>
      <Select
        defaultValue={sp.get("sort") ?? "newest"}
        onChange={(e) => update({ sort: e.target.value === "newest" ? null : e.target.value })}
        className="w-44"
      >
        <option value="newest">Newest</option>
        <option value="featured">Featured</option>
        <option value="price-asc">Price · low to high</option>
        <option value="price-desc">Price · high to low</option>
      </Select>
    </div>
  );
}
