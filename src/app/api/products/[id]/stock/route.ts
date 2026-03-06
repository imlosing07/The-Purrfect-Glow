// src/app/api/products/[id]/stock/route.ts
// Stock management API - replenish and adjust operations

import { NextRequest, NextResponse } from 'next/server';
import { prismaClientGlobal } from '@/src/app/lib/prisma';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { operation, quantity } = body;

        // Validate operation
        if (!operation || !['replenish', 'adjust'].includes(operation)) {
            return NextResponse.json(
                { error: 'Operación inválida. Use "replenish" o "adjust"' },
                { status: 400 }
            );
        }

        // Validate quantity
        if (typeof quantity !== 'number' || !Number.isInteger(quantity)) {
            return NextResponse.json(
                { error: 'La cantidad debe ser un número entero' },
                { status: 400 }
            );
        }

        if (operation === 'replenish' && quantity <= 0) {
            return NextResponse.json(
                { error: 'La cantidad de reposición debe ser mayor a 0' },
                { status: 400 }
            );
        }

        // Get current stock to validate adjustment won't go negative
        const current = await prismaClientGlobal.product.findUnique({
            where: { id },
            select: { stock: true },
        });

        if (!current) {
            return NextResponse.json(
                { error: 'Producto no encontrado' },
                { status: 404 }
            );
        }

        const newStock = current.stock + quantity;
        if (newStock < 0) {
            return NextResponse.json(
                { error: `Stock insuficiente. Stock actual: ${current.stock}` },
                { status: 400 }
            );
        }

        // Update stock and auto-derive isAvailable
        const updated = await prismaClientGlobal.product.update({
            where: { id },
            data: {
                stock: newStock,
                isAvailable: newStock > 0,
            },
            select: {
                id: true,
                name: true,
                stock: true,
                isAvailable: true,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating stock:', error);
        return NextResponse.json(
            { error: 'Error al actualizar stock' },
            { status: 500 }
        );
    }
}
