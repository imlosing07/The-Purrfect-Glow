import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Brand } from '@/src/types';
import {
  Genre,
  ProductCategory,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS
} from '@/src/app/lib/constants/product-constants';
interface ProductFormProps {
  brands: Brand[];
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

export default function ProductForm({ brands, initialData, onSubmit, onCancel, loading, isEdit = false }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    salePrice: initialData?.salePrice || 0,
    category: initialData?.category || ProductCategory.SNEAKERS,
    genre: initialData?.genre || Genre.UNISEX,
    brandId: initialData?.brandId || (initialData?.brand?.id) || '',
    featured: initialData?.featured || false,
    isNew: initialData?.isNew ?? true,
  });

  const [sizes, setSizes] = useState<Array<{ value: string; inventory: number | null }>>(initialData?.sizes || []);
  const [images, setImages] = useState<Array<{ originalUrl: string; standardUrl: string; publicId: string }>>(
    initialData?.images?.map((img: any) => ({
      originalUrl: img.originalUrl,
      standardUrl: img.standardUrl,
      publicId: img.publicId
    })) || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // CRÍTICO: Actualizar el form cuando cambien los initialData (para modo edición)
  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        salePrice: initialData.salePrice || 0,
        category: initialData.category || ProductCategory.SNEAKERS,
        genre: initialData.genre || Genre.UNISEX,
        brandId: initialData.brandId || (initialData.brand?.id) || '',
        featured: initialData.featured || false,
        isNew: initialData.isNew ?? true,
      });
      setSizes(initialData.sizes || []);
      setImages(
        initialData.images?.map((img: any) => ({
          originalUrl: img.originalUrl,
          standardUrl: img.standardUrl,
          publicId: img.publicId
        })) || []
      );
    } else if (!isEdit) {
      // Limpiar el form si no es edición
      setFormData({
        name: '',
        description: '',
        price: 0,
        salePrice: 0,
        category: ProductCategory.SNEAKERS,
        genre: Genre.UNISEX,
        brandId: '',
        featured: false,
        isNew: true,
      });
      setSizes([]);
      setImages([]);
    }
  }, [initialData?.id, isEdit]); // ✅ Usar initialData?.id en lugar de initialData completo

  const addSize = () => {
    setSizes([...sizes, { value: '', inventory: null }]);
  };
  const updateSize = (index: number, field: string, value: any) => {
    setSizes(sizes.map((size: any, i: number) => i === index ? { ...size, [field]: value } : size));
  };
  const removeSize = (index: number) => setSizes(sizes.filter((_: any, i: number) => i !== index));

  const addImageUrl = async () => {
    if (newImageUrl.trim()) {
      try {
        setUploadingImage(true);
        // Process external URL to get full metadata
        const response = await fetch('/api/images/process-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: newImageUrl.trim(),
            folder: 'products'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to process URL');
        }

        const result = await response.json();
        setImages([...images, {
          originalUrl: result.data.originalUrl,
          standardUrl: result.data.standardUrl,
          publicId: result.data.publicId
        }]);
        setNewImageUrl('');
      } catch (error: any) {
        console.error('Error processing image URL:', error);
        alert(`Failed to add image: ${error.message}`);
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const removeImage = (index: number) => setImages(images.filter((_: any, i: number) => i !== index));

  // Subir imagen a Cloudinary
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      setImages([...images, {
        originalUrl: result.data.originalUrl,
        standardUrl: result.data.standardUrl,
        publicId: result.data.publicId
      }]);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validar que todos los sizes tengan value y inventory válidos
    const validSizes = sizes.filter((size: any) => {
      const hasValue = size.value && size.value.trim() !== '';
      const hasInventory = size.inventory !== null && size.inventory !== undefined && size.inventory >= 0;
      return hasValue && hasInventory;
    });

    // Si hay sizes vacíos, advertir al usuario
    if (validSizes.length === 0) {
      alert('Please add at least one size with a valid value and inventory amount');
      return;
    }

    if (validSizes.length < sizes.length) {
      const skipped = sizes.length - validSizes.length;
      const confirmed = window.confirm(
        `${skipped} size(s) have empty or invalid inventory values and will be skipped. Continue?`
      );
      if (!confirmed) return;
    }

    // Limpiar sizes - solo enviar value e inventory
    const cleanSizes = validSizes.map((size: any) => ({
      value: size.value.trim(),
      inventory: parseInt(size.inventory) || 0
    }));

    await onSubmit({
      ...formData,
      sizes: cleanSizes,
      images,
    });
  };

  return (
    <div className={isEdit ? 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4' : ''}>
      <div className={`bg-white rounded-lg shadow-lg ${isEdit ? 'max-w-4xl w-full max-h-[90vh] overflow-y-auto' : 'border border-gray-200'} p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{isEdit ? 'Edit Product' : 'Create New Product'}</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección 1: Info básica */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Brand *</label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Categorización */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">Category & Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {PRODUCT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{PRODUCT_CATEGORY_LABELS[cat]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Genre *</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value as Genre })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={Genre.MENS}>Men's</option>
                  <option value={Genre.WOMENS}>Women's</option>
                  <option value={Genre.KIDS}>Kids</option>
                  <option value={Genre.UNISEX}>Unisex</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Price *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Sale Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salePrice || ''}
                  onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  />
                  <span className="text-sm">New Arrival</span>
                </label>
              </div>
            </div>
          </div>

          {/* Sección 3: Sizes */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-medium text-gray-900">Available Sizes</h3>
              <button type="button" onClick={addSize} className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
                <PlusIcon className="w-4 h-4" /> Add Size
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {sizes.map((size: any, index: number) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Size (e.g., 9, M, 42)"
                    value={size.value}
                    onChange={(e) => updateSize(index, 'value', e.target.value)}
                    className="flex-1 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    min="0"
                    value={size.inventory === null ? '' : size.inventory}
                    onChange={(e) => updateSize(index, 'inventory', e.target.value === '' ? null : parseInt(e.target.value))}
                    className="w-24 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" onClick={() => removeSize(index)} className="text-red-500 hover:text-red-700 p-1">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {sizes.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No sizes added yet</p>}
            </div>
          </div>

          {/* Sección 4: Images */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-medium text-gray-900">Product Images</h3>
            </div>

            {/* Subir archivo */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                disabled={uploadingImage}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <CloudArrowUpIcon className="w-10 h-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {uploadingImage ? 'Uploading...' : 'Click to upload or drag and drop'}
                </span>
                <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
              </label>
            </div>

            {/* O pegar URL */}
            <div className="flex gap-2">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Or paste image URL"
                className="flex-1 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={addImageUrl} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">
                Add
              </button>
            </div>

            {/* Preview imágenes */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 max-h-60 overflow-y-auto">
              {images.map((image: any, index: number) => (
                <div key={index} className="relative border rounded p-2 group">
                  <img src={image.standardUrl} alt={`Product ${index + 1}`} className="w-full h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-3 md:col-span-5 flex flex-col items-center justify-center py-8 text-gray-400">
                  <PhotoIcon className="w-12 h-12 mb-2" />
                  <p className="text-sm">No images added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading || uploadingImage} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400">
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}