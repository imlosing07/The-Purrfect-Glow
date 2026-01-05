// src/services/product.ts
import { prismaClientGlobal } from '@/src/app/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  CreateProductDTO,
  ProductQueryDTO,
  PaginatedProductsResponse,
  UpdateProductDTO,
  Product,
  AddProductImageDTO,
  ProductImage
} from '@/src/types';

export async function getProducts(options: ProductQueryDTO): Promise<PaginatedProductsResponse> {
  const {
    page = 1,
    limit = 10,
    category,
    genre,
    brandId,
    search,
    minPrice,
    maxPrice,
    featured,
    isNew,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  // Construir el objeto de filtros
  const where: Prisma.ProductWhereInput = {};

  if (category) where.category = category;
  if (genre) where.genre = genre;
  if (brandId) where.brandId = brandId;
  if (featured !== undefined) where.featured = featured;
  if (isNew !== undefined) where.isNew = isNew;

  // Filtros de precio
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Búsqueda por texto
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Configurar el ordenamiento
  const orderBy: Prisma.ProductOrderByWithRelationInput = {
    [sortBy]: sortOrder
  };

  try {
    // Ejecutar consultas en paralelo para mejorar rendimiento
    const [products] = await Promise.all([
      prismaClientGlobal.product.findMany({
        where,
        include: {
          brand: true,
          images: {
            orderBy: { createdAt: 'asc' }
          },
          sizes: {
            orderBy: { value: 'asc' }
          }
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy
      })
    ]);

    const total = await prismaClientGlobal.product.count({ where });

    const result = {
      products: products.map(transformProductFromDB),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
    return result;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const result = await prismaClientGlobal.product.findUnique({
      where: { id },
      include: {
        brand: true,
        images: {
          orderBy: { createdAt: 'asc' }
        },
        sizes: {
          orderBy: { value: 'asc' }
        }
      }
    });

    const newResult = transformProductFromDB(result); // Transformar el producto para asegurar que los precios son números

    return newResult;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error(`Failed to fetch product ${id}`);
  }
}

// src/services/product.ts - createProduct method
export async function createProduct(data: CreateProductDTO): Promise<Product> {
  console.log('Creating product with data:', data);
  try {
    const result = await prismaClientGlobal.product.create({
      data: {
        name: data.name,
        description: data.description || null,
        category: data.category,
        genre: data.genre,
        price: data.price,
        salePrice: data.salePrice || null,
        featured: data.featured || false,
        isNew: data.isNew ?? true,
        brandId: data.brandId,
        sizes: {
          create: data.sizes.map(size => ({
            value: size.value,
            inventory: size.inventory
          }))
        }
      },
      include: {
        brand: true,
        sizes: { orderBy: { value: 'asc' } }
      }
    });

    return transformProductFromDB(result);
  } catch (error) {
    console.log('Error creating product:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('A product with this name already exists');
      }
    }
    throw new Error('Failed to create product');
  }
}

// src/services/product.ts - updateProduct method (sin imágenes)
export async function updateProduct(id: string, data: UpdateProductDTO): Promise<Product> {
  const { sizes, ...productData } = data;
  
  try {
    return await prismaClientGlobal.$transaction(async (prisma) => {
      // 1. Actualizar datos básicos del producto
      await prisma.product.update({
        where: { id },
        data: productData,
      });

      // 2. Actualizar tallas si se proporcionan
      if (sizes && sizes.length > 0) {
        // Obtener tallas actuales
        const currentSizes = await prisma.size.findMany({
          where: { productId: id }
        });
        
        // Crear un conjunto con los valores de tallas actuales
        const currentSizeValues = new Set(currentSizes.map(size => size.value));
        
        // Conjunto para rastrear qué tallas se mantienen
        const keepSizeValues = new Set<string>();
        
        for (const size of sizes) {
          keepSizeValues.add(size.value);
          
          if (currentSizeValues.has(size.value)) {
            // La talla existe, actualizarla
            await prisma.size.update({
              where: {
                productId_value: {
                  productId: id,
                  value: size.value,
                }
              },
              data: {
                inventory: size.inventory
              }
            });
          } else {
            // La talla es nueva, crearla
            await prisma.size.create({
              data: {
                value: size.value,
                inventory: size.inventory,
                productId: id
              }
            });
          }
        }
        
        // Eliminar tallas que ya no están en la lista
        for (const size of currentSizes) {
          if (!keepSizeValues.has(size.value)) {
            await prisma.size.delete({
              where: {
                productId_value: {
                  productId: id,
                  value: size.value
                }
              }
            });
          }
        }
      }

      // 3. Obtener el producto actualizado con todas sus relaciones
      const result = await prisma.product.findUnique({
        where: { id },
        include: {
          brand: true,
          images: { orderBy: { createdAt: 'asc' } },
          sizes: { orderBy: { value: 'asc' } }
        }
      });
      
      return transformProductFromDB(result);
    });
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw new Error(`Failed to update product ${id}`);
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await prismaClientGlobal.product.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new Error(`Product with ID ${id} not found`);
      }
    }
    throw new Error(`Failed to delete product ${id}`);
  }
}

