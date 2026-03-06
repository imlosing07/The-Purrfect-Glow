// types.ts - The Purrfect Glow (Skincare E-commerce)

// ═══════════════════════════════════════════════════════════════
// ENUMS (Import from Prisma for type consistency)
// ═══════════════════════════════════════════════════════════════

// Import and re-export Prisma enums to avoid duplicate type definitions
import {
  TagType as PrismaTagType,
  OrderStatus as PrismaOrderStatus,
  ShippingZone as PrismaShippingZone,
  ShippingModality as PrismaShippingModality,
  UsageTime as PrismaUsageTime,
  RoutineStep as PrismaRoutineStep,
} from '@prisma/client';

export {
  PrismaTagType as TagType,
  PrismaOrderStatus as OrderStatus,
  PrismaShippingZone as ShippingZone,
  PrismaShippingModality as ShippingModality,
  PrismaUsageTime as UsageTime,
  PrismaRoutineStep as RoutineStep,
};

// Create local aliases for use within this file
type TagType = PrismaTagType;
type OrderStatus = PrismaOrderStatus;
type ShippingZone = PrismaShippingZone;
type ShippingModality = PrismaShippingModality;
type UsageTime = PrismaUsageTime;
type RoutineStep = PrismaRoutineStep;

// ═══════════════════════════════════════════════════════════════
// SHIPPING ZONE METADATA (Para UI)
// ═══════════════════════════════════════════════════════════════

export const SHIPPING_ZONES_INFO: Record<ShippingZone, { label: string; examples: string }> = {
  [PrismaShippingZone.LIMA_LOCAL]: {
    label: 'Lima Local',
    examples: 'Miraflores, San Borja, Surco, etc.',
  },
  [PrismaShippingZone.LIMA_PROVINCIAS]: {
    label: 'Lima Provincias',
    examples: 'Huacho, Barranca, Cañete',
  },
  [PrismaShippingZone.COSTA_NACIONAL]: {
    label: 'Costa Nacional',
    examples: 'Trujillo, Chiclayo, Ica, Piura',
  },
  [PrismaShippingZone.SIERRA_SELVA]: {
    label: 'Sierra y Selva',
    examples: 'Arequipa, Cusco, Puno, Iquitos',
  },
  [PrismaShippingZone.ZONAS_REMOTAS]: {
    label: 'Zonas Remotas',
    examples: 'Áreas rurales o selva profunda',
  },
};

export const SHIPPING_MODALITY_INFO: Record<ShippingModality, { label: string; icon: string }> = {
  [PrismaShippingModality.DOMICILIO]: {
    label: 'Entrega a Domicilio',
    icon: '🏠',
  },
  [PrismaShippingModality.AGENCIA]: {
    label: 'Recojo en Agencia Olva',
    icon: '📦',
  },
};

// ═══════════════════════════════════════════════════════════════
// ROUTINE STEP METADATA (Para UI)
// ═══════════════════════════════════════════════════════════════

export const ROUTINE_STEP_INFO: Record<RoutineStep, { label: string; step: number; icon: string }> = {
  [PrismaRoutineStep.CLEANSE]: { label: 'Limpieza', step: 1, icon: '💧' },
  [PrismaRoutineStep.TONER]: { label: 'Tónico', step: 2, icon: '✨' },
  [PrismaRoutineStep.SERUM]: { label: 'Serum', step: 3, icon: '💎' },
  [PrismaRoutineStep.AMPOULE]: { label: 'Ampolla', step: 4, icon: '🧴' },
  [PrismaRoutineStep.MOISTURIZER]: { label: 'Crema', step: 5, icon: '🌸' },
  [PrismaRoutineStep.SUNSCREEN]: { label: 'Protector Solar', step: 6, icon: '☀️' },
  [PrismaRoutineStep.SPECIAL_CARE]: { label: 'Cuidado Especial', step: 0, icon: '💕' },
};

// ═══════════════════════════════════════════════════════════════
// PRODUCT ENTITIES
// ═══════════════════════════════════════════════════════════════

export interface Tag {
  id: string;
  name: string;
  slug: string;
  type: TagType;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  summary?: string | null;
  benefits: string[];
  howToUse?: string | null;
  routineStep?: RoutineStep | null;
  usageTime: UsageTime;
  keyIngredients?: Record<string, string> | null;
  isAvailable: boolean;
  stock: number;
  featured: boolean;
  tags: Tag[];
  createdAt: Date;
  updatedAt: Date;
}

// ═══════════════════════════════════════════════════════════════
// PRODUCT DTOs
// ═══════════════════════════════════════════════════════════════

export interface CreateProductDTO {
  name: string;
  price: number;
  images: string[];
  summary?: string;
  benefits?: string[];
  howToUse?: string;
  routineStep?: RoutineStep | null;
  usageTime?: UsageTime;
  keyIngredients?: Record<string, string>;
  stock?: number;
  isAvailable?: boolean;
  featured?: boolean;
  tagIds: string[];
}

export interface UpdateProductDTO {
  name?: string;
  price?: number;
  images?: string[];
  summary?: string;
  benefits?: string[];
  howToUse?: string;
  routineStep?: RoutineStep | null;
  usageTime?: UsageTime;
  keyIngredients?: Record<string, string>;
  stock?: number;
  isAvailable?: boolean;
  featured?: boolean;
  tagIds?: string[];
}

export interface ProductQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];      // Array de tag slugs
  available?: boolean;
  featured?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedProductsResponse {
  products: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ═══════════════════════════════════════════════════════════════
// SHIPPING ENTITIES
// ═══════════════════════════════════════════════════════════════

export interface ShippingRate {
  id: string;
  zone: ShippingZone;
  modality: ShippingModality;
  cost: number;
  estimatedDays: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingQueryDTO {
  zone: ShippingZone;
  modality?: ShippingModality;
}

export interface ShippingResponse {
  domicilio: {
    cost: number;
    estimatedDays: string;
  };
  agencia: {
    cost: number;
    estimatedDays: string;
  } | null;
  savings: number; // Diferencia entre domicilio y agencia
}

// ═══════════════════════════════════════════════════════════════
// ORDER ENTITIES
// ═══════════════════════════════════════════════════════════════

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  dni: string;
  fullName: string;
  phone: string;
  address: string;
  department: string;
  province: string;
  shippingZone: ShippingZone;
  shippingModality: ShippingModality;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  whatsappLink?: string | null;
  locationUrl?: string | null;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDTO {
  dni: string;
  fullName: string;
  phone: string;
  address: string;
  department: string;
  province: string;
  shippingZone: ShippingZone;
  shippingModality: ShippingModality;
  locationUrl?: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface OrderResponse {
  orderId: string;
  whatsappLink: string;
  order: Order;
}

// ═══════════════════════════════════════════════════════════════
// CART (Frontend State)
// ═══════════════════════════════════════════════════════════════

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

// ═══════════════════════════════════════════════════════════════
// USER (Auth - se mantiene)
// ═══════════════════════════════════════════════════════════════

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: UserRole;
  purrPoints?: number;
}