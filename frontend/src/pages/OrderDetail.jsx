import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Package, MapPin, CreditCard, Check, X as XIcon } from 'lucide-react';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { formatCurrency, formatDate, getOrderStatusColor } from '../utils/helpers';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fromCheckout = location.state?.fromCheckout;

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await ordersAPI.getOrderById(id);
      setOrder(data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    setError('');

    try {
      await ordersAPI.cancelOrder(id);
      setSuccess('Order cancelled successfully');
      fetchOrder();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link to="/orders" className="btn btn-primary">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const canCancel = ['Pending', 'Processing'].includes(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Success Message from Checkout */}
          {fromCheckout && (
            <div className="mb-6">
              <Alert
                type="success"
                message="Order placed successfully! Your order is being processed."
              />
            </div>
          )}

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

          {/* Header */}
          <div className="card p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Order #{order._id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-gray-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <span className={`badge text-base ${getOrderStatusColor(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                <div className="flex items-center space-x-2">
                  {order.isPaid ? (
                    <>
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-600">Paid</span>
                    </>
                  ) : (
                    <>
                      <XIcon className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-orange-600">Pending</span>
                    </>
                  )}
                </div>
                {order.isPaid && order.paidAt && (
                  <p className="text-xs text-gray-500 mt-1">{formatDate(order.paidAt)}</p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(order.totalPrice)}</p>
              </div>

              {order.trackingNumber && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                  <p className="font-mono font-medium text-primary-600">{order.trackingNumber}</p>
                </div>
              )}
            </div>

            {canCancel && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="btn btn-danger"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Shipping Address */}
            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="text-gray-700 space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p className="pt-2">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              </div>
              <div className="text-gray-700">
                <p className="capitalize font-medium">{order.paymentMethod}</p>
                {order.paymentResult?.id && (
                  <p className="text-sm text-gray-600 mt-2">
                    Transaction ID: {order.paymentResult.id}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card p-6 mb-6">
            <div className="flex items-center space-x-2 mb-6">
              <Package className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
            </div>

            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 pb-4 border-b border-gray-200 last:border-0">
                  <Link to={`/products/${item.product}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.product}`}
                      className="font-semibold text-gray-900 hover:text-primary-600 block mb-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Items Price</span>
                <span className="font-medium">{formatCurrency(order.itemsPrice)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">
                  {order.shippingPrice === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    formatCurrency(order.shippingPrice)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium">{formatCurrency(order.taxPrice)}</span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <Link to="/orders" className="btn btn-outline">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
