"use client";
import { Product } from "@/src/types";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SizeGuideModal from "../../components/SizeGuideModal";
import FavoriteButton from "../../components/FavoriteButton";
import { useCart } from "@/src/app/lib/contexts/CartContext";
import { ArrowLeft, ShoppingCart } from "lucide-react";

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const { addToCart } = useCart();

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const mainImage = product.images.find(img => img.isMain) || product.images[0];

  const handleAddToCart = () => {
    if (!selectedSize) return;

    const selectedSizeObj = product.sizes.find(s => s.value === selectedSize);
    if (!selectedSizeObj || selectedSizeObj.inventory === 0) return;

    addToCart({
      productId: product.id,
      productName: product.name,
      productImage: mainImage?.standardUrl || '',
      brandName: product.brand?.name || '',
      size: selectedSize,
      price: product.price,
      salePrice: product.salePrice || undefined,
    });

    // Mostrar mensaje de confirmación
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb and Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-sm text-gray-500">
            <button onClick={() => router.push("/")} className="hover:underline cursor-pointer">Home</button>
            {" / "}
            <span className="hover:underline cursor-pointer">{product.category}</span>
            {" / "}
            <span className="text-black">{product.name}</span>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-black transition font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
                        Volver
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage].standardUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    Sin imagen
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${idx === selectedImage ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img.standardUrl}
                      alt={`Vista ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info del producto */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              {product.isNew && (
                <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                                    NUEVO
                </span>
              )}
              {product.featured && (
                <span className="bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                                    ⭐ DESTACADO
                </span>
              )}
            </div>

            {/* Marca y nombre */}
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                {product.brand?.name}
              </p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Precio */}
            <div className="py-4 border-y">
              {hasDiscount ? (
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-red-600">
                                        S/ {product.salePrice?.toFixed(2)}
                  </p>
                  <p className="text-lg text-gray-400 line-through">
                                        S/ {product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                                        ¡Ahorra S/ {(product.price - product.salePrice!)?.toFixed(2)}!
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-bold">S/ {product.price.toFixed(2)}</p>
              )}
            </div>

            {/* Selector de tallas */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="font-medium text-gray-900">Selecciona tu talla:</p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm font-medium text-gray-700 hover:text-black flex items-center gap-1.5 transition-colors group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                                    Guía de tallas
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => {
                  const isLowStock = size.inventory > 0 && size.inventory <= 3;
                  const isOutOfStock = size.inventory === 0;
                  const isSelected = selectedSize === size.value;

                  return (
                    <button
                      key={size.id}
                      onClick={() => !isOutOfStock && setSelectedSize(size.value)}
                      disabled={isOutOfStock}
                      className={`relative py-3 rounded-lg border-2 font-medium transition-all duration-200 ${isOutOfStock
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                        : isSelected
                          ? 'border-black bg-black text-white shadow-md scale-105'
                          : 'border-gray-300 hover:border-black hover:shadow-sm hover:scale-102'
                      }`}
                    >
                      <span className={isOutOfStock ? 'line-through' : ''}>
                        {size.value}
                      </span>
                      {isLowStock && !isSelected && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border border-white" />
                      )}
                      {isOutOfStock && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-full h-0.5 bg-gray-300 rotate-45" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {product.sizes.some(s => s.inventory > 0 && s.inventory <= 3) && (
                <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 bg-orange-500 rounded-full" />
                                    Tallas con stock limitado
                </p>
              )}
              {product.sizes.every(s => s.inventory === 0) && (
                <p className="text-sm text-red-600 mt-2 font-medium">Agotado temporalmente</p>
              )}
            </div>

            {/* Mensaje de producto agregado */}
            {showAddedMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">¡Producto agregado al carrito!</p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize || product.sizes.every(s => s.inventory === 0)}
                className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {selectedSize ? 'Agregar al carrito' : 'Selecciona una talla'}
              </button>

              <FavoriteButton
                productId={product.id}
                variant="inline"
                className="w-full border-2 border-black py-4 rounded-lg font-medium hover:bg-gray-50"
                showToast={true}
              />
            </div>

            {/* Info adicional */}
            <div className="pt-4 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-xl">🚚</span>
                <div>
                  <p className="font-medium">Envío gratis</p>
                  <p className="text-gray-600">En compras mayores a S/ 200</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">↩️</span>
                <div>
                  <p className="font-medium">Devolución gratis</p>
                  <p className="text-gray-600">Tienes 30 días para devolver</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Guía de Tallas */}
      {showSizeGuide && (
        <SizeGuideModal
          category={product.category as any}
          onClose={() => setShowSizeGuide(false)}
        />
      )}
    </div>
  );
}
