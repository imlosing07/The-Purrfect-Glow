'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';

interface GlowSummaryProps {
    subtotal: number;
    shippingCost: number;
    estimatedDays?: string;
    isFormValid: boolean;
    isLoading?: boolean;
    onSubmit: () => void;
}

export default function GlowSummary({
    subtotal,
    shippingCost,
    estimatedDays,
    isFormValid,
    isLoading = false,
    onSubmit,
}: GlowSummaryProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const total = subtotal + shippingCost;

    return (
        <>
            {/* Desktop Version - Sticky Sidebar */}
            <div className="hidden lg:block">
                <div className="bg-white rounded-[40px] p-6 lg:p-8 sticky top-24 border border-brand-yellow/40 shadow-soft-lg">
                    <h2 className="font-baloo text-2xl text-brand-brown mb-6 text-center">
                        ✨ Resumen de Compra
                    </h2>

                    <div className="space-y-4 mb-6">
                        {/* Subtotal */}
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Subtotal:</span>
                            <span className="font-medium text-gray-900">S/ {subtotal.toFixed(2)}</span>
                        </div>

                        {/* Shipping */}
                        <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-gray-700">Costo de Envío Olva</span>
                                <span className="text-xs text-gray-500">(Estimado)</span>
                            </div>
                            <span className="font-medium text-gray-900">
                                S/ {shippingCost.toFixed(2)}
                            </span>
                        </div>

                        {estimatedDays && (
                            <div className="text-xs text-gray-500 text-right">
                                ⏱️ Tiempo estimado: {estimatedDays}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-brand-brown/10 my-4" />

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                        <span className="font-baloo text-xl text-brand-brown">Total Final:</span>
                        <span className="font-baloo text-2xl text-brand-brown">
                            S/ {total.toFixed(2)}
                        </span>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onSubmit}
                        disabled={!isFormValid || isLoading}
                        className={`w-full py-4 rounded-2xl font-baloo text-lg flex items-center justify-center gap-3 transition-all
                            ${isFormValid && !isLoading
                                ? 'bg-brand-orange text-white hover:bg-brand-orange/90 shadow-soft-md hover:shadow-glow'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                <Image
                                    src="/cat-paw.png"
                                    alt="Paw"
                                    width={24}
                                    height={24}
                                    className="w-6 h-6"
                                />
                                Confirmar Pedido vía WhatsApp
                            </>
                        )}
                    </button>

                    {/* Help text */}
                    <p className="text-xs text-center text-gray-600 mt-4">
                        Coordinaremos el pago y envío por WhatsApp.
                        <br />
                        Tiempos de entrega varían.
                    </p>
                </div>
            </div>

            {/* Mobile Version - Fixed bottom bar (nav is hidden on cart page) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
                {/* Expanded Content */}
                <div
                    className={`bg-white transition-all duration-300 overflow-hidden
                        ${isExpanded ? 'max-h-96 rounded-t-[30px] shadow-2xl border-x border-t border-brand-yellow/40' : 'max-h-0'}`}
                >
                    <div className="p-6 pt-4">
                        <h2 className="font-baloo text-xl text-brand-brown mb-4 text-center">
                            ✨ Resumen de Compra
                        </h2>

                        <div className="space-y-3 mb-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700">Subtotal:</span>
                                <span className="font-medium text-gray-900">S/ {subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-gray-700">Envío:</span>
                                    <span className="text-xs text-gray-500 ml-1">(aprox.)</span>
                                </div>
                                <span className="font-medium text-gray-900">S/ {shippingCost.toFixed(2)}</span>
                            </div>

                            {estimatedDays && (
                                <div className="text-xs text-gray-500 text-right">
                                    ⏱️ {estimatedDays}
                                </div>
                            )}
                        </div>

                        <div className="border-t-2 border-brand-brown/10 my-3" />

                        <div className="flex justify-between items-center">
                            <span className="font-baloo text-lg text-brand-brown">Total:</span>
                            <span className="font-baloo text-xl text-brand-brown">
                                S/ {total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Collapsed Bar */}
                <div
                    className="bg-white px-4 py-3 flex items-center justify-between rounded-t-[20px] shadow-[0_-4px_20px_rgba(0,0,0,0.1)] cursor-pointer border-t border-x border-brand-yellow/40"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-3">
                        <button
                            className="p-1 hover:bg-white/20 rounded-full transition"
                            aria-label={isExpanded ? 'Contraer resumen' : 'Expandir resumen'}
                        >
                            {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-brand-brown" />
                            ) : (
                                <ChevronUp className="w-5 h-5 text-brand-brown" />
                            )}
                        </button>
                        <div>
                            <p className="text-xs text-gray-600">Total:</p>
                            <p className="font-baloo text-lg text-brand-brown">
                                S/ {total.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSubmit();
                        }}
                        disabled={!isFormValid || isLoading}
                        className={`px-4 py-2.5 rounded-xl font-baloo text-sm flex items-center gap-2 transition-all
                            ${isFormValid && !isLoading
                                ? 'bg-brand-orange text-white hover:bg-brand-orange/90 shadow-soft'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Image
                                src="/cat-paw.png"
                                alt="Paw"
                                width={20}
                                height={20}
                                className="w-5 h-5"
                            />
                        )}
                        Enviar Pedido al WhatsApp
                    </button>
                </div>
            </div>

            {/* Mobile spacer to prevent content from being hidden behind sticky bar */}
            {/* <div className="lg:hidden h-28" /> */}
        </>
    );
}
