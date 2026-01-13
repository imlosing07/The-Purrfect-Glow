'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Heart, User, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/src/app/lib/contexts/CartContext';

// Same navigation as bottom nav for consistency
const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Catalogo', href: '/catalogo' }
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { items } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = status === 'authenticated' && session?.user;
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

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
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-brand-cream-dark/50 transition-colors"
                >
                  {isAuthenticated ? (
                    <>
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-7 h-7 bg-pastel-purple rounded-full flex items-center justify-center">
                          <User size={16} className="text-brand-brown" />
                        </div>
                      )}
                      <span className="font-nunito text-sm text-brand-brown max-w-[100px] truncate">
                        {session.user?.name?.split(' ')[0] || 'Mi cuenta'}
                      </span>
                      <ChevronDown size={16} className={`text-brand-brown/60 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </>
                  ) : (
                    <>
                      <div className="w-7 h-7 bg-brand-cream-dark rounded-full flex items-center justify-center">
                        <User size={16} className="text-brand-brown/60" />
                      </div>
                      <span className="font-nunito text-sm text-brand-brown/70">
                        Invitado
                      </span>
                      <ChevronDown size={16} className={`text-brand-brown/60 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-brand-cream-dark overflow-hidden z-50"
                    >
                      {isAuthenticated ? (
                        <>
                          {/* User info header */}
                          <div className="px-4 py-3 bg-brand-cream/30 border-b border-brand-cream-dark">
                            <p className="font-nunito font-semibold text-brand-brown text-sm truncate">
                              {session.user?.name}
                            </p>
                            <p className="font-nunito text-xs text-brand-brown/60 truncate">
                              {session.user?.email}
                            </p>
                          </div>

                          <div className="p-2">
                            <Link
                              href="/favoritos"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pastel-pink/20 transition-colors"
                            >
                              <Heart size={18} className="text-pastel-purple" />
                              <span className="font-nunito text-sm text-brand-brown">Mis Favoritos</span>
                            </Link>

                            <button
                              onClick={handleSignOut}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left"
                            >
                              <LogOut size={18} className="text-red-400" />
                              <span className="font-nunito text-sm text-brand-brown">Cerrar sesión</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="p-4 text-center">
                          <div className="mb-3">
                            <span className="text-3xl">🐱</span>
                          </div>
                          <p className="font-nunito text-sm text-brand-brown/70 mb-3">
                            Únete al Club Purrfect Glow y obtén beneficios exclusivos
                          </p>
                          <Link
                            href="/login"
                            onClick={() => setShowUserMenu(false)}
                            className="block w-full py-2.5 rounded-xl font-nunito font-semibold text-white text-sm transition-colors"
                            style={{ backgroundColor: '#FFB559' }}
                          >
                            Iniciar sesión
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
            {isAuthenticated ? (
              <Link
                href="/favoritos"
                className="p-2 rounded-xl"
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-brand-orange/30"
                  />
                ) : (
                  <div className="w-8 h-8 bg-pastel-purple rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange/10 rounded-full"
              >
                <User size={18} className="text-brand-orange" />
                <span className="font-nunito text-xs font-medium text-brand-orange">
                  Unirme
                </span>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}