'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/app/lib/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, AlertCircle, Loader2, User } from 'lucide-react';
import { ShippingZone, CreateOrderDTO } from '@/src/types';

// Lazy load GlowSummary to reduce initial bundle size
const GlowSummary = dynamic(() => import('./GlowSummary'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-[40px] p-6 lg:p-8 animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-6 w-3/4 mx-auto" />
      <div className="space-y-4 mb-6">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-full" />
      </div>
      <div className="h-12 bg-gray-200 rounded-2xl" />
    </div>
  ),
});

// ═══════════════════════════════════════════════════════════════
// SHIPPING COSTS (Hardcoded fallback - ideally fetched from API)
// ═══════════════════════════════════════════════════════════════

const SHIPPING_RATES: Record<ShippingZone, { domicilio: number; agencia: number; estimatedDays: string }> = {
  LIMA_LOCAL: { domicilio: 10, agencia: 7, estimatedDays: '24 - 48h' },
  LIMA_PROVINCIAS: { domicilio: 15, agencia: 12, estimatedDays: '2 - 3 días' },
  COSTA_NACIONAL: { domicilio: 20, agencia: 15, estimatedDays: '3 - 5 días' },
  SIERRA_SELVA: { domicilio: 25, agencia: 20, estimatedDays: '4 - 7 días' },
  ZONAS_REMOTAS: { domicilio: 35, agencia: 28, estimatedDays: '5 - 10 días' },
};

// Profile data interface
interface UserProfile {
  name: string;
  dni: string;
  phone: string;
  department: string;
  province: string;
  district: string;
  address: string;
  reference: string;
  locationUrl: string;
  shippingZone: ShippingZone | null;
  shippingModality: 'DOMICILIO' | 'AGENCIA';
  profileComplete: boolean;
}

