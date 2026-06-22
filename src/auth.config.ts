import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

/**
 * Edge-safe Auth.js config (NO Prisma / bcrypt imports) — shared by the
 * middleware and the full server config. The Credentials provider with the
 * Node-only `authorize` lookup is added in `src/lib/auth.ts`.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/studio/login" },
  providers: [],
  callbacks: {
    // Route protection — runs in middleware. /studio/* requires a session,
    // except the login page.
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;
      const isStudio = path.startsWith("/studio");
      const isLoginPage = path === "/studio/login";
      if (isStudio && !isLoginPage) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: Role }).role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as Role | undefined;
        if (typeof token.id === "string") session.user.id = token.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
