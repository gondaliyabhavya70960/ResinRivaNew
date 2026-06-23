"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

type OrderData = { message: string; waUrl: string; productTitle: string };

export default function WhatsAppOrderPage() {
  const raw = React.useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return sessionStorage.getItem("rr_order");
      } catch {
        return null;
      }
    },
    () => null,
  );
  const data = React.useMemo<OrderData | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as OrderData;
    } catch {
      return null;
    }
  }, [raw]);

  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-xl text-center">
        <CheckCircle2 className="mx-auto size-12 text-teal" />
        <h1 className="mt-4 font-display text-3xl">Your order is ready for WhatsApp</h1>
        <p className="mt-2 text-muted-foreground">
          We&apos;ve saved your request. If WhatsApp didn&apos;t open automatically, tap the button
          below.
        </p>

        {data ? (
          <>
            <div className="mt-6">
              <Button asChild variant="gold" size="lg">
                <a href={data.waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle />
                  Open WhatsApp
                </a>
              </Button>
            </div>
            <pre className="mt-8 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border bg-muted p-4 text-left text-xs">
              {data.message}
            </pre>
          </>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">
            No recent order found.{" "}
            <Link href="/shop" className="text-ocean underline">
              Browse the shop
            </Link>
            .
          </p>
        )}

        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/shop">Continue browsing</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
