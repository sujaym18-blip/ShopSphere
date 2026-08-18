import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { productsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import Alert from '../../components/Alert';
import { formatCurrency, getStockStatus } from '../../utils/helpers';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 20,
        ...(searchQuery && { search: searchQuery })
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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await productsAPI.deleteProduct(id);
      setSuccess('Product deleted successfully');
      fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-2">Manage your product inventory</p>
          </div>
          <Link to="/admin/products/create" className="btn btn-primary flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Add Product</span>
          </Link>
        </div>

        {success && (
          <div className="mb-6">
            <Alert type="success" message={success} onClose={() => setSuccess('')} />
          </div>
        )}
        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        {/* Search */}
        <div className="card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Products Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Stock</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => {
                      const stockStatus = getStockStatus(product.stock);
                      return (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={product.images[0]?.url}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div>
                                <Link
                                  to={`/products/${product._id}`}
                                  className="font-medium text-gray-900 hover:text-primary-600 line-clamp-1"
                                >
                                  {product.name}
                                </Link>
                                <p className="text-sm text-gray-500">{product.brand}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700">{product.category}</td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {formatCurrency(product.discountPrice || product.price)}
                              </p>
                              {product.discountPrice && (
                                <p className="text-xs text-gray-500 line-through">
                                  {formatCurrency(product.price)}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`text-sm font-medium ${stockStatus.color}`}>
                              {stockStatus.text}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-700">
                            {product.ratings.toFixed(1)} ({product.numReviews})
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                to={`/admin/products/edit/${product._id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDelete(product._id, product.name)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
  );
};

export default AdminProducts;
