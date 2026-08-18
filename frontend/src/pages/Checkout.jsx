import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard, MapPin, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { formatCurrency, calculateCartTotals } from '../utils/helpers';
import { PAYMENT_METHODS } from '../utils/constants';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Shipping Address
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  // Payment Method ('razorpay' or 'cod')
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const totals = calculateCartTotals(cart.items);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine1 ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode
    ) {
      setError('Please fill in all required shipping fields');
      return;
    }

    setStep(2);
  };

  const handlePaymentSelectSubmit = (e) => {
    e.preventDefault();
    setError('');
    setStep(3);
  };

  // Trigger Razorpay Modal Checkout
  const handleRazorpayPayment = async (createdOrder) => {
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      
      // 1. Create Razorpay order on backend
      const { data: rzpData } = await axios.post(`${apiBase}/payment/order`, {
        amount: totals.total
      });

      if (!rzpData.success) {
        throw new Error(rzpData.message || 'Failed to initiate Razorpay order');
      }

      // 2. Open Razorpay Checkout Window
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpData.order.amount,
        currency: rzpData.order.currency,
        name: 'ShopSphere',
        description: `Order #${createdOrder._id}`,
        order_id: rzpData.order.id,
        handler: async function (response) {
          try {
            // 3. Verify payment signature on backend
            const { data: verifyRes } = await axios.post(`${apiBase}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              // 4. Update order status to paid in database
              await ordersAPI.updateOrderToPaid(createdOrder._id, {
                id: response.razorpay_payment_id,
                status: 'COMPLETED',
                update_time: new Date().toISOString(),
                email_address: 'customer@example.com'
              });

              await clearCart();
              navigate(`/orders/${createdOrder._id}`, { state: { fromCheckout: true } });
            }
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phone,
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment failed');
      setLoading(false);
    }
  };

  // Final submission trigger
  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      const orderData = {
        orderItems: cart.items.map((item) => ({
          product: item.product._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: totals.subtotal,
        taxPrice: totals.tax,
        shippingPrice: totals.shipping,
        totalPrice: totals.total
      };

      const { data } = await ordersAPI.createOrder(orderData);

      if (paymentMethod === 'cod') {
        // Direct cash on delivery completion
        await clearCart();
        navigate(`/orders/${data.order._id}`, { state: { fromCheckout: true } });
      } else {
        // Online Gateway Flow
        await handleRazorpayPayment(data.order);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping', icon: MapPin },
    { number: 2, title: 'Payment', icon: CreditCard },
    { number: 3, title: 'Review', icon: ShoppingBag }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step >= s.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > s.number ? <Check className="w-6 h-6" /> : <s.icon className="w-6 h-6" />}
                  </div>
                  <span className="text-sm font-medium mt-2">{s.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-1 mx-4 ${
                      step > s.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <Alert type="error" message={error} onClose={() => setError('')} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card p-6">
              {/* Step 1: Shipping Address */}
              {step === 1 && (
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.fullName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                        className="input"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        className="input"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.addressLine1}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                      className="input"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.addressLine2}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                      className="input"
                      placeholder="Apartment, suite, unit (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="input"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="input"
                        placeholder="State"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                        className="input"
                        placeholder="Postal Code"
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full btn btn-primary mt-4">
                    Continue to Payment
                  </button>
                </form>
              )}

              {/* Step 2: Payment Method Selection */}
              {step === 2 && (
                <form onSubmit={handlePaymentSelectSubmit} className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Select Payment Method</h2>

                  <div className="space-y-3">
                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                        paymentMethod === 'razorpay'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium text-gray-900 block">Online Payment (Razorpay)</span>
                        <span className="text-xs text-gray-500">Supports UPI, Credit/Debit Cards, Net Banking & Wallets</span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <span className="font-medium text-gray-900 block">Cash on Delivery (COD)</span>
                        <span className="text-xs text-gray-500">Pay cash upon item delivery</span>
                      </div>
                    </label>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 btn btn-outline"
                    >
                      Back
                    </button>
                    <button type="submit" className="flex-1 btn btn-primary">
                      Review Order
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Order Review */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">Review Order</h2>

                  {/* Shipping Info Card */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Shipping Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                      <p className="font-medium">{shippingAddress.fullName}</p>
                      <p>{shippingAddress.addressLine1}</p>
                      {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                      <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                      <p>{shippingAddress.country}</p>
                      <p className="mt-2 text-gray-600">Phone: {shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Payment Method Selected */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Payment Option</h3>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                      <p className="font-medium uppercase">
                        {paymentMethod === 'razorpay' ? 'Razorpay Secure Checkout' : 'Cash On Delivery'}
                      </p>
                    </div>
                  </div>

                  {/* Item List */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div key={item._id} className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 btn btn-outline"
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="flex-1 btn btn-primary flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="small" />
                          <span className="ml-2">Processing...</span>
                        </>
                      ) : (
                        paymentMethod === 'razorpay' ? 'Proceed to Pay' : 'Confirm Order'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
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
                  <span>Tax</span>
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

              <div className="text-xs text-gray-500">
                <p>Protected by Razorpay 256-bit SSL encryption.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;