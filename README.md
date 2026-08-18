# ShopSphere - Full-Stack MERN E-Commerce Application

A modern, production-ready e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js). Features a clean UI, comprehensive admin dashboard, and industry-standard practices perfect for showcasing in your portfolio.

![ShopSphere](https://img.shields.io/badge/MERN-E--Commerce-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

### User Features
- **Authentication & Authorization**
  - User registration and login with JWT
  - HTTP-only cookie support
  - Role-based access control (User/Admin)
  - Profile management

- **Product Browsing**
  - Advanced search and filtering
  - Category-based navigation
  - Price range filters
  - Sort by price, rating, and date
  - Product reviews and ratings
  - Responsive product cards with discount badges

- **Shopping Cart**
  - Persistent cart (database-backed)
  - Real-time stock validation
  - Quantity management
  - Free shipping threshold

- **Checkout Process**
  - Multi-step checkout flow
  - Shipping address management
  - Multiple payment methods (Card, UPI, COD, Net Banking)
  - Order summary with tax calculation
  - Simulated payment processing

- **Order Management**
  - Order history with pagination
  - Real-time order status tracking
  - Order cancellation (for Pending/Processing orders)
  - Detailed order view with tracking

### Admin Features
- **Dashboard**
  - Revenue and order statistics
  - Order status breakdown
  - Low stock alerts
  - Recent orders overview

- **Product Management**
  - CRUD operations for products
  - Image upload with Cloudinary
  - Inventory tracking
  - Stock status indicators

- **Order Management**
  - View all orders with filters
  - Update order status inline
  - Track payments
  - Customer information view

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Context API** for state management
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Cloudinary** for image hosting
- **Express Validator** for input validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd shopsphere
```

### 2. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/shopsphere

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### 4. Seed the Database

Populate the database with sample products and users:

```bash
npm run seed
```

This creates:
- **Admin user:** admin@shopsphere.com / admin123
- **Test user:** john@example.com / user123
- **18 sample products** across multiple categories

### 5. Run the Application

**Development Mode (Backend + Frontend):**

Terminal 1 (Backend):
```bash
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run client
```

**Access the Application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
shopsphere/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── cloudinary.js         # Cloudinary config
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── productController.js  # Product CRUD
│   │   ├── cartController.js     # Cart operations
│   │   └── orderController.js    # Order management
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   ├── errorHandler.js       # Global error handling
│   │   ├── validator.js          # Input validation
│   │   └── uploadMiddleware.js   # File upload handling
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   ├── Cart.js               # Cart schema
│   │   └── Order.js              # Order schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/
│   │   ├── asyncHandler.js       # Async error wrapper
│   │   ├── generateToken.js      # JWT generation
│   │   └── cloudinaryUpload.js   # Image upload utilities
│   ├── seed.js                   # Database seeder
│   └── server.js                 # Express app entry
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── context/              # React Context providers
│   │   ├── pages/                # Page components
│   │   │   ├── admin/            # Admin pages
│   │   │   ├── Home.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── utils/
│   │   │   ├── helpers.js        # Utility functions
│   │   │   └── constants.js      # App constants
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔑 Demo Credentials

### Admin Account
- **Email:** admin@shopsphere.com
- **Password:** admin123

### User Account
- **Email:** john@example.com
- **Password:** user123

## 🎯 API Endpoints

### Authentication
```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login user
GET    /api/auth/me             # Get current user
GET    /api/auth/logout         # Logout user
PUT    /api/auth/profile        # Update profile
PUT    /api/auth/password       # Change password
```

### Products
```
GET    /api/products            # Get all products (with filters)
GET    /api/products/:id        # Get single product
POST   /api/products            # Create product (Admin)
PUT    /api/products/:id        # Update product (Admin)
DELETE /api/products/:id        # Delete product (Admin)
POST   /api/products/:id/reviews # Create review
```

### Cart
```
GET    /api/cart                # Get user cart
POST   /api/cart                # Add to cart
PUT    /api/cart/:itemId        # Update cart item
DELETE /api/cart/:itemId        # Remove from cart
DELETE /api/cart                # Clear cart
```

### Orders
```
POST   /api/orders              # Create order
GET    /api/orders/myorders     # Get user orders
GET    /api/orders/:id          # Get order details
PUT    /api/orders/:id/pay      # Update payment status
PUT    /api/orders/:id/cancel   # Cancel order
GET    /api/orders/admin/all    # Get all orders (Admin)
PUT    /api/orders/:id/status   # Update order status (Admin)
```

## 🎨 Features Showcase

### For Users:
1. Browse products with advanced filters
2. Add products to cart with real-time stock validation
3. Secure checkout with multiple payment options
4. Track order status in real-time
5. Write and read product reviews
6. Manage profile and shipping addresses

### For Admins:
1. Comprehensive dashboard with key metrics
2. Manage product inventory with image uploads
3. Process and update orders
4. Monitor low stock products
5. View customer information
6. Track revenue and order statistics

## 🚀 Deployment

### Backend Deployment (e.g., Render, Railway, Heroku)
1. Set environment variables
2. Update MONGODB_URI to production database
3. Set NODE_ENV to 'production'
4. Deploy backend code

### Frontend Deployment (e.g., Vercel, Netlify)
1. Update API endpoint in frontend
2. Build production bundle: `npm run build`
3. Deploy dist folder

## 🔒 Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS configuration
- Protected routes on frontend and backend
- Role-based access control
- Secure payment simulation

## 🧪 Testing

**Test the application with:**
1. User registration and login
2. Product browsing and filtering
3. Adding items to cart
4. Checkout process
5. Order placement and tracking
6. Admin dashboard features
7. Product management
8. Order status updates

## 📝 Future Enhancements

- [ ] Real payment gateway integration (Stripe/Razorpay)
- [ ] Email notifications for orders
- [ ] Product wishlist
- [ ] Advanced analytics dashboard
- [ ] Coupon/discount system
- [ ] Multi-language support
- [ ] Social media authentication
- [ ] Product recommendations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for learning and portfolio demonstration.

## 🙏 Acknowledgments

- React and Vite teams for amazing tools
- Tailwind CSS for beautiful styling
- MongoDB for flexible data storage
- Cloudinary for image hosting

---

**Note:** This is a demonstration project for educational and portfolio purposes. For production use, implement additional security measures, real payment processing, and thorough testing.
