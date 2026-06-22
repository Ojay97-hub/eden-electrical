import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no database / bcrypt imports) so it can run in
 * middleware. The Credentials provider is added in src/auth.ts.
 */
export const authConfig = {
  // `/admin` self-guards: it renders the login form when signed out (see
  // src/app/admin/page.tsx), so there's no separate public login URL to find.
  pages: { signIn: "/admin" },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
} satisfies NextAuthConfig;
