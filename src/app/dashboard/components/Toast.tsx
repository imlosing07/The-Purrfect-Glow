'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ToastData {
    id: string;
    message: string;
    type?: 'success' | 'error' | 'info';
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.8 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl shadow-soft-lg min-w-[280px]
                ${toast.type === 'error' ? 'bg-red-50 border border-red-200' :
                                    toast.type === 'info' ? 'bg-pastel-blue border border-pastel-blue' :
                                        'bg-white border border-pastel-green'}
              `}
                        >
                            {/* Cat Icon */}
                            <div className="relative w-10 h-10 flex-shrink-0">
                                <Image
                                    src="/PurrfectGlowGatoIcon.png"
                                    alt="Gato"
                                    fill
                                    className="object-contain animate-bounce-soft"
                                />
                            </div>

                            {/* Message */}
                            <p className="flex-1 font-nunito text-sm text-brand-brown">
                                {toast.message}
                            </p>

                            {/* Close button */}
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="p-1 rounded-full hover:bg-brand-cream transition-colors"
                            >
                                <X size={16} className="text-brand-brown/50" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
