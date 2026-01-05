// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { deleteProduct, getProductById, updateProduct } from '@/src/services/product';
import { createSuccessResponse } from '@/src/app/lib/api-response';
import { withParamsHandler } from '@/src/app/lib/middleware/error-handler-extended';
import { updateProductSchema } from '@/src/app/lib/validation/product.schema';

// Usamos el nuevo middleware que acepta params
export const GET = withParamsHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(createSuccessResponse(product));
  }
);

export const PUT = withParamsHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const data = await req.json();
    const { id } = await params;
    try {
      // Validación manual (idealmente esto se haría con un middleware)
      const validData = updateProductSchema.parse(data);
      const product = await updateProduct(id, validData);

      return NextResponse.json(
        createSuccessResponse(product, 'Producto actualizado exitosamente')
      );
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { success: false, message: 'Datos de entrada inválidos', errors: error.errors },
          { status: 400 }
        );
      }
      console.error('Error updating product since route update:', error);
      throw error; // Re-lanzar otros errores para que el middleware los maneje
    }
  }
);

export const DELETE = withParamsHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json(
      createSuccessResponse(null, `Producto ${id} eliminado exitosamente`)
    );
  }
);