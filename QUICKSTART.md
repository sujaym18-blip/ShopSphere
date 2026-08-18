# ShopSphere - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Setup Database
Make sure MongoDB is running on your machine. If you don't have MongoDB installed:
- **Download:** https://www.mongodb.com/try/download/community
- **Or use MongoDB Atlas** (cloud): https://www.mongodb.com/cloud/atlas

### Step 3: Seed Sample Data
```bash
npm run seed
```

This creates sample products and test accounts.

### Step 4: Start the Application

**Open two terminal windows:**

Terminal 1 - Backend Server:
```bash
npm run dev
```

Terminal 2 - Frontend App:
```bash
cd frontend
npm run dev
```

### Step 5: Open Your Browser
Navigate to: **http://localhost:5173**

### Step 6: Login
Use these demo credentials:

**Admin Account:**
- Email: `admin@shopsphere.com`
- Password: `admin123`

**User Account:**
- Email: `john@example.com`
- Password: `user123`

## 🎯 What to Try

### As a User:
1. Browse products on the home page
2. Use search and filters
3. Add products to cart
4. Complete the checkout process
5. View your orders
6. Leave a product review

### As an Admin:
1. Login with admin credentials
2. Visit `/admin` dashboard
3. View statistics and metrics
4. Manage products
5. Update order statuses
6. Monitor low stock items

## 🛠️ Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Change port in `frontend/vite.config.js`

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules
npm install
cd frontend && npm install
```

## 📚 Learn More

Check the full [README.md](./README.md) for:
- Complete feature list
- API documentation
- Deployment guide
- Project structure details

## 💡 Tips

- **Hot Reload:** Both frontend and backend support hot reload
- **API Testing:** Use the demo credentials to test all features
- **Cloudinary:** Images work without Cloudinary (uses demo URLs)
- **Production:** See README.md for deployment instructions

---

Happy coding! 🎉
