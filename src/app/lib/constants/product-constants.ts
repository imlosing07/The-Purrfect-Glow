// lib/constants/product.constants.ts
import { ProductCategory, Genre, UserRole } from "@prisma/client";

// Re-exportar los enums de Prisma para uso en toda la app
export { ProductCategory, Genre, UserRole } from "@prisma/client";

// Crear objetos con labels legibles para la UI
export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  [ProductCategory.FORMAL]: "Formal",
  [ProductCategory.SNEAKERS]: "Sneakers",
  [ProductCategory.SANDALS]: "Sandalias",
  [ProductCategory.BOOTS]: "Botas",
  [ProductCategory.ATHLETIC]: "Deportivo",
  [ProductCategory.CASUAL]: "Casual",
  [ProductCategory.SLIPPERS]: "Pantuflas",
  [ProductCategory.OUTDOOR]: "Outdoor",
};

export const GENRE_LABELS: Record<Genre, string> = {
  [Genre.WOMENS]: "Mujer",
  [Genre.MENS]: "Hombre",
  [Genre.KIDS]: "Niños",
  [Genre.UNISEX]: "Unisex",
};

// Arrays para iterar en selects/dropdowns
export const PRODUCT_CATEGORIES = Object.values(ProductCategory);
export const GENRES = Object.values(Genre);

// Helper functions
export const getCategoryLabel = (category: ProductCategory): string => {
  return PRODUCT_CATEGORY_LABELS[category];
};

export const getGenreLabel = (genre: Genre): string => {
  return GENRE_LABELS[genre];
};