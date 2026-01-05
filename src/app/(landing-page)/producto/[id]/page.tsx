import { notFound } from "next/navigation";
import { getProductById } from "@/src/services/product";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}