'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Package, AlertTriangle, Pencil, Plus, Minus, Loader2 } from 'lucide-react';
import { Product } from '@/src/types';
import { useToast } from '../components/Toast';
import StockModal from '../components/StockModal';

// Sales data type (from dashboard stats API)
interface ProductSalesMap {
    [productId: string]: number;
}

export default function InventarioPage() {
    const searchParams = useSearchParams();
    const initialFilter = searchParams.get('filter');

    const [products, setProducts] = useState<Product[]>([]);
    const [salesData, setSalesData] = useState<ProductSalesMap>({});
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showLowStockOnly, setShowLowStockOnly] = useState(initialFilter === 'low-stock');
    const { showToast } = useToast();

    // Stock modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'replenish' | 'adjust'>('replenish');
    const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; stock: number } | null>(null);

    // Fetch products + sales data in parallel
    useEffect(() => {
        async function fetchData() {
            try {
                const [productsRes, statsRes] = await Promise.all([
                    fetch('/api/products?limit=100'),
                    fetch('/api/dashboard/stats'),
                ]);

                const productsData = await productsRes.json();
                setProducts(productsData.products || []);

                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    // Build sales map from topSold (we need all products' sales though)
                    const salesMap: ProductSalesMap = {};
                    (statsData.topSold || []).forEach((item: any) => {
                        salesMap[item.productId] = item.totalSold;
                    });
                    setSalesData(salesMap);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                showToast('Error al cargar datos', 'error');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [showToast]);

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLowStock = !showLowStockOnly || product.stock < 5;
            return matchesSearch && matchesLowStock;
        });
    }, [products, searchQuery, showLowStockOnly]);

    // Stats
    const lowStockCount = useMemo(() => products.filter(p => p.stock < 5).length, [products]);

    // Modal handlers
    const openModal = (product: Product, mode: 'replenish' | 'adjust') => {
        setSelectedProduct({ id: product.id, name: product.name, stock: product.stock });
        setModalMode(mode);
        setModalOpen(true);
    };

    const handleStockUpdate = (productId: string, newStock: number) => {
        setProducts(prev =>
            prev.map(p => p.id === productId ? { ...p, stock: newStock, isAvailable: newStock > 0 } : p)
        );
        showToast('Stock actualizado ✅');
    };

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="font-baloo font-bold text-3xl text-brand-brown mb-1">
                    Inventario 📦
                </h1>
                <p className="font-nunito text-brand-brown/70">
                    Gestiona el stock de tus productos
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
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

                <button
                    onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                    className={`rounded-3xl p-4 shadow-soft text-left transition-all ${showLowStockOnly
                        ? 'bg-gradient-to-br from-red-50 to-orange-50 ring-2 ring-red-200'
                        : 'bg-white hover:bg-red-50'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-2xl ${lowStockCount > 0 ? 'bg-red-100' : 'bg-pastel-green'}`}>
                            <AlertTriangle size={20} className={lowStockCount > 0 ? 'text-red-500' : 'text-green-600'} />
                        </div>
                        <div>
                            <p className="text-xs font-nunito text-brand-brown/60">
                                {showLowStockOnly ? 'Mostrando bajo stock' : 'Stock bajo'}
                            </p>
                            <p className={`font-baloo font-bold text-xl ${lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {lowStockCount}
                            </p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="relative">
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
            </div>

            {/* Products Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-orange" />
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl shadow-soft">
                    <span className="text-4xl mb-4 block">🔍</span>
                    <p className="font-nunito text-brand-brown/60">
                        {showLowStockOnly ? 'No hay productos con stock bajo 🎉' : 'No se encontraron productos'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
                    {/* Table Header */}
                    <div className="hidden md:grid md:grid-cols-[1fr_80px_80px_100px_100px_50px] gap-4 px-6 py-3 bg-brand-cream/50 border-b border-brand-cream">
                        <span className="font-nunito text-xs font-semibold text-brand-brown/60 uppercase tracking-wider">Producto</span>
                        <span className="font-nunito text-xs font-semibold text-brand-brown/60 uppercase tracking-wider text-center">Stock</span>
                        <span className="font-nunito text-xs font-semibold text-brand-brown/60 uppercase tracking-wider text-center">Ventas 30d</span>
                        <span className="font-nunito text-xs font-semibold text-brand-brown/60 uppercase tracking-wider text-center">Reposición</span>
                        <span className="font-nunito text-xs font-semibold text-brand-brown/60 uppercase tracking-wider text-center">Ajuste</span>
                        <span className="font-nunito text-xs font-semibold text-brand-brown/60 uppercase tracking-wider text-center"></span>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-brand-cream">
                        {filteredProducts.map((product) => {
                            const sales = salesData[product.id] || 0;
                            const isLowStock = product.stock < 5;

                            return (
                                <div
                                    key={product.id}
                                    className={`px-4 md:px-6 py-3 md:py-4 hover:bg-brand-cream/30 transition-colors ${isLowStock ? 'bg-red-50/50' : ''}`}
                                >
                                    {/* Desktop: grid row */}
                                    <div className="hidden md:grid md:grid-cols-[1fr_80px_80px_100px_100px_50px] gap-4 items-center">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <p className="font-nunito font-medium text-sm text-brand-brown truncate">
                                                {product.name}
                                            </p>
                                            {isLowStock && (
                                                <span className="flex-shrink-0 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-nunito font-medium rounded-full">
                                                    ⚠️
                                                </span>
                                            )}
                                        </div>
                                        <span className={`font-baloo font-bold text-lg text-center ${isLowStock ? 'text-red-600' : 'text-brand-brown'}`}>
                                            {product.stock}
                                        </span>
                                        <span className="font-nunito text-sm text-brand-brown/70 text-center">
                                            {sales > 0 ? sales : '—'}
                                        </span>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => openModal(product, 'replenish')}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-pastel-green/60 text-green-700 rounded-xl text-xs font-nunito font-semibold hover:bg-pastel-green transition-colors"
                                            >
                                                <Plus size={14} />
                                                Agregar
                                            </button>
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => openModal(product, 'adjust')}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-pastel-blue/60 text-blue-700 rounded-xl text-xs font-nunito font-semibold hover:bg-pastel-blue transition-colors"
                                            >
                                                <Minus size={14} />
                                                Ajustar
                                            </button>
                                        </div>
                                        <div className="flex justify-center">
                                            <Link
                                                href={`/dashboard/inventario/${product.id}/editar`}
                                                className="p-2 bg-brand-cream rounded-xl hover:bg-brand-yellow transition-colors group"
                                                title="Editar producto"
                                            >
                                                <Pencil size={14} className="text-brand-brown/70 group-hover:text-brand-brown" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Mobile: compact row */}
                                    <div className="md:hidden">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            <p className="font-nunito font-medium text-sm text-brand-brown truncate flex-1 min-w-0">
                                                {product.name}
                                            </p>
                                            <span className={`font-baloo font-bold text-base flex-shrink-0 ${isLowStock ? 'text-red-600' : 'text-brand-brown'}`}>
                                                {product.stock}
                                                {isLowStock && <span className="ml-1 text-xs">⚠️</span>}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-nunito text-brand-brown/40 mr-auto">
                                                {sales > 0 ? `${sales} vendidos` : ''}
                                            </span>
                                            <button
                                                onClick={() => openModal(product, 'replenish')}
                                                className="p-1.5 bg-pastel-green/60 text-green-700 rounded-lg hover:bg-pastel-green transition-colors"
                                                title="Agregar stock"
                                            >
                                                <Plus size={14} />
                                            </button>
                                            <button
                                                onClick={() => openModal(product, 'adjust')}
                                                className="p-1.5 bg-pastel-blue/60 text-blue-700 rounded-lg hover:bg-pastel-blue transition-colors"
                                                title="Ajustar stock"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <Link
                                                href={`/dashboard/inventario/${product.id}/editar`}
                                                className="p-1.5 bg-brand-cream rounded-lg hover:bg-brand-yellow transition-colors"
                                                title="Editar producto"
                                            >
                                                <Pencil size={14} className="text-brand-brown/70" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Stock Modal */}
            <StockModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                product={selectedProduct}
                mode={modalMode}
                onSuccess={handleStockUpdate}
            />
        </div>
    );
}
