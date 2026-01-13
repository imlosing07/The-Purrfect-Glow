'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Card data with alternating rotations for collage effect
const skinTypeCards = [
    {
        id: 'st-1',
        name: 'Piel Grasa',
        slug: 'piel-grasa',
        bgColor: '#D8F3DC',
        rotation: -3,
    },
    {
        id: 'st-2',
        name: 'Piel Seca',
        slug: 'piel-seca',
        bgColor: '#FFE4D0',
        rotation: 2,
    },
    {
        id: 'st-3',
        name: 'Piel Mixta',
        slug: 'piel-mixta',
        bgColor: '#E0F4FF',
        rotation: -1,
    },
    {
        id: 'st-4',
        name: 'Piel Sensible',
        slug: 'piel-sensible',
        bgColor: '#FFF0F5',
        rotation: 3,
    },
    {
        id: 'st-5',
        name: 'Piel Acnéica',
        slug: 'piel-acneica',
        bgColor: '#E8F5E9',
        rotation: -2,
    },
    {
        id: 'st-6',
        name: 'Todo Tipo de Piel',
        slug: 'todo-tipo-piel',
        bgColor: '#FFF8E1',
        rotation: 2,
    },
];

interface SkinTypeCardProps {
    card: typeof skinTypeCards[0];
    isActive: boolean;
    onClick: () => void;
    index: number;
    size?: 'desktop' | 'mobile';
}

