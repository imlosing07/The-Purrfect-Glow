import { useState } from "react";
import { 
  ProductCategory, 
  Genre,
  PRODUCT_CATEGORIES,
  PRODUCT_CATEGORY_LABELS 
} from "@/src/app/lib/constants/product-constants"

interface FilterState {
  categories: ProductCategory[];
  genres: Genre[];
  brands: string[];
  priceRange: { min: number; max: number } | null;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableBrands: string[];
  showGenreFilter?: boolean;
  currentGenre?: Genre | null;
}

const PRICE_RANGES = [
  { min: 0, max: 100, label: "Menos de S/100" },
  { min: 100, max: 200, label: "S/100 - S/200" },
  { min: 200, max: 300, label: "S/200 - S/300" },
  { min: 300, max: 500, label: "S/300 - S/500" },
  { min: 500, max: 99999, label: "Más de S/500" },
];

export default function FilterBar({
  filters,
  onFilterChange,
  availableBrands,
  currentGenre
}: FilterBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const toggleCategory = (category: ProductCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    onFilterChange({ ...filters, brands: newBrands });
  };

  const setPriceRange = (range: { min: number; max: number } | null) => {
    onFilterChange({ ...filters, priceRange: range });
  };

  const clearFilters = () => {
    onFilterChange({
      categories: [],
      genres: currentGenre ? [currentGenre] : [],
      brands: [],
      priceRange: null,
    });
  };

  const activeFiltersCount = 
    filters.categories.length + 
    filters.brands.length + 
    (filters.priceRange ? 1 : 0);

  return (
    <div className="bg-white border-b top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Botón para mostrar/ocultar filtros */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
            {activeFiltersCount > 0 && (
              <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-black underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Panel de filtros - solo se muestra si showFilters es true */}
        {showFilters && (
          <div className="space-y-4">
            {/* Filtros rápidos - Categorías como chips */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filtrar por:
              </span>
              {PRODUCT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                    filters.categories.includes(category)
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {PRODUCT_CATEGORY_LABELS[category]}
                </button>
              ))}
            </div>
            {/* Botón filtros avanzados */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-medium hover:underline"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Más filtros
              </button>
            </div>

            {/* Panel expandible de filtros avanzados */}
            {isOpen && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Marcas */}
                <div>
                  <h3 className="font-medium mb-3 text-sm">Marcas</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableBrands.map((brand) => (
                      <label key={brand} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rango de precios */}
                <div>
                  <h3 className="font-medium mb-3 text-sm">Precio</h3>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                      <label key={range.label} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="radio"
                          name="priceRange"
                          checked={
                            filters.priceRange?.min === range.min &&
                        filters.priceRange?.max === range.max
                          }
                          onChange={() => setPriceRange(range)}
                          className="w-4 h-4 border-gray-300 text-black focus:ring-black"
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filtros activos */}
                <div>
                  <h3 className="font-medium mb-3 text-sm">Filtros activos</h3>
                  <div className="flex flex-wrap gap-2">
                    {filters.categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs"
                      >
                        {PRODUCT_CATEGORY_LABELS[cat]}
                        <button
                          onClick={() => toggleCategory(cat)}
                          className="hover:text-red-600"
                        >
                      ×
                        </button>
                      </span>
                    ))}
                    {filters.brands.map((brand) => (
                      <span
                        key={brand}
                        className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs"
                      >
                        {brand}
                        <button
                          onClick={() => toggleBrand(brand)}
                          className="hover:text-red-600"
                        >
                      ×
                        </button>
                      </span>
                    ))}
                    {filters.priceRange && (
                      <span className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-xs">
                        {PRICE_RANGES.find(
                          r => r.min === filters.priceRange?.min && r.max === filters.priceRange?.max
                        )?.label}
                        <button
                          onClick={() => setPriceRange(null)}
                          className="hover:text-red-600"
                        >
                      ×
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}