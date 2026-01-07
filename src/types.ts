// types.ts - The Purrfect Glow (Skincare E-commerce)

// ═══════════════════════════════════════════════════════════════
// ENUMS (Mirror Prisma enums for frontend use)
// ═══════════════════════════════════════════════════════════════

export enum TagType {
  SKIN_TYPE = 'SKIN_TYPE',
  CONCERN = 'CONCERN',
  CATEGORY = 'CATEGORY',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

export enum ShippingZone {
  LIMA_LOCAL = 'LIMA_LOCAL',
  LIMA_PROVINCIAS = 'LIMA_PROVINCIAS',
  COSTA_NACIONAL = 'COSTA_NACIONAL',
  SIERRA_SELVA = 'SIERRA_SELVA',
  ZONAS_REMOTAS = 'ZONAS_REMOTAS',
}

export enum ShippingModality {
  DOMICILIO = 'DOMICILIO',
  AGENCIA = 'AGENCIA',
}

export enum UsageTime {
  AM = 'AM',
  PM = 'PM',
  BOTH = 'BOTH',
}

// ═══════════════════════════════════════════════════════════════
// SHIPPING ZONE METADATA (Para UI)
// ═══════════════════════════════════════════════════════════════

export const SHIPPING_ZONES_INFO: Record<ShippingZone, { label: string; examples: string }> = {
  [ShippingZone.LIMA_LOCAL]: {
    label: 'Lima Local',
    examples: 'Miraflores, San Borja, Surco, etc.',
  },
  [ShippingZone.LIMA_PROVINCIAS]: {
    label: 'Lima Provincias',
    examples: 'Huacho, Barranca, Cañete',
  },
  [ShippingZone.COSTA_NACIONAL]: {
    label: 'Costa Nacional',
    examples: 'Trujillo, Chiclayo, Ica, Piura',
  },
  [ShippingZone.SIERRA_SELVA]: {
    label: 'Sierra y Selva',
    examples: 'Arequipa, Cusco, Puno, Iquitos',
  },
  [ShippingZone.ZONAS_REMOTAS]: {
    label: 'Zonas Remotas',
    examples: 'Áreas rurales o selva profunda',
  },
};

export const SHIPPING_MODALITY_INFO: Record<ShippingModality, { label: string; icon: string }> = {
  [ShippingModality.DOMICILIO]: {
    label: 'Entrega a Domicilio',
    icon: '🏠',
  },
  [ShippingModality.AGENCIA]: {
    label: 'Recojo en Agencia Olva',
    icon: '📦',
  },
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
  routineStep?: string | null;
  usageTime: UsageTime;
  keyIngredients?: Record<string, string> | null;
  isAvailable: boolean;
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
  routineStep?: string;
  usageTime?: UsageTime;
  keyIngredients?: Record<string, string>;
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
  routineStep?: string;
  usageTime?: UsageTime;
  keyIngredients?: Record<string, string>;
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
// WHATSAPP UTILITY TYPES
// ═══════════════════════════════════════════════════════════════

export interface WhatsAppOrderData {
  customerName: string;
  dni: string;
  phone: string;
  items: { name: string; quantity: number; price: number }[];
  shippingZone: ShippingZone;
  shippingModality: ShippingModality;
  shippingCost: number;
  estimatedDays: string;
  totalAmount: number;
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
}