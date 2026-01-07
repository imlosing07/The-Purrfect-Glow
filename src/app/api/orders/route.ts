// src/app/api/orders/route.ts
// API de órdenes - POST para crear, GET para listar

import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders, getOrdersCountByStatus } from '@/src/services/order';
import { OrderStatus } from '@/src/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validación básica
    const requiredFields = ['dni', 'fullName', 'phone', 'address', 'department', 'province', 'shippingZone', 'items'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    if (!body.items?.length) {
      return NextResponse.json(
        { error: 'Order must have at least one item' },
        { status: 400 }
      );
    }

    const result = await createOrder(body);
    
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    const message = error instanceof Error ? error.message : 'Error creating order';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as OrderStatus | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const countOnly = searchParams.get('countOnly') === 'true';
    
    // Si solo se quiere el conteo por estado (para dashboard)
    if (countOnly) {
      const counts = await getOrdersCountByStatus();
      return NextResponse.json(counts);
    }
    
    const result = await getOrders({
      status: status || undefined,
      page,
      limit
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    return NextResponse.json(
      { error: 'Error fetching orders' },
      { status: 500 }
    );
  }
}
