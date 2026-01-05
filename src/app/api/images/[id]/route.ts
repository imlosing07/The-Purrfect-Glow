// app/api/images/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSuccessResponse } from '@/src/app/lib/api-response';
import { withParamsHandler } from '@/src/app/lib/middleware/error-handler-extended';
import { getImagebyId, del } from '@/src/services/images';

// Usamos el nuevo middleware que acepta params
export const GET = withParamsHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    const imageDetails = await getImagebyId(params.id);

    if (!imageDetails) {
      return NextResponse.json(
        { success: false, message: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(createSuccessResponse(imageDetails));
  }
);

export const DELETE = withParamsHandler(
  async (req: NextRequest, { params }: { params: { id: string } }) => {
    await del(params.id);
    return NextResponse.json(
      createSuccessResponse(null, `Imagen ${params.id} eliminado exitosamente`)
    );
  }
);