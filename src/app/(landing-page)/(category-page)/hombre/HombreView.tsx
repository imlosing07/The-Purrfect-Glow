"use client";
import { Product } from "@/src/types";
import CategoryPageLayout from "../components/CategoryPageLayout";

export default function HombreView({ products }: { products: Product[] }) {
  return (
    <CategoryPageLayout
      products={products}
      genre="MENS"
      heroConfig={{
        image: "/categoryImages/desktopMen.jpg",
        title: "Hombre",
        subtitle: "Descubre nuestra selección de calzado urbano y deportivo",
        gradientFrom: "blue-900"
      }}
    />
  );
}
