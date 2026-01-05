"use client";
import { Product } from "@/src/types";
import CategoryPageLayout from "../components/CategoryPageLayout";

export default function MujerView({ products }: { products: Product[] }) {
  return (
    <CategoryPageLayout
      products={products}
      genre="WOMENS"
      heroConfig={{
        image: "/categoryImages/desktopWomen.webp",
        title: "Mujer",
        subtitle: "Estilo y comodidad en cada paso",
        gradientFrom: "pink-600"
      }}
    />
  );
}
