'use client';

import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' });
    };

    return (
        <div className="min-h-screen bg-[#FFF6E6] flex items-center justify-center px-4 py-12">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    className="absolute top-20 left-10 opacity-20"
                >
                    <Image src="/Elementos/Vector-49.png" alt="" width={80} height={60} />
                </motion.div>
                <motion.div
                    animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-32 right-16 opacity-15"
                >
                    <Image src="/Elementos/Vector-50.png" alt="" width={60} height={45} />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-1/4 left-1/4 text-2xl text-pastel-purple"
                >
                    ✦
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.7 }}
                    className="absolute top-1/3 right-1/4 text-xl text-pastel-pink"
                >
                    ★
                </motion.div>
            </div>

            {/* Main Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative bg-white rounded-[40px] shadow-soft-lg p-8 md:p-10 max-w-md w-full"
            >
                {/* Cat Mascot */}
                <div className="flex justify-center -mt-20 mb-4">
                    <div className="relative">
                        <Image
                            src="/Elementos/Group 1697.png"
                            alt="Purrfect Glow Mascot"
                            width={100}
                            height={100}
                            className="drop-shadow-lg"
                        />
                        {/* Hearts decoration */}
                        <motion.div
                            animate={{ y: [0, -5, 0], scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute -top-2 -right-2 text-lg"
                        >
                            💕
                        </motion.div>
                    </div>
                </div>

                {/* Club Badge */}
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pastel-pink/30 to-pastel-purple/30 px-4 py-1.5 rounded-full mb-3">
                        <span className="text-sm">✨</span>
                        <span className="font-nunito text-sm font-medium text-brand-brown">
                            Club Purrfect Glow
                        </span>
                        <span className="text-sm">✨</span>
                    </div>

                    <h1 className="font-baloo font-bold text-2xl md:text-3xl text-brand-brown mb-2">
                        ¡Únete a la Familia!
                    </h1>
                    <p className="font-nunito text-brand-brown/70 text-sm leading-relaxed">
                        Accede a beneficios exclusivos, descuentos especiales y participa en retos para ganar premios increíbles 🎁
                    </p>
                </div>

                {/* Benefits Preview */}
                <div className="bg-brand-cream/50 rounded-2xl p-4 mb-6 space-y-2">
                    <p className="font-nunito font-semibold text-brand-brown text-xs uppercase tracking-wide">
                        Beneficios del Club
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5">
                            <span>🏷️</span>
                            <span className="font-nunito text-brand-brown/80">Descuentos exclusivos</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span>🚚</span>
                            <span className="font-nunito text-brand-brown/80">Envíos gratis</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span>🎮</span>
                            <span className="font-nunito text-brand-brown/80">Retos y premios</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span>💎</span>
                            <span className="font-nunito text-brand-brown/80">Puntos Purrfect</span>
                        </div>
                    </div>
                    <p className="text-xs text-brand-brown/50 font-nunito italic pt-1">
                        ¡Próximamente más sorpresas! 🐱
                    </p>
                </div>

                {/* Sign In Options */}
                <div className="space-y-3">
                    {/* Google - Primary */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-brand-cream-dark py-3.5 px-4 rounded-2xl font-nunito font-semibold text-brand-brown hover:bg-brand-cream/50 hover:border-brand-orange/30 transition-all shadow-sm"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continuar con Google
                    </button>

                    {/* Future providers - Disabled for now */}
                    <div className="space-y-2 opacity-50">
                        <button
                            disabled
                            className="w-full flex items-center justify-center gap-3 bg-gray-100 py-3 px-4 rounded-2xl font-nunito text-sm text-gray-400 cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Facebook (Próximamente)
                        </button>
                        <button
                            disabled
                            className="w-full flex items-center justify-center gap-3 bg-gray-100 py-3 px-4 rounded-2xl font-nunito text-sm text-gray-400 cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                            </svg>
                            Instagram (Próximamente)
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-brand-cream-dark" />
                    <span className="font-nunito text-xs text-brand-brown/50">o</span>
                    <div className="flex-1 h-px bg-brand-cream-dark" />
                </div>

                {/* Continue as Guest */}
                <Link
                    href="/"
                    className="block w-full text-center py-3 font-nunito text-brand-brown/70 hover:text-brand-orange transition-colors text-sm"
                >
                    Continuar como invitado →
                </Link>

                {/* Privacy note */}
                <p className="text-center text-xs text-brand-brown/40 font-nunito mt-4">
                    Al iniciar sesión, aceptas nuestros términos de servicio y política de privacidad.
                </p>
            </motion.div>
        </div>
    );
}
