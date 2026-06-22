import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Activity log</h1>
      <Card>
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <p className="p-5 text-sm text-muted-foreground">No activity recorded yet.</p>
          ) : (
            <ul className="divide-y">
              {logs.map((l) => (
                <li key={l.id} className="flex items-center justify-between gap-4 p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{l.action}</span>
                    <Badge variant="muted">{l.entity}</Badge>
                    {l.entityId && (
                      <span className="hidden text-xs text-muted-foreground sm:inline">{l.entityId}</span>
                    )}
                  </div>
                  <div className="text-right text-xs text-muted-foreground">
                    <p>{l.user?.email ?? "system"}</p>
                    <p>{new Date(l.createdAt).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
