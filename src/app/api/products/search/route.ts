// src/app/api/products/search/route.ts
// Endpoint optimizado para búsqueda de productos (global search)

import { NextResponse } from 'next/server';
import { prismaClientGlobal } from '@/src/app/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.length < 3) {
        return NextResponse.json({ products: [] });
    }

    try {
        const products = await prismaClientGlobal.product.findMany({
            where: {
                isAvailable: true,
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { summary: { contains: query, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                name: true,
                price: true,
                images: true,
                summary: true,
            },
            take: 8,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ products: [] }, { status: 500 });
    }
}
