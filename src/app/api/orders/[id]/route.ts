// src/app/api/orders/[id]/route.ts
// API de orden individual - GET, PATCH para actualizar estado

import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus } from '@/src/services/order';
import { OrderStatus } from '@/src/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error in GET /api/orders/[id]:', error);
    return NextResponse.json(
      { error: 'Error fetching order' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validar que el status sea válido
    const validStatuses: OrderStatus[] = [OrderStatus.PENDING, OrderStatus.SHIPPED, OrderStatus.DELIVERED];
    
    if (!body.status || !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: PENDING, SHIPPED, DELIVERED' },
        { status: 400 }
      );
    }
    
    const order = await updateOrderStatus(id, body.status);
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error in PATCH /api/orders/[id]:', error);
    return NextResponse.json(
      { error: 'Error updating order' },
      { status: 500 }
    );
  }
}
