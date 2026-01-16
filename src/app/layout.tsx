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
  description: 'Descubre cuidado de la piel coreano de alta calidad y cuida cualquier tipo de piel con productos K-Beauty populares y efectivos.',
  icons: {
    icon: '/PurrfectGlowGatoIcon.png',
    apple: '/PurrfectGlowGatoIcon.png',
  },
  openGraph: {
    title: 'Descubre The Purrfect Glow: Cuidado Coreano de Calidad',
    description: 'Descubre cuidado de la piel coreano de alta calidad y cuida cualquier tipo de piel con productos K-Beauty populares y efectivos.',
    type: 'website',
    locale: 'es_PE',
    siteName: 'The Purrfect Glow',
    url: 'https://the-purrfect-glow.vercel.app/',
    images: [
      {
        url: 'https://ogcdn.net/ff2341cb-cbbb-4b55-ab5d-d141aa8706fb/v3/https%3A%2F%2Fopengraph.b-cdn.net%2Fproduction%2Fimages%2Fe6562a9a-ebe8-4364-b9f6-f86f0700ff58.png%3Ftoken%3DrCS22OoHEQ-MQmmpwav8F5S0j4AjCFRhfh3it95ZGZU%26height%3D1489%26width%3D1200%26expires%3D33304592541/cover/rgba(255%2C%20246%2C%20230%2C%201)/og.png',
        width: 1200,
        height: 630,
        alt: 'The Purrfect Glow - Cuidado Coreano de Calidad',
      },
    ],
  },
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
