// Product categories
export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Shoes',
  'Books',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Sports & Outdoors',
  'Toys & Games',
  'Automotive',
  'Health & Wellness'
];

// Sort options for products
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' }
];

// Order status options
export const ORDER_STATUS = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
];

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'netbanking', label: 'Net Banking' },
  { value: 'cod', label: 'Cash on Delivery' }
];

// Price ranges for filtering
export const PRICE_RANGES = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: '$500+', min: 500, max: 10000 }
];

// Rating filters
export const RATING_FILTERS = [
  { label: '4+ Stars', value: 4 },
  { label: '3+ Stars', value: 3 },
  { label: '2+ Stars', value: 2 },
  { label: '1+ Stars', value: 1 }
];

// Pagination
export const PRODUCTS_PER_PAGE = 12;
export const ORDERS_PER_PAGE = 10;

// Shipping
export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING_COST = 10;
export const TAX_RATE = 0.1; // 10%

// Regex patterns
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[0-9]{10}$/;
export const POSTAL_CODE_REGEX = /^[0-9]{5,6}$/;
