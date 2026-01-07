'use client';

import { motion } from 'framer-motion';

// Base skeleton with shimmer animation
function SkeletonBase({ className = '' }: { className?: string }) {
    return (
        <div className={`relative overflow-hidden bg-brand-cream-dark rounded-2xl ${className}`}>
            <motion.div
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                animate={{ x: ['0%', '200%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
}

// Product card skeleton
export function ProductSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-4 shadow-soft">
            <div className="flex gap-4">
                {/* Image skeleton */}
                <SkeletonBase className="w-20 h-20 flex-shrink-0" />

                {/* Content */}
                <div className="flex-1 space-y-3">
                    {/* Title */}
                    <SkeletonBase className="h-5 w-3/4" />

                    {/* Price */}
                    <SkeletonBase className="h-4 w-1/4" />

                    {/* Tags */}
                    <div className="flex gap-2">
                        <SkeletonBase className="h-6 w-16" />
                        <SkeletonBase className="h-6 w-20" />
                    </div>
                </div>

                {/* Toggle skeleton */}
                <SkeletonBase className="w-12 h-6 flex-shrink-0" />
            </div>
        </div>
    );
}

// Product grid skeleton
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}

// Order card skeleton
export function OrderSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-soft">
            <div className="flex justify-between items-start mb-4">
                {/* Order ID and date */}
                <div className="space-y-2">
                    <SkeletonBase className="h-5 w-32" />
                    <SkeletonBase className="h-4 w-24" />
                </div>
                {/* Status */}
                <SkeletonBase className="h-8 w-24" />
            </div>

            {/* Customer info */}
            <div className="space-y-2 mb-4">
                <SkeletonBase className="h-4 w-48" />
                <SkeletonBase className="h-4 w-36" />
                <SkeletonBase className="h-4 w-40" />
            </div>

            {/* Products */}
            <div className="space-y-2 border-t border-brand-cream pt-4">
                <SkeletonBase className="h-4 w-full" />
                <SkeletonBase className="h-4 w-3/4" />
            </div>

            {/* Total */}
            <div className="flex justify-end mt-4">
                <SkeletonBase className="h-6 w-28" />
            </div>
        </div>
    );
}

// Order list skeleton
export function OrderListSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <OrderSkeleton key={i} />
            ))}
        </div>
    );
}

// Stats skeleton
export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow-soft">
                    <SkeletonBase className="h-4 w-24 mb-2" />
                    <SkeletonBase className="h-8 w-16" />
                </div>
            ))}
        </div>
    );
}
