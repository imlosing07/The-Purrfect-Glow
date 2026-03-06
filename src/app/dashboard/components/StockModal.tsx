'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Package, Loader2 } from 'lucide-react';

interface StockModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: { id: string; name: string; stock: number } | null;
    mode: 'replenish' | 'adjust';
    onSuccess: (productId: string, newStock: number) => void;
}

export default function StockModal({ isOpen, onClose, product, mode, onSuccess }: StockModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!product) return null;

    const isReplenish = mode === 'replenish';
    const effectiveQuantity = isReplenish ? quantity : quantity; // In adjust mode, quantity can represent + or -
    const previewStock = product.stock + effectiveQuantity;

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
                    quantity: effectiveQuantity,
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
        setQuantity(1);
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
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-baloo font-bold text-lg text-brand-brown">
                                {isReplenish ? '📦 Reposición' : '⚙️ Ajuste de Stock'}
                            </h3>
                            <button
                                onClick={handleClose}
                                className="p-1.5 hover:bg-brand-cream rounded-full transition-colors"
                            >
                                <X size={18} className="text-brand-brown/50" />
                            </button>
                        </div>

                        {/* Product name */}
                        <p className="font-nunito text-sm text-brand-brown/70 mb-4 line-clamp-2">
                            {product.name}
                        </p>

                        {/* Current stock */}
                        <div className="flex items-center justify-between bg-brand-cream rounded-2xl p-3 mb-4">
                            <span className="font-nunito text-sm text-brand-brown/60">Stock actual</span>
                            <span className="font-baloo font-bold text-brand-brown text-lg">{product.stock}</span>
                        </div>

                        {/* Quantity input */}
                        <div className="mb-4">
                            <label className="font-nunito text-sm text-brand-brown/60 block mb-2">
                                {isReplenish ? 'Cantidad a agregar' : 'Ajuste (+ agregar, - quitar)'}
                            </label>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(prev => isReplenish ? Math.max(1, prev - 1) : prev - 1)}
                                    className="p-2.5 bg-brand-cream rounded-xl hover:bg-brand-cream-dark transition-colors"
                                >
                                    <Minus size={18} className="text-brand-brown" />
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        setQuantity(isReplenish ? Math.max(1, val) : val);
                                    }}
                                    className="flex-1 text-center px-4 py-3 bg-brand-cream rounded-xl border-0 font-baloo font-bold text-xl text-brand-brown focus:ring-2 focus:ring-brand-orange"
                                />
                                <button
                                    type="button"
                                    onClick={() => setQuantity(prev => prev + 1)}
                                    className="p-2.5 bg-brand-cream rounded-xl hover:bg-brand-cream-dark transition-colors"
                                >
                                    <Plus size={18} className="text-brand-brown" />
                                </button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className={`flex items-center justify-between rounded-2xl p-3 mb-4 ${previewStock <= 0 ? 'bg-red-50' : 'bg-pastel-green/30'
                            }`}>
                            <span className="font-nunito text-sm text-brand-brown/60">Nuevo stock</span>
                            <span className={`font-baloo font-bold text-lg ${previewStock <= 0 ? 'text-red-600' : 'text-green-700'
                                }`}>
                                {previewStock}
                            </span>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-500 text-sm font-nunito mb-4 bg-red-50 rounded-xl p-3">
                                ⚠️ {error}
                            </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                className="flex-1 py-3 bg-brand-cream text-brand-brown rounded-2xl font-nunito font-semibold text-sm hover:bg-brand-cream-dark transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || previewStock < 0}
                                className="flex-1 py-3 bg-brand-orange text-white rounded-2xl font-nunito font-semibold text-sm hover:bg-brand-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Package size={16} />
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
