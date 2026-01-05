'use client';

import { useState, useEffect } from 'react';
import { lusitana } from '@/src/app/ui/fonts';
import {
  TagIcon,
  ShoppingBagIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { Product } from '@/src/types';
import TopFavoriteProducts from './analytics/TopFavoriteProducts';
import TopBrandsChart from './analytics/TopBrandsChart';

interface DashboardStats {
  totalBrands: number;
  totalProducts: number;
  outOfStockProducts: number;
  productsOnSale: number;
  newProducts: number;
}

export default function DashboardSummary() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBrands: 0,
    totalProducts: 0,
    outOfStockProducts: 0,
    productsOnSale: 0,
    newProducts: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        // Get brands count
        const res = await fetch('/api/brands');
        const data = await res.json();
        const brandsResponse = data.total;

        // Get products count
        const res1 = await fetch('/api/products');
        const data1 = await res1.json();
        const productsResponse = data1.data.meta.total;

        // Get all products with full details for calculations
        const products = data1.data.products as Product[];

        // Calculate inventory statistics
        let outOfStockCount = 0;
        let productsOnSaleCount = 0;
        let newProductsCount = 0;

        products.forEach(product => {
          // Calculate total inventory for this product
          const totalInventory = product.sizes.reduce((sum, size) => sum + size.inventory, 0);

          // Out of stock (0 inventory)
          if (totalInventory === 0) {
            outOfStockCount++;
          }

          // Products on sale
          if (product.salePrice && product.salePrice > 0) {
            productsOnSaleCount++;
          }

          // New products
          if (product.isNew) {
            newProductsCount++;
          }
        });

        setStats({
          totalBrands: brandsResponse,
          totalProducts: productsResponse,
          outOfStockProducts: outOfStockCount,
          productsOnSale: productsOnSaleCount,
          newProducts: newProductsCount,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const quickStats = [
    {
      title: 'Total Productos',
      value: stats.totalProducts,
      icon: ShoppingBagIcon,
      color: 'bg-blue-100 text-blue-800',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Total Marcas',
      value: stats.totalBrands,
      icon: TagIcon,
      color: 'bg-purple-100 text-purple-800',
      iconColor: 'text-purple-600',
    },
    {
      title: 'Sin Stock',
      value: stats.outOfStockProducts,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-100 text-red-800',
      iconColor: 'text-red-600',
    },
  ];

  const alertStats = [
    {
      title: 'En Oferta',
      value: stats.productsOnSale,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-100 text-yellow-800',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Nuevos',
      value: stats.newProducts,
      icon: SparklesIcon,
      color: 'bg-emerald-100 text-emerald-800',
      iconColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={`${lusitana.className} text-xl sm:text-2xl font-bold`}>Resumen General</h2>
        <div className="text-xs sm:text-sm text-gray-500">
          {new Date().toLocaleDateString('es-ES')}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
        </div>
      ) : (
        <>
          {/* Quick Stats - Mobile: 2 cols, Tablet+: 3 cols */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className={`${lusitana.className} mt-1 sm:mt-2 text-xl sm:text-2xl font-bold`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-2 rounded-full ${stat.color}`}>
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top Favorites - New Analytics */}
          <TopFavoriteProducts />

          {/* Top Brands - New Analytics */}
          <TopBrandsChart />

          {/* Additional Stats - Mobile: 2 cols */}
          <div className="grid grid-cols-2 gap-3">
            {alertStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className={`${lusitana.className} mt-1 sm:mt-2 text-xl sm:text-2xl font-bold`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-2 rounded-full ${stat.color}`}>
                        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}