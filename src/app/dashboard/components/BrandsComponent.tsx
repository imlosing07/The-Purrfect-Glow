'use client';

import { useState, useEffect } from 'react';
import { Brand } from '@/src/types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/src/app/ui/fonts';
import { useRouter } from 'next/navigation';
import BrandForm from './subcomponents/BrandForm';
import Image from 'next/image';

export default function BrandsComponent() {
  const router = useRouter();
  const [brands, setBrands] = useState<(Brand & { count: number })[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [editName, setEditName] = useState('');
  const [editBrandLogo, setEditBrandLogo] = useState('');

  useEffect(() => {
    fetchBrands();
  }, [pagination.page]);

  async function fetchBrands() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/brands?page=${pagination.page}&pageSize=${pagination.pageSize}`);
      const data = await res.json();
      setBrands(data.brands);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateBrand(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName, logoUrl: newBrandLogo }),
      });
      setNewBrandName('');
      setNewBrandLogo('');
      setShowCreateForm(false);
      router.refresh();
      fetchBrands();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectBrand(brand: Brand) {
    setSelectedBrand(brand);
    setEditName(brand.name);
    setEditBrandLogo(brand.logoUrl || '');
  }

  async function handleUpdateBrand(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBrand) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/brands/${selectedBrand.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, logoUrl: editBrandLogo }),
      });
      if (!res.ok) throw new Error('Failed to update brand');
      setSelectedBrand(null);
      fetchBrands();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteBrand(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta marca?')) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete brand');
      fetchBrands();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`${lusitana.className} text-2xl font-bold`}>Marcas</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          {showCreateForm ? 'Cancelar' : 'Agregar Marca'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showCreateForm && (
        <BrandForm
          name={newBrandName}
          logoUrl={newBrandLogo}
          onNameChange={setNewBrandName}
          onLogoChange={setNewBrandLogo}
          onSubmit={handleCreateBrand}
          onCancel={() => setShowCreateForm(false)}
          loading={loading}
        />
      )}

      {selectedBrand && (
        <BrandForm
          name={editName}
          logoUrl={editBrandLogo}
          onNameChange={setEditName}
          onLogoChange={setEditBrandLogo}
          onSubmit={handleUpdateBrand}
          onCancel={() => setSelectedBrand(null)}
          loading={loading}
          isEdit
        />
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading && !brands.length ? (
          <div className="p-8 text-center text-gray-500">Cargando marcas...</div>
        ) : brands.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Logo</th>
                  <th scope="col" className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Productos</th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brands.map((brand) => (
                  <tr key={brand.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap font-medium">{brand.name}</td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      {brand.logoUrl ? (
                        <Image src={`/brandsImages/${brand.logoUrl}`} alt={brand.name} width={32} height={32} className="object-contain" />
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      {brand.count > 0 ? (
                        <a
                          href={`/dashboard/products?brandId=${brand.id}`}
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          ({brand.count})
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">0</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleSelectBrand(brand)}
                        className="text-blue-500 hover:text-blue-700 mr-2 sm:mr-4"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5 inline" />
                      </button>
                      <button
                        onClick={() => handleDeleteBrand(brand.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">No se encontraron marcas.</div>
        )}

        {brands.length > 0 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1 || loading}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${pagination.page <= 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Anterior
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages || loading}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${pagination.page >= pagination.totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{brands.length > 0 ? (pagination.page - 1) * pagination.pageSize + 1 : 0}</span> a{' '}
                  <span className="font-medium">{Math.min(pagination.page * pagination.pageSize, pagination.total)}</span>{' '}
                  de <span className="font-medium">{pagination.total}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page <= 1 || loading}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${pagination.page <= 1 ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Anterior</span>
                    &larr;
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page >= pagination.totalPages || loading}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${pagination.page >= pagination.totalPages ? 'text-gray-300' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Siguiente</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}