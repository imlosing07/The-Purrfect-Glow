'use server';

import { auth } from '@/auth';
import { prismaClientGlobal } from '@/src/app/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Toggle a product in the user's wishlist
 * If the product is already in the wishlist, it will be removed
 * If the product is not in the wishlist, it will be added
 */
export async function toggleFavorite(productId: string) {
  try {
    // Verificar sesión del usuario
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Debes iniciar sesión para agregar favoritos',
        isInWishlist: false,
      };
    }

    const userId = session.user.id;

    // Verificar que el producto existe
    const product = await prismaClientGlobal.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return {
        success: false,
        message: 'Producto no encontrado',
        isInWishlist: false,
      };
    }

    // Buscar si ya existe el item en la wishlist
    const existingItem = await prismaClientGlobal.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingItem) {
      // Si existe, eliminar
      await prismaClientGlobal.wishlistItem.delete({
        where: {
          id: existingItem.id,
        },
      });

      // Revalidar rutas relevantes
      revalidatePath('/favoritos');
      revalidatePath('/catalogo');
      revalidatePath(`/producto/${productId}`);
      
      return {
        success: true,
        message: 'Producto eliminado de favoritos',
        isInWishlist: false,
      };
    } else {
      // Si no existe, crear
      await prismaClientGlobal.wishlistItem.create({
        data: {
          userId,
          productId,
        },
      });

      // Revalidar rutas relevantes
      revalidatePath('/favoritos');
      revalidatePath('/catalogo');
      revalidatePath(`/producto/${productId}`);
      
      return {
        success: true,
        message: 'Producto agregado a favoritos',
        isInWishlist: true,
      };
    }
  } catch (error) {
    console.error('Error in toggleFavorite:', error);
    return {
      success: false,
      message: 'Error al procesar la solicitud',
      isInWishlist: false,
    };
  }
}

/**
 * Get all products in the user's wishlist
 */
export async function getUserWishlist() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Debes iniciar sesión',
        products: [],
      };
    }

    const wishlistItems = await prismaClientGlobal.wishlistItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          include: {
            tags: {
              include: {
                tag: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Mapear a formato de producto directo
    const products = wishlistItems.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      price: Number(item.product.price),
      images: item.product.images,
      summary: item.product.summary,
      benefits: item.product.benefits,
      howToUse: item.product.howToUse,
      routineStep: item.product.routineStep,
      usageTime: item.product.usageTime,
      keyIngredients: item.product.keyIngredients,
      isAvailable: item.product.isAvailable,
      featured: item.product.featured,
      tags: item.product.tags.map((pt) => pt.tag),
      createdAt: item.product.createdAt,
      updatedAt: item.product.updatedAt,
    }));

    return {
      success: true,
      message: 'Wishlist obtenida exitosamente',
      products,
    };
  } catch (error) {
    console.error('Error in getUserWishlist:', error);
    return {
      success: false,
      message: 'Error al obtener favoritos',
      products: [],
    };
  }
}

/**
 * Check if a product is in the user's wishlist
 */
export async function isProductInWishlist(productId: string) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: true,
        isInWishlist: false,
      };
    }

    const item = await prismaClientGlobal.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
    });

    return {
      success: true,
      isInWishlist: !!item,
    };
  } catch (error) {
    console.error('Error in isProductInWishlist:', error);
    return {
      success: false,
      isInWishlist: false,
    };
  }
}

/**
 * Get all product IDs in the user's wishlist (lightweight version)
 * Useful for initializing the wishlist context
 */
export async function getUserWishlistIds() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: true,
        productIds: [],
      };
    }

    const wishlistItems = await prismaClientGlobal.wishlistItem.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        productId: true,
      },
    });

    return {
      success: true,
      productIds: wishlistItems.map((item) => item.productId),
    };
  } catch (error) {
    console.error('Error in getUserWishlistIds:', error);
    return {
      success: false,
      productIds: [],
    };
  }
}

/**
 * Remove all items from wishlist (useful for "move all to cart")
 */
export async function clearWishlist() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return {
        success: false,
        message: 'Debes iniciar sesión',
      };
    }

    await prismaClientGlobal.wishlistItem.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    revalidatePath('/favoritos');
    revalidatePath('/catalogo');

    return {
      success: true,
      message: 'Wishlist vaciada exitosamente',
    };
  } catch (error) {
    console.error('Error in clearWishlist:', error);
    return {
      success: false,
      message: 'Error al vaciar favoritos',
    };
  }
}