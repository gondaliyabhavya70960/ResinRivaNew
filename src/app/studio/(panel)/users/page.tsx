import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserForm } from "@/components/studio/user-form";
import { UserRoleSelect } from "@/components/studio/user-role-select";
import { DeleteButton } from "@/components/studio/delete-button";
import { deleteUser } from "@/actions/users";
import { bulkDelete } from "@/actions/bulk";
import { BulkProvider, BulkBar, BulkCheckbox, BulkSelectAll } from "@/components/studio/bulk/bulk-select";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const me = await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  const selectableIds = users.filter((u) => u.id !== me.id).map((u) => u.id);

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl">Users &amp; roles</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <BulkProvider>
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="w-10 p-4">
                      <BulkSelectAll ids={selectableIds} />
                    </th>
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="p-4">{u.id !== me.id && <BulkCheckbox id={u.id} />}</td>
                      <td className="p-4">
                        <p className="font-medium">{u.name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </td>
                      <td className="p-4">
                        {u.id === me.id ? (
                          <span className="text-sm text-muted-foreground">{u.role} (you)</span>
                        ) : (
                          <UserRoleSelect id={u.id} role={u.role} />
                        )}
                      </td>
                      <td className="whitespace-nowrap p-4 text-right">
                        {u.id !== me.id && (
                          <DeleteButton action={deleteUser.bind(null, u.id)} confirmText={`Remove ${u.email}?`} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <BulkBar entity="user" noun="user" action={bulkDelete} />
        </BulkProvider>

        <Card>
          <CardHeader>
            <CardTitle>Add user</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
