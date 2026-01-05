import { NextResponse } from 'next/server';
import { prismaClientGlobal } from '@/src/app/lib/prisma';

export async function GET() {
  try {
    const brandsWithCounts = await prismaClientGlobal.brand.findMany({
      select: {
        id: true,
        name: true,
        logoUrl: true,
        products: {
          select: {
            _count: {
              select: {
                wishlistItems: true,
              },
            },
          },
        },
      },
    });

    const brandsData = brandsWithCounts
      .map(brand => ({
        name: brand.name,
        logoUrl: brand.logoUrl,
        favoritesCount: brand.products.reduce((sum, product) => 
          sum + product._count.wishlistItems, 0
        ),
      }))
      .filter(brand => brand.favoritesCount > 0)
      .sort((a, b) => b.favoritesCount - a.favoritesCount)
      .slice(0, 7);

    return NextResponse.json({ data: brandsData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching top brands:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
