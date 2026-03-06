'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Package, Loader2, AlertTriangle } from 'lucide-react';

interface StockModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: { id: string; name: string; stock: number } | null;
    mode: 'replenish' | 'adjust';
    onSuccess: (productId: string, newStock: number) => void;
}

export default function StockModal({ isOpen, onClose, product, mode, onSuccess }: StockModalProps) {
    const isReplenish = mode === 'replenish';
    const [quantity, setQuantity] = useState(isReplenish ? 1 : 0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset quantity when product or mode changes
    useEffect(() => {
        if (isOpen) {
            setQuantity(isReplenish ? 1 : 0);
            setError(null);
        }
    }, [isOpen, isReplenish]);

    if (!product) return null;

    const previewStock = product.stock + quantity;

    const handleSubmit = async () => {
        if (isReplenish && quantity <= 0) {
            setError('La cantidad debe ser mayor a 0');
            return;
        }

        if (previewStock < 0) {
            setError(`Stock insuficiente. Stock actual: ${product.stock}`);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`/api/products/${product.id}/stock`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    operation: mode,
                    quantity: quantity,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Error al actualizar stock');
            }

            const updated = await response.json();
            onSuccess(product.id, updated.stock);
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setQuantity(isReplenish ? 1 : 0);
        setError(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-6 sm:p-8"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-baloo font-bold text-xl text-brand-brown flex items-center gap-2">
                                {isReplenish ? '📦 Reposición' : <><span className="text-purple-400">⚙️</span> Ajuste de Stock</>}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-brand-cream rounded-full transition-colors text-brand-brown/40"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Product info */}
                        <div className="mb-6">
                            <p className="font-nunito text-brand-brown/70 leading-relaxed line-clamp-2">
                                {product.name}
                            </p>
                        </div>

                        {/* Current stock box */}
                        <div className="flex items-center justify-between bg-brand-cream/80 rounded-2xl p-4 mb-4">
                            <span className="font-nunito text-sm text-brand-brown/60">Stock actual</span>
                            <span className="font-baloo font-bold text-brand-brown text-2xl">{product.stock}</span>
                        </div>

                        {/* Adjustment Section */}
                        <div className="mb-6">
                            <label className="font-nunito text-sm text-brand-brown/60 block mb-3">
                                {isReplenish ? 'Cantidad a agregar' : 'Ajuste (+ agregar, - quitar)'}
                            </label>
                            <div className="flex items-center gap-2 sm:gap-4">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(prev => isReplenish ? Math.max(1, prev - 1) : prev - 1)}
                                    className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center bg-brand-cream rounded-2xl hover:bg-brand-cream-dark transition-colors border border-brand-cream-dark"
                                >
                                    <Minus size={20} className="text-brand-brown" />
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setQuantity(isReplenish ? Math.max(1, val) : val);
                                    }}
                                    className="flex-1 min-w-0 text-center h-10 sm:h-12 bg-brand-cream rounded-2xl border-0 font-baloo font-bold text-xl sm:text-2xl text-brand-brown focus:ring-2 focus:ring-brand-orange"
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center bg-brand-cream rounded-2xl hover:bg-brand-cream-dark transition-colors border border-brand-cream-dark"
                                >
                                    <Plus size={20} className="text-brand-brown" />
                                </button>
                            </div>
                        </div>

                        {/* New Stock Preview */}
                        <div className={`flex items-center justify-between rounded-2xl p-4 mb-6 transition-colors ${previewStock < 0 ? 'bg-red-50 text-red-600' : 'bg-pastel-green/20'
                            }`}>
                            <span className="font-nunito text-sm opacity-70">Nuevo stock</span>
                            <span className={`font-baloo font-bold text-2xl ${previewStock < 0 ? 'text-red-600' : 'text-green-700'
                                }`}>
                                {previewStock}
                            </span>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="mb-6 p-3 bg-red-50 rounded-xl flex items-center gap-2 text-red-500 text-sm font-nunito">
                                <AlertTriangle size={16} />
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleClose}
                                className="flex-1 py-4 bg-brand-cream text-brand-brown rounded-2xl font-nunito font-bold text-sm hover:bg-brand-cream-dark transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || previewStock < 0 || (isReplenish && quantity === 0)}
                                className="flex-1 py-4 bg-brand-orange text-white rounded-2xl font-nunito font-bold text-sm shadow-lg shadow-brand-orange/20 hover:shadow-brand-orange/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Package size={18} />
                                )}
                                Confirmar
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
