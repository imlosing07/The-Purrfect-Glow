// src/services/product.ts
// Servicio de productos para The Purrfect Glow

import { prismaClientGlobal } from '@/src/app/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  CreateProductDTO,
  ProductQueryDTO,
  PaginatedProductsResponse,
  UpdateProductDTO,
  Product
} from '@/src/types';

// Full include for single product detail view
const productInclude = {
  tags: {
    include: {
      tag: true
    }
  }
} satisfies Prisma.ProductInclude;

// Optimized select for catalog listing (reduces data transfer)
const productSelectForList = {
  id: true,
  name: true,
  price: true,
  images: true,
  summary: true,
  isAvailable: true,
  featured: true,
  createdAt: true,
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          name: true,
          slug: true,
          type: true
        }
      }
    }
  }
} satisfies Prisma.ProductSelect;

// Transformar producto de DB a tipo frontend
function transformProductFromDB(product: any): Product {
  return {
    ...product,
    tags: product.tags?.map((pt: any) => pt.tag) || []
  };
}

/**
 * Obtiene productos con filtros y paginación (optimized for listing)
 */
export async function getProducts(options: ProductQueryDTO): Promise<PaginatedProductsResponse> {
  const {
    page = 1,
    limit = 12,
    search,
    tags,
    available,
    featured,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  // Construir filtros
  const where: Prisma.ProductWhereInput = {};

  // Filtro por disponibilidad
  if (available !== undefined) {
    where.isAvailable = available;
  }

  // Filtro por destacados
  if (featured !== undefined) {
    where.featured = featured;
  }

  // Búsqueda por texto
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { summary: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Filtro por tags (AND - debe tener TODOS los tags)
  if (tags && tags.length > 0) {
    where.AND = tags.map(tagSlug => ({
      tags: {
        some: {
          tag: {
            slug: tagSlug
          }
        }
      }
    }));
  }

  // Ordenamiento
  const orderBy: Prisma.ProductOrderByWithRelationInput = {
    [sortBy]: sortOrder
  };

  try {
    const [products, total] = await Promise.all([
      prismaClientGlobal.product.findMany({
        where,
        select: productSelectForList, // Using optimized select instead of include
        take: limit,
        skip: (page - 1) * limit,
        orderBy
      }),
      prismaClientGlobal.product.count({ where })
    ]);

    return {
      products: products.map(transformProductFromDB),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

/**
 * Obtiene un producto por ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await prismaClientGlobal.product.findUnique({
      where: { id },
      include: productInclude
    });

    if (!product) return null;

    return transformProductFromDB(product);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error(`Failed to fetch product ${id}`);
  }
}

/**
 * Crea un nuevo producto
 */
export async function createProduct(data: CreateProductDTO): Promise<Product> {
  try {
    const product = await prismaClientGlobal.product.create({
      data: {
        name: data.name,
        price: data.price,
        images: data.images,
        summary: data.summary,
        benefits: data.benefits || [],
        howToUse: data.howToUse,
        routineStep: data.routineStep,
        usageTime: data.usageTime || 'BOTH',
        keyIngredients: data.keyIngredients || {},
        isAvailable: data.isAvailable ?? true,
        featured: data.featured ?? false,
        tags: {
          create: data.tagIds.map(tagId => ({
            tag: { connect: { id: tagId } }
          }))
        }
      },
      include: productInclude
    });

    return transformProductFromDB(product);
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

/**
 * Actualiza un producto
 * NOTA: Los tags solo se actualizan si se proporciona tagIds con valores.
 * Si tagIds es undefined o vacío, los tags existentes se mantienen.
 */
export async function updateProduct(id: string, data: UpdateProductDTO): Promise<Product> {
  const { tagIds, ...productData } = data;

  try {
    // Solo actualizar tags si se proporcionan tagIds con al menos un valor
    const shouldUpdateTags = tagIds && tagIds.length > 0;

    if (shouldUpdateTags) {
      // Eliminar tags existentes y crear los nuevos
      await prismaClientGlobal.productTag.deleteMany({
        where: { productId: id }
      });
    }

    const product = await prismaClientGlobal.product.update({
      where: { id },
      data: {
        ...productData,
        ...(shouldUpdateTags && {
          tags: {
            create: tagIds!.map(tagId => ({
              tag: { connect: { id: tagId } }
            }))
          }
        })
      },
      include: productInclude
    });

    return transformProductFromDB(product);
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw new Error(`Failed to update product ${id}`);
  }
}

/**
 * Toggle de disponibilidad (para admin - un solo clic)
 */
export async function toggleProductAvailability(id: string): Promise<Product> {
  try {
    const current = await prismaClientGlobal.product.findUnique({
      where: { id },
      select: { isAvailable: true }
    });

    if (!current) {
      throw new Error(`Product ${id} not found`);
    }

    const product = await prismaClientGlobal.product.update({
      where: { id },
      data: { isAvailable: !current.isAvailable },
      include: productInclude
    });

    return transformProductFromDB(product);
  } catch (error) {
    console.error(`Error toggling availability for product ${id}:`, error);
    throw new Error(`Failed to toggle product availability`);
  }
}

/**
 * Elimina un producto
 */
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

/**
 * Obtiene todos los tags
 */
export async function getAllTags() {
  try {
    return await prismaClientGlobal.tag.findMany({
      orderBy: [{ type: 'asc' }, { name: 'asc' }]
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }
}

/**
 * Obtiene tags por tipo
 */
export async function getTagsByType(type: 'SKIN_TYPE' | 'CONCERN' | 'CATEGORY') {
  try {
    return await prismaClientGlobal.tag.findMany({
      where: { type },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error(`Error fetching tags of type ${type}:`, error);
    throw new Error(`Failed to fetch tags of type ${type}`);
  }
}

/**
 * Cuenta total de productos
 */
export async function getTotalProducts(): Promise<number> {
  return prismaClientGlobal.product.count();
}

/**
 * Obtiene productos destacados (optimized for listing)
 */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const products = await prismaClientGlobal.product.findMany({
      where: { 
        featured: true,
        isAvailable: true 
      },
      select: productSelectForList, // Optimized select
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return products.map(transformProductFromDB);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw new Error('Failed to fetch featured products');
  }
}