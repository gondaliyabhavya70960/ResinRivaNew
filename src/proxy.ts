import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Next.js 16 "proxy" convention (formerly "middleware"). Edge runtime — uses the
// Prisma-free config only. The `authorized` callback gates /studio/* and
// redirects to /studio/login when signed out.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/studio", "/studio/:path*"],
};
