import { auth } from '@/auth';
import '@/src/app/ui/global.css';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Poppins } from 'next/font/google';
import { WishlistProvider } from '@/src/app/lib/contexts/WishlistContext';
import { CartProvider } from '@/src/app/lib/contexts/CartContext';

export const metadata: Metadata = {
  title: {
    template: '%s | SneakerShooes',
    default: 'SneakerShooes',
  },
  description: 'Zapatillas zapatos de la mejor calidad y precio, entrega rápida y segura',
  // metadataBase: new URL('https://mywebsite.com'),
};

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "500", "700"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="es">
      <body className={poppins.className}>
        <SessionProvider session={session}>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
