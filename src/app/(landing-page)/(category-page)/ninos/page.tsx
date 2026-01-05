import NinosView from "./NinosView";
import { getProducts } from "@/src/services/product";

export default async function NinosPage() {
  // Fetch products server-side
  const response = await getProducts({ genre: "KIDS" });
  const products = response.products;

  return <NinosView products={products} />;
}