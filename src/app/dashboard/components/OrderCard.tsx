'use client';

import { motion } from 'framer-motion';
import { Order, OrderStatus } from '@/src/types';
import { StatusSelector } from './StatusBadge';
import { User, Phone, MapPin, Package, Calendar } from 'lucide-react';

interface OrderCardProps {
    order: Order;
    onStatusChange: (orderId: string, status: OrderStatus) => void;
    isUpdating?: boolean;
}

export default function OrderCard({ order, onStatusChange, isUpdating = false }: OrderCardProps) {
    const formattedDate = new Date(order.createdAt).toLocaleDateString('es-PE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-soft-md transition-shadow"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-baloo font-bold text-brand-brown">
                            Pedido #{order.id.slice(0, 8)}
                        </span>
                        {order.whatsappLink && (
                            <a
                                href={order.whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-pastel-green text-green-800 px-2 py-0.5 rounded-full font-nunito hover:bg-green-200 transition-colors"
                            >
                                Ver en WhatsApp 💬
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-brand-brown/60 font-nunito">
                        <Calendar size={12} />
                        {formattedDate}
                    </div>
                </div>

                {/* Status Selector */}
                <StatusSelector
                    currentStatus={order.status}
                    onStatusChange={(status) => onStatusChange(order.id, status)}
                    disabled={isUpdating}
                />
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-4 bg-brand-cream rounded-2xl">
                <div className="flex items-center gap-2">
                    <User size={16} className="text-brand-brown/50" />
                    <div>
                        <p className="text-xs text-brand-brown/60 font-nunito">Cliente</p>
                        <p className="font-nunito font-semibold text-brand-brown text-sm">{order.fullName}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm">🪪</span>
                    <div>
                        <p className="text-xs text-brand-brown/60 font-nunito">DNI</p>
                        <p className="font-nunito font-semibold text-brand-brown text-sm">{order.dni}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Phone size={16} className="text-brand-brown/50" />
                    <div>
                        <p className="text-xs text-brand-brown/60 font-nunito">Teléfono</p>
                        <p className="font-nunito font-semibold text-brand-brown text-sm">{order.phone}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-brand-brown/50" />
                    <div>
                        <p className="text-xs text-brand-brown/60 font-nunito">Zona</p>
                        <p className="font-nunito font-semibold text-brand-brown text-sm">
                            {order.province}, {order.department}
                        </p>
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="mb-4 p-3 bg-pastel-blue/30 rounded-2xl">
                <p className="text-xs text-brand-brown/60 font-nunito mb-1">📍 Dirección de envío:</p>
                <p className="font-nunito text-sm text-brand-brown">{order.address}</p>
            </div>

            {/* Products */}
            <div className="border-t border-brand-cream pt-4">
                <div className="flex items-center gap-2 mb-3">
                    <Package size={16} className="text-brand-brown/50" />
                    <span className="font-nunito font-semibold text-sm text-brand-brown">
                        Productos ({order.items.length})
                    </span>
                </div>

                <div className="space-y-2">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm font-nunito">
                            <span className="text-brand-brown/80">
                                {item.product?.name || 'Producto'} x{item.quantity}
                            </span>
                            <span className="font-semibold text-brand-brown">
                                S/ {(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-brand-cream space-y-2">
                <div className="flex justify-between text-sm font-nunito">
                    <span className="text-brand-brown/60">Subtotal</span>
                    <span className="text-brand-brown">S/ {order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-nunito">
                    <span className="text-brand-brown/60">Envío (Olva)</span>
                    <span className="text-brand-brown">S/ {order.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-baloo font-bold text-lg">
                    <span className="text-brand-brown">Total</span>
                    <span className="text-brand-orange">S/ {order.totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </motion.div>
    );
}
