"use client";
import { Product } from "@/src/types";
import CategoryPageLayout from "../components/CategoryPageLayout";

export default function NinosView({ products }: { products: Product[] }) {
  return (
    <CategoryPageLayout
      products={products}
      genre="KIDS"
      heroConfig={{
        image: "/categoryImages/desktopChildren.webp",
        title: "Niños",
        subtitle: "Comodidad y diversión para los más pequeños",
        gradientFrom: "orange-500"
      }}
    />
  );
}