// Función helper de transformación
function transformProductFromDB(product: any): Product {
  return {
    ...product,
    price: parseFloat(product.price.toString()),
    salePrice: product.salePrice ? parseFloat(product.salePrice.toString()) : null
  };
}

export function getTotalProducts(): Promise<number> {
  return prismaClientGlobal.product.count();
}

// src/services/product.ts - Método para agregar imagen a producto existente

export async function addProductImage(
  productId: string, 
  imageData: AddProductImageDTO
): Promise<ProductImage> {
  try {
    // 1. Verificar que el producto existe
    const product = await prismaClientGlobal.product.findUnique({
      where: { id: productId },
      include: { images: true }
    });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    // 2. Determinar si esta imagen debe ser la principal
    const isMain = product.images.length === 0; // Es main si es la primera imagen

    // 3. Si esta imagen va a ser main, asegurar que ninguna otra lo sea
    if (isMain && product.images.some(img => img.isMain)) {
      await prismaClientGlobal.productImage.updateMany({
        where: { 
          productId: productId,
          isMain: true 
        },
        data: { isMain: false }
      });
    }

    // 4. Crear la nueva imagen
    const newImage = await prismaClientGlobal.productImage.create({
      data: {
        originalUrl: imageData.originalUrl,
        standardUrl: imageData.standardUrl,
        publicId: imageData.publicId,
        isMain: isMain,
        productId: productId
      }
    });

    return newImage;
  } catch (error) {
    console.error(`Error adding image to product ${productId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new Error(`Product with ID ${productId} not found`);
      }
    }
    throw new Error(`Failed to add image to product ${productId}`);
  }
}

// Método auxiliar para establecer imagen principal
export async function setMainProductImage(
  productId: string, 
  imageId: string
): Promise<boolean> {
  try {
    await prismaClientGlobal.$transaction(async (prisma) => {
      // 1. Quitar isMain de todas las imágenes del producto
      await prisma.productImage.updateMany({
        where: { productId: productId },
        data: { isMain: false }
      });

      // 2. Establecer la imagen especificada como main
      await prisma.productImage.update({
        where: { 
          id: imageId,
          productId: productId // Asegurar que la imagen pertenece al producto
        },
        data: { isMain: true }
      });
    });

    return true;
  } catch (error) {
    console.error(`Error setting main image ${imageId} for product ${productId}:`, error);
    throw new Error(`Failed to set main image`);
  }
}

// Método para eliminar imagen de producto
export async function removeProductImage(
  productId: string, 
  imageId: string
): Promise<boolean> {
  try {
    const deletedImage = await prismaClientGlobal.productImage.delete({
      where: { 
        id: imageId,
        productId: productId // Asegurar que la imagen pertenece al producto
      }
    });

    // Si la imagen eliminada era la principal, establecer otra como principal
    if (deletedImage.isMain) {
      const firstImage = await prismaClientGlobal.productImage.findFirst({
        where: { productId: productId },
        orderBy: { createdAt: 'asc' }
      });

      if (firstImage) {
        await prismaClientGlobal.productImage.update({
          where: { id: firstImage.id },
          data: { isMain: true }
        });
      }
    }

    return true;
  } catch (error) {
    console.error(`Error removing image ${imageId} from product ${productId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new Error(`Image with ID ${imageId} not found`);
      }
    }
    throw new Error(`Failed to remove image from product`);
  }
}