// Import Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import axios from 'axios';
import sizeOf from 'image-size';
import { prismaClientGlobal } from '../app/lib/prisma';

// Enhanced types for image variants
export interface ImageDetails {
  originalUrl: string; // High quality image (2000px)
  standardUrl: string; // Standard image using t_standard template
  publicId: string; // To facilitate later deletion
  dimensions: { // Added actual dimensions
    width: number;
    height: number;
  };
}

// Options for product image uploads
export interface ProductImageUploadOptions {
  folder?: string;
  publicId?: string;
  overwrite?: boolean;
  tags?: string[]; // Added tags for better organization
}

// Image validation requirements
const IMAGE_REQUIREMENTS = {
  MIN_WIDTH: 1000,
  MIN_HEIGHT: 1000,
  TARGET_WIDTH: 2000,
  TARGET_HEIGHT: 2000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB limit
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'webp']
} as const;

// Ensure Cloudinary is correctly configured
const configureCloudinary = () => {
  if (!cloudinary.config().cloud_name) {
    const config = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true
    };

    // Validate required environment variables
    if (!config.cloud_name || !config.api_key || !config.api_secret) {
      throw new Error('Missing required Cloudinary environment variables');
    }

    cloudinary.config(config);
  }
};

/**
 * Validate and sanitize upload options
 */
function validateUploadOptions(options: ProductImageUploadOptions): Required<Omit<ProductImageUploadOptions, 'publicId'>> & Pick<ProductImageUploadOptions, 'publicId'> {
  const folder = options.folder?.trim() || 'products';
  
  // Validate folder name (Cloudinary requirements)
  if (!/^[a-zA-Z0-9_\-\/]+$/.test(folder)) {
    throw new Error('Invalid folder name. Only alphanumeric characters, hyphens, underscores, and forward slashes are allowed');
  }
  
  // Validate publicId if provided
  const publicId = options.publicId?.trim() || undefined;
  if (publicId && !/^[a-zA-Z0-9_\-]+$/.test(publicId)) {
    throw new Error('Invalid publicId. Only alphanumeric characters, hyphens, and underscores are allowed');
  }
  
  return {
    folder,
    publicId,
    overwrite: options.overwrite ?? false,
    tags: options.tags || []
  };
}

/**
 * Upload a buffer to Cloudinary
 */
export async function uploadBufferToCloudinary(buffer: Buffer, options: any = {}): Promise<any> {
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
}

/**
 * Validate image using image-size library (more efficient)
 */
