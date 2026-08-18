import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, LayoutDashboard, Search, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-gray-200/50 animate-slide-down">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-primary-500/50">
              <ShoppingCart className="w-6 h-6 text-white animate-float" />
            </div>
            <span className="text-xl font-bold gradient-text">ShopSphere</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 animate-fade-in">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-300 hover:border-gray-300 shadow-sm hover:shadow-md"
              />
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 transition-colors group-hover:text-primary-500" />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/products" 
              className="text-gray-700 hover:text-primary-600 font-semibold transition-all duration-300 hover:scale-110 transform"
            >
              Products
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative text-gray-700 hover:text-primary-600 transition-all duration-300 transform hover:scale-110 group">
                  <ShoppingCart className="w-6 h-6 group-hover:animate-wiggle" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce-slow">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 font-semibold transition-all duration-300 transform hover:scale-110"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Admin</span>
                  </Link>
                )}

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold">{user?.name}</span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-52 glass-effect rounded-xl shadow-2xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 font-medium"
                    >
                      <User className="inline w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200 font-medium"
                    >
                      <Package className="inline w-4 h-4 mr-2" />
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 font-medium"
                    >
                      <LogOut className="inline w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4 animate-fade-in">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 font-semibold transition-all duration-300 transform hover:scale-110">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-110"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200/50 animate-slide-down">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all shadow-sm"
                />
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </form>

            <div className="space-y-2">
              <Link
                to="/products"
                className="block py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-semibold transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center justify-between py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-semibold transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Cart</span>
                    {cartItemsCount > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    className="block py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-semibold transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-semibold transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-semibold transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 px-4 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-all duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-3 px-4 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-semibold transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-3 px-4 text-center bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
