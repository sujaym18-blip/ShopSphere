import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-500 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container-custom py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-6 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold gradient-text">ShopSphere</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your one-stop destination for quality products at great prices. Shop with confidence and convenience.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social, index) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gradient-to-br hover:from-primary-500 hover:to-primary-600 flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-xl">{social === 'facebook' ? '📘' : social === 'twitter' ? '🐦' : social === 'instagram' ? '📷' : '💼'}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/products?featured=true', label: 'Featured Products' },
                { to: '/cart', label: 'Shopping Cart' },
                { to: '/orders', label: 'Order Tracking' }
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="hover:text-primary-400 transition-all duration-300 hover:translate-x-2 inline-block group"
                  >
                    <span className="group-hover:underline">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Categories
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm">
              {['Electronics', 'Clothing', 'Home & Kitchen', 'Books'].map((category) => (
                <li key={category}>
                  <Link 
                    to={`/products?category=${category}`} 
                    className="hover:text-primary-400 transition-all duration-300 hover:translate-x-2 inline-block group"
                  >
                    <span className="group-hover:underline">{category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3 group">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">Silicon City, Indore, India</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all" />
                <span className="group-hover:text-white transition-colors">+919630575516</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-white transition-colors">kumars302003@gmail</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 p-8 glass-effect rounded-2xl animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-red font-bold text-xl mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-gray-900 text-sm">Get the latest updates on new products and upcoming sales</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-3 rounded-l-xl bg-gray-800 border-2 border-gray-700 text-white focus:outline-none focus:border-primary-500 transition-all w-full md:w-80"
              />
              <button className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-r-xl hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105 shadow-lg">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-400 animate-fade-in">
            © {currentYear} <span className="gradient-text font-bold">ShopSphere</span>. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-4 md:mt-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((link) => (
              <Link 
                key={link}
                to="#" 
                className="text-gray-400 hover:text-primary-400 transition-all duration-300 hover:-translate-y-0.5"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
