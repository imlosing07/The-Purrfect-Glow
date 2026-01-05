import { Product } from "@/src/types";
import Image from "next/image";

export default function FormalProductCard({ 
  product, 
  onClick 
}: { 
  product: Product; 
  onClick?: () => void 
}) {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const mainImage = product.images.find(img => img.isMain) || product.images[0];
  const secondaryImage = product.images.find(img => !img.isMain) || product.images[1];

  return (
    <div onClick={onClick} className="group cursor-pointer">
      {/* Contenedor de imagen con doble imagen hover */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden mb-4">
        {/* Badge premium */}
        {product.featured && (
          <div className="absolute top-4 right-4 z-20">
            <div className="px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-[9px] font-light tracking-[0.15em] uppercase">
              Premium
            </div>
          </div>
        )}

        {/* Badge descuento discreto */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 z-20">
            <div className="px-3 py-1 bg-white/90 backdrop-blur-sm text-black text-[9px] font-medium tracking-wider">
              OFERTA
            </div>
          </div>
        )}

        {/* Imagen principal */}
        {mainImage && (
          <div className="relative w-full h-full">
            <Image
              src={mainImage.originalUrl || mainImage.standardUrl}
              alt={product.name}
              width={240}
              height={240}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 group-hover:opacity-0"
            />
            {/* Imagen secundaria en hover */}
            {secondaryImage && (
              <Image
                src={secondaryImage.originalUrl || secondaryImage.standardUrl}
                alt={product.name}
                width={240}
                height={240}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              />
            )}
          </div>
        )}

        {/* Overlay sutil en hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Botón Quick View */}
        <div className="absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <div className="bg-white/95 backdrop-blur-sm py-4 text-center">
            <span className="text-[10px] font-light tracking-[0.2em] uppercase text-gray-900">
              Ver Detalles
            </span>
          </div>
        </div>

        {/* Wishlist button - aparece en hover */}
        <button 
          className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            // Lógica de wishlist aquí
          }}
        >
          <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      {/* Info del producto - Layout mejorado */}
      <div className="space-y-3 px-1">
        {/* Marca y featured */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-light">
            {product.brand?.name}
          </p>
          {product.isNew && (
            <span className="px-2 py-0.5 bg-black text-white text-[8px] tracking-wider uppercase font-light">
              Nuevo
            </span>
          )}
        </div>

        {/* Nombre del producto con altura mínima */}
        <h3 className="font-serif text-base leading-snug min-h-[2.8rem] text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Precio elegante */}
        <div className="flex items-baseline gap-3 pt-1">
          {hasDiscount ? (
            <>
              <p className="font-light text-lg text-gray-900">
                S/ {product.salePrice?.toFixed(2)}
              </p>
              <p className="text-sm text-gray-400 line-through font-light">
                S/ {product.price.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="font-light text-lg text-gray-900">
              S/ {product.price.toFixed(2)}
            </p>
          )}
        </div>

        {/* Tallas disponibles - icono */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider font-light">
                {product.sizes.length} Tallas Disponibles
              </p>
            </div>
          </div>
        )}

        {/* Color swatches si hay múltiples imágenes */}
        {product.images.length > 1 && (
          <div className="flex items-center gap-1.5 pt-1">
            {product.images.slice(0, 4).map((img, idx) => (
              <div 
                key={idx}
                className="w-6 h-6 rounded-full border-2 border-gray-200 overflow-hidden hover:border-gray-900 transition-colors cursor-pointer"
              >
                <Image 
                  src={img.standardUrl} 
                  alt="" 
                  width={240}
                  height={240}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {product.images.length > 4 && (
              <span className="text-[10px] text-gray-400 ml-1">
                +{product.images.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}