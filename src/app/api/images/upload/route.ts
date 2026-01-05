// src/app/api/images/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { uploadProductImage } from '@/src/services/images';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    
    // Only basic existence check
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }
    
    // Convert to buffer - let service validate everything else
    let buffer: Buffer;
    try {
      buffer = Buffer.from(await imageFile.arrayBuffer());
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to read file data' },
        { status: 400 }
      );
    }
    
    const folder = (formData.get('folder') as string) || 'products';
    const publicId = formData.get('publicId') as string || undefined;
    
    // Let service handle ALL validation
    const imageDetails = await uploadProductImage(buffer, {
      folder,
      publicId
    });
    
    return NextResponse.json({
      success: true,
      data: imageDetails
    });

  } catch (error: any) {
    console.error('Error uploading image:', error);
    
    // Map service errors to HTTP status codes
    const statusCode = getErrorStatusCode(error.message);
    
    return NextResponse.json(
      { error: error.message },
      { status: statusCode }
    );
  }
}

/**
 * Map service error messages to appropriate HTTP status codes
 * This is the ONLY place where we interpret service errors
 */
export function getErrorStatusCode(errorMessage: string): number {
  const message = errorMessage.toLowerCase();
  
  // Client errors (4xx)
  if (
    message.includes('dimensions too small') ||
    message.includes('invalid format') ||
    message.includes('file size too large') ||
    message.includes('validation failed') ||
    message.includes('invalid url') ||
    message.includes('invalid file type')
  ) {
    return 400; // Bad Request
  }
  
  if (message.includes('timeout')) {
    return 408; // Request Timeout
  }
  
  if (message.includes('missing required cloudinary')) {
    return 503; // Service Unavailable
  }
  
  // Default to server error
  return 500;
}