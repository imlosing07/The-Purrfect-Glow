'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51959619405';
const INSTAGRAM_URL = 'https://instagram.com/thepurrfectglow';

// WhatsApp icon SVG
const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

// Instagram icon SVG
const InstagramIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
);

export default function FloatingSocialButtons() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showBubble, setShowBubble] = useState(true);

    const whatsappLink = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent('¡Hola! 🌸 Me gustaría hacer una consulta sobre sus productos de skincare.')}`;

    return (
        <div className="fixed bottom-20 lg:bottom-6 right-4 z-40 flex flex-col items-end gap-3">
            {/* Expanded buttons */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        {/* Instagram Button */}
                        <motion.a
                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.8 }}
                            transition={{ delay: 0.1 }}
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 group flex-row-reverse"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow group-hover:scale-110 transform duration-200">
                                <InstagramIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="hidden lg:block bg-white px-3 py-1.5 rounded-full shadow-md text-sm font-nunito text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                Síguenos en Instagram
                            </span>
                        </motion.a>

                        {/* WhatsApp Button */}
                        <motion.a
                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.8 }}
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 group flex-row-reverse"
                        >
                            <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow group-hover:scale-110 transform duration-200">
                                <WhatsAppIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="hidden lg:block bg-white px-3 py-1.5 rounded-full shadow-md text-sm font-nunito text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                Escríbenos por WhatsApp
                            </span>
                        </motion.a>
                    </>
                )}
            </AnimatePresence>

            {/* Main toggle button */}
            <div className="relative">
                {/* Speech bubble - only show when not expanded and showBubble is true */}
                <AnimatePresence>
                    {!isExpanded && showBubble && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute right-16 bottom-1 whitespace-nowrap"
                        >
                            <div className="relative bg-white rounded-2xl px-4 py-2 shadow-lg border border-brand-cream-dark">
                                <p className="text-sm font-nunito text-brand-brown">
                                    ¿Tienes dudas? 🐱✨
                                </p>
                                {/* Triangle pointer - right side */}
                                <div className="absolute -right-2 bottom-3 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-white" />
                            </div>
                            {/* Close bubble button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBubble(false);
                                }}
                                className="absolute -top-2 -left-2 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                            >
                                <X size={12} className="text-gray-600" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toggle button */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isExpanded
                        ? 'bg-gray-600 rotate-45'
                        : 'bg-gradient-to-br from-[#25D366] to-[#128C7E]'
                        }`}
                >
                    {isExpanded ? (
                        <X size={24} className="text-white" />
                    ) : (
                        <WhatsAppIcon className="w-7 h-7 text-white" />
                    )}
                </motion.button>
            </div>
        </div>
    );
}