function validateImageBuffer(buffer: Buffer): {
  width: number;
  height: number;
  format: string;
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  try {
    // Check file size
    if (buffer.length > IMAGE_REQUIREMENTS.MAX_FILE_SIZE) {
      errors.push(`File size too large. Maximum: ${IMAGE_REQUIREMENTS.MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Get image dimensions using image-size library (much faster than uploading)
    const dimensions = sizeOf(new Uint8Array(buffer));
    
    if (!dimensions.width || !dimensions.height) {
      errors.push('Could not determine image dimensions');
      return { width: 0, height: 0, format: '', valid: false, errors };
    }

    const { width, height, type } = dimensions;
    const format = type || '';

    // Validate format
    if (!IMAGE_REQUIREMENTS.ALLOWED_FORMATS.includes(format.toLowerCase() as any)) {
      errors.push(`Invalid format: ${format}. Allowed: ${IMAGE_REQUIREMENTS.ALLOWED_FORMATS.join(', ')}`);
    }

    // Validate dimensions
    if (width < IMAGE_REQUIREMENTS.MIN_WIDTH) {
      errors.push(`Width too small: ${width}px. Minimum: ${IMAGE_REQUIREMENTS.MIN_WIDTH}px`);
    }
    
    if (height < IMAGE_REQUIREMENTS.MIN_HEIGHT) {
      errors.push(`Height too small: ${height}px. Minimum: ${IMAGE_REQUIREMENTS.MIN_HEIGHT}px`);
    }

    return {
      width,
      height,
      format,
      valid: errors.length === 0,
      errors
    };
  } catch (error) {
    errors.push(`Failed to validate image: ${(error as Error).message}`);
    return { width: 0, height: 0, format: '', valid: false, errors };
  }
}

/**
 * Get a buffer from a URL with better error handling
 */
async function getImageBufferFromUrl(url: string): Promise<Buffer> {
  try {
    // Validate URL format
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol. Only HTTP and HTTPS are supported');
    }

    const response = await axios.get(url, { 
      responseType: 'arraybuffer',
      timeout: 30000, // 30 second timeout
      maxContentLength: IMAGE_REQUIREMENTS.MAX_FILE_SIZE
    });
    
    return Buffer.from(response.data);
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout while fetching image from URL');
    }
    throw new Error(`Failed to fetch image from URL: ${error.message}`);
  }
}

/**
 * Format URLs using your existing t_standard transformation
 */
function formatCloudinaryUrls(result: any): { originalUrl: string; standardUrl: string } {
  const baseUrl = result.secure_url.split('/upload/')[0] + '/upload/';
  
  // Original high-quality version
  const originalTransformation = `w_${IMAGE_REQUIREMENTS.TARGET_WIDTH},h_${IMAGE_REQUIREMENTS.TARGET_HEIGHT},c_limit,q_auto`;
  const originalUrl = `${baseUrl}${originalTransformation}/${result.public_id}.${result.format}`;
  
  // Using your existing t_standard transformation
  const standardUrl = `${baseUrl}t_standard/${result.public_id}.${result.format}`;
  
  return { originalUrl, standardUrl };
}

/**
 * Upload a product image to Cloudinary with improved validation and error handling
 */
export async function uploadProductImage(
  file: Buffer | string,
  options: ProductImageUploadOptions = {}
): Promise<ImageDetails> {
  configureCloudinary();

  try {
    // Validate and sanitize options first
    const sanitizedOptions = validateUploadOptions(options);
    
    let imageBuffer: Buffer;
    
    // Convert input to buffer
    if (typeof file === 'string') {
      if (!file.trim() || !file.startsWith('http')) {
        throw new Error('Invalid URL. Must be a valid HTTP/HTTPS URL');
      }
      imageBuffer = await getImageBufferFromUrl(file);
    } else if (Buffer.isBuffer(file)) {
      if (file.length === 0) {
        throw new Error('Empty buffer provided');
      }
      imageBuffer = file;
    } else {
      throw new Error('Invalid file type. Must be a URL string or Buffer');
    }

    // Validate image using image-size library (much more efficient)
    const validation = validateImageBuffer(imageBuffer);
    
    if (!validation.valid) {
      throw new Error(`Image validation failed:\n${validation.errors.join('\n')}`);
    }

    // Prepare upload options
    const uploadOptions = {
      folder: sanitizedOptions.folder,
      public_id: sanitizedOptions.publicId,
      overwrite: sanitizedOptions.overwrite,
      tags: sanitizedOptions.tags,
      resource_type: 'image' as const,
      quality: 'auto' as const,
    };

    // Upload the image (only once!)
    const uploadResult = await uploadBufferToCloudinary(imageBuffer, uploadOptions);

    // Format URLs with transformations
    const { originalUrl, standardUrl } = formatCloudinaryUrls(uploadResult);

    return {
      originalUrl,
      standardUrl,
      publicId: uploadResult.public_id,
      dimensions: {
        width: validation.width,
        height: validation.height
      }
    };
  } catch (error: any) {
    console.error('Error uploading image to Cloudinary:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Delete an image from Cloudinary by its publicId
 */
export async function deleteCloudinaryImage(publicId: string): Promise<boolean> {
  configureCloudinary();

  try {
    if (!publicId || typeof publicId !== 'string') {
      throw new Error('Invalid publicId provided');
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result?.result === 'ok';
  } catch (error: any) {
    console.error('Error deleting image from Cloudinary:', error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
}

/**
 * Batch delete multiple images (useful for cleanup)
 */
export async function deleteMultipleCloudinaryImages(publicIds: string[]): Promise<{ 
  deleted: string[]; 
  failed: string[] 
}> {
  configureCloudinary();

  const deleted: string[] = [];
  const failed: string[] = [];

  // Process in batches of 100 (Cloudinary's limit)
  const batchSize = 100;
  
  for (let i = 0; i < publicIds.length; i += batchSize) {
    const batch = publicIds.slice(i, i + batchSize);
    
    try {
      const result = await cloudinary.api.delete_resources(batch);
      
      Object.entries(result.deleted || {}).forEach(([publicId, status]) => {
        if (status === 'deleted') {
          deleted.push(publicId);
        } else {
          failed.push(publicId);
        }
      });
    } catch (error) {
      // If batch fails, add all to failed array
      failed.push(...batch);
    }
  }

  return { deleted, failed };
}

export async function getImagebyId(id: string) {
  try {
    const image = await prismaClientGlobal.productImage.findUnique({
      where: { id },
    });
    if (!image) return null;

    return image;
  } catch (error) {
    console.error('Error fetching image by ID:', error);
    throw new Error('Error fetching image by ID');
  }
}

export async function del(id: string) {
  try {
    const image = await getImagebyId(id);
    if (!image) {
      throw new Error('Image not found');
    }
    // First delete from Cloudinary
    await deleteCloudinaryImage(image.publicId);
    // Then delete from database
    await prismaClientGlobal.productImage.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Error deleting image');
  }
}