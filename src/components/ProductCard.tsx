'use client';

import { Product, TagType } from '@/src/types';
import { useCart } from '@/src/app/lib/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

// Tag color mapping based on TagType
const getTagColors = (type: TagType): string => {
    switch (type) {
        case TagType.SKIN_TYPE:
            return 'bg-pastel-blue text-brand-brown';
        case TagType.CONCERN:
            return 'bg-pastel-green text-brand-brown';
        case TagType.CATEGORY:
            return 'bg-pastel-purple text-brand-brown';
        default:
            return 'bg-brand-cream text-brand-brown';
    }
};

interface ProductCardProps {
    product: Product;
    variant?: 'default' | 'compact';
    showAddToCart?: boolean;
}

export default function ProductCard({
    product,
    variant = 'default',
    showAddToCart = true,
}: ProductCardProps) {
    const { addToCart } = useCart();
    const [isAdding, setIsAdding] = useState(false);

    // Get the first image or placeholder
    const mainImage = product.images?.[0] || null;

    // Get display tags (max 2 for compact display)
    const displayTags = product.tags?.slice(0, 2) || [];

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsAdding(true);

        addToCart({
            productId: product.id,
            productName: product.name,
            productImage: mainImage || '',
            brandName: '', // No brand in current schema
            size: 'Único', // Default size
            price: product.price,
        });

        // Visual feedback
        setTimeout(() => setIsAdding(false), 600);
    };

    const cardContent = (
        <div
            className={`
        group relative bg-white rounded-3xl overflow-hidden shadow-soft 
        hover:shadow-soft-md transition-all duration-300
        ${variant === 'compact' ? 'p-3' : 'p-4'}
      `}
        >
            {/* Product Image Container */}
            <div
                className={`
          relative overflow-hidden rounded-2xl mb-3 bg-brand-cream group
          ${variant === 'compact' ? 'aspect-square' : 'aspect-[4/3]'}
        `}
            >
                {/* Decorative paw print on top of image */}
                <div className="absolute -bottom-1 -right-1 w-10 h-10 z-10 pointer-events-none transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <Image
                        src="/cat-paw.png"
                        alt=""
                        width={64}
                        height={64}
                        className="w-full h-full object-contain opacity-90"
                    />
                </div>

                {mainImage ? (
                    <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-brown/40">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="space-y-2">
                {/* Product Name */}
                <h3
                    className={`
            font-nunito font-semibold text-brand-brown line-clamp-2 
            group-hover:text-brand-orange transition-colors
            ${variant === 'compact' ? 'text-sm h-[2.5rem]' : 'text-base h-[3rem]'}
          `}
                >
                    {product.name}
                </h3>

                {/* Tags */}
                {displayTags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {displayTags.map((tag) => (
                            <span
                                key={tag.id}
                                className={`
                  text-xs font-medium px-2 py-0.5 rounded-full
                  ${getTagColors(tag.type as TagType)}
                `}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                {/* Price */}
                <p className={`font-baloo font-bold text-brand-orange ${variant === 'compact' ? 'text-base' : 'text-lg'}`}>
                    S/ {product.price.toFixed(2)}
                </p>

                {/* Add to Cart Button */}
                {showAddToCart && (
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className={`
              w-full py-2 rounded-xl font-nunito font-semibold text-sm
              transition-all duration-300 transform
              ${isAdding
                                ? 'bg-pastel-green text-brand-brown scale-95'
                                : 'bg-brand-cream text-brand-brown hover:bg-brand-orange hover:text-white hover:shadow-glow'
                            }
            `}
                    >
                        {isAdding ? '¡Agregado! ✓' : 'Agregar al Carrito'}
                    </button>
                )}
            </div>
        </div>
    );

    // Wrap in Link for navigation
    return (
        <Link href={`/producto/${product.id}`} className="block h-full">
            {cardContent}
        </Link>
    );
}