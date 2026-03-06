"use client";

import { Product, RoutineStep, ROUTINE_STEP_INFO } from "@/src/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sun, Moon, ShoppingCart, Heart, Check } from "lucide-react";
import { useCart } from "@/src/app/lib/contexts/CartContext";
import { useWishlist } from "@/src/app/lib/contexts/WishlistContext";
import { useSession } from "next-auth/react";

// Colores pastel para ingredientes (rotan)
const INGREDIENT_COLORS = [
  "bg-[#BDDEFF]", // Celeste
  "bg-[#FFB559]/30", // Naranja suave
  "bg-[#EFB9EC]", // Morado
];

// Pasos de la rutina de skincare (6 pasos esenciales)
const ROUTINE_STEPS = [
  { step: 1, key: 'CLEANSE', name: "Limpieza", icon: "💧" },
  { step: 2, key: 'TONER', name: "Tónico", icon: "✨" },
  { step: 3, key: 'SERUM', name: "Serum", icon: "💎" },
  { step: 4, key: 'AMPOULE', name: "Ampolla", icon: "🧴" },
  { step: 5, key: 'MOISTURIZER', name: "Crema", icon: "🌸" },
  { step: 6, key: 'SUNSCREEN', name: "Protector", icon: "☀️" },
];



export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [showFavoriteMessage, setShowFavoriteMessage] = useState(false);
  const { addToCart } = useCart();
  const { toggleFavorite, isInWishlist } = useWishlist();
  const { data: session } = useSession();

  const isProductInWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0 || !product.isAvailable;

  // Verificar si es un producto de cuidado especial
  const isSpecialCare = product.routineStep === RoutineStep.SPECIAL_CARE;

  // Obtener el número de paso de la rutina usando el enum
  const getCurrentStep = (): number => {
    if (!product.routineStep || isSpecialCare) return 0;
    const stepInfo = ROUTINE_STEP_INFO[product.routineStep];
    return stepInfo ? stepInfo.step : 0;
  };

  const currentStep = getCurrentStep();

  // Obtener label del paso de rutina
  const getRoutineStepLabel = (): string => {
    if (!product.routineStep) return '';
    const stepInfo = ROUTINE_STEP_INFO[product.routineStep];
    if (!stepInfo) return '';
    if (isSpecialCare) return stepInfo.label;
    return `Paso ${stepInfo.step}: ${stepInfo.label}`;
  };

  // Agregar al carrito
  const handleAddToCart = () => {
    // Auth check
    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (isOutOfStock) return;

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || "",
      brandName: "",
      size: "único",
      price: product.price,
    });

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  // Agregar/quitar de favoritos
  const handleToggleFavorite = async () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    const newState = await toggleFavorite(product.id);
    if (newState && !isProductInWishlist) {
      setShowFavoriteMessage(true);
      setTimeout(() => setShowFavoriteMessage(false), 3000);
    }
  };

  // Renderizar íconos de tiempo de uso
  const renderUsageTimeIcons = () => {
    switch (product.usageTime) {
      case "AM":
        return (
          <div className="flex items-center gap-2 text-brand-orange">
            <Sun className="w-5 h-5" />
            <span className="text-sm font-medium">Uso AM (Mañana)</span>
          </div>
        );
      case "PM":
        return (
          <div className="flex items-center gap-2 text-indigo-400">
            <Moon className="w-5 h-5" />
            <span className="text-sm font-medium">Uso PM (Noche)</span>
          </div>
        );
      case "BOTH":
      default:
        return (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-brand-orange">
              <Sun className="w-5 h-5" />
              <span className="text-sm font-medium">AM</span>
            </div>
            <span className="text-brand-brown/30">|</span>
            <div className="flex items-center gap-1 text-indigo-400">
              <Moon className="w-5 h-5" />
              <span className="text-sm font-medium">PM</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream pb-32 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-brand-brown hover:text-brand-brown-dark transition font-medium mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN - Images (Sticky on Desktop) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div
            className="lg:sticky lg:top-24 lg:self-start space-y-4"
          >
            {/* Main Image */}
            <div className="relative bg-white rounded-3xl shadow-soft-md overflow-hidden aspect-square">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-brand-brown/40">
                  <span className="text-6xl">🧴</span>
                </div>
              )}

              {/* Unavailable Badge */}
              {isOutOfStock && (
                <div className="absolute top-4 left-4 bg-gray-500 text-white px-4 py-2 rounded-full font-baloo font-semibold text-sm">
                  Agotado
                </div>
              )}

              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute top-4 right-4 bg-brand-yellow text-brand-brown px-3 py-1 rounded-full font-baloo font-semibold text-sm flex items-center gap-1">
                  ⭐ Destacado
                </div>
              )}


            </div>

            {/* Thumbnail Gallery - Washi Tape Style */}
            {product.images.length > 1 && (
              <div className="flex gap-3 justify-center flex-wrap">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all transform hover:scale-105 ${idx === selectedImage
                      ? "border-brand-orange shadow-glow rotate-2"
                      : "border-brand-cream-dark hover:border-brand-yellow -rotate-1"
                      }`}
                    style={{
                      transform: `rotate(${idx % 2 === 0 ? -2 : 2}deg)`,
                    }}
                  >
                    <img
                      src={img}
                      alt={`Vista ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Washi tape effect */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-brand-yellow/60 rounded-sm" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN - Product Info */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          <div className="space-y-6">
            {/* Hero Info */}
            <div className="space-y-3">
              {/* Routine Step Badge */}
              {product.routineStep && (
                <div className="inline-flex items-center gap-2 bg-pastel-blue/30 text-brand-brown px-3 py-1.5 rounded-full text-sm font-medium">
                  <span>{ROUTINE_STEP_INFO[product.routineStep]?.icon || '🧴'}</span>
                  {getRoutineStepLabel()}
                </div>
              )}

              {/* Product Name */}
              <h1 className="font-baloo text-3xl md:text-4xl font-bold text-brand-brown leading-tight">
                {product.name}
              </h1>

              {/* Usage Time Icons */}
              <div className="py-2">{renderUsageTimeIcons()}</div>

              {/* Price Sticker */}
              <div className="inline-block">
                <div className="bg-pastel-green px-6 py-3 rounded-full shadow-soft transform -rotate-1">
                  <span className="font-baloo text-2xl font-bold text-brand-brown">
                    S/ {product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary */}
            {product.summary && (
              <div>
                <p className="text-brand-brown/80 font-nunito leading-relaxed">
                  {product.summary}
                </p>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* TIP DE SOLICORN - For SPECIAL_CARE products */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {isSpecialCare && (
              <div className="py-4">
                <div className="bg-gradient-to-r from-pastel-pink/40 to-pastel-purple/40 p-5 rounded-3xl border-2 border-dashed border-brand-orange/30">

                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💕</span>
                    <div>
                      <h3 className="font-baloo font-semibold text-brand-brown text-lg mb-1">
                        Tip de Solicorn ✨
                      </h3>
                      <p className="text-brand-brown/80 font-nunito text-sm leading-relaxed">
                        Este es un <strong>paso especial</strong> de cuidado: Úsalo cuando tu piel necesite un extra de amor.
                        No es parte de la rutina diaria, pero hace magia cuando lo necesitas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ROUTINE TIMELINE - For regular steps 1-6 */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {currentStep > 0 && !isSpecialCare && (
              <div className="py-4">
                <h3 className="font-baloo text-lg font-semibold text-brand-brown mb-4 flex items-center gap-2">
                  <span>📋</span> Tu Rutina de Skincare
                </h3>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-brand-cream-dark rounded-full" />
                  <div
                    className="absolute top-6 left-0 h-1 bg-pastel-green rounded-full transition-all"
                    style={{ width: `${((currentStep - 1) / (ROUTINE_STEPS.length - 1)) * 100}%` }}
                  />

                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {ROUTINE_STEPS.map((step) => (
                      <div key={step.step} className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${step.step === currentStep
                            ? "bg-pastel-green shadow-glow scale-110 ring-4 ring-pastel-green/30"
                            : step.step < currentStep
                              ? "bg-pastel-green/50"
                              : "bg-brand-cream-dark"
                            }`}
                        >
                          {step.icon}
                        </div>
                        <span
                          className={`mt-2 text-xs font-medium ${step.step === currentStep
                            ? "text-brand-brown font-semibold"
                            : "text-brand-brown/50"
                            }`}
                        >
                          {step.name}
                        </span>
                        {/* Current step indicator */}
                        {step.step === currentStep && (
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-lg animate-bounce">
                            🐱
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* BENEFITS */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="py-4">
                <h3 className="font-baloo text-lg font-semibold text-brand-brown mb-4 flex items-center gap-2">
                  <span>✨</span> Beneficios Clave
                </h3>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-brand-orange text-lg mt-0.5">🐾</span>
                      <span className="text-brand-brown/80 font-nunito">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* KEY INGREDIENTS - Infographic Style */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {product.keyIngredients && Object.keys(product.keyIngredients).length > 0 && (
              <div className="py-4">
                <h3 className="font-baloo text-lg font-semibold text-brand-brown mb-4 flex items-center gap-2">
                  <span>🧪</span> Ingredientes Estrella
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {Object.entries(product.keyIngredients).map(([ingredient, description], idx) => (
                    <div
                      key={ingredient}
                      className={`${INGREDIENT_COLORS[idx % INGREDIENT_COLORS.length]} p-4 rounded-2xl transform transition-transform hover:scale-[1.02]`}
                      style={{ transform: `rotate(${idx % 2 === 0 ? -0.5 : 0.5}deg)` }}
                    >
                      <h4 className="font-baloo font-semibold text-brand-brown text-sm">
                        {ingredient}
                      </h4>
                      <p className="text-brand-brown/70 text-xs font-nunito mt-1">
                        {description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* HOW TO USE */}
            {/* ═══════════════════════════════════════════════════════════════ */}
            {product.howToUse && (
              <div className="py-4">
                <h3 className="font-baloo text-lg font-semibold text-brand-brown mb-4 flex items-center gap-2">
                  <span>📖</span> Modo de Uso
                </h3>
                <div className="bg-white p-5 rounded-2xl shadow-soft">
                  <p className="text-brand-brown/80 font-nunito leading-relaxed">
                    {product.howToUse}
                  </p>
                </div>
              </div>
            )}

            {/* Removed inline desktop CTA - now using floating bar below */}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* STICKY CTA (Desktop) - Floating bar */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-soft-lg border border-brand-cream-dark p-4 flex items-center gap-4">
          {/* Success Messages - Desktop */}
          {showAddedMessage && (
            <div className="absolute -top-14 left-0 right-0 bg-pastel-green border border-pastel-green rounded-xl p-3 flex items-center gap-2 shadow-lg">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-brand-brown font-medium text-sm">¡Agregado al carrito! 🎉</p>
            </div>
          )}

          {showFavoriteMessage && (
            <div className="absolute -top-14 left-0 right-0 bg-pastel-pink border border-pastel-pink rounded-xl p-3 flex items-center gap-2 shadow-lg">
              <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <p className="text-brand-brown font-medium text-sm">¡Guardado en favoritos! 💕</p>
            </div>
          )}

          {!isOutOfStock ? (
            <>
              <button
                onClick={handleAddToCart}
                className="bg-brand-orange text-white px-8 py-3 rounded-xl font-baloo font-semibold hover:bg-brand-orange/90 transition flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Agregar al carrito
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`px-4 py-3 rounded-xl font-baloo font-semibold transition flex items-center justify-center ${isProductInWishlist
                  ? "bg-pastel-pink text-brand-brown"
                  : "bg-white border-2 border-brand-cream-dark text-brand-brown hover:bg-brand-cream"
                  }`}
              >
                <Heart className={`w-5 h-5 ${isProductInWishlist ? "fill-current" : ""}`} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-brand-brown/60 font-nunito text-sm">Agotado</span>
              <button
                onClick={handleToggleFavorite}
                className={`px-6 py-3 rounded-xl font-baloo font-semibold transition flex items-center gap-2 ${isProductInWishlist
                  ? "bg-pastel-pink text-brand-brown"
                  : "bg-brand-orange text-white hover:bg-brand-orange/90"
                  }`}
              >
                <Heart className={`w-5 h-5 ${isProductInWishlist ? "fill-current" : ""}`} />
                {isProductInWishlist ? "En favoritos" : "Guardar"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* STICKY CTA (Mobile) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="fixed bottom-28 left-0 right-0 md:hidden bg-white border-t border-brand-cream-dark p-4 shadow-lg z-50">
        {/* Success Messages - Mobile */}
        {showAddedMessage && (
          <div className="absolute -top-16 left-4 right-4 bg-pastel-green/90 border border-pastel-green rounded-xl p-3 flex items-center gap-2 shadow-lg">
            <Check className="w-5 h-5 text-green-600" />
            <p className="text-brand-brown font-medium text-sm">¡Agregado al carrito! 🎉</p>
          </div>
        )}

        {showFavoriteMessage && (
          <div className="absolute -top-16 left-4 right-4 bg-pastel-pink/90 border border-pastel-pink rounded-xl p-3 flex items-center gap-2 shadow-lg">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
            <p className="text-brand-brown font-medium text-sm">¡Guardado en favoritos! 💕</p>
          </div>
        )}

        {!isOutOfStock ? (
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-brand-orange text-white py-3.5 rounded-xl font-baloo font-semibold hover:bg-brand-orange/90 transition flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Agregar
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`px-4 py-3.5 rounded-xl font-baloo font-semibold transition flex items-center justify-center ${isProductInWishlist
                ? "bg-pastel-pink text-brand-brown"
                : "bg-white border-2 border-brand-cream-dark text-brand-brown hover:bg-brand-cream"
                }`}
            >
              <Heart className={`w-5 h-5 ${isProductInWishlist ? "fill-current" : ""}`} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-brand-brown/70 text-center text-sm font-nunito">
              Agotado · Guárdalo para traerlo pronto 💕
            </p>
            <button
              onClick={handleToggleFavorite}
              className={`w-full py-3.5 rounded-xl font-baloo font-semibold transition flex items-center justify-center gap-2 ${isProductInWishlist
                ? "bg-pastel-pink text-brand-brown"
                : "bg-brand-orange text-white hover:bg-brand-orange/90"
                }`}
            >
              <Heart className={`w-5 h-5 ${isProductInWishlist ? "fill-current" : ""}`} />
              {isProductInWishlist ? "¡Ya está en favoritos!" : "Guardar en favoritos"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
