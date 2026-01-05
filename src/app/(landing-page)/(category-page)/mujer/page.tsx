import MujerView from "./MujerView";
import { getProducts } from "@/src/services/product";

export default async function MujerPage() {
  // Fetch products server-side
  const response = await getProducts({ genre: "WOMENS" });
  const products = response.products;

  return <MujerView products={products} />;
}