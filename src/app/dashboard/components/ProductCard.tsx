'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product, TagType } from '@/src/types';
import Toggle from './Toggle';
import { Pencil } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onToggleAvailability: (productId: string, currentState: boolean) => void;
    isUpdating?: boolean;
}

// Tag color mapping
const tagColors: Record<TagType, string> = {
    [TagType.SKIN_TYPE]: 'bg-pastel-blue text-blue-800',
    [TagType.CONCERN]: 'bg-pastel-purple text-purple-800',
    [TagType.CATEGORY]: 'bg-pastel-green text-green-800',
};

export default function ProductCard({ product, onToggleAvailability, isUpdating = false }: ProductCardProps) {
    const mainImage = product.images[0] || '/placeholder-product.png';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
        bg-white rounded-3xl p-4 shadow-soft hover:shadow-soft-md transition-shadow
        ${!product.isAvailable ? 'opacity-60' : ''}
      `}
        >
            <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-brand-cream flex-shrink-0">
                    <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                    />
                    {!product.isAvailable && (
                        <div className="absolute inset-0 bg-brand-brown/30 flex items-center justify-center">
                            <span className="text-white text-xs font-nunito font-semibold bg-brand-brown/80 px-2 py-1 rounded-full">
                                Agotado
                            </span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-nunito font-semibold text-brand-brown text-sm line-clamp-2 leading-tight">
                        {product.name}
                    </h3>

                    <p className="font-baloo font-bold text-brand-orange text-lg mt-1">
                        S/ {product.price.toFixed(2)}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {product.tags?.slice(0, 3).map((tag) => (
                            <span
                                key={tag.id}
                                className={`
                  px-2 py-0.5 rounded-full text-xs font-nunito font-medium
                  ${tagColors[tag.type]}
                `}
                            >
                                {tag.name}
                            </span>
                        ))}
                        {product.tags && product.tags.length > 3 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-nunito text-brand-brown/50 bg-brand-cream">
                                +{product.tags.length - 3}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end justify-between flex-shrink-0 gap-2">
                    {/* Edit Button */}
                    <Link
                        href={`/dashboard/inventario/${product.id}/editar`}
                        className="p-2 bg-brand-cream rounded-xl hover:bg-brand-yellow transition-colors group"
                        title="Editar producto"
                    >
                        <Pencil size={16} className="text-brand-brown/70 group-hover:text-brand-brown" />
                    </Link>

                    {/* Toggle & Status */}
                    <div className="flex flex-col items-end">
                        <Toggle
                            checked={product.isAvailable}
                            onChange={() => onToggleAvailability(product.id, product.isAvailable)}
                            disabled={isUpdating}
                            size="sm"
                        />
                        <span className={`text-xs font-nunito mt-1 ${product.isAvailable ? 'text-green-600' : 'text-brand-brown/50'}`}>
                            {product.isAvailable ? 'Disponible' : 'Agotado'}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
