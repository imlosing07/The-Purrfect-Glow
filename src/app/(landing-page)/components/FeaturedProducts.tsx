import { getFeaturedProducts } from '@/src/services/product';
import ProductCard from '@/src/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';

export default async function FeaturedProducts() {
    const products = await getFeaturedProducts(10); // Get up to 10 featured products

    if (!products || products.length === 0) {
        return (
            <section className="py-12 relative">
                <div className="text-center text-brand-brown/60">
                    <p>No hay productos destacados por el momento</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 relative overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <h2 className="font-baloo font-bold text-2xl md:text-3xl text-brand-brown">
                        Productos Destacados
                    </h2>
                    <span className="text-2xl">✨</span>
                </div>
                <Link
                    href="/catalogo"
                    className="font-nunito text-brand-orange hover:text-brand-brown transition-colors group flex items-center gap-1"
                >
                    Ver catálogo
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
            </div>

            {/* Products Grid */}
            {/* Desktop: 5 columns, Tablet: 3 columns, Mobile: 2 columns */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        variant="default"
                    />
                ))}
            </div>
        </section>
    );
}
