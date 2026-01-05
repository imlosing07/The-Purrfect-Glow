'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/src/app/ui/fonts';
import Image from 'next/image';

interface FavoriteProduct {
    id: string;
    name: string;
    brand: string;
    price: number;
    salePrice: number | null;
    imageUrl: string | null;
    favoritesCount: number;
}

export default function TopFavoriteProducts() {
    const [products, setProducts] = useState<FavoriteProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTopFavorites() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch('/api/analytics/top-favorites');
                if (!res.ok) throw new Error('Failed to fetch top favorites');
                const data = await res.json();
                setProducts(data.data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchTopFavorites();
    }, []);

    if (loading) {
        return (
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 className={`${lusitana.className} text-lg font-semibold mb-4`}>
                    ⭐ Productos Más Deseados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="border rounded p-3 animate-pulse">
                            <div className="w-full h-32 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 className={`${lusitana.className} text-lg font-semibold mb-4`}>
                    ⭐ Productos Más Deseados
                </h3>
                <p className="text-sm text-red-600">Error: {error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 className={`${lusitana.className} text-lg font-semibold mb-4`}>
                    ⭐ Productos Más Deseados
                </h3>
                <p className="text-sm text-gray-500 text-center py-8">
                    No hay productos en favoritos aún
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className={`${lusitana.className} text-lg font-semibold mb-4`}>
                ⭐ Productos Más Deseados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                        {product.imageUrl ? (
                            <div className="relative w-full h-32 mb-2 bg-gray-100 rounded overflow-hidden">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-32 mb-2 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-gray-400 text-xs">Sin imagen</span>
                            </div>
                        )}
                        <p className="font-medium text-sm truncate" title={product.name}>
                            {product.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate" title={product.brand}>
                            {product.brand}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-2">
                                {product.salePrice && product.salePrice > 0 ? (
                                    <>
                                        <span className="text-sm font-bold text-green-600">
                                            ${product.salePrice.toString()}
                                        </span>
                                        <span className="text-xs text-gray-400 line-through">
                                            ${product.price.toString()}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-sm font-bold">
                                        ${product.price.toString()}
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-red-500 flex items-center gap-1 font-semibold">
                                ❤️ {product.favoritesCount}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
