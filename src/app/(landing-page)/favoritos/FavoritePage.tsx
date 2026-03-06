'use client';

import { useWishlist } from '@/src/app/lib/contexts/WishlistContext';
import { useCart } from '@/src/app/lib/contexts/CartContext';
import { useEffect, useState } from 'react';
import { Product } from "@/src/types";
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingCart, ArrowLeft } from 'lucide-react';
import { getUserWishlist } from '@/src/actions/wishlist';

// ═══════════════════════════════════════════════════════════════
// FAVORITE CARD COMPONENT
// ═══════════════════════════════════════════════════════════════
function FavoriteCard({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: () => void;
}) {
  const mainImage = product.images?.[0] || null;

  return (
    <div className="relative bg-white rounded-3xl overflow-hidden shadow-soft p-3 group">
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 z-20 w-8 h-8 bg-pastel-pink hover:bg-red-200 rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110"
        aria-label="Eliminar de favoritos"
      >
        <X className="w-4 h-4 text-brand-brown" />
      </button>

      <Link href={`/producto/${product.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-cream mb-3">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-brown/40">
              <span className="text-3xl">🧴</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <h3 className="font-nunito font-semibold text-brand-brown text-sm line-clamp-2 h-[2.5rem] group-hover:text-brand-orange transition-colors">
          {product.name}
        </h3>
        <p className="font-baloo font-bold text-brand-orange">
          S/ {product.price.toFixed(2)}
        </p>
      </Link>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SELECTION SUMMARY COMPONENT (Desktop Sidebar)
// ═══════════════════════════════════════════════════════════════
function SelectionSummary({
  count,
  total,
  onMoveToCart,
  isMoving,
}: {
  count: number;
  total: number;
  onMoveToCart: () => void;
  isMoving: boolean;
}) {
  return (
    <div className="bg-white rounded-[40px] shadow-soft p-6 space-y-5">
      {/* Cat illustration */}
      <div className="flex justify-center">
        <div className="relative">
          <span className="text-5xl">🐱</span>
          <div className="absolute -right-2 -bottom-1">
            <ShoppingCart className="w-6 h-6 text-brand-orange" />
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="font-baloo font-bold text-brand-brown text-lg">
          Resumen de Selección
        </h3>
        <p className="font-nunito text-brand-brown/70 text-sm">
          ¡Lleva todo a tu carrito con un clic!
        </p>
      </div>

      {/* Stats */}
      <div className="bg-brand-cream/50 rounded-2xl p-4 space-y-2">
        <div className="flex justify-between font-nunito text-sm text-brand-brown">
          <span>Productos</span>
          <span className="font-semibold">{count}</span>
        </div>
        <div className="flex justify-between font-baloo text-brand-brown">
          <span>Total estimado</span>
          <span className="font-bold text-brand-orange">S/ {total.toFixed(2)}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={onMoveToCart}
          disabled={count === 0 || isMoving}
          className="w-full py-3.5 rounded-2xl font-baloo font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#FFB559' }}
        >
          {isMoving ? (
            <>
              <ShoppingCart className="w-5 h-5 animate-spin" />
              Moviendo...
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Mover todo al Carrito
            </>
          )}
        </button>

        <Link
          href="/catalogo"
          className="w-full py-3 rounded-2xl font-baloo font-semibold text-brand-orange border-2 border-brand-orange hover:bg-brand-orange/10 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Catálogo
        </Link>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EMPTY STATE COMPONENT
// ═══════════════════════════════════════════════════════════════
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-6">
        <span className="text-6xl">😿</span>
      </div>

      <h2 className="font-baloo font-bold text-2xl text-brand-brown mb-2">
        No tienes favoritos aún
      </h2>
      <p className="font-nunito text-brand-brown/70 mb-6 max-w-sm">
        Explora nuestro catálogo y guarda los productos que te encanten para encontrarlos fácilmente 💕
      </p>

      <Link
        href="/catalogo"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-baloo font-semibold text-white transition-all hover:shadow-glow"
        style={{ backgroundColor: '#FFB559' }}
      >
        <span>🛍️</span>
        Explorar Catálogo
      </Link>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMoving, setIsMoving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { wishlistIds, toggleFavorite, isAuthenticated } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const result = await getUserWishlist();
        if (result.success) {
          setProducts(result.products as Product[]);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const favoriteProducts = products;
  const isEmpty = favoriteProducts.length === 0;
  const totalPrice = favoriteProducts.reduce((sum, p) => sum + p.price, 0);

  const handleRemove = async (productId: string) => {
    await toggleFavorite(productId);
  };

  const handleMoveAllToCart = async () => {
    if (favoriteProducts.length === 0) return;

    setIsMoving(true);

    for (const product of favoriteProducts) {
      addToCart({
        productId: product.id,
        productName: product.name,
        productImage: product.images?.[0] || '',
        brandName: '',
        size: 'Único',
        price: product.price,
      });
    }

    setShowSuccess(true);
    setTimeout(() => {
      setIsMoving(false);
      setShowSuccess(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF6E6] flex items-center justify-center">
        <div className="text-4xl animate-spin">🐱</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF6E6] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-[40px] shadow-soft-lg p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <span className="text-6xl">🐱</span>
          </div>

          <h1 className="font-baloo font-bold text-2xl text-brand-brown mb-2">
            ¡Únete para guardar favoritos!
          </h1>
          <p className="font-nunito text-brand-brown/70 text-sm mb-6">
            Inicia sesión para guardar tus productos favoritos y acceder a beneficios exclusivos del Club Purrfect Glow ✨
          </p>

          <div className="bg-brand-cream/50 rounded-2xl p-4 mb-6 text-left">
            <p className="font-nunito font-semibold text-brand-brown text-xs uppercase tracking-wide mb-2">
              Beneficios de unirte
            </p>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span>💕</span>
                <span className="font-nunito text-brand-brown/80">Guarda tus productos favoritos</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🏷️</span>
                <span className="font-nunito text-brand-brown/80">Descuentos exclusivos</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎮</span>
                <span className="font-nunito text-brand-brown/80">Retos y premios (próximamente)</span>
              </div>
            </div>
          </div>

          <Link
            href="/login"
            className="block w-full py-3.5 rounded-2xl font-baloo font-semibold text-white transition-all hover:shadow-glow mb-3"
            style={{ backgroundColor: '#FFB559' }}
          >
            Iniciar sesión
          </Link>

          <Link
            href="/catalogo"
            className="block font-nunito text-sm text-brand-brown/60 hover:text-brand-orange transition-colors"
          >
            Continuar explorando →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF6E6] pb-32 lg:pb-8">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FFECD2] to-[#FFF6E6] py-8 lg:py-12">
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-3">
            <span className="text-5xl">😻</span>
          </div>

          <h1
            className="font-baloo font-bold text-3xl lg:text-4xl"
            style={{ color: '#C18046' }}
          >
            Mis Favoritos
          </h1>
          {!isEmpty && (
            <p className="font-nunito text-brand-brown/60 mt-2">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto guardado' : 'productos guardados'}
            </p>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Grid */}
            <div className="flex-1 lg:w-[70%]">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {favoriteProducts.map((product) => (
                  <FavoriteCard
                    key={product.id}
                    product={product}
                    onRemove={() => handleRemove(product.id)}
                  />
                ))}
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-[30%] lg:max-w-xs">
              <div className="sticky top-24">
                <SelectionSummary
                  count={favoriteProducts.length}
                  total={totalPrice}
                  onMoveToCart={handleMoveAllToCart}
                  isMoving={isMoving}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM BAR */}
      {!isEmpty && (
        <div className="lg:hidden fixed bottom-20 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-brand-cream-dark p-4 z-50 shadow-lg">
          {showSuccess && (
            <div className="absolute -top-14 left-4 right-4 bg-pastel-green border border-green-200 rounded-xl p-3 flex items-center gap-2 shadow-lg">
              <span>✓</span>
              <p className="text-brand-brown font-medium text-sm">¡Todos agregados al carrito! 🎉</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-nunito text-xs text-brand-brown/60">
                {favoriteProducts.length} productos
              </p>
              <p className="font-baloo font-bold text-brand-orange">
                S/ {totalPrice.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleMoveAllToCart}
              disabled={isMoving}
              className="flex-1 max-w-[200px] py-3 rounded-xl font-baloo font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ backgroundColor: '#FFB559' }}
            >
              {isMoving ? (
                'Moviendo...'
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Mover al Carrito
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}