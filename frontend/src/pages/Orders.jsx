import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import { formatCurrency, formatDateShort, getOrderStatusColor } from '../utils/helpers';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchOrders();
  }, [pagination.page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await ordersAPI.getMyOrders({ page: pagination.page });
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

  const handlePageChange = (page) => {
    setPagination({ ...pagination, page });
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <EmptyState
            icon={Package}
            title="No orders yet"
            message="You haven't placed any orders. Start shopping to see your orders here!"
            actionLabel="Browse Products"
            actionLink="/products"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order._id}
                to={`/orders/${order._id}`}
                className="card p-6 hover:shadow-lg transition-shadow block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono font-semibold text-gray-900">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`badge ${getOrderStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="font-medium text-gray-900">{formatDateShort(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-bold text-gray-900">{formatCurrency(order.totalPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Status</p>
                    <p className={`font-medium ${order.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                      {order.isPaid ? 'Paid' : 'Pending'}
                    </p>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500 mb-2">Items ({order.orderItems.length})</p>
                  <div className="flex -space-x-2">
                    {order.orderItems.slice(0, 3).map((item, index) => (
                      <img
                        key={index}
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover border-2 border-white"
                      />
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 border-2 border-white flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          +{order.orderItems.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tracking Number */}
                {order.trackingNumber && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">Tracking Number</p>
                    <p className="font-mono font-medium text-primary-600">{order.trackingNumber}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Orders;
