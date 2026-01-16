'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, User, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';

interface UserAccountProps {
    isAuthenticated: boolean;
    isAdmin: boolean;
    userName?: string | null;
    userEmail?: string | null;
    userImage?: string | null;
    variant: 'desktop' | 'mobile';
}

export default function UserAccount({
    isAuthenticated,
    isAdmin,
    userName,
    userEmail,
    userImage,
    variant
}: UserAccountProps) {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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

    // Mobile Version
    if (variant === 'mobile') {
        if (!isAuthenticated) {
            return (
                <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange/10 rounded-full"
                >
                    <User size={18} className="text-brand-orange" />
                    <span className="font-nunito text-xs font-medium text-brand-orange">
                        Unirme
                    </span>
                </Link>
            );
        }

        // Mobile authenticated - with dropdown
        return (
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 rounded-xl"
                >
                    {userImage ? (
                        <Image
                            src={userImage}
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
                </button>

                {/* Mobile Dropdown Menu */}
                <AnimatePresence>
                    {showUserMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-soft-lg border border-brand-cream-dark overflow-hidden z-50"
                        >
                            <div className="p-2">
                                {isAdmin ? (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setShowUserMenu(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pastel-pink/20 transition-colors"
                                    >
                                        <LayoutDashboard size={18} className="text-pastel-purple" />
                                        <span className="font-nunito text-sm text-brand-brown">Dashboard</span>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/favoritos"
                                        onClick={() => setShowUserMenu(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pastel-pink/20 transition-colors"
                                    >
                                        <Heart size={18} className="text-pastel-purple" />
                                        <span className="font-nunito text-sm text-brand-brown">Mis Favoritos</span>
                                    </Link>
                                )}

                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left"
                                >
                                    <LogOut size={18} className="text-red-400" />
                                    <span className="font-nunito text-sm text-brand-brown">Cerrar sesión</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Desktop Version
    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-brand-cream-dark/50 transition-colors"
            >
                {isAuthenticated ? (
                    <>
                        {userImage ? (
                            <Image
                                src={userImage}
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
                            {userName?.split(' ')[0] || 'Mi cuenta'}
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

            {/* Desktop Dropdown Menu */}
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
                                        {userName}
                                    </p>
                                    <p className="font-nunito text-xs text-brand-brown/60 truncate">
                                        {userEmail}
                                    </p>
                                </div>

                                <div className="p-2">
                                    {isAdmin ? (
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pastel-pink/20 transition-colors"
                                        >
                                            <LayoutDashboard size={18} className="text-pastel-purple" />
                                            <span className="font-nunito text-sm text-brand-brown">Dashboard</span>
                                        </Link>
                                    ) : (
                                        <Link
                                            href="/favoritos"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pastel-pink/20 transition-colors"
                                        >
                                            <Heart size={18} className="text-pastel-purple" />
                                            <span className="font-nunito text-sm text-brand-brown">Mis Favoritos</span>
                                        </Link>
                                    )}

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
    );
}
