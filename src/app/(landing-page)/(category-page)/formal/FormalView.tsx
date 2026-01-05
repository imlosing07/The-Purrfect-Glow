"use client";
import { Product } from "@/src/types";
import { useState, useMemo } from "react";
import FormalProductCard from "../components/FormalProductCard";
import { Genre } from "@/src/app/lib/constants/product-constants";
import { useRouter } from "next/navigation";

interface FilterState {
  genres: Genre[];
  brands: string[];
  priceRange: { min: number; max: number } | null;
}

const GENRE_LABELS = {
  MENS: "Caballero",
  WOMENS: "Dama",
  UNISEX: "Unisex",
  KIDS: "Niños",
};

export default function FormalView({ products }: { products: Product[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    brands: [],
    priceRange: null,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => p.category === "FORMAL");

    if (filters.genres.length > 0) {
      result = result.filter(p =>
        filters.genres.includes(p.genre) || p.genre === "UNISEX"
      );
    }

    if (filters.brands.length > 0) {
      result = result.filter(p => p.brand && filters.brands.includes(p.brand.name));
    }

    if (filters.priceRange) {
      result = result.filter(p => {
        const price = p.salePrice || p.price;
        return price >= filters.priceRange!.min && price <= filters.priceRange!.max;
      });
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case "featured":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, filters, sortBy]);

  const availableBrands = useMemo(() => {
    const brands = products
      .filter(p => p.category === "FORMAL")
      .map(p => p.brand?.name)
      .filter((name): name is string => !!name);
    return Array.from(new Set(brands)).sort();
  }, [products]);

  const toggleGenre = (genre: Genre) => {
    const newGenres = filters.genres.includes(genre)
      ? filters.genres.filter(g => g !== genre)
      : [...filters.genres, genre];
    setFilters({ ...filters, genres: newGenres });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    setFilters({ ...filters, brands: newBrands });
  };

  const handleProductClick = (product: Product) => {
    router.push(`/producto/${product.id}`); // Navega a la página del producto
  };

  return (
    <div className="pt-16 bg-neutral-50">
      {/* Hero Premium - Full Screen */}
      <div className="relative h-screen overflow-hidden bg-black">
        {/* Video o imagen de fondo con efecto parallax */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[2000ms]"
            style={{
              backgroundImage: "url('/categoryImages/desktopFormal.webp')",
              filter: 'brightness(0.4) contrast(1.1)'
            }}
          />
          {/* Patrón de puntos sutil */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>

        {/* Contenido del hero */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl space-y-8 animate-fade-in">
            {/* Badge superior */}
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] text-white/90 uppercase tracking-[0.3em] font-light">
                Colección Exclusiva 2025
              </span>
            </div>

            {/* Título principal con efecto de brillo */}
            <h1 className="relative font-serif text-[clamp(3rem,10vw,7rem)] text-white font-extralight tracking-tight leading-[0.9]">
              Formal
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xl" />
            </h1>

            {/* Subtítulo elegante */}
            <p className="text-xl md:text-2xl text-gray-300/90 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
              Maestría artesanal que trasciende el tiempo.<br />
              Elegancia refinada para momentos extraordinarios.
            </p>

            {/* Estadísticas minimalistas */}
            <div className="flex items-center justify-center gap-12 pt-8">
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-1">{filteredProducts.length}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">Estilos</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-1">{availableBrands.length}</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">Marcas</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="text-3xl font-light text-white mb-1">100%</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest">Premium</div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
              <span className="text-[9px] text-white/60 uppercase tracking-widest">Explorar</span>
              <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de filtros sticky premium */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm font-light hover:text-black transition group"
              >
                <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                <span className="uppercase tracking-wider">Filtros</span>
                {(filters.genres.length + filters.brands.length) > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-black text-white text-xs rounded-full">
                    {filters.genres.length + filters.brands.length}
                  </span>
                )}
              </button>

              <div className="h-6 w-px bg-gray-200" />

              <span className="text-sm text-gray-500 font-light">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "featured" | "price-asc" | "price-desc")}
              className="text-sm font-light border-0 focus:ring-0 text-gray-700 cursor-pointer bg-transparent"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Ascendente</option>
              <option value="price-desc">Precio: Descendente</option>
            </select>
          </div>

          {/* Panel de filtros expandible */}
          {showFilters && (
            <div className="border-t border-gray-200 py-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Género */}
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">Colección</h3>
                  <div className="space-y-2">
                    {(["MENS", "WOMENS", "UNISEX"] as Genre[]).map((genre) => (
                      <button
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`w-full text-left px-4 py-2 text-sm font-light tracking-wide transition rounded ${filters.genres.includes(genre)
                          ? "bg-black text-white"
                          : "hover:bg-gray-50 text-gray-700"
                          }`}
                      >
                        {GENRE_LABELS[genre]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Marcas */}
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">Casas de Moda</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pr-2 scrollbar-thin">
                    {availableBrands.map((brand) => (
                      <label
                        key={brand}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded transition"
                      >
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-3.5 h-3.5 rounded-sm border-gray-300 text-black focus:ring-black focus:ring-offset-0"
                        />
                        <span className="text-sm font-light">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-4">Acciones</h3>
                    {(filters.genres.length > 0 || filters.brands.length > 0) && (
                      <button
                        onClick={() => setFilters({ genres: [], brands: [], priceRange: null })}
                        className="text-xs text-gray-500 hover:text-black underline font-light tracking-wide"
                      >
                        Limpiar todo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid de productos premium */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-32">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-light text-gray-900 mb-2">No se encontraron productos</h3>
            <p className="text-sm text-gray-500 font-light mb-6">Prueba ajustando los filtros seleccionados</p>
            <button
              onClick={() => setFilters({ genres: [], brands: [], priceRange: null })}
              className="text-sm text-black underline hover:no-underline font-light tracking-wide"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {filteredProducts.map((product) => (
              <FormalProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sección de valores de marca - Premium */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-gray-900 font-light tracking-tight mb-4">La Diferencia</h2>
            <p className="text-gray-500 font-light max-w-2xl mx-auto">
              Cada par cuenta una historia de dedicación, precisión y pasión por la perfección
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-gray-900 font-light">Artesanía Excepcional</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Cada zapato es elaborado a mano por maestros artesanos con décadas de experiencia
              </p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-gray-900 font-light">Materiales Premium</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Cueros europeos de primera calidad, seleccionados por su durabilidad y belleza natural
              </p>
            </div>

            <div className="text-center space-y-4 group">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-gray-900 font-light">Diseño Atemporal</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Siluetas clásicas que trascienden tendencias, una inversión para toda la vida
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Premium */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-24 text-center">
          <h2 className="font-serif text-5xl font-light tracking-tight mb-6">
            Experiencia de Compra Exclusiva
          </h2>
          <p className="text-lg text-gray-300 font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            Agenda una cita privada con nuestros expertos en calzado formal para una experiencia personalizada
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-white text-black rounded font-light tracking-wide hover:bg-gray-100 transition">
              Agendar Cita
            </button>
            <button className="px-8 py-4 border border-white/30 rounded font-light tracking-wide hover:bg-white/10 transition">
              Asesoría Virtual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}