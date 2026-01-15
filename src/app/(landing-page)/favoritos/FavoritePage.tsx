'use client';

import { useWishlist } from '@/src/app/lib/contexts/WishlistContext';
import { useCart } from '@/src/app/lib/contexts/CartContext';
import { useMemo, useEffect, useState } from 'react';
import { Product } from "@/src/types";
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white rounded-3xl overflow-hidden shadow-soft p-3 group"
    >
      {/* Delete Button - Paw shaped bubble */}
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

      {/* Decorative Paw */}
      <div className="absolute -bottom-1 -right-1 w-8 h-8 z-10 pointer-events-none opacity-60">
        <Image src="/cat-paw.png" alt="" width={32} height={32} />
      </div>

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
    </motion.div>
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
      {/* Cat with cart illustration */}
      <div className="flex justify-center">
        <div className="relative">
          <Image
            src="/Elementos/Group 1697.png"
            alt="Gatito con carrito"
            width={80}
            height={80}
            className="drop-shadow-sm"
          />
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
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              >
                <ShoppingCart className="w-5 h-5" />
              </motion.div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      {/* Cat searching illustration */}
      <div className="relative mb-6">
        <Image
          src="/Elementos/Group 1703.png"
          alt="Gatito buscando"
          width={150}
          height={150}
          className="drop-shadow-md"
        />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-2 -right-2"
        >
          <span className="text-2xl">💭</span>
        </motion.div>
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
    </motion.div>
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

  // In your FavoritesPage component, replace the useEffect with:
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

  // And remove the filtering since products are already favorites:
  const favoriteProducts = products;

  const isEmpty = favoriteProducts.length === 0;
  const totalPrice = favoriteProducts.reduce((sum, p) => sum + p.price, 0);

  // Handle remove product from favorites
  const handleRemove = async (productId: string) => {
    await toggleFavorite(productId);
  };

  // Handle move all to cart
  const handleMoveAllToCart = async () => {
    if (favoriteProducts.length === 0) return;

    setIsMoving(true);

    // Add each product to cart
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

    // Show success feedback
    setShowSuccess(true);
    setTimeout(() => {
      setIsMoving(false);
      setShowSuccess(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF6E6] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="text-4xl"
        >
          🐱
        </motion.div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FFF6E6] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] shadow-soft-lg p-8 max-w-md w-full text-center"
        >
          {/* Cat Mascot */}
          <div className="flex justify-center mb-4">
            <Image
              src="/Elementos/Group 1697.png"
              alt="Purrfect Glow Mascot"
              width={100}
              height={100}
              className="drop-shadow-lg"
            />
          </div>

          <h1 className="font-baloo font-bold text-2xl text-brand-brown mb-2">
            ¡Únete para guardar favoritos!
          </h1>
          <p className="font-nunito text-brand-brown/70 text-sm mb-6">
            Inicia sesión para guardar tus productos favoritos y acceder a beneficios exclusivos del Club Purrfect Glow ✨
          </p>

          {/* Benefits preview */}
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
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF6E6] pb-32 lg:pb-8">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DECORATIVE HEADER */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FFECD2] to-[#FFF6E6] py-8 lg:py-12">
        {/* Decorative elements - Clouds */}
        <div className="absolute top-4 left-8 opacity-40">
          <Image src="/Elementos/Vector-49.png" alt="" width={60} height={40} />
        </div>
        <div className="absolute top-6 right-12 opacity-30">
          <Image src="/Elementos/Vector-50.png" alt="" width={50} height={35} />
        </div>

        {/* Decorative elements - Stars */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute top-8 left-1/4 text-pastel-purple"
        >
          ✦
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
          className="absolute top-12 right-1/4 text-pastel-pink"
        >
          ✦
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, delay: 1 }}
          className="absolute bottom-4 left-1/3 text-pastel-blue"
        >
          ★
        </motion.div>

        {/* Header Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          {/* Cat with heart eyes */}
          <div className="flex justify-center mb-3">
            <Image
              src="/Elementos/Group 1697.png"
              alt="Gatito con corazones"
              width={80}
              height={80}
              className="drop-shadow-md"
            />
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {isEmpty ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Grid - Main Column (70%) */}
            <div className="flex-1 lg:w-[70%]">
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {favoriteProducts.map((product) => (
                    <FavoriteCard
                      key={product.id}
                      product={product}
                      onRemove={() => handleRemove(product.id)}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Selection Summary - Sidebar (30%) - Desktop Only */}
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MOBILE STICKY BOTTOM BAR */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {!isEmpty && (
        <div className="lg:hidden fixed bottom-20 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-brand-cream-dark p-4 z-50 shadow-lg">
          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -top-14 left-4 right-4 bg-pastel-green border border-green-200 rounded-xl p-3 flex items-center gap-2 shadow-lg"
              >
                <span>✓</span>
                <p className="text-brand-brown font-medium text-sm">¡Todos agregados al carrito! 🎉</p>
              </motion.div>
            )}
          </AnimatePresence>

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