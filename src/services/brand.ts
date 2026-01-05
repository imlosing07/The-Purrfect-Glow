// src/services/brand.ts
import { prismaClientGlobal } from '@/src/app/lib/prisma';
import { Prisma } from '@prisma/client';
import { Brand } from '@/src/types';

export async function getBrands(page: number = 1, pageSize: number = 10): Promise<{
    brands: Array<Brand & { count: number }>,
    pagination: {
        page: number,
        pageSize: number,
        total: number,
        totalPages: number
    }
}> {
  const limit = pageSize;

  try {
    const brandsRaw = await prismaClientGlobal.brand.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        name: 'asc'
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    const total = await prismaClientGlobal.brand.count();

    const brands = brandsRaw.map((brand) => ({
      id: brand.id,
      name: brand.name,
      logoUrl: brand.logoUrl,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
      count: brand._count.products,
    }));

    return {
      brands,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw new Error('Error fetching brands');
  }
}

export async function getTotalBrands(): Promise<number> {
  try {
    return (await getBrands()).pagination.total;
  } catch (error) {
    console.error('Error fetching total brands:', error);
    throw new Error('Error fetching total brands');
  }
}

export async function getBrandById(id: string): Promise<(Brand) | null> {
  try {
    const brand = await prismaClientGlobal.brand.findUnique({
      where: { id },
    });
    if (!brand) return null;

    return brand;
  } catch (error) {
    console.error('Error fetching brand by ID:', error);
    throw new Error('Error fetching brand by ID');
  }
}

export async function createBrand(data: Prisma.BrandCreateInput): Promise<Brand> {
  try {
    const brand = await prismaClientGlobal.brand.create({
      data
    });
    return brand;
  } catch (error) {
    console.error('Error creating brand:', error);
    throw new Error('Error creating brand');
  }
}

export async function updateBrand(id: string, data: Prisma.BrandUpdateInput): Promise<Brand> {
  try {
    const brand = await prismaClientGlobal.brand.update({
      where: { id },
      data
    });
    return brand;
  } catch (error) {
    console.error('Error updating brand:', error);
    throw new Error('Error updating brand');
  }
}

export async function deleteBrand(id: string): Promise<Brand> {
  try {
    const Brand = await prismaClientGlobal.brand.delete({
      where: { id },
    });
    return Brand;
  } catch (error) {
    console.error('Error deleting brand:', error);
    throw new Error('Error deleting brand');
  }
}
