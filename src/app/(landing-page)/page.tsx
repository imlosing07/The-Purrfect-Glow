import HeroSection from "./components/Hero";
import BrandsCarousel from "./components/BrandsCarousel";
import ProductGrid from "./(category-page)/components/ProductGrid";
import { getProducts } from "@/src/services/product";

export default async function HomePage() {
  // Fetch products server-side
  const response = await getProducts({ limit: 12, featured: true });
  const products = response.products;

  return (
    <>
      <HeroSection />
      <BrandsCarousel />
      <ProductGrid
        products={products}
        title="Colección Premium"
      />
    </>
  );
}