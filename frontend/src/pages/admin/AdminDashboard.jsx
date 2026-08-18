import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { ordersAPI, productsAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch order stats
      const { data: statsData } = await ordersAPI.getOrderStats();
      setStats(statsData);

      // Fetch low stock products
      const { data: lowStockData } = await productsAPI.getLowStockProducts(10);
      setLowStockProducts(lowStockData.products);

      // Fetch recent orders
      const { data: ordersData } = await ordersAPI.getAllOrders({ limit: 5 });
      setRecentOrders(ordersData.orders);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      link: '/admin/orders'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'bg-green-500',
      link: '/admin/orders?status=Delivered'
    },
    {
      title: 'Pending Orders',
      value: stats?.statusBreakdown?.find(s => s._id === 'Pending')?.count || 0,
      icon: Package,
      color: 'bg-orange-500',
      link: '/admin/orders?status=Pending'
    },
    {
      title: 'Low Stock Items',
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: 'bg-red-500',
      link: '/admin/products'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link key={index} to={stat.link} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <Link
                    key={order._id}
                    to={`/orders/${order._id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-mono text-sm font-semibold text-gray-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600">{order.user?.name || 'Customer'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'Pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            )}
          </div>

          {/* Low Stock Products */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Low Stock Alert</h2>
              <Link to="/admin/products" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                Manage Products
              </Link>
            </div>

            {lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={product.images[0]?.url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-semibold ${
                        product.stock === 0 ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">All products are well stocked!</p>
            )}
          </div>
        </div>

        {/* Order Status Breakdown */}
        {stats?.statusBreakdown && stats.statusBreakdown.length > 0 && (
          <div className="card p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status Breakdown</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {stats.statusBreakdown.map((status) => (
                <div key={status._id} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{status.count}</p>
                  <p className="text-sm text-gray-600 mt-1">{status._id}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatCurrency(status.totalAmount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Link
            to="/admin/products"
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <Package className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Products</h3>
            <p className="text-gray-600 text-sm">Add, edit, or remove products from inventory</p>
          </Link>

          <Link
            to="/admin/orders"
            className="card p-6 hover:shadow-lg transition-shadow text-center"
          >
            <ShoppingBag className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Orders</h3>
            <p className="text-gray-600 text-sm">View and update order status and tracking</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
