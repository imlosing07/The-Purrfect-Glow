import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prismaClientGlobal } from '@/src/app/lib/prisma';
import { UserRole } from './src/types';

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
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          const userCount = await prismaClientGlobal.user.count();
          
          // Si es el primer usuario registrado, hacerlo ADMIN
          if (userCount === 1) {
            await prismaClientGlobal.user.update({
              where: { email: user.email },
              data: { role: UserRole.ADMIN }
            });
          }
        } catch (error) {
          console.error('Error assigning admin role:', error);
        }
      }
      return true;
    },
  },
});