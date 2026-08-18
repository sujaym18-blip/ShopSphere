import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Eye, Package } from 'lucide-react';
import { ordersAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import Alert from '../../components/Alert';
import { formatCurrency, formatDateShort, getOrderStatusColor } from '../../utils/helpers';
import { ORDER_STATUS } from '../../utils/constants';

const AdminOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [updating, setUpdating] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 20,
        ...(statusFilter && { status: statusFilter })
      };
      const { data } = await ordersAPI.getAllOrders(params);
      setOrders(data.orders);
      setPagination({
        page: data.page,
        pages: data.pages,
        total: data.total
      });
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId);
    setError('');

    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
      setSuccess(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">View and manage customer orders</p>
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

        {/* Status Filter */}
        <div className="card p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilterChange('')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                !statusFilter
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Orders
            </button>
            {ORDER_STATUS.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilterChange(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm ${
                  statusFilter === status
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {/* Orders Table */}
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Payment</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <p className="font-mono text-sm font-semibold text-gray-900">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm font-medium text-gray-900">{order.user?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{order.user?.email || 'N/A'}</p>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {formatDateShort(order.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            order.isPaid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {updating === order._id ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-lg font-medium border-2 ${
                                order.orderStatus === 'Delivered' ? 'border-green-200 bg-green-50 text-green-800' :
                                order.orderStatus === 'Pending' ? 'border-orange-200 bg-orange-50 text-orange-800' :
                                order.orderStatus === 'Cancelled' ? 'border-red-200 bg-red-50 text-red-800' :
                                'border-blue-200 bg-blue-50 text-blue-800'
                              }`}
                            >
                              {ORDER_STATUS.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end">
                            <Link
                              to={`/orders/${order._id}`}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {orders.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No orders found</p>
              </div>
            )}

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

export default AdminOrders;
