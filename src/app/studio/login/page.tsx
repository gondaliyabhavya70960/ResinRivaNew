"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StudioLoginPage() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);
  const [showHelp, setShowHelp] = React.useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      redirect: false,
    });
    setPending(false);
    if (res?.error) setError("Invalid email or password.");
    else router.push("/studio");
  }

  return (
    <div className="mesh-ink grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-[var(--shadow-luxe)]">
        <Logo />
        <h1 className="mt-6 font-display text-2xl">Studio sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Owner access only.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <div className="mt-5 border-t pt-4">
          <button
            type="button"
            onClick={() => setShowHelp((v) => !v)}
            aria-expanded={showHelp}
            className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            Forgot password?
          </button>

          {showHelp && (
            <div className="mt-3 space-y-2 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Reset your password from Vercel</p>
              <p>Your password is stored securely in Vercel — never in the website. To reset it:</p>
              <ol className="list-decimal space-y-1 pl-5">
                <li>
                  In Vercel → <span className="font-medium text-foreground">Settings → Environment Variables</span>,
                  set <code className="rounded bg-background px-1">ADMIN_PASSWORD</code> to a new password
                  and add <code className="rounded bg-background px-1">RESET_ADMIN</code> ={" "}
                  <code className="rounded bg-background px-1">1</code> (Production).
                </li>
                <li>
                  Open <span className="font-medium text-foreground">Deployments → newest → ⋯ → Redeploy</span>.
                </li>
                <li>Return here and sign in with the new password.</li>
                <li>
                  Delete <code className="rounded bg-background px-1">RESET_ADMIN</code> and redeploy once more.
                </li>
              </ol>
              <p className="text-xs">Full steps are in ADMIN_GUIDE.md.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
