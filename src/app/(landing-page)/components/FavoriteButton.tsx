'use client';

import { useWishlist } from '@/src/app/lib/contexts/WishlistContext';
import { useSession } from 'next-auth/react';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
    productId: string;
    variant?: 'floating' | 'inline';
    className?: string;
    showToast?: boolean;
}

export default function FavoriteButton({
  productId,
  variant = 'floating',
  className = '',
  showToast = false
}: FavoriteButtonProps) {
  const { toggleFavorite, isInWishlist } = useWishlist();
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const inWishlist = isInWishlist(productId);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Si no está logueado, redirigir al login
    if (!session?.user) {
      router.push('/login');
      return;
    }

    // Animación de click
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    // Toggle con optimistic update
    startTransition(async () => {
      await toggleFavorite(productId);
            
      // Mostrar mensaje temporal si está habilitado
      if (showToast) {
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 2000);
      }
    });
  };

  const baseClasses = variant === 'floating'
    ? 'w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all'
    : 'w-full flex items-center justify-center gap-2 transition-all';

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`
                    ${baseClasses}
                    ${isAnimating ? 'scale-125' : 'scale-100'}
                    ${isPending ? 'opacity-50 cursor-not-allowed' : variant === 'floating' ? 'hover:scale-110' : ''}
                    ${className}
                `}
        aria-label={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        title={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <Heart
          className={`w-5 h-5 transition-all ${
            inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
          }`}
        />
        {variant === 'inline' && (
          <span>{inWishlist ? 'En favoritos' : 'Agregar a favoritos'}</span>
        )}
      </button>

      {/* Mensaje toast temporal */}
      {showMessage && showToast && (
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg z-50">
          {inWishlist ? '❤️ Agregado a favoritos' : '💔 Quitado de favoritos'}
        </div>
      )}
    </div>
  );
}