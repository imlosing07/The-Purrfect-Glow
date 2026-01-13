import { getProducts } from '@/src/services/product';
import { getAllTags } from '@/src/services/product';
import CatalogClient from './CatalogClient';

interface PageProps {
    searchParams: Promise<{ skin?: string }>;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
    const params = await searchParams;

    // Fetch all products and tags on the server
    const [productsResponse, tags] = await Promise.all([
        getProducts({ limit: 100, available: true }),
        getAllTags(),
    ]);

    return (
        <CatalogClient
            initialProducts={productsResponse.products}
            tags={tags}
            initialSkinType={params.skin}
        />
    );
}
