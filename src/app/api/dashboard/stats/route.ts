// src/app/api/dashboard/stats/route.ts
// Dashboard metrics API - optimized with single DB round-trip where possible

import { NextResponse } from 'next/server';
import { prismaClientGlobal } from '@/src/app/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1); // Start of 6 months ago

        // Execute all queries in parallel for performance
        const [
            totalProducts,
            lowStockProducts,
            topSoldRaw,
            monthlySalesRaw,
            currentMonthOrders,
        ] = await Promise.all([
            // 1. Total products count
            prismaClientGlobal.product.count(),

            // 2. Low stock products (stock < 5)
            prismaClientGlobal.product.findMany({
                where: { stock: { lt: 5 } },
                select: { id: true, name: true, stock: true },
                orderBy: { stock: 'asc' },
            }),

            // 3. Top 5 sold in last 30 days (orders with status PAID or SHIPPED)
            prismaClientGlobal.orderItem.groupBy({
                by: ['productId'],
                where: {
                    order: {
                        status: { in: ['PAID', 'SHIPPED'] },
                        createdAt: { gte: thirtyDaysAgo },
                    },
                },
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: 'desc' } },
                take: 5,
            }),

            // 4. Monthly sales (last 6 months) - get raw orders and aggregate in JS
            prismaClientGlobal.order.findMany({
                where: {
                    status: { in: ['PAID', 'SHIPPED'] },
                    createdAt: { gte: sixMonthsAgo },
                },
                select: {
                    createdAt: true,
                    totalAmount: true,
                },
            }),

            // 5. Current month orders count
            prismaClientGlobal.order.count({
                where: {
                    createdAt: {
                        gte: new Date(now.getFullYear(), now.getMonth(), 1),
                    },
                },
            }),
        ]);

        // Resolve product names for top sold
        const topSoldProductIds = topSoldRaw.map((item) => item.productId);
        const topProducts = topSoldProductIds.length > 0
            ? await prismaClientGlobal.product.findMany({
                where: { id: { in: topSoldProductIds } },
                select: { id: true, name: true, price: true, images: true },
            })
            : [];

        const productMap = new Map(topProducts.map((p) => [p.id, p]));
        const topSold = topSoldRaw.map((item) => {
            const product = productMap.get(item.productId);
            return {
                productId: item.productId,
                name: product?.name || 'Producto eliminado',
                image: product?.images?.[0] || null,
                price: product?.price || 0,
                totalSold: item._sum.quantity || 0,
            };
        });

        // Aggregate monthly sales in JS (avoids raw SQL for Prisma compatibility)
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const monthlySalesMap = new Map<string, { count: number; total: number }>();

        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            monthlySalesMap.set(key, { count: 0, total: 0 });
        }

        for (const order of monthlySalesRaw) {
            const d = new Date(order.createdAt);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            const existing = monthlySalesMap.get(key);
            if (existing) {
                existing.count += 1;
                existing.total += order.totalAmount;
            }
        }

        const monthlySales = Array.from(monthlySalesMap.entries()).map(([key, data]) => {
            const [year, month] = key.split('-').map(Number);
            return {
                month: monthNames[month],
                year,
                count: data.count,
                total: Math.round(data.total * 100) / 100,
            };
        });

        return NextResponse.json({
            totalProducts,
            lowStockCount: lowStockProducts.length,
            lowStockProducts,
            topSold,
            monthlySales,
            currentMonthOrders,
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { error: 'Error al obtener estadísticas' },
            { status: 500 }
        );
    }
}
