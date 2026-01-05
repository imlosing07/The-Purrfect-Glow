import { Product } from "@/src/types";
import FavoriteButton from "../../components/FavoriteButton";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product, onClick }: { product: Product; onClick?: () => void }): React.JSX.Element {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : 0;

  const mainImage = product.images.find(img => img.isMain) || product.images[0];

  const content = (
    <div className="group cursor-pointer h-full" onClick={onClick ? onClick : undefined}>
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
              NUEVO
            </span>
          )}
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{discountPercent}%
            </span>
          )}
        </div>

        {product.featured && (
          <span className="absolute top-3 right-3 bg-amber-400 text-black text-xs font-bold px-3 py-1 rounded-full z-10">
            ⭐ TOP
          </span>
        )}

        {/* Imagen */}
        {mainImage ? (
          <Image
            src={mainImage.standardUrl}
            alt={product.name}
            width={700}
            height={700}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}

        {/* Botón favorito (desktop hover, mobile always visible) */}
        <div className="absolute bottom-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition z-10">
          <FavoriteButton productId={product.id} variant="floating" />
        </div>
      </div>

      {/* Info del producto */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
          {product.brand?.name}
        </p>
        <h3 className="font-medium text-sm line-clamp-2 group-hover:underline">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {hasDiscount ? (
            <>
              <p className="font-bold text-red-600">S/ {product.salePrice?.toFixed(2)}</p>
              <p className="text-xs text-gray-400 line-through">S/ {product.price.toFixed(2)}</p>
            </>
          ) : (
            <p className="font-bold">S/ {product.price.toFixed(2)}</p>
          )}
        </div>
      </div>
    </div>
  );

  // If no onClick is provided, wrap with Link
  if (!onClick) {
    return (
      <Link href={`/producto/${product.id}`} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}