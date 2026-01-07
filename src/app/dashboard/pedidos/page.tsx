'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderStatus } from '@/src/types';
import OrderCard from '../components/OrderCard';
import { OrderListSkeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';

export default function PedidosPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [stats, setStats] = useState({ PENDING: 0, SHIPPED: 0, DELIVERED: 0 });
    const { showToast } = useToast();

    // Fetch orders
    useEffect(() => {
        async function fetchOrders() {
            try {
                const [ordersRes, statsRes] = await Promise.all([
                    fetch('/api/orders?limit=50'),
                    fetch('/api/orders?countOnly=true'),
                ]);

                const ordersData = await ordersRes.json();
                const statsData = await statsRes.json();

                setOrders(ordersData.orders || []);
                setStats(statsData);
            } catch (error) {
                console.error('Error fetching orders:', error);
                showToast('Error al cargar pedidos', 'error');
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, [showToast]);

    // Update order status
    async function handleStatusChange(orderId: string, newStatus: OrderStatus) {
        setUpdatingId(orderId);

        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) throw new Error('Failed to update');

            const updatedOrder = await response.json();

            // Update local state
            setOrders(prev =>
                prev.map(o => o.id === orderId ? updatedOrder : o)
            );

            // Update stats
            const oldOrder = orders.find(o => o.id === orderId);
            if (oldOrder) {
                setStats(prev => ({
                    ...prev,
                    [oldOrder.status]: prev[oldOrder.status as keyof typeof prev] - 1,
                    [newStatus]: prev[newStatus as keyof typeof prev] + 1,
                }));
            }

            const statusMessages: Record<OrderStatus, string> = {
                [OrderStatus.PENDING]: '¡Pedido marcado como pendiente! ⏳',
                [OrderStatus.SHIPPED]: '¡Pedido enviado! 📦✨',
                [OrderStatus.DELIVERED]: '¡Pedido entregado! 🎉',
            };

            showToast(statusMessages[newStatus]);
        } catch (error) {
            console.error('Error updating order:', error);
            showToast('Error al actualizar estado', 'error');
        } finally {
            setUpdatingId(null);
        }
    }

    // Filter orders
    const filteredOrders = orders.filter(order =>
        statusFilter === 'ALL' || order.status === statusFilter
    );

    const statusTabs: { key: OrderStatus | 'ALL'; label: string; icon: string; color: string }[] = [
        { key: 'ALL', label: 'Todos', icon: '📋', color: 'bg-white' },
        { key: OrderStatus.PENDING, label: 'Pendientes', icon: '⏳', color: 'bg-status-pending' },
        { key: OrderStatus.SHIPPED, label: 'Enviados', icon: '📦', color: 'bg-status-shipped' },
        { key: OrderStatus.DELIVERED, label: 'Entregados', icon: '✅', color: 'bg-status-delivered' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-baloo font-bold text-3xl text-brand-brown mb-2">
                    Pedidos 🛍️
                </h1>
                <p className="font-nunito text-brand-brown/70">
                    Gestiona el estado de tus órdenes con un clic
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-status-pending rounded-3xl p-4 shadow-soft">
                    <div className="text-center">
                        <span className="text-2xl">⏳</span>
                        <p className="font-baloo font-bold text-2xl text-brand-brown mt-1">{stats.PENDING}</p>
                        <p className="text-xs font-nunito text-brand-brown/70">Pendientes</p>
                    </div>
                </div>

                <div className="bg-status-shipped rounded-3xl p-4 shadow-soft">
                    <div className="text-center">
                        <span className="text-2xl">📦</span>
                        <p className="font-baloo font-bold text-2xl text-blue-800 mt-1">{stats.SHIPPED}</p>
                        <p className="text-xs font-nunito text-blue-800/70">Enviados</p>
                    </div>
                </div>

                <div className="bg-status-delivered rounded-3xl p-4 shadow-soft">
                    <div className="text-center">
                        <span className="text-2xl">✅</span>
                        <p className="font-baloo font-bold text-2xl text-green-800 mt-1">{stats.DELIVERED}</p>
                        <p className="text-xs font-nunito text-green-800/70">Entregados</p>
                    </div>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {statusTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setStatusFilter(tab.key)}
                        className={`
              flex items-center gap-2 px-4 py-2 rounded-2xl font-nunito font-medium text-sm
              transition-all duration-200 flex-shrink-0
              ${statusFilter === tab.key
                                ? `${tab.color} shadow-soft ring-2 ring-brand-brown/10`
                                : 'bg-white text-brand-brown/60 hover:bg-brand-cream shadow-soft'
                            }
            `}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                        {tab.key !== 'ALL' && (
                            <span className="bg-white/50 px-1.5 py-0.5 rounded-full text-xs">
                                {stats[tab.key as keyof typeof stats]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {loading ? (
                <OrderListSkeleton count={4} />
            ) : (
                <AnimatePresence mode="popLayout">
                    <motion.div className="space-y-4">
                        {filteredOrders.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 bg-white rounded-3xl shadow-soft"
                            >
                                <span className="text-4xl mb-4 block">📭</span>
                                <p className="font-nunito text-brand-brown/60">
                                    {statusFilter === 'ALL'
                                        ? 'No hay pedidos aún'
                                        : `No hay pedidos ${statusTabs.find(t => t.key === statusFilter)?.label.toLowerCase()}`
                                    }
                                </p>
                            </motion.div>
                        ) : (
                            filteredOrders.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onStatusChange={handleStatusChange}
                                    isUpdating={updatingId === order.id}
                                />
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
