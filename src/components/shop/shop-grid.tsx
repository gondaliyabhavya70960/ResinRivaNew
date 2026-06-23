"use client";

import * as React from "react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { fetchProducts, type ShopFilters, type ShopProduct } from "@/actions/shop";

export function ShopGrid({
  initial,
  filters,
  total,
}: {
  initial: ShopProduct[];
  filters: ShopFilters;
  total: number;
}) {
  // The parent passes a `key` derived from the filters, so this remounts with
  // fresh state whenever filters change — no effect-based syncing needed.
  const [items, setItems] = React.useState(initial);
  const [loading, setLoading] = React.useState(false);
  const sentinel = React.useRef<HTMLDivElement>(null);

  const hasMore = items.length < total;

  const loadMore = React.useCallback(async () => {
    setLoading(true);
    const more = await fetchProducts(filters, items.length);
    setItems((prev) => [...prev, ...more]);
    setLoading(false);
  }, [filters, items.length]);

  React.useEffect(() => {
    if (!hasMore || loading) return;
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading, loadMore]);

  if (!items.length) {
    return (
      <p className="py-16 text-center text-muted-foreground">
        No products found — try a different filter or search.
      </p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinel} className="mt-10 flex justify-center">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}
