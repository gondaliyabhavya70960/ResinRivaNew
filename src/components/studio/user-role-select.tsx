"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/select";
import { updateUserRole } from "@/actions/users";

export function UserRoleSelect({ id, role }: { id: string; role: string }) {
  const [pending, start] = useTransition();
  return (
    <Select
      defaultValue={role}
      disabled={pending}
      onChange={(e) => {
        const v = e.target.value as "ADMIN" | "EDITOR";
        start(() => updateUserRole(id, v));
      }}
      className="h-9 w-32"
    >
      <option value="ADMIN">ADMIN</option>
      <option value="EDITOR">EDITOR</option>
    </Select>
  );
}
