// src/app/api/upload/route.ts
// API para subir imágenes a Cloudinary con transformaciones de marca

import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Transformaciones simples (sin background_removal para evitar timeouts)
// Las transformaciones pesadas se pueden aplicar en el frontend con la URL
const SIMPLE_TRANSFORMATIONS = [
  // Calidad y formato automático
  { quality: 'auto', fetch_format: 'auto' },
  // Tamaño estándar para productos
  { width: 1000, height: 1000, crop: 'pad', gravity: 'center', background: 'rgb:FFF6E6' },
];

// POST: Subir imagen desde archivo (form-data)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const productName = formData.get('productName') as string || 'producto';

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó archivo' },
        { status: 400 }
      );
    }

    // Convertir File a base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const cleanName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 30);
    const publicId = `products/${cleanName}-${timestamp}`;

    // Subir a Cloudinary con transformaciones simples
    const result = await cloudinary.uploader.upload(base64, {
      public_id: publicId,
      folder: 'thepurrfectglow',
      resource_type: 'image',
      transformation: SIMPLE_TRANSFORMATIONS,
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { error: 'Error al subir imagen' },
      { status: 500 }
    );
  }
}

// PUT: Subir imagen desde URL externa
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, productName = 'producto' } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No se proporcionó URL de imagen' },
        { status: 400 }
      );
    }

    // Generar nombre único
    const timestamp = Date.now();
    const cleanName = productName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 30);
    const publicId = `products/${cleanName}-${timestamp}`;

    // Subir desde URL con transformaciones simples
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      folder: 'thepurrfectglow',
      resource_type: 'image',
      transformation: SIMPLE_TRANSFORMATIONS,
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error('Error uploading URL to Cloudinary:', error);
    return NextResponse.json(
      { error: 'Error al procesar URL de imagen' },
      { status: 500 }
    );
  }
}
