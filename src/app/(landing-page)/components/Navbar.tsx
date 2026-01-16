'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useCart } from '@/src/app/lib/contexts/CartContext';
import UserAccount from './UserAccount';

// Same navigation as bottom nav for consistency
const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Catalogo', href: '/catalogo' }
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { items } = useCart();

  const isAuthenticated = status === 'authenticated' && session?.user;
  const isAdmin = isAuthenticated && session?.user?.role === 'ADMIN';
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          DESKTOP NAVBAR
          ═══════════════════════════════════════════════════════════════ */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-brand-cream/95 backdrop-blur-sm border-b border-brand-brown/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-20 h-20">
                <Image
                  src="/PurrfectGlowGatoLogo.png"
                  alt="The Purrfect Glow"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform"
                />
              </div>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8 hidden lg:block">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Busca tu producto de skincare favorito..."
                  className="w-full bg-brand-cream-dark/30 border-2 border-transparent rounded-2xl py-2.5 pl-5 pr-12 text-brand-brown placeholder:text-brand-brown/50 focus:bg-white focus:border-brand-orange/30 focus:outline-none transition-all duration-300 text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-brown/60 hover:text-brand-orange transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Nav Links + Icons */}
            <div className="flex items-center gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href ||
                  (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      font-baloo text-lg transition-colors relative
                      ${isActive
                        ? 'text-brand-orange'
                        : 'text-brand-brown hover:text-brand-orange'
                      }
                    `}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-brand-orange rounded-full"
                      />
                    )}
                  </Link>
                );
              })}

              {/* Cart */}
              <Link
                href="/carrito"
                className={`p-2 rounded-xl transition-colors relative ${pathname === '/carrito'
                  ? 'bg-pastel-blue/30 text-blue-600'
                  : 'text-brand-brown hover:bg-pastel-blue/30 hover:text-blue-600'
                  }`}
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange text-white text-xs rounded-full flex items-center justify-center font-nunito font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              {/* User Account Dropdown */}
              <UserAccount
                isAuthenticated={!!isAuthenticated}
                isAdmin={!!isAdmin}
                userName={session?.user?.name}
                userEmail={session?.user?.email}
                userImage={session?.user?.image}
                variant="desktop"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE TOP BAR
          ═══════════════════════════════════════════════════════════════ */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-brand-cream/95 backdrop-blur-sm border-b border-brand-brown/5">
        <div className="flex items-center justify-center relative">
          {/* Logo - Centered */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-20 h-20">
              <Image
                src="/PurrfectGlowGatoLogo.png"
                alt="The Purrfect Glow"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* User Profile Icon - Right side */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <UserAccount
              isAuthenticated={!!isAuthenticated}
              isAdmin={!!isAdmin}
              userName={session?.user?.name}
              userEmail={session?.user?.email}
              userImage={session?.user?.image}
              variant="mobile"
            />
          </div>
        </div>
      </header>
    </>
  );
}
