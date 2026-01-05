import { NextResponse } from 'next/server';
import { prismaClientGlobal } from '@/src/app/lib/prisma';

export async function GET() {
  try {
    const topFavorites = await prismaClientGlobal.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        salePrice: true,
        brand: {
          select: {
            name: true,
          },
        },
        images: {
          where: { isMain: true },
          take: 1,
          select: {
            standardUrl: true,
          },
        },
        _count: {
          select: {
            wishlistItems: true,
          },
        },
      },
      orderBy: {
        wishlistItems: {
          _count: 'desc',
        },
      },
      take: 10,
      where: {
        wishlistItems: {
          some: {}, // Only products with at least 1 wishlist entry
        },
      },
    });

    const formatted = topFavorites.map(product => ({
      id: product.id,
      name: product.name,
      brand: product.brand.name,
      price: product.price,
      salePrice: product.salePrice,
      imageUrl: product.images[0]?.standardUrl || null,
      favoritesCount: product._count.wishlistItems,
    }));

    return NextResponse.json({ data: formatted }, { status: 200 });
  } catch (error) {
    console.error('Error fetching top favorites:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
