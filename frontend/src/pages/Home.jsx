import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Shield, Truck } from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await productsAPI.getProducts({ featured: 'true', limit: 8 });
      setFeaturedProducts(data.products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white py-24 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl animate-fade-in-up">
            <h1 className="text-6xl font-extrabold mb-6 leading-tight">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-accent-200">ShopSphere</span>
            </h1>
            <p className="text-2xl text-primary-100 mb-10 leading-relaxed">
              Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.
            </p>
            <Link 
              to="/products" 
              className="inline-flex items-center bg-white text-primary-600 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-accent-500/50 hover:scale-105 transition-all duration-300 group"
            >
              Shop Now
              <ShoppingBag className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100', color: 'from-blue-400 to-blue-600' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure transactions', color: 'from-green-400 to-green-600' },
              { icon: TrendingUp, title: 'Best Prices', desc: 'Competitive pricing', color: 'from-purple-400 to-purple-600' },
              { icon: ShoppingBag, title: 'Easy Returns', desc: '30-day return policy', color: 'from-pink-400 to-pink-600' }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="text-center group animate-fade-in-up hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-2xl group-hover:rotate-6 transition-all duration-300`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12 animate-slide-right">
            <div>
              <h2 className="text-4xl font-bold gradient-text mb-3">Featured Products</h2>
              <p className="text-gray-600 text-lg">Check out our hand-picked selection</p>
            </div>
            <Link to="/products" className="btn btn-outline">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product._id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <h2 className="text-4xl font-bold gradient-text mb-12 text-center animate-fade-in-up">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {['Electronics', 'Clothing', 'Shoes', 'Books', 'Home & Kitchen'].map((category, index) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="card-hover p-8 text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <span className="text-3xl">📦</span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-300 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container-custom text-center relative z-10 animate-fade-in-up">
          <h2 className="text-5xl font-extrabold mb-6">Ready to Start Shopping?</h2>
          <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers and discover quality products at great prices.
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center bg-white text-primary-600 px-12 py-5 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/50 hover:scale-110 transition-all duration-300 group"
          >
            Create Account
            <span className="ml-2 text-2xl group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
