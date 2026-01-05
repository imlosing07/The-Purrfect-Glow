// lib/hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/src/types';

/**
 * Interface genérica para respuestas paginadas
 * El genérico T permite reutilizar esta interface para diferentes tipos de datos
 */
interface PaginatedResponse<T> {
  products: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Interface alternativa que coincide con tu backend
 * Nota: Tu backend usa 'meta' en lugar de 'pagination'
 */
interface BackendPaginatedResponse {
  products: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface UseProductsOptions {
  initialCategory?: string;
  initialPage?: number;
  initialPageSize?: number;
  fetchOnMount?: boolean;
}

interface FetchProductsParams {
  category?: string;
  page?: number;
  pageSize?: number;
  query?: string;
  brandId?: string;
}

/**
 * Hook personalizado para gestionar productos
 * Retorna una estructura consistente que el componente puede usar directamente
 */
export function useProducts(options: UseProductsOptions = {}) {
  // Estado unificado para productos y paginación
  const [productsData, setProductsData] = useState<BackendPaginatedResponse>({
    products: [],
    meta: {
      total: 0,
      page: 1,
      limit: options.initialPageSize || 10,
      totalPages: 0
    }
  });
  
  // Estados separados para casos específicos
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Función principal para obtener productos
   * Mantiene la consistencia con la estructura del backend
   */
  const fetchProducts = useCallback(async (params: FetchProductsParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Construir URL con parámetros
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.set('category', params.category);
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());
      if (params.query) searchParams.set('search', params.query);
      if (params.brandId) searchParams.set('brandId', params.brandId);
      
      const queryString = searchParams.toString();
      const url = `/api/products${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      
      const responseData = await response.json();
      
      // Verificar la estructura de la respuesta
      if (!responseData.data) {
        console.error('Invalid response structure:', responseData);
        throw new Error('Invalid response structure from API');
      }
      
      // La respuesta viene envuelta en { data: { products, meta } }
      const data: BackendPaginatedResponse = responseData.data;
      
      console.log('Product fetch result in useProducts hook:', {
        productsCount: data.products?.length || 0,
        meta: data.meta
      });
      
      setProductsData(data);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error in fetchProducts:', errorMessage);
      setError(errorMessage);
      
      // Mantener estructura consistente incluso en error
      setProductsData({
        products: [],
        meta: {
          total: 0,
          page: params.page || 1,
          limit: params.pageSize || 10,
          totalPages: 0
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Función para obtener un producto por ID
   */
  const fetchProductById = useCallback(async (id: string): Promise<Product | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch product');
      }
      
      const responseData = await response.json();
      
      // Verificar si la respuesta está envuelta
      const product = responseData.data?.product || responseData.product;
      
      return product;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error fetching product by ID:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Función para obtener productos destacados
   */
  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/products?featured=true&pageSize=8');
      
      if (!response.ok) {
        throw new Error('Failed to fetch featured products');
      }
      
      const responseData = await response.json();
      const data = responseData.data || responseData;
      
      setFeatured(data.products || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error fetching featured products:', errorMessage);
      setError(errorMessage);
      setFeatured([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Función para obtener nuevos productos
   */
  const fetchNewArrivals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/products?sort=createdAt&order=desc&pageSize=8');
      
      if (!response.ok) {
        throw new Error('Failed to fetch new arrivals');
      }
      
      const responseData = await response.json();
      const data = responseData.data || responseData;
      
      setNewArrivals(data.products || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error fetching new arrivals:', errorMessage);
      setError(errorMessage);
      setNewArrivals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Función para buscar productos
   */
  const searchProducts = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search products');
      }
      
      const responseData = await response.json();
      const data = responseData.data || responseData;
      
      setProductsData({
        products: data.products || [],
        meta: data.meta || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('Error searching products:', errorMessage);
      setError(errorMessage);
      
      setProductsData({
        products: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Efecto para cargar productos al montar si está configurado
   */
  useEffect(() => {
    if (options.fetchOnMount) {
      fetchProducts({
        category: options.initialCategory,
        page: options.initialPage || 1,
        pageSize: options.initialPageSize || 10
      });
    }
  }, [options.fetchOnMount]); // Dependencias mínimas para evitar re-renders

  /**
   * Retornar estructura consistente
   * Importante: Retornamos todo el objeto productsData para que el componente
   * pueda acceder tanto a products como a meta
   */
  return {
    // Datos principales
    productsData, // Objeto completo con products y meta
    products: productsData.products, // Array de productos directo para compatibilidad
    pagination: productsData.meta, // Meta/paginación directa para compatibilidad
    
    // Estados de UI
    loading,
    error,
    
    // Funciones
    fetchProducts,
    fetchProductById,
    searchProducts,
    
    // Datos adicionales
    featured,
    newArrivals,
    fetchFeatured,
    fetchNewArrivals,
  };
}