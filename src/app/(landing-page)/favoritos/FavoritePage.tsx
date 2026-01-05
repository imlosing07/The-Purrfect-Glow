'use client';

import ProductCard from '../(category-page)/components/ProductCard';
import { useWishlist } from '@/src/app/lib/contexts/WishlistContext';
import { useMemo, useEffect, useState } from 'react';
import { Product } from "@/src/types";
import Link from 'next/link';

export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { wishlistIds } = useWishlist();

  // Fetch products from API
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const json = await response.json();
        const productsList: Product[] = json?.data?.products ?? [];
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, []);

  // Filtrar productos que están en wishlist
  const favoriteProducts = useMemo(() => {
    return products.filter(product => wishlistIds.has(product.id));
  }, [products, wishlistIds]);

  const isEmpty = favoriteProducts.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Mis Favoritos
          </h1>
          <p className="text-gray-600">
            {isEmpty
              ? 'No tienes productos favoritos aún'
              : `${favoriteProducts.length} ${favoriteProducts.length === 1 ? 'producto' : 'productos'} guardados`}
          </p>
        </div>

        {/* Empty state */}
        {isEmpty ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            No hay favoritos aún
            </h2>
            <p className="text-gray-600 mb-6">
                            Explora nuestra colección y guarda tus productos favoritos
            </p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
            >
                            Explorar productos
            </Link>
          </div>
        ) : (
        /* Grid de productos */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}