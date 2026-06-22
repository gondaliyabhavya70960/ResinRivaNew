import { requireUser } from "@/lib/auth-helpers";
import { StudioSidebar } from "@/components/studio/studio-sidebar";
import { SignOutButton } from "@/components/studio/sign-out-button";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="flex min-h-dvh flex-col bg-muted/30 md:flex-row">
      <StudioSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-card/80 px-5 backdrop-blur">
          <span className="text-sm font-medium">Studio</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-muted-foreground sm:inline">{user.email}</span>
            <SignOutButton />
          </div>
        </header>
        <main className="flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
