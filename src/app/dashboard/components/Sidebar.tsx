'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    ShoppingBag,
    Menu,
    X,
    Instagram,
    ExternalLink,
    Plus
} from 'lucide-react';

const navItems = [
    {
        name: 'Inventario',
        href: '/dashboard/inventario',
        icon: Package,
        description: 'Gestiona tus productos'
    },
    {
        name: 'Pedidos',
        href: '/dashboard/pedidos',
        icon: ShoppingBag,
        description: 'Revisa las órdenes'
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-2xl shadow-soft-md text-brand-brown hover:bg-brand-cream transition-colors"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Desktop: always visible, Mobile: slide in/out */}
            <aside
                className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-72 bg-white shadow-soft-lg
          flex flex-col
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
            >
                {/* Logo & Brand */}
                <div className="p-6 border-b border-brand-cream">
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-brand-cream p-1">
                            <Image
                                src="/PurrfectGlowGatoIcon.png"
                                alt="The Purrfect Glow"
                                fill
                                className="object-contain group-hover:scale-110 transition-transform"
                            />
                        </div>
                        <div>
                            <h1 className="font-baloo font-bold text-lg text-brand-brown leading-tight">
                                The Purrfect Glow
                            </h1>
                            <p className="text-xs text-brand-brown/60 font-nunito">
                                Panel de Admin
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-2xl
                  transition-all duration-200 group
                  ${isActive
                                        ? 'bg-brand-orange text-white shadow-soft'
                                        : 'text-brand-brown hover:bg-brand-cream'
                                    }
                `}
                            >
                                <Icon
                                    size={22}
                                    className={`${isActive ? 'text-white' : 'text-brand-brown/70 group-hover:text-brand-brown'}`}
                                />
                                <div className="flex-1">
                                    <span className="font-nunito font-semibold text-sm block">
                                        {item.name}
                                    </span>
                                    <span className={`text-xs ${isActive ? 'text-white/80' : 'text-brand-brown/50'}`}>
                                        {item.description}
                                    </span>
                                </div>
                                {isActive && (
                                    <div className="w-1.5 h-8 bg-white/40 rounded-full" />
                                )}
                            </Link>
                        );
                    })}

                    {/* Add Product Button */}
                    <Link
                        href="/dashboard/inventario/nuevo"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-brand-orange/30 text-brand-orange hover:bg-brand-orange/10 transition-all mt-4"
                    >
                        <Plus size={22} />
                        <span className="font-nunito font-semibold text-sm">Agregar Producto</span>
                    </Link>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-brand-cream">
                    <a
                        href="https://instagram.com/thepurrfectglow"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-brand-brown/70 hover:bg-pastel-pink/30 hover:text-brand-brown transition-all group"
                    >
                        <Instagram size={20} />
                        <span className="font-nunito text-sm flex-1">@thepurrfectglow</span>
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>

                    <div className="mt-4 px-4 py-3 bg-brand-cream rounded-2xl">
                        <p className="text-xs text-brand-brown/60 font-nunito text-center">
                            Hecho con 💕 para Solicorn
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}
