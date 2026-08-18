import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import { formatCurrency, calculateCartTotals } from '../utils/helpers';
import { useState } from 'react';

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart } = useCart();
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState('');

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            message="Add some products to your cart to get started"
            actionLabel="Continue Shopping"
            actionLink="/products"
          />
        </div>
      </div>
    );
  }

  const totals = calculateCartTotals(cart.items);

  const handleQuantityUpdate = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(itemId);
    setError('');
    const result = await updateCartItem(itemId, newQuantity);
    setUpdating(null);

    if (!result.success) {
      setError(result.message);
    }
  };

  const handleRemove = async (itemId) => {
    setError('');
    const result = await removeFromCart(itemId);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="card p-4">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <Link to={`/products/${item.product._id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      to={`/products/${item.product._id}`}
                      className="font-semibold text-gray-900 hover:text-primary-600 mb-1 block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-lg font-bold text-gray-900 mb-3">
                      {formatCurrency(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityUpdate(item._id, item.quantity - 1)}
                          disabled={updating === item._id || item.quantity <= 1}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                          {updating === item._id ? (
                            <LoadingSpinner size="small" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => handleQuantityUpdate(item._id, item.quantity + 1)}
                          disabled={updating === item._id || item.quantity >= item.stock}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Remove</span>
                      </button>
                    </div>

                    {/* Stock Warning */}
                    {item.stock < 10 && (
                      <p className="text-sm text-orange-600 mt-2">
                        Only {item.stock} left in stock
                      </p>
                    )}
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {totals.shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      formatCurrency(totals.shipping)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-medium">{formatCurrency(totals.tax)}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(totals.total)}
                    </span>
                  </div>
                </div>
              </div>

              {totals.subtotal < 100 && totals.shipping > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-800">
                    Add {formatCurrency(100 - totals.subtotal)} more to get FREE shipping!
                  </p>
                </div>
              )}

              <Link to="/checkout" className="w-full btn btn-primary block text-center">
                Proceed to Checkout
              </Link>

              <Link
                to="/products"
                className="w-full btn btn-outline block text-center mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
