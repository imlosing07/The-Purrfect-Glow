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
      // REMOVIDO: authorization config que causa conflicto
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
  },
});