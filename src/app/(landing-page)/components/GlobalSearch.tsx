'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchResult {
    id: string;
    name: string;
    price: number;
    images: string[];
    summary?: string;
}

interface GlobalSearchProps {
    variant?: 'desktop' | 'mobile';
}

const MIN_SEARCH_LENGTH = 3;

export default function GlobalSearch({ variant = 'desktop' }: GlobalSearchProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search logic with debounce
    const handleSearch = useCallback((searchQuery: string) => {
        setQuery(searchQuery);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (searchQuery.length < MIN_SEARCH_LENGTH) {
            setResults([]);
            setIsOpen(false);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        debounceRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await response.json();
                setResults(data.products || []);
                setIsOpen(data.products?.length > 0);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);
    }, []);

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    const handleResultClick = () => {
        setIsOpen(false);
        setQuery('');
    };

    if (variant === 'mobile') {
        return (
            <div ref={containerRef} className="relative w-full">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Buscar productos..."
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => query.length >= MIN_SEARCH_LENGTH && results.length > 0 && setIsOpen(true)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-full border border-brand-cream bg-white focus:ring-2 focus:ring-brand-orange focus:border-transparent font-nunito text-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-brown/40" />
                    {query && (
                        <button
                            onClick={handleClear}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-brown/40 hover:text-brand-brown"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Mobile Results Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-brand-cream-dark max-h-[60vh] overflow-y-auto z-50"
                        >
                            <div className="p-2 space-y-1">
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/producto/${product.id}`}
                                        onClick={handleResultClick}
                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-brand-cream/50 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-brand-cream flex-shrink-0">
                                            {product.images?.[0] ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-brand-brown/30">
                                                    <Search size={16} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-nunito text-sm font-medium text-brand-brown truncate">
                                                {product.name}
                                            </p>
                                            <p className="font-baloo text-sm text-brand-orange">
                                                S/ {product.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link
                                href={`/catalogo?search=${encodeURIComponent(query)}`}
                                onClick={handleResultClick}
                                className="block p-3 text-center text-sm font-nunito text-brand-orange hover:bg-brand-cream/30 border-t border-brand-cream"
                            >
                                Ver todos los resultados ({results.length})
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Desktop variant
    return (
        <div ref={containerRef} className="relative flex-1 max-w-md mx-8">
            <div className="relative group">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Busca tu producto de skincare favorito..."
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => query.length >= MIN_SEARCH_LENGTH && results.length > 0 && setIsOpen(true)}
                    className="w-full bg-brand-cream-dark/30 border-2 border-transparent rounded-2xl py-2.5 pl-5 pr-12 text-brand-brown placeholder:text-brand-brown/50 focus:bg-white focus:border-brand-orange/30 focus:outline-none transition-all duration-300 text-sm"
                />
                {query ? (
                    <button
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-brown/60 hover:text-brand-orange transition-colors"
                    >
                        <X size={18} />
                    </button>
                ) : (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-brown/60">
                        <Search size={18} />
                    </div>
                )}
            </div>

            {/* Desktop Results Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-brand-cream-dark max-h-96 overflow-y-auto z-50"
                    >
                        <div className="p-2 space-y-1">
                            {results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/producto/${product.id}`}
                                    onClick={handleResultClick}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-brand-cream/50 transition-colors"
                                >
                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-brand-cream flex-shrink-0">
                                        {product.images?.[0] ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name}
                                                width={56}
                                                height={56}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-brand-brown/30">
                                                <Search size={20} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-nunito font-medium text-brand-brown truncate">
                                            {product.name}
                                        </p>
                                        {product.summary && (
                                            <p className="font-nunito text-xs text-brand-brown/60 truncate">
                                                {product.summary}
                                            </p>
                                        )}
                                        <p className="font-baloo text-sm text-brand-orange">
                                            S/ {product.price.toFixed(2)}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <Link
                            href={`/catalogo?search=${encodeURIComponent(query)}`}
                            onClick={handleResultClick}
                            className="block p-3 text-center text-sm font-nunito text-brand-orange hover:bg-brand-cream/30 border-t border-brand-cream"
                        >
                            Ver todos los resultados ({results.length})
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
