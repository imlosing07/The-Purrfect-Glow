'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Package } from 'lucide-react';
import { Product } from '@/src/types';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import { useToast } from '../components/Toast';

export default function InventarioPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const { showToast } = useToast();

    // Fetch products
    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch('/api/products?limit=50');
                const data = await response.json();
                setProducts(data.products || []);
            } catch (error) {
                console.error('Error fetching products:', error);
                showToast('Error al cargar productos', 'error');
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [showToast]);

    // Toggle product availability
    async function handleToggleAvailability(productId: string, currentState: boolean) {
        setUpdatingId(productId);

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ toggleAvailability: true }),
            });

            if (!response.ok) throw new Error('Failed to update');

            const updatedProduct = await response.json();

            // Update local state
            setProducts(prev =>
                prev.map(p => p.id === productId ? updatedProduct : p)
            );

            showToast(
                updatedProduct.isAvailable
                    ? '¡Listo! Producto disponible 🌟'
                    : 'Producto marcado como agotado'
            );
        } catch (error) {
            console.error('Error updating product:', error);
            showToast('Error al actualizar', 'error');
        } finally {
            setUpdatingId(null);
        }
    }

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesAvailable = !showOnlyAvailable || product.isAvailable;
        return matchesSearch && matchesAvailable;
    });

    // Stats
    const availableCount = products.filter(p => p.isAvailable).length;
    const outOfStockCount = products.filter(p => !p.isAvailable).length;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-baloo font-bold text-3xl text-brand-brown mb-2">
                    Inventario 📦
                </h1>
                <p className="font-nunito text-brand-brown/70">
                    Gestiona la disponibilidad de tus productos con un solo toque
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-3xl p-4 shadow-soft">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pastel-blue rounded-2xl">
                            <Package size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs font-nunito text-brand-brown/60">Total</p>
                            <p className="font-baloo font-bold text-xl text-brand-brown">{products.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-soft">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-pastel-green rounded-2xl">
                            <span className="text-lg">✅</span>
                        </div>
                        <div>
                            <p className="text-xs font-nunito text-brand-brown/60">Disponibles</p>
                            <p className="font-baloo font-bold text-xl text-brand-brown">{availableCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-4 shadow-soft col-span-2 md:col-span-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-status-pending rounded-2xl">
                            <span className="text-lg">⏸️</span>
                        </div>
                        <div>
                            <p className="text-xs font-nunito text-brand-brown/60">Agotados</p>
                            <p className="font-baloo font-bold text-xl text-brand-brown">{outOfStockCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-brown/40" />
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border-0 shadow-soft
              font-nunito text-brand-brown placeholder:text-brand-brown/40
              focus:ring-2 focus:ring-brand-orange focus:ring-offset-2 focus:ring-offset-brand-cream"
                    />
                </div>

                <button
                    onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
                    className={`
            flex items-center gap-2 px-4 py-3 rounded-2xl font-nunito font-medium text-sm
            transition-all duration-200
            ${showOnlyAvailable
                            ? 'bg-pastel-green text-green-800'
                            : 'bg-white text-brand-brown/70 hover:bg-brand-cream shadow-soft'
                        }
          `}
                >
                    <Filter size={16} />
                    Solo disponibles
                </button>
            </div>

            {/* Products List */}
            {loading ? (
                <ProductGridSkeleton count={6} />
            ) : (
                <AnimatePresence mode="popLayout">
                    <motion.div className="space-y-4">
                        {filteredProducts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 bg-white rounded-3xl shadow-soft"
                            >
                                <span className="text-4xl mb-4 block">🔍</span>
                                <p className="font-nunito text-brand-brown/60">
                                    No se encontraron productos
                                </p>
                            </motion.div>
                        ) : (
                            filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onToggleAvailability={handleToggleAvailability}
                                    isUpdating={updatingId === product.id}
                                />
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
}
