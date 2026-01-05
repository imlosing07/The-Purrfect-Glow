import { XMarkIcon } from '@heroicons/react/24/outline';

interface BrandFormProps {
  name: string;
  logoUrl: string;
  onNameChange: (value: string) => void;
  onLogoChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
  isEdit?: boolean;
}

export default function BrandForm({
  name,
  logoUrl,
  onNameChange,
  onLogoChange,
  onSubmit,
  onCancel,
  loading,
  isEdit = false
}: BrandFormProps) {
  return (
    <div className={isEdit ? 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' : ''}>
      <div className={isEdit ? 'bg-white p-6 rounded-lg shadow-lg max-w-md w-full' : 'bg-white p-6 rounded-lg shadow-md border border-gray-200'}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isEdit ? 'Editar Marca' : 'Crear nueva marca'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit}>
          <div className={isEdit ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
            <div>
              <label className="block mb-1 font-medium">Nombre de la marca:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Logo de la marca:</label>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) => onLogoChange(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          <div className={`mt-4 ${isEdit ? 'flex justify-end space-x-2' : ''}`}>
            {isEdit && (
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={`${isEdit ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded transition-colors`}
              disabled={loading}
            >
              {loading ? (isEdit ? 'Updating...' : 'Creando...') : (isEdit ? 'Update Brand' : 'Crear Marca')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}