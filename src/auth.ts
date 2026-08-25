import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { verify } from "argon2";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/auth/validation";
import type { AppRole } from "@/lib/auth/roles";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
        if (!user?.passwordHash || !(await verify(user.passwordHash, parsed.data.password))) {
          return null;
        }

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = user.role as AppRole;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId && token.role) {
        session.user.id = String(token.userId);
        session.user.role = token.role as AppRole;
      }
      return session;
    },
  },
});
