import { Product } from "@/src/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  onProductClick
}: {
  products: Product[];
  onProductClick?: (product: Product) => void;
}) {
  return (
    <section className="pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay productos disponibles
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={onProductClick ? () => onProductClick(product) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}