// src/lib/validation/product.schema.ts
import { z } from 'zod';
import { ProductCategory, Genre } from '@/src/app/lib/constants/product-constants';

// Esquemas para datos anidados
export const productImageSchema = z.object({
  originalUrl: z.string().url('URL de imagen inválida'),
  standardUrl: z.string().url('URL de imagen inválida')
});

export const productSizeSchema = z.object({
  value: z.string().min(1, 'El valor de la talla es requerido'),
  inventory: z.number().int().min(0, 'El inventario debe ser un número entero positivo')
});

// Esquema base para campos comunes
const productBaseSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(100),
  description: z.string().max(1000).nullable().optional(),
  category: z.nativeEnum(ProductCategory, {
    errorMap: () => ({ message: 'Categoría de producto inválida' })
  }),
  genre: z.nativeEnum(Genre, {
    errorMap: () => ({ message: 'Género inválido' })
  }),
  price: z.number().positive('El precio debe ser mayor que cero'),
  salePrice: z.number().positive('El precio de oferta debe ser mayor que cero').nullable().optional(),
  featured: z.boolean().default(false),
  isNew: z.boolean().default(true),
  brandId: z.string().uuid('ID de marca inválido')
});

// Esquema para creación de producto
export const createProductSchema = productBaseSchema.extend({
  sizes: z.array(productSizeSchema)
    .min(1, 'Se requiere al menos una talla')
});

// Esquema para actualización de producto
export const updateProductSchema = productBaseSchema
  .partial() // Hace todos los campos opcionales
  .extend({
    sizes: z.array(productSizeSchema).optional()
  });

// Esquema para consultas y filtrado
export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.nativeEnum(ProductCategory).optional(),
  genre: z.nativeEnum(Genre).optional(),
  brandId: z.string().uuid('ID de marca inválido').optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().positive().optional(),
  featured: z.coerce.boolean().optional(),
  isNew: z.coerce.boolean().optional(),
  sortBy: z.enum(['price', 'name', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});