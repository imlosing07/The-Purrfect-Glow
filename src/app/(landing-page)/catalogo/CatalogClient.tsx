'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Tag, TagType } from '@/src/types';
import ProductCard from '@/src/components/ProductCard';
import Image from 'next/image';

// Skin type colors for buttons
const skinTypeColors: Record<string, string> = {
    'piel-grasa': 'bg-pastel-blue border-pastel-blue',
    'piel-seca': 'bg-brand-orange/20 border-brand-orange',
    'piel-mixta': 'bg-pastel-green border-pastel-green',
    'piel-sensible': 'bg-pastel-purple border-pastel-purple',
    'piel-acneica': 'bg-pastel-pink border-pastel-pink',
    'todo-tipo-piel': 'bg-brand-cream border-brand-yellow',
};

const skinTypeActiveColors: Record<string, string> = {
    'piel-grasa': 'bg-pastel-blue ring-2 ring-pastel-blue ring-offset-2',
    'piel-seca': 'bg-brand-orange ring-2 ring-brand-orange ring-offset-2',
    'piel-mixta': 'bg-pastel-green ring-2 ring-pastel-green ring-offset-2',
    'piel-sensible': 'bg-pastel-purple ring-2 ring-pastel-purple ring-offset-2',
    'piel-acneica': 'bg-pastel-pink ring-2 ring-pastel-pink ring-offset-2',
    'todo-tipo-piel': 'bg-brand-yellow ring-2 ring-brand-yellow ring-offset-2',
};

interface CatalogClientProps {
    initialProducts: Product[];
    tags: Tag[];
    initialSkinType?: string;
}

