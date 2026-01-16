'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3X3, Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

const bottomNavItems = [
    { name: 'Inicio', href: '/', icon: Home },
    { name: 'Catalogo', href: '/catalogo', icon: Grid3X3 },
    { name: 'Favoritos', href: '/favoritos', icon: Heart },
    { name: 'Carrito', href: '/carrito', icon: ShoppingBag },
];

export default function BottomNavigation() {
    const pathname = usePathname();

    // Hide bottom nav on cart/checkout page for cleaner UX
    if (pathname === '/carrito') {
        return null;
    }

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-soft-lg border border-white/50 px-2 py-2">
                <div className="flex items-center justify-around">
                    {bottomNavItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href));
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center px-4 py-2"
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-indicator"
                                        className="absolute inset-0 bg-gradient-to-r from-pastel-purple/30 to-pastel-blue/30 rounded-2xl"
                                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                    />
                                )}
                                <Icon
                                    size={24}
                                    className={`relative z-10 transition-colors ${isActive
                                        ? 'text-pastel-purple'
                                        : 'text-brand-brown/50'
                                        }`}
                                    fill={isActive ? 'currentColor' : 'none'}
                                    strokeWidth={isActive ? 1.5 : 2}
                                />
                                <span className={`relative z-10 text-xs font-nunito mt-1 transition-colors ${isActive
                                    ? 'text-brand-brown font-medium'
                                    : 'text-brand-brown/50'
                                    }`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