export default function CartPage() {
  const { items, cartCount, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile when authenticated
  useEffect(() => {
    if (authStatus === 'authenticated') {
      setLoadingProfile(true);
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.profile) {
            setProfile(data.profile);
          }
        })
        .catch(err => console.error('Error loading profile:', err))
        .finally(() => setLoadingProfile(false));
    }
  }, [authStatus]);

  // Calculate shipping cost from profile
  const shippingZone: ShippingZone = profile?.shippingZone || 'LIMA_LOCAL';
  const shippingRate = SHIPPING_RATES[shippingZone];
  const shippingModality = profile?.shippingModality || 'DOMICILIO';
  const shippingCost = shippingModality === 'AGENCIA'
    ? shippingRate.agencia
    : shippingRate.domicilio;

  // Submit order
  const handleSubmitOrder = async () => {
    // Guard: must be authenticated
    if (authStatus !== 'authenticated') {
      router.push('/login');
      return;
    }

    // Guard: profile must be complete
    if (!profile?.profileComplete) {
      router.push('/perfil');
      return;
    }

    if (items.length === 0) {
      setError('Tu carrito está vacío');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderData: CreateOrderDTO = {
        dni: profile.dni,
        fullName: profile.name,
        phone: profile.phone,
        address: profile.address,
        department: profile.department,
        province: profile.province,
        shippingZone: shippingZone,
        shippingModality: shippingModality,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          district: profile.district,
          reference: profile.reference,
          locationUrl: profile.locationUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la orden');
      }

      const result = await response.json();

      if (result.whatsappLink) {
        // Open WhatsApp in a new tab first
        window.open(result.whatsappLink, '_blank', 'noopener,noreferrer');

        // Delay clearing the cart to ensure the WhatsApp tab has time to load
        setTimeout(() => {
          clearCart();
        }, 1500);
      } else {
        setError('La orden se creó pero no se generó el enlace de WhatsApp. Contacta al soporte.');
      }
    } catch (err) {
      console.error('Error submitting order:', err);
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido');
    } finally {
      setIsLoading(false);
    }
  };

  // Can submit?
  const canSubmit = authStatus === 'authenticated'
    && profile?.profileComplete === true
    && items.length > 0;

  // Empty cart state
  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-brand-cream pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-soft p-8 sm:p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-brand-cream rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-brand-brown/50" />
            </div>
            <h2 className="font-baloo text-2xl sm:text-3xl text-brand-brown mb-3">
              Tu carrito está vacío
            </h2>
            <p className="text-gray-600 mb-8">
              ¡Descubre nuestros productos de skincare y comienza tu rutina de belleza! 🐱✨
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-xl font-baloo hover:bg-brand-orange/90 transition shadow-soft hover:shadow-glow"
            >
              <ArrowLeft className="w-4 h-4" />
              Explorar productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h1 className="font-baloo text-2xl sm:text-3xl text-brand-brown flex items-center gap-2">
              <Image
                src="/PurrfectGlowGatoIcon.png"
                alt="The Purrfect Glow"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              Mi Carrito
            </h1>
            <p className="text-gray-600 mt-1">
              {cartCount} {cartCount === 1 ? 'producto' : 'productos'} en tu carrito
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-2 self-start sm:self-auto transition"
          >
            <Trash2 className="w-4 h-4" />
            Vaciar carrito
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Products + Shipping Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product List */}
            <div className="space-y-3">
              {items.map((item) => {
                const price = item.salePrice || item.price;
                const itemTotal = price * item.quantity;

                return (
                  <div
                    key={`${item.productId}-${item.size}`}
                    className="bg-white rounded-2xl border-2 border-brand-cream-dark p-4 flex gap-4 hover:border-brand-orange/30 transition"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-brand-cream">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-brown/30 text-xs">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">
                            {item.productName}
                          </h3>
                          {item.brandName && (
                            <p className="text-xs text-gray-500">
                              {item.brandName}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId, item.size)}
                          className="text-gray-400 hover:text-red-500 transition p-1 -mt-1 -mr-1"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1 bg-brand-cream rounded-xl">
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                            className="p-2 hover:bg-brand-cream-dark rounded-l-xl transition"
                            aria-label="Disminuir cantidad"
                          >
                            <Minus className="w-3 h-3 text-brand-brown" />
                          </button>
                          <span className="px-3 font-medium text-brand-brown min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                            className="p-2 hover:bg-brand-cream-dark rounded-r-xl transition"
                            aria-label="Aumentar cantidad"
                          >
                            <Plus className="w-3 h-3 text-brand-brown" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-baloo text-brand-brown">
                            S/ {itemTotal.toFixed(2)}
                          </p>
                          {item.salePrice && (
                            <p className="text-xs text-gray-400 line-through">
                              S/ {(item.price * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Shipping / Profile Info Card */}
            {authStatus === 'loading' || loadingProfile ? (
              <div className="bg-white rounded-3xl p-6 flex items-center justify-center gap-3 text-brand-brown/60">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-nunito text-sm">Cargando datos de envío...</span>
              </div>
            ) : authStatus !== 'authenticated' ? (
              <div className="bg-gradient-to-br from-pastel-orange/30 to-pastel-pink/20 rounded-3xl p-6 text-center">
                <AlertCircle className="w-10 h-10 text-brand-orange mx-auto mb-3" />
                <h3 className="font-baloo text-lg text-brand-brown mb-2">
                  Inicia sesión para comprar
                </h3>
                <p className="font-nunito text-sm text-brand-brown/70 mb-4">
                  Necesitas una cuenta para realizar tu pedido
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-2xl font-nunito font-semibold text-sm hover:bg-brand-orange/90 transition shadow-soft"
                >
                  <User className="w-4 h-4" />
                  Iniciar Sesión
                </Link>
              </div>
            ) : !profile?.profileComplete ? (
              <div className="bg-gradient-to-br from-pastel-orange/30 to-pastel-pink/20 rounded-3xl p-6 text-center">
                <AlertCircle className="w-10 h-10 text-brand-orange mx-auto mb-3" />
                <h3 className="font-baloo text-lg text-brand-brown mb-2">
                  Completa tu perfil
                </h3>
                <p className="font-nunito text-sm text-brand-brown/70 mb-4">
                  Necesitas completar tu dirección y datos para realizar el envío
                </p>
                <Link
                  href="/perfil"
                  className="inline-flex items-center gap-2 bg-brand-orange text-white px-6 py-3 rounded-2xl font-nunito font-semibold text-sm hover:bg-brand-orange/90 transition shadow-soft"
                >
                  <User className="w-4 h-4" />
                  Completar Perfil
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-soft p-6">
                <h3 className="font-baloo text-lg text-brand-brown mb-4 flex items-center gap-2">
                  📍 Datos de envío
                </h3>
                <div className="space-y-2 font-nunito text-sm text-brand-brown/80">
                  <p><strong>Nombre:</strong> {profile.name}</p>
                  <p><strong>DNI:</strong> {profile.dni}</p>
                  <p><strong>Teléfono:</strong> {profile.phone}</p>
                  <p><strong>Dirección:</strong> {profile.address}{profile.district ? `, ${profile.district}` : ''}, {profile.province}, {profile.department}</p>
                  {profile.reference && <p><strong>Referencia:</strong> {profile.reference}</p>}
                  {profile.locationUrl && (
                    <p>
                      <strong>Ubicación:</strong>{' '}
                      <a
                        href={profile.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-orange hover:text-brand-orange/80 underline transition"
                      >
                        Ver en Google Maps 📍
                      </a>
                    </p>
                  )}
                </div>
                <Link
                  href="/perfil"
                  className="inline-flex items-center gap-1 mt-4 text-brand-orange font-nunito text-sm font-semibold hover:text-brand-orange/80 transition"
                >
                  ✏️ Editar datos
                </Link>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <GlowSummary
              subtotal={totalPrice}
              shippingCost={shippingCost}
              estimatedDays={shippingRate.estimatedDays}
              isFormValid={canSubmit}
              isLoading={isLoading}
              onSubmit={handleSubmitOrder}
            />
          </div>
        </div>

        {/* Back to Shop Link */}
        <div className="mt-2 hidden lg:block">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-brown hover:text-brand-brown-dark font-medium transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}