export default function CatalogClient({ initialProducts, tags, initialSkinType }: CatalogClientProps) {
    // Filter states - initialize with URL param if present
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSkinTypes, setSelectedSkinTypes] = useState<string[]>(
        initialSkinType ? [initialSkinType] : []
    );
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Separate tags by type
    const skinTypeTags = useMemo(() =>
        tags.filter(t => t.type === TagType.SKIN_TYPE), [tags]);
    const categoryTags = useMemo(() =>
        tags.filter(t => t.type === TagType.CATEGORY), [tags]);
    const concernTags = useMemo(() =>
        tags.filter(t => t.type === TagType.CONCERN), [tags]);

    // Carousel ref for mobile
    const carouselRef = useRef<HTMLDivElement>(null);

    // Filter products
    const filteredProducts = useMemo(() => {
        let result = initialProducts;

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.summary?.toLowerCase().includes(query)
            );
        }

        // Skin type filter (OR logic - product matches ANY selected skin type)
        if (selectedSkinTypes.length > 0) {
            result = result.filter(p =>
                p.tags?.some(tag => selectedSkinTypes.includes(tag.slug))
            );
        }

        // Category filter (OR logic)
        if (selectedCategories.length > 0) {
            result = result.filter(p =>
                p.tags?.some(tag => selectedCategories.includes(tag.slug))
            );
        }

        // Concern filter (OR logic)
        if (selectedConcerns.length > 0) {
            result = result.filter(p =>
                p.tags?.some(tag => selectedConcerns.includes(tag.slug))
            );
        }

        return result;
    }, [initialProducts, searchQuery, selectedSkinTypes, selectedCategories, selectedConcerns]);

    // Toggle functions
    const toggleSkinType = (slug: string) => {
        setSelectedSkinTypes(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    };

    const toggleCategory = (slug: string) => {
        setSelectedCategories(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    };

    const toggleConcern = (slug: string) => {
        setSelectedConcerns(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setSelectedSkinTypes([]);
        setSelectedCategories([]);
        setSelectedConcerns([]);
    };

    const hasActiveFilters = selectedSkinTypes.length > 0 || selectedCategories.length > 0 || selectedConcerns.length > 0 || searchQuery.trim();

    return (
        <div className="min-h-screen bg-brand-cream/30">
            {/* Mobile Search Bar - Fixed */}
            <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm px-4 py-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-full border border-brand-cream bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent font-nunito text-sm"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-brown/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Mobile Skin Type Carousel */}
            <div className="lg:hidden overflow-hidden py-4 px-4 bg-white border-b border-brand-cream">
                <p className="text-xs font-nunito text-brand-brown/60 mb-2">Tipo de Piel</p>
                <div
                    ref={carouselRef}
                    className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {skinTypeTags.map((tag) => (
                        <button
                            key={tag.id}
                            onClick={() => toggleSkinType(tag.slug)}
                            className={`
                flex-shrink-0 flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all duration-200
                ${selectedSkinTypes.includes(tag.slug)
                                    ? skinTypeActiveColors[tag.slug] || 'bg-brand-orange ring-2 ring-brand-orange ring-offset-2'
                                    : skinTypeColors[tag.slug] || 'bg-brand-cream'
                                }
              `}
                        >
                            {/* Icon placeholder */}
                            <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                                <span className="text-lg">🐱</span>
                            </div>
                            <span className="text-xs font-nunito font-medium text-brand-brown whitespace-nowrap">
                                {tag.name.replace('Piel ', '')}
                            </span>
                        </button>
                    ))}
                </div>

                {/* More Filters Button */}
                <button
                    onClick={() => setShowMobileFilters(true)}
                    className="mt-3 w-full py-2 px-4 bg-brand-cream rounded-full font-nunito text-sm text-brand-brown flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Más filtros
                    {(selectedCategories.length + selectedConcerns.length) > 0 && (
                        <span className="bg-brand-orange text-white text-xs px-2 py-0.5 rounded-full">
                            {selectedCategories.length + selectedConcerns.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {showMobileFilters && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                            onClick={() => setShowMobileFilters(false)}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto lg:hidden"
                        >
                            <div className="sticky top-0 bg-white p-4 border-b flex items-center justify-between">
                                <h3 className="font-baloo font-bold text-lg text-brand-brown">Filtros</h3>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 hover:bg-brand-cream rounded-full"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-4 space-y-6">
                                {/* Categories */}
                                <div>
                                    <h4 className="font-nunito font-semibold text-brand-brown mb-3">Categoría</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {categoryTags.map((tag) => (
                                            <button
                                                key={tag.id}
                                                onClick={() => toggleCategory(tag.slug)}
                                                className={`
                          px-3 py-1.5 rounded-full text-sm font-nunito transition-all
                          ${selectedCategories.includes(tag.slug)
                                                        ? 'bg-brand-orange text-white'
                                                        : 'bg-brand-cream text-brand-brown hover:bg-brand-cream-dark'
                                                    }
                        `}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Concerns */}
                                <div>
                                    <h4 className="font-nunito font-semibold text-brand-brown mb-3">Preocupación</h4>
                                    <div className="space-y-2">
                                        {concernTags.map((tag) => (
                                            <label
                                                key={tag.id}
                                                className="flex items-center gap-3 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedConcerns.includes(tag.slug)}
                                                    onChange={() => toggleConcern(tag.slug)}
                                                    className="w-4 h-4 rounded border-brand-brown/30 text-brand-orange focus:ring-brand-orange"
                                                />
                                                <span className="font-nunito text-sm text-brand-brown">{tag.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-white p-4 border-t flex gap-3">
                                <button
                                    onClick={clearAllFilters}
                                    className="flex-1 py-2.5 border border-brand-brown/20 rounded-full font-nunito text-sm text-brand-brown"
                                >
                                    Limpiar
                                </button>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="flex-1 py-2.5 bg-brand-orange text-white rounded-full font-nunito text-sm font-semibold"
                                >
                                    Ver {filteredProducts.length} productos
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Layout */}
            <div className="hidden lg:flex max-w-7xl mx-auto px-4 py-8 gap-8">
                {/* Sidebar */}
                <aside className="w-64 flex-shrink-0">
                    <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-soft space-y-6">
                        {/* Search */}
                        <div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-full border border-brand-cream bg-brand-cream/30 focus:ring-2 focus:ring-brand-orange focus:border-transparent font-nunito text-sm"
                                />
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-brown/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Skin Type */}
                        <div>
                            <h3 className="font-baloo font-bold text-brand-brown mb-3">Tipo de Piel</h3>
                            <div className="space-y-2">
                                {skinTypeTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleSkinType(tag.slug)}
                                        className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200
                      hover:scale-[1.02]
                      ${selectedSkinTypes.includes(tag.slug)
                                                ? skinTypeActiveColors[tag.slug] || 'bg-brand-orange text-white'
                                                : skinTypeColors[tag.slug] || 'bg-brand-cream'
                                            }
                    `}
                                    >
                                        {/* Icon placeholder */}
                                        <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm">🐱</span>
                                        </div>
                                        <span className="font-nunito text-sm font-medium text-brand-brown">
                                            {tag.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category Chips */}
                        <div>
                            <h3 className="font-baloo font-bold text-brand-brown mb-3">Categoría</h3>
                            <div className="flex flex-wrap gap-2">
                                {categoryTags.map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggleCategory(tag.slug)}
                                        className={`
                      px-3 py-1 rounded-full text-xs font-nunito transition-all hover:scale-105
                      ${selectedCategories.includes(tag.slug)
                                                ? 'bg-brand-orange text-white'
                                                : 'bg-brand-cream text-brand-brown hover:bg-brand-cream-dark'
                                            }
                    `}
                                    >
                                        {tag.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Concerns Checkboxes */}
                        <div>
                            <h3 className="font-baloo font-bold text-brand-brown mb-3">Preocupación</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {concernTags.map((tag) => (
                                    <label
                                        key={tag.id}
                                        className="flex items-center gap-2 cursor-pointer hover:bg-brand-cream/50 px-2 py-1 rounded-lg transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedConcerns.includes(tag.slug)}
                                            onChange={() => toggleConcern(tag.slug)}
                                            className="w-4 h-4 rounded border-brand-brown/30 text-brand-orange focus:ring-brand-orange"
                                        />
                                        <span className="font-nunito text-sm text-brand-brown">{tag.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="w-full py-2 text-sm font-nunito text-brand-orange hover:underline"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="flex-1">
                    {/* Results count */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="font-nunito text-brand-brown/70">
                            {filteredProducts.length} productos encontrados
                        </p>
                    </div>

                    {/* Grid */}
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-4 opacity-50">
                                <Image src="/cat-paw.png" alt="" width={96} height={96} />
                            </div>
                            <p className="font-nunito text-brand-brown/60 mb-2">No se encontraron productos</p>
                            <button
                                onClick={clearAllFilters}
                                className="text-brand-orange hover:underline font-nunito text-sm"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
                            layout
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredProducts.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </main>
            </div>

            {/* Mobile Product Grid */}
            <div className="lg:hidden px-4 py-6">
                <p className="font-nunito text-sm text-brand-brown/70 mb-4">
                    {filteredProducts.length} productos
                </p>

                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="font-nunito text-brand-brown/60 mb-2">No se encontraron productos</p>
                        <button
                            onClick={clearAllFilters}
                            className="text-brand-orange hover:underline font-nunito text-sm"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-2 gap-3"
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ProductCard product={product} variant="compact" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
