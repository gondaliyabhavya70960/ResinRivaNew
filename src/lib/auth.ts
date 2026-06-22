import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

/**
 * Full Auth.js v5 setup (Node runtime). Owner-only Credentials login backed by
 * the seeded admin user. Used by the route handler and server-side `auth()`.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.hashedPassword) return null;

        const valid = await bcrypt.compare(password, user.hashedPassword);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
});
