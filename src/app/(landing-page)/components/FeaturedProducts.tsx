import { getFeaturedProducts } from '@/src/services/product';
import ProductCard from '@/src/components/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { FaTiktok } from 'react-icons/fa';

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
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-4 sm:px-0">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#FE2C55] via-[#25F4EE] to-[#FE2C55] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                        <h2 className="relative font-baloo font-extrabold text-3xl md:text-4xl text-brand-brown tracking-tight">
                            TikTok <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE2C55] to-[#25F4EE]">Viral</span>
                        </h2>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black shadow-lg">
                        <FaTiktok className="text-white text-xl" />
                    </div>
                    <span className="hidden sm:inline-block bg-brand-yellow/30 text-brand-brown text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border border-brand-yellow/50">
                        Trending ✨
                    </span>
                </div>
                <Link
                    href="/catalogo"
                    className="font-nunito font-bold text-brand-orange hover:text-brand-brown transition-all group flex items-center gap-1.5 self-start md:self-center"
                >
                    Explorar tendencia
                    <span className="group-hover:translate-x-1 transition-transform bg-brand-orange/10 p-1 rounded-full leading-none mt-0.5">→</span>
                </Link>
            </div>

            {/* Products Grid / Horizontal Scroll for Mobile */}
            <div className="relative">
                {/* Horizontal scroll on mobile, grid on desktop */}
                <div className="flex overflow-x-auto pb-8 -mx-4 px-4 gap-4 snap-x snap-mandatory scrollbar-hide no-scrollbar md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:gap-6 md:overflow-visible md:pb-0 md:mx-0 md:px-0">
                    {products.map((product) => (
                        <div key={product.id} className="w-[280px] sm:w-[320px] md:w-auto flex-shrink-0 snap-center md:snap-align-none">
                            <ProductCard
                                product={product}
                                variant="default"
                            />
                        </div>
                    ))}
                </div>

                {/* Mobile Scroll Indicator Overlay */}
                <div className="md:hidden absolute -bottom-1 left-0 right-0 h-1 bg-brand-cream-dark/30 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FE2C55] to-[#25F4EE] w-1/3 rounded-full animate-marquee"></div>
                </div>
            </div>
        </section>
    );
}
