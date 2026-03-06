'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/src/app/lib/contexts/CartContext';
import UserAccount from './UserAccount';
import GlobalSearch from './GlobalSearch';
import { useState, useRef, useEffect } from 'react';

// Same navigation as bottom nav for consistency
const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Catalogo', href: '/catalogo' },
  { name: 'Favoritos', href: '/favoritos' }
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { items } = useCart();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const isAuthenticated = status === 'authenticated' && session?.user;
  const isAdmin = isAuthenticated && session?.user?.role === 'ADMIN';
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Close mobile search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowMobileSearch(false);
      }
    };
    if (showMobileSearch) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileSearch]);

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

            {/* Global Search Bar */}
            <GlobalSearch variant="desktop" />

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
                      <div
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
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-brand-cream/95 backdrop-blur-sm border-b border-brand-brown/5" ref={mobileSearchRef}>
        <div className="flex items-center justify-between px-3 relative">
          {/* Search Button - Left side */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="p-2 rounded-xl text-brand-brown hover:bg-brand-cream-dark/50 transition-colors"
          >
            <Search size={22} />
          </button>

          {/* Logo - Centered */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-16 h-16">
              <Image
                src="/PurrfectGlowGatoLogo.png"
                alt="The Purrfect Glow"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Spacer to keep logo centered */}
          <div className="w-10" />
        </div>

        {/* Mobile Search Dropdown */}
        {showMobileSearch && (
          <div className="px-3 pb-3 pt-1">
            <GlobalSearch variant="mobile" />
          </div>
        )}
      </header>
    </>
  );
}
