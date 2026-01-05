// src/app/api/images/process-url/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadProductImage } from '@/src/services/images';
import {getErrorStatusCode} from '@/src/app/api/images/upload/route'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, folder } = body;
    
    // Only basic input validation - let service handle the rest
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Valid image URL is required' },
        { status: 400 }
      );
    }
    
    // Let the service handle ALL validation logic
    const imageDetails = await uploadProductImage(url, {
      folder: folder || 'products'
    });
    
    return NextResponse.json({
      success: true,
      data: imageDetails
    });

  } catch (error: any) {
    console.error('Error processing image URL:', error);
    
    // Map service errors to appropriate HTTP status codes
    const statusCode = getErrorStatusCode(error.message);
    
    return NextResponse.json(
      { error: error.message },
      { status: statusCode }
    );
  }
}