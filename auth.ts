import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prismaClientGlobal } from '@/src/app/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prismaClientGlobal),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Cuando el usuario inicia sesión, obtener el rol de la base de datos
      if (user) {
        token.id = user.id ?? '';
        token.role = user.role;
      }

      // Si no tiene rol en el token, intentar obtenerlo de la DB
      if (!token.role && token.email) {
        const dbUser = await prismaClientGlobal.user.findUnique({
          where: { email: token.email },
          select: { role: true, id: true }
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
});