// src/lib/middleware/validate.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export function validateRequest<T>(
  schema: z.Schema<T>,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      // Para solicitudes GET, validamos los parámetros de consulta
      if (req.method === 'GET') {
        const url = new URL(req.url);
        const queryParams: Record<string, string> = {};
        
        url.searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });
        
        const data = schema.parse(queryParams);
        return handler(req, data);
      }
      
      // Para otros métodos, validamos el cuerpo JSON
      const body = await req.json().catch(() => ({}));
      const data = schema.parse(body);
      console.log('Validated data:', data);
      return handler(req, data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Validation error', 
            errors: error.errors.map(err => ({
              path: err.path.join('.'),
              message: err.message
            }))
          },
          { status: 400 }
        );
      }
      
      console.error('Validation error:', error);
      return NextResponse.json(
        { success: false, message: 'Invalid request data' },
        { status: 400 }
      );
    }
  };
}