'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '../../../components/ProductForm';
import { Product } from '@/src/types';
import { Loader2 } from 'lucide-react';

export default function EditarProductoPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(`/api/products/${params.id}`);
                if (!response.ok) throw new Error('Product not found');
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError('No se pudo cargar el producto');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-brand-orange mx-auto mb-4" />
                    <p className="font-nunito text-brand-brown/70">Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center bg-white rounded-3xl p-8 shadow-soft">
                    <span className="text-4xl mb-4 block">😿</span>
                    <h2 className="font-baloo font-bold text-xl text-brand-brown mb-2">
                        Producto no encontrado
                    </h2>
                    <p className="font-nunito text-brand-brown/70">
                        {error || 'No pudimos encontrar el producto que buscas'}
                    </p>
                </div>
            </div>
        );
    }

    return <ProductForm product={product} mode="edit" />;
}
