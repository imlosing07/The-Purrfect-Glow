import { PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Product } from '@/src/types';
import Image from 'next/image';

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onManageImages: (product: Product) => void;
}

export default function ProductsTable({ products, loading, onEdit, onDelete, onManageImages }: ProductsTableProps) {
  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando productos...</div>;
  }

  if (products.length === 0) {
    return <div className="p-8 text-center text-gray-500">No se encontraron productos.</div>;
  }

  return (
    <>
      {/* Vista Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const mainImage = product.images?.find((img: any) => img.isMain) || product.images?.[0];
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    {mainImage ? (
                      <Image src={mainImage.standardUrl} alt={product.name} width={48} height={48} className="h-12 w-12 object-cover rounded" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                        <PhotoIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-xs text-gray-500">{product.genre}</div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900">{product.brand?.name || 'N/A'}</td>
                  <td className="px-3 py-4 text-sm text-gray-900">{product.category}</td>
                  <td className="px-3 py-4">
                    <div className="text-sm font-medium text-gray-900">${product.price}</div>
                    {product.salePrice && (
                      <div className="text-xs text-green-600">${product.salePrice}</div>
                    )}
                  </td>
                  <td className="px-3 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(product)} className="text-blue-500 hover:text-blue-700" title="Editar">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => onManageImages(product)} className="text-green-500 hover:text-green-700" title="Imágenes">
                        <PhotoIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-700" title="Eliminar">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile (Cards) */}
      <div className="md:hidden space-y-3 p-4">
        {products.map((product) => {
          const mainImage = product.images?.find((img: any) => img.isMain) || product.images?.[0];
          return (
            <div key={product.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex gap-3">
                {mainImage ? (
                  <Image src={mainImage.standardUrl} alt={product.name} width={80} height={80} className="h-20 w-20 object-cover rounded flex-shrink-0" />
                ) : (
                  <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <PhotoIcon className="h-10 w-10 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.brand?.name}</p>
                  <p className="text-xs text-gray-400">{product.category} • {product.genre}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    {product.salePrice && (
                      <span className="text-sm text-green-600 font-medium">${product.salePrice}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2 border-t pt-3">
                <button onClick={() => onEdit(product)} className="text-blue-500 hover:text-blue-700 px-3 py-1.5 border border-blue-500 rounded text-sm">
                  Editar
                </button>
                <button onClick={() => onManageImages(product)} className="text-green-500 hover:text-green-700 px-3 py-1.5 border border-green-500 rounded text-sm">
                  Imágenes
                </button>
                <button onClick={() => onDelete(product.id)} className="text-red-500 hover:text-red-700 px-3 py-1.5 border border-red-500 rounded text-sm">
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}