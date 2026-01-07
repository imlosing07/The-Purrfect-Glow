// src/app/api/products/route.ts
// API de productos - GET con filtros, POST para crear

import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct, getAllTags } from '@/src/services/product';
import { ProductQueryDTO } from '@/src/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parsear parámetros de query
    const options: ProductQueryDTO = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
      search: searchParams.get('search') || undefined,
      tags: searchParams.get('tags')?.split(',').filter(Boolean) || undefined,
      available: searchParams.get('available') === 'true' ? true : 
                 searchParams.get('available') === 'false' ? false : undefined,
      featured: searchParams.get('featured') === 'true' ? true :
                searchParams.get('featured') === 'false' ? false : undefined,
      sortBy: (searchParams.get('sortBy') as 'price' | 'name' | 'createdAt') || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    };

    const result = await getProducts(options);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { error: 'Error fetching products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validación básica
    if (!body.name || !body.price || !body.images?.length) {
      return NextResponse.json(
        { error: 'Name, price, and at least one image are required' },
        { status: 400 }
      );
    }

    const product = await createProduct(body);
    
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      { error: 'Error creating product' },
      { status: 500 }
    );
  }
}