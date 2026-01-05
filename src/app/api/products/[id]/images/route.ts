// src/app/api/products/[id]/images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addProductImage } from '@/src/services/product';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {

  const { id } = await params;

  try {
    const body = await request.json();
    const { originalUrl, standardUrl, publicId } = body;

    // Validación básica
    if (!originalUrl || !standardUrl || !publicId) {
      return NextResponse.json(
        { error: 'Missing required image data (originalUrl, standardUrl, publicId)' },
        { status: 400 }
      );
    }

    // Agregar imagen al producto usando el servicio
    const newImage = await addProductImage(id, {
      originalUrl,
      standardUrl,
      publicId
    });

    return NextResponse.json({
      success: true,
      data: newImage
    });

  } catch (error: any) {
    console.error('Error adding product image:', error);
    
    // Manejar errores específicos
    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to add product image' },
      { status: 500 }
    );
  }
}