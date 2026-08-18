import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import Pagination from '../components/Pagination';
import EmptyState from '../components/EmptyState';
import { CATEGORIES, SORT_OPTIONS, PRICE_RANGES } from '../utils/constants';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1
  });

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        limit: 12
      };
      const { data } = await productsAPI.getProducts(params);
      setProducts(data.products);
      setPagination({
        page: data.page,
        pages: data.pages,
        total: data.total
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const resetFilters = {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest',
      page: 1
    };
    setFilters(resetFilters);
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  const activeFiltersCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">
            Showing {products.length} of {pagination.total} products
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block">
            <div className="card p-6 sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => updateFilters({ category: '' })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">All Categories</span>
                  </label>
                  {CATEGORIES.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category}
                        onChange={() => updateFilters({ category })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      checked={!filters.minPrice && !filters.maxPrice}
                      onChange={() => updateFilters({ minPrice: '', maxPrice: '' })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">All Prices</span>
                  </label>
                  {PRICE_RANGES.map((range) => (
                    <label key={range.label} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filters.minPrice == range.min && filters.maxPrice == range.max}
                        onChange={() => updateFilters({ minPrice: range.min, maxPrice: range.max })}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Toggle & Sort */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden btn btn-outline flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <select
                value={filters.sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="input max-w-xs"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filters Modal */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
                <div className="absolute inset-y-0 left-0 w-80 bg-white p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Same filters as desktop */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Category</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="category-mobile"
                          checked={!filters.category}
                          onChange={() => updateFilters({ category: '' })}
                          className="mr-2"
                        />
                        <span className="text-sm">All Categories</span>
                      </label>
                      {CATEGORIES.map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="radio"
                            name="category-mobile"
                            checked={filters.category === category}
                            onChange={() => updateFilters({ category })}
                            className="mr-2"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="priceRange-mobile"
                          checked={!filters.minPrice && !filters.maxPrice}
                          onChange={() => updateFilters({ minPrice: '', maxPrice: '' })}
                          className="mr-2"
                        />
                        <span className="text-sm">All Prices</span>
                      </label>
                      {PRICE_RANGES.map((range) => (
                        <label key={range.label} className="flex items-center">
                          <input
                            type="radio"
                            name="priceRange-mobile"
                            checked={filters.minPrice == range.min && filters.maxPrice == range.max}
                            onChange={() => updateFilters({ minPrice: range.min, maxPrice: range.max })}
                            className="mr-2"
                          />
                          <span className="text-sm">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full btn btn-primary"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                title="No products found"
                message="Try adjusting your filters or search query"
                actionLabel="Clear Filters"
                actionLink="#"
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
