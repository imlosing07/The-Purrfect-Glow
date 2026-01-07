import { auth } from '@/auth';
import '@/src/app/ui/global.css';
import { Metadata } from 'next';
import { SessionProvider } from 'next-auth/react';
import { Baloo_2, Nunito } from 'next/font/google';
import { WishlistProvider } from '@/src/app/lib/contexts/WishlistContext';
import { CartProvider } from '@/src/app/lib/contexts/CartContext';

export const metadata: Metadata = {
  title: {
    template: '%s | The Purrfect Glow',
    default: 'The Purrfect Glow',
  },
  description: 'Skincare coreano de alta calidad. Descubre productos K-Beauty para todo tipo de piel 🌸',
};

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-baloo',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-nunito',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="es" className={`${baloo.variable} ${nunito.variable}`}>
      <body className="font-nunito bg-brand-cream text-brand-brown antialiased">
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
