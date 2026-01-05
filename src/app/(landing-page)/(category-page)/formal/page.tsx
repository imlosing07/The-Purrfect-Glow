// app/(landing-page)/(category-page)/formal/page.tsx
import FormalView from "./FormalView";
import { getProducts } from "@/src/services/product";

export default async function Page() {
  // 1. Obtenemos los productos en el servidor
  const response = await getProducts({ category: "FORMAL" });
  const formalProducts = response.products;

  // 2. Pasar los productos filtrados a FormalView
  return (
    <FormalView products={formalProducts} />
  );
}