import { Link } from 'react-router-dom';
import { ShoppingCart, Star, StarHalf } from 'lucide-react';
import { formatCurrency, calculateDiscount, generateStars } from '../utils/helpers';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);

  const discount = calculateDiscount(product.price, product.discountPrice);
  const finalPrice = product.discountPrice || product.price;
  const stars = generateStars(product.ratings);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (product.stock === 0) return;

    setAdding(true);
    const result = await addToCart(product._id, 1);
    setAdding(false);

    if (result.success) {
      // Optional: Show toast notification
    }
  };

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="card-hover group-hover:scale-105 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <img
            src={product.images[0]?.url || 'https://via.placeholder.com/400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse-slow">
              {discount}% OFF
            </div>
          )}

          {/* Stock Status */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center animate-fade-in">
              <span className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold shadow-xl">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="text-white font-semibold text-sm bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg">
              Quick View
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Category */}
          <p className="text-xs text-primary-600 font-bold uppercase tracking-wider mb-2 animate-fade-in">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 text-lg group-hover:text-primary-600 transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {stars.map((star, index) => (
                <span key={index} className="transform transition-transform hover:scale-125">
                  {star === 'full' && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                  {star === 'half' && <StarHalf className="w-4 h-4 text-yellow-400 fill-current" />}
                  {star === 'empty' && <Star className="w-4 h-4 text-gray-300" />}
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600 font-medium">
              ({product.numReviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-extrabold gradient-text">
                {formatCurrency(finalPrice)}
              </span>
              {discount > 0 && (
                <span className="text-sm text-gray-500 line-through font-medium">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className={`w-full text-sm ${
              product.stock === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed py-3 rounded-lg'
                : 'btn btn-primary'
            } flex items-center justify-center space-x-2 group-hover:shadow-lg`}
          >
            <ShoppingCart className={`w-5 h-5 ${!adding && 'group-hover:animate-wiggle'}`} />
            <span className="font-bold">{adding ? 'Adding...' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
