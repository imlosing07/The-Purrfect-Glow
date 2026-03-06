'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    Package, AlertTriangle, TrendingUp, ShoppingBag,
    ArrowRight, Loader2
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

interface TopSoldProduct {
    productId: string;
    name: string;
    image: string | null;
    price: number;
    totalSold: number;
}

interface MonthlySale {
    month: string;
    year: number;
    count: number;
    total: number;
}

interface DashboardStats {
    totalProducts: number;
    lowStockCount: number;
    lowStockProducts: { id: string; name: string; stock: number }[];
    topSold: TopSoldProduct[];
    monthlySales: MonthlySale[];
    currentMonthOrders: number;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/dashboard/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    // Find the max value for chart bar scaling
    const maxSalesTotal = useMemo(() => {
        if (!stats?.monthlySales?.length) return 1;
        return Math.max(...stats.monthlySales.map(s => s.total), 1);
    }, [stats?.monthlySales]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <p className="font-nunito text-brand-brown/60">Error al cargar estadísticas</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="font-baloo font-bold text-3xl text-brand-brown">
                    Dashboard 📊
                </h1>
                <p className="font-nunito text-brand-brown/70">
                    Resumen de tu negocio
                </p>
            </div>

            {/* ═══════════════════════════════════════════════════ */}
            {/* METRIC CARDS */}
            {/* ═══════════════════════════════════════════════════ */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Productos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-5 shadow-soft"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-pastel-blue rounded-2xl">
                            <Package size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-nunito text-brand-brown/60">Productos</p>
                            <p className="font-baloo font-bold text-2xl text-brand-brown leading-tight">
                                {stats.totalProducts}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Stock Bajo - Clickable */}
                <Link href="/dashboard/inventario?filter=low-stock">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className={`rounded-3xl p-5 shadow-soft cursor-pointer transition-all hover:shadow-soft-md ${stats.lowStockCount > 0
                                ? 'bg-gradient-to-br from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100'
                                : 'bg-white hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-2xl ${stats.lowStockCount > 0 ? 'bg-red-100' : 'bg-pastel-green'}`}>
                                <AlertTriangle size={20} className={stats.lowStockCount > 0 ? 'text-red-500' : 'text-green-600'} />
                            </div>
                            <div>
                                <p className="text-xs font-nunito text-brand-brown/60">Stock Bajo</p>
                                <p className={`font-baloo font-bold text-2xl leading-tight ${stats.lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {stats.lowStockCount}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs font-nunito text-brand-orange">
                            <span>Ver detalles</span>
                            <ArrowRight size={12} />
                        </div>
                    </motion.div>
                </Link>

                {/* Pedidos este mes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-5 shadow-soft"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-pastel-green rounded-2xl">
                            <ShoppingBag size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs font-nunito text-brand-brown/60">Pedidos (mes)</p>
                            <p className="font-baloo font-bold text-2xl text-brand-brown leading-tight">
                                {stats.currentMonthOrders}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Ventas este mes */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-white rounded-3xl p-5 shadow-soft"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-pastel-purple rounded-2xl">
                            <TrendingUp size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs font-nunito text-brand-brown/60">Ventas (mes)</p>
                            <p className="font-baloo font-bold text-2xl text-brand-brown leading-tight">
                                S/ {(stats.monthlySales[stats.monthlySales.length - 1]?.total || 0).toFixed(0)}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════ */}
            {/* TOP 5 + MONTHLY CHART (Side by Side on Desktop) */}
            {/* ═══════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top 5 Vendidos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-6 shadow-soft"
                >
                    <h2 className="font-baloo font-bold text-lg text-brand-brown mb-4 flex items-center gap-2">
                        🏆 Top 5 Vendidos
                        <span className="text-xs font-nunito font-normal text-brand-brown/50">(30 días)</span>
                    </h2>

                    {stats.topSold.length === 0 ? (
                        <div className="text-center py-8">
                            <span className="text-3xl mb-2 block">📭</span>
                            <p className="font-nunito text-sm text-brand-brown/50">Sin ventas en los últimos 30 días</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {stats.topSold.map((product, index) => (
                                <div
                                    key={product.productId}
                                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-brand-cream/50 transition-colors"
                                >
                                    {/* Rank */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-baloo font-bold text-sm flex-shrink-0 ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-gray-100 text-gray-600' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-brand-cream text-brand-brown/60'
                                        }`}>
                                        {index + 1}
                                    </div>

                                    {/* Product info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-nunito text-sm font-medium text-brand-brown truncate">
                                            {product.name}
                                        </p>
                                        <p className="font-nunito text-xs text-brand-brown/50">
                                            S/ {product.price.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Quantity sold */}
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-baloo font-bold text-brand-orange">
                                            {product.totalSold}
                                        </p>
                                        <p className="font-nunito text-xs text-brand-brown/50">vendidos</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Monthly Sales Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="bg-white rounded-3xl p-6 shadow-soft"
                >
                    <h2 className="font-baloo font-bold text-lg text-brand-brown mb-4 flex items-center gap-2">
                        📈 Ventas Mensuales
                        <span className="text-xs font-nunito font-normal text-brand-brown/50">(últimos 6 meses)</span>
                    </h2>

                    {stats.monthlySales.every(s => s.total === 0) ? (
                        <div className="text-center py-8">
                            <span className="text-3xl mb-2 block">📊</span>
                            <p className="font-nunito text-sm text-brand-brown/50">Sin datos de ventas aún</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Chart bars */}
                            <div className="flex items-end justify-between gap-2 h-40">
                                {stats.monthlySales.map((sale, index) => {
                                    const heightPercent = maxSalesTotal > 0 ? (sale.total / maxSalesTotal) * 100 : 0;
                                    const isCurrentMonth = index === stats.monthlySales.length - 1;

                                    return (
                                        <div key={`${sale.month}-${sale.year}`} className="flex-1 flex flex-col items-center gap-1">
                                            {/* Value */}
                                            <span className="font-nunito text-xs text-brand-brown/60 font-medium">
                                                {sale.total > 0 ? `S/${sale.total.toFixed(0)}` : '—'}
                                            </span>

                                            {/* Bar */}
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: `${Math.max(heightPercent, 4)}%` }}
                                                transition={{ delay: 0.3 + index * 0.05, duration: 0.5, ease: 'easeOut' }}
                                                className={`w-full rounded-t-xl min-h-[4px] ${isCurrentMonth
                                                        ? 'bg-gradient-to-t from-brand-orange to-pastel-orange'
                                                        : 'bg-gradient-to-t from-pastel-blue to-blue-200'
                                                    }`}
                                            />

                                            {/* Label */}
                                            <span className={`font-nunito text-xs ${isCurrentMonth ? 'text-brand-orange font-bold' : 'text-brand-brown/50'}`}>
                                                {sale.month}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Summary row */}
                            <div className="flex justify-between pt-3 border-t border-brand-cream">
                                <div>
                                    <p className="font-nunito text-xs text-brand-brown/50">Total pedidos (6 meses)</p>
                                    <p className="font-baloo font-bold text-brand-brown">
                                        {stats.monthlySales.reduce((sum, s) => sum + s.count, 0)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-nunito text-xs text-brand-brown/50">Total ventas</p>
                                    <p className="font-baloo font-bold text-brand-orange">
                                        S/ {stats.monthlySales.reduce((sum, s) => sum + s.total, 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
