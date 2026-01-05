// src/lib/middleware/error-handler.ts
import { NextRequest, NextResponse } from 'next/server';

export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function withErrorHandler(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: any) {
      console.error('API Error:', error);
      
      // Errores específicos que lanzamos intencionalmente
      if (error instanceof ApiError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.statusCode }
        );
      }
      
      // Errores de Prisma
      if (error.code === 'P2002') {
        return NextResponse.json(
          { success: false, message: 'Un registro con esos datos ya existe' },
          { status: 409 }
        );
      }
      
      if (error.code === 'P2025') {
        return NextResponse.json(
          { success: false, message: 'Recurso no encontrado' },
          { status: 404 }
        );
      }
      
      // Error genérico
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}