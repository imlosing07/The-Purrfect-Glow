import HombreView from "./HombreView";
import { getProducts } from "@/src/services/product";

export default async function HombrePage() {
  // Fetch products server-side
  const response = await getProducts({ genre: "MENS" });
  const products = response.products;

  return <HombreView products={products} />;
}