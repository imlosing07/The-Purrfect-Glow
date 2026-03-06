// src/app/api/user/orders/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prismaClientGlobal } from '@/src/app/lib/prisma';

export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    try {
        const orders = await prismaClientGlobal.order.findMany({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                images: true,
                                price: true,
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ error: 'Error al obtener pedidos' }, { status: 500 });
    }
}