function SkinTypeCard({ card, isActive, onClick, index, size = 'desktop' }: SkinTypeCardProps) {
    const isDesktop = size === 'desktop';
    const cardWidth = isDesktop ? 120 : 95;
    const cardHeight = isDesktop ? 140 : 115;

    return (
        <motion.div
            className="relative cursor-pointer"
            style={{
                zIndex: isActive ? 25 : 10 + index,
            }}
            whileHover={{
                scale: 1.08,
                rotate: card.rotation * 0.3,
                zIndex: 30,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            initial={{ opacity: 0, y: 20, rotate: card.rotation }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: card.rotation,
            }}
            transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 200,
                damping: 20,
            }}
        >
            {/* Mascot - Above card */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        layoutId={isDesktop ? "mascot-desktop" : "mascot-mobile"}
                        className="absolute pointer-events-none left-1/2"
                        style={{
                            top: isDesktop ? '-55px' : '-45px',
                            transform: 'translateX(-50%)',
                            zIndex: 50,
                        }}
                        initial={{ y: 20, opacity: 0, scale: 0.7 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: -10, opacity: 0, scale: 0.7 }}
                        transition={{
                            type: "spring",
                            stiffness: 280,
                            damping: 25
                        }}
                    >
                        <Image
                            src="/PurrfectGlowGatoIcon.png"
                            alt="Purrfect Glow Mascot"
                            width={isDesktop ? 80 : 55}
                            height={isDesktop ? 80 : 55}
                            className="drop-shadow-lg"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Card Container - Polaroid Style */}
            <div
                className="relative bg-white rounded-xl overflow-hidden"
                style={{
                    width: cardWidth,
                    height: cardHeight,
                    boxShadow: isActive
                        ? '0 10px 30px rgba(193, 128, 70, 0.28), 0 4px 10px rgba(0,0,0,0.1)'
                        : '0 6px 18px rgba(193, 128, 70, 0.16), 0 2px 6px rgba(0,0,0,0.06)',
                    border: '3px solid white',
                }}
            >
                {/* Image Area */}
                <div
                    className="w-full flex items-center justify-center"
                    style={{
                        backgroundColor: card.bgColor,
                        height: '68%',
                    }}
                >
                    <span className={isDesktop ? "text-3xl" : "text-2xl"} style={{ color: '#FFD797' }}>✦</span>
                </div>

                {/* Title Area */}
                <div
                    className="w-full flex items-center justify-center px-1 bg-white"
                    style={{ height: '32%' }}
                >
                    <span
                        className="font-baloo font-bold text-center leading-tight"
                        style={{
                            color: '#C18046',
                            fontSize: isDesktop ? '0.7rem' : '0.6rem',
                        }}
                    >
                        {card.name}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

// Floating sparkle component
function FloatingSparkle({
    className,
    delay = 0,
    size = 'text-2xl',
    color = '#EFB9EC',
}: {
    className: string;
    delay?: number;
    size?: string;
    color?: string;
}) {
    return (
        <motion.div
            className={`absolute pointer-events-none ${className}`}
            animate={{
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
            }}
            transition={{
                duration: 2,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            <span className={size} style={{ color }}>✦</span>
        </motion.div>
    );
}

export default function HeroInteractive() {
    const router = useRouter();
    const [activeCardId, setActiveCardId] = useState('st-3');
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleCardClick = useCallback((cardId: string, slug: string) => {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            // Navigate to catalog with skin type filter
            router.push(`/catalogo?skin=${slug}`);
        } else {
            clickTimeoutRef.current = setTimeout(() => {
                setActiveCardId(cardId);
                clickTimeoutRef.current = null;
            }, 250);
        }
    }, [router]);

    return (
        <section className="relative w-full overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/fondo.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* ═══════════════════════════════════════════════════════════════
          DESKTOP LAYOUT
          ═══════════════════════════════════════════════════════════════ */}
            <div className="hidden lg:block relative z-10">
                <div className="max-w-7xl mx-auto px-8 min-h-[520px]">
                    <div className="flex items-center justify-between h-full py-4">

                        {/* Left Side - Card Grid (2 columns x 3 rows) */}
                        <div className="w-[45%] flex justify-center">
                            <div className="grid grid-cols-2 gap-4 p-4">
                                {skinTypeCards.map((card, index) => (
                                    <SkinTypeCard
                                        key={card.id}
                                        card={card}
                                        isActive={activeCardId === card.id}
                                        onClick={() => handleCardClick(card.id, card.slug)}
                                        index={index}
                                        size="desktop"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right Side - Text Content with frosted glass container */}
                        <div className="w-[48%] flex justify-center">
                            <motion.div
                                className="backdrop-blur-md px-10 py-10 space-y-6"
                                style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                    borderRadius: '40px',
                                    border: '1px solid rgba(193, 128, 70, 0.2)',
                                }}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                <h1 className="font-baloo font-bold leading-tight">
                                    <span
                                        className="block text-4xl xl:text-5xl "
                                        style={{ color: '#C18046' }}
                                    >
                                        Descubre tu
                                    </span>
                                    <span
                                        className="block text-5xl xl:text-6xl mt-2 italic"
                                        style={{ color: '#C18046' }}
                                    >
                                        Purrfect Glow
                                    </span>
                                </h1>

                                {/* Video + Botón Container - Desktop */}
                                <div className="flex items-center gap-4">
                                    <video
                                        src="/Kawaii_Cat_Skincare_Routine_GIF.mp4"
                                        width={150}
                                        height={150}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="rounded-2xl"
                                    >
                                        Tu navegador no soporta videos.
                                    </video>

                                    <motion.button
                                        className="inline-flex items-center gap-2 px-8 py-3 font-nunito font-bold text-lg text-white rounded-full"
                                        style={{
                                            backgroundColor: '#FFB559',
                                            boxShadow: '0 8px 24px rgba(255, 181, 89, 0.4)',
                                        }}
                                        animate={{
                                            y: [0, -6, 0],
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        whileHover={{
                                            scale: 1.05,
                                            boxShadow: '0 12px 32px rgba(255, 181, 89, 0.5)',
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => router.push('/catalogo')}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="9" cy="21" r="1" />
                                            <circle cx="20" cy="21" r="1" />
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                        </svg>
                                        Comprar Ahora
                                    </motion.button>
                                </div>

                                <div className="flex flex-col items-center gap-1">
                                    <p
                                        className="font-nunito text-sm"
                                        style={{ color: 'rgba(193, 128, 70, 0.6)' }}
                                    >
                                        ✨ Clic para seleccionar tu tipo de piel
                                    </p>
                                    <p
                                        className="font-nunito text-sm"
                                        style={{ color: 'rgba(193, 128, 70, 0.6)' }}
                                    >
                                        • Doble clic para ver productos
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
          MOBILE LAYOUT
          ═══════════════════════════════════════════════════════════════ */}
            <div className="block lg:hidden relative z-10">
                {/* Cards Grid Section (3 columns x 2 rows on mobile) */}
                <div className="relative px-4 pt-12 pb-4">
                    <div className="flex justify-center">
                        <div className="grid grid-cols-3 gap-2">
                            {skinTypeCards.map((card, index) => (
                                <SkinTypeCard
                                    key={card.id}
                                    card={card}
                                    isActive={activeCardId === card.id}
                                    onClick={() => handleCardClick(card.id, card.slug)}
                                    index={index}
                                    size="mobile"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-1 pt-6">
                        <p
                            className="font-nunito text-sm"
                            style={{ color: 'rgba(193, 128, 70, 0.6)' }}
                        >
                            ✨ Clic para seleccionar tu tipo de piel
                        </p>
                        <p
                            className="font-nunito text-sm"
                            style={{ color: 'rgba(193, 128, 70, 0.6)' }}
                        >
                            • Doble clic para ver productos
                        </p>
                    </div>
                </div>

                {/* Text Section with frosted glass container */}
                <div className="relative px-4 py-6">
                    <div
                        className="backdrop-blur-md px-6 py-8 text-center mx-auto max-w-sm"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.4)',
                            borderRadius: '32px',
                            border: '1px solid rgba(193, 128, 70, 0.2)',
                        }}
                    >
                        <h1
                            className="font-baloo font-bold leading-tight"
                            style={{ color: '#C18046' }}
                        >
                            <span className="block text-2xl ">Descubre tu</span>
                            <span className="block text-3xl mt-1 italic">Purrfect Glow</span>
                        </h1>

                        {/* Video Container - Mobile */}
                        <div className="flex justify-center py-2">
                            <video
                                src="/Kawaii_Cat_Skincare_Routine_GIF.mp4"
                                width={120}
                                height={120}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="rounded-2xl"
                            >
                                Tu navegador no soporta videos.
                            </video>
                        </div>

                        <motion.button
                            className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 font-nunito font-bold text-base text-white rounded-full"
                            style={{
                                backgroundColor: '#FFB559',
                                boxShadow: '0 6px 20px rgba(255, 181, 89, 0.4)',
                            }}
                            animate={{
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/catalogo')}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            Comprar Ahora
                        </motion.button>
                    </div>
                </div>
            </div>
        </section>
    );
}
