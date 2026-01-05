// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createProduct, getProducts } from '@/src/services/product';
import { withErrorHandler } from '../../lib/middleware/error-handler';
import { validateRequest } from '../../lib/middleware/validate';
import { createSuccessResponse } from '../../lib/api-response';
import { createProductSchema, productQuerySchema } from '../../lib/validation/product.schema';

// Manejar solicitudes GET y POST a /api/products
export const GET = withErrorHandler(
  validateRequest(productQuerySchema, async (req, data) => {
    const result = await getProducts(data);
    return NextResponse.json(createSuccessResponse(result));
  })
);

export const POST = withErrorHandler(
  validateRequest(createProductSchema, async (req, data) => {
    const product = await createProduct(data);
    return NextResponse.json(
      createSuccessResponse(product, 'Producto creado exitosamente'),
      { status: 201 }
    );
  })
);