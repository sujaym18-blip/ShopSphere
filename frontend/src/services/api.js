import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for cookies
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    
    // Redirect to login on 401
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject({ message, status: error.response?.status });
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.get('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
  addAddress: (address) => api.post('/auth/addresses', address),
  updateAddress: (addressId, address) => api.put(`/auth/addresses/${addressId}`, address),
  deleteAddress: (addressId) => api.delete(`/auth/addresses/${addressId}`)
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProduct: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  createReview: (id, review) => api.post(`/products/${id}/reviews`, review),
  getCategories: () => api.get('/products/categories/all'),
  getLowStockProducts: (threshold) => api.get('/products/admin/low-stock', { params: { threshold } })
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart', { productId, quantity }),
  updateCartItem: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart')
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getMyOrders: (params) => api.get('/orders/myorders', { params }),
  updateOrderToPaid: (id, paymentResult) => api.put(`/orders/${id}/pay`, paymentResult),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  
  // Admin endpoints
  getAllOrders: (params) => api.get('/orders/admin/all', { params }),
  updateOrderStatus: (id, status, trackingNumber) => api.put(`/orders/${id}/status`, { 
    orderStatus: status, 
    trackingNumber 
  }),
  getOrderStats: () => api.get('/orders/admin/stats')
};

export default api;
