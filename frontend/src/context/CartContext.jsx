import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await cartAPI.getCart();
      setCart(data.cart);
    } catch (err) {
      setError(err.message);
      console.error('Fetch cart error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      const { data } = await cartAPI.addToCart(productId, quantity);
      setCart(data.cart);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      setError(null);
      const { data } = await cartAPI.updateCartItem(itemId, quantity);
      setCart(data.cart);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setError(null);
      const { data } = await cartAPI.removeFromCart(itemId);
      setCart(data.cart);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const { data } = await cartAPI.clearCart();
      setCart(data.cart);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  // Calculate cart totals
  const cartItemsCount = cart?.items?.length || 0;
  const cartTotal = cart?.subtotal || 0;

  const value = {
    cart,
    loading,
    error,
    cartItemsCount,
    cartTotal,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
