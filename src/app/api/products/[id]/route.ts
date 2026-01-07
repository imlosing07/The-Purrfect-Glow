// src/app/api/products/[id]/route.ts
// API de producto individual - GET, PATCH, DELETE

import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct, toggleProductAvailability } from '@/src/services/product';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in GET /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Error fetching product' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Si solo se envía toggleAvailability, usar la función específica
    if (body.toggleAvailability === true) {
      const product = await toggleProductAvailability(id);
      return NextResponse.json(product);
    }
    
    const product = await updateProduct(id, body);
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error in PATCH /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Error updating product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deleteProduct(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/products/[id]:', error);
    return NextResponse.json(
      { error: 'Error deleting product' },
      { status: 500 }
    );
  }
}