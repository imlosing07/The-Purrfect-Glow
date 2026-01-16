import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === 'ADMIN';

      // Proteger rutas del dashboard - solo admins
      if (pathname.startsWith('/dashboard')) {
        if (!isLoggedIn) {
          return false; // Redirige a login automáticamente
        }
        if (!isAdmin) {
          return Response.redirect(new URL('/', request.url));
        }
        return true;
      }

      return true;
    }
  },
  session: {
    strategy: 'jwt'
  },
  providers: [],
};