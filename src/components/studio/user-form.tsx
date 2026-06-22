"use client";

import { useActionState } from "react";
import { createUser } from "@/actions/users";
import { emptyState } from "@/actions/state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FieldError } from "./field-error";

export function UserForm() {
  const [state, action, pending] = useActionState(createUser, emptyState);

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label htmlFor="u-name">Name</Label>
        <Input id="u-name" name="name" />
      </div>
      <div>
        <Label htmlFor="u-email">Email</Label>
        <Input id="u-email" name="email" type="email" required />
        <FieldError errors={state.fieldErrors?.email} />
      </div>
      <div>
        <Label htmlFor="u-password">Password</Label>
        <Input id="u-password" name="password" type="password" required />
        <FieldError errors={state.fieldErrors?.password} />
      </div>
      <div>
        <Label htmlFor="u-role">Role</Label>
        <Select id="u-role" name="role" defaultValue="EDITOR">
          <option value="EDITOR">Editor</option>
          <option value="ADMIN">Admin</option>
        </Select>
      </div>
      {state.ok && <p className="text-sm text-teal">User created.</p>}
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Creating…" : "Create user"}
      </Button>
    </form>
  );
}
