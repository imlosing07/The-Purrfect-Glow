'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/src/app/ui/fonts';
import Image from 'next/image';

interface BrandData {
    name: string;
    logoUrl: string | null;
    favoritesCount: number;
}

export default function TopBrandsChart() {
    const [brands, setBrands] = useState<BrandData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTopBrands() {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch('/api/analytics/top-brands');
                if (!res.ok) throw new Error('Failed to fetch top brands');
                const data = await res.json();
                setBrands(data.data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchTopBrands();
    }, []);

    if (loading) {
        return (
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 className={`${lusitana.className} text-lg font-semibold mb-4`}>
                    📈 Marcas Más Populares
                </h3>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded mb-1"></div>
                            <div className="w-full bg-gray-200 rounded-full h-2"></div>
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
                    📈 Marcas Más Populares
                </h3>
                <p className="text-sm text-red-600">Error: {error}</p>
            </div>
        );
    }

    if (brands.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <h3 className={`${lusitana.className} text-lg font-semibold mb-4`}>
                    📈 Marcas Más Populares
                </h3>
                <p className="text-sm text-gray-500 text-center py-8">
                    No hay datos de marcas favoritas aún
                </p>
            </div>
        );
    }

    const maxCount = brands[0]?.favoritesCount || 1;

    return (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 className={`${lusitana.className} text-lg font-semibold mb-4`}>
                📈 Marcas Más Populares
            </h3>
            <div className="space-y-3">
                {brands.map((brand, index) => (
                    <div key={brand.name}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600 w-5">
                                    {index + 1}.
                                </span>
                                {brand.logoUrl && (
                                    <div className="relative w-6 h-6 flex-shrink-0">
                                        <Image
                                            src={`/brandsImages/${brand.logoUrl}`}
                                            alt={brand.name}
                                            width={24}
                                            height={24}
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                                <span className="text-sm font-medium truncate max-w-[150px]">
                                    {brand.name}
                                </span>
                            </div>
                            <span className="text-xs text-gray-600 font-semibold ml-2 flex-shrink-0">
                                {brand.favoritesCount} ❤️
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-gradient-to-r from-pink-500 to-red-500 h-2.5 rounded-full transition-all duration-500"
                                style={{
                                    width: `${(brand.favoritesCount / maxCount) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
