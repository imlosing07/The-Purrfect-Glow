'use client';

import { useEffect } from 'react';
import Image from 'next/image';

// Real social media posts from the user
const instagramPosts = [
    'https://www.instagram.com/reel/DSJeN3sDG4L/',
    'https://www.instagram.com/reel/DQ7fCBLEhe3/',
    'https://www.instagram.com/p/DOwitXcjYYV/',
];

const tiktokPosts = [
    'https://www.tiktok.com/@thepurrfectglow/video/7571565945316019463',
    'https://www.tiktok.com/@thepurrfectglow/photo/7552620369723641095',
];

// Extract TikTok video ID from URL
function getTikTokVideoId(url: string): string {
    const match = url.match(/\/(video|photo)\/(\d+)/);
    return match ? match[2] : '';
}

export default function SocialMediaSection() {
    // Load Instagram embed script
    useEffect(() => {
        // Instagram
        if (typeof window !== 'undefined' && !(window as any).instgrm) {
            const script = document.createElement('script');
            script.src = 'https://www.instagram.com/embed.js';
            script.async = true;
            document.body.appendChild(script);
        } else if ((window as any).instgrm) {
            (window as any).instgrm.Embeds.process();
        }
    }, []);

    return (
        <section className="py-4 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pastel-purple/10 to-transparent pointer-events-none" />

            {/* Decorative elements */}
            <div className="absolute top-10 left-5 opacity-15 pointer-events-none hidden md:block">
                <Image src="/Elementos/Vector-49.png" alt="" width={60} height={60} />
            </div>
            <div className="absolute bottom-10 right-5 opacity-15 pointer-events-none hidden md:block">
                <Image src="/Elementos/Vector-50.png" alt="" width={60} height={60} />
            </div>

            {/* Section Header */}
            <div className="text-center mb-10">
                <h2 className="font-baloo font-bold text-2xl md:text-3xl text-brand-brown mb-2">
                    Síguenos en Redes Sociales
                </h2>
                <p className="font-nunito text-brand-brown/70">
                    Únete a nuestra comunidad gatuna ✨🐱
                </p>
            </div>

            {/* Instagram Section */}
            <div className="mb-12">
                <div className="flex items-center justify-center gap-3 mb-6">
                    <a
                        href="https://instagram.com/thepurrfectglow"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white rounded-full font-nunito font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Síguenos en Instagram @thepurrfectglow
                    </a>
                </div>

                {/* Instagram Embeds Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {instagramPosts.map((url, index) => (
                        <div
                            key={index}
                            className="flex justify-center bg-white rounded-2xl shadow-soft overflow-hidden min-h-[400px]"
                        >
                            <blockquote
                                className="instagram-media"
                                data-instgrm-captioned
                                data-instgrm-permalink={url}
                                data-instgrm-version="14"
                                style={{
                                    background: '#FFF',
                                    border: '0',
                                    borderRadius: '16px',
                                    margin: '0',
                                    maxWidth: '100%',
                                    minWidth: '280px',
                                    padding: '0',
                                    width: '100%',
                                }}
                            >
                                <div className="flex items-center justify-center p-8 text-brand-brown/40">
                                    <div className="animate-pulse">Cargando...</div>
                                </div>
                            </blockquote>
                        </div>
                    ))}
                </div>
            </div>

            {/* TikTok Section */}
            <div>
                <div className="flex items-center justify-center gap-3 mb-6">
                    <a
                        href="https://tiktok.com/@thepurrfectglow"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full font-nunito font-semibold text-sm hover:bg-gray-800 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                        </svg>
                        Síguenos en TikTok @thepurrfectglow
                    </a>
                </div>

                {/* TikTok Embeds Grid - Using iframes */}
                <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                    {tiktokPosts.map((url, index) => {
                        const videoId = getTikTokVideoId(url);
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-soft overflow-hidden"
                            >
                                <iframe
                                    src={`https://www.tiktok.com/embed/v2/${videoId}`}
                                    style={{
                                        width: '325px',
                                        height: '575px',
                                        border: 'none',
                                    }}
                                    allow="encrypted-media"
                                    allowFullScreen
                                    title={`TikTok video ${index + 1}`}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-10">
                <p className="font-nunito text-brand-brown/60 text-sm">
                    ¡Comparte tu rutina con nosotros etiquetando a <span className="font-semibold text-brand-orange">@ThePurrfectGlow</span>! 🐾
                </p>
            </div>
        </section>
    );
}
