// app/api/brands/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBrandById, updateBrand, deleteBrand } from '@/src/services/brand'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; 
    const brand = await getBrandById(id);

    return NextResponse.json(brand, { status: 200 });
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// Cambiado de PUT a PATCH para coincidir con el cliente API
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params; 
    const brandData = await request.json();
    const updatedBrand = await updateBrand(id, brandData);

    return NextResponse.json(updatedBrand, { status: 200 });
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    if (error.message.includes('already exists')) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params; 
    await deleteBrand(id);

    return NextResponse.json({ message: 'Brand deleted successfully' }, { status: 200 });
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return NextResponse.json({ message: error.message }, { status: 404 });
    }
    if (error.message.includes('associated products')) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}