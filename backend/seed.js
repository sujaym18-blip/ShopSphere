import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';

dotenv.config();

// Sample Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@shopsphere.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
    role: 'user'
  }
];

// Sample Products - 70+ products across all categories
const products = [
  // ELECTRONICS (20 products)
  {
    name: 'Apple iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. 6.1-inch Super Retina XDR display.',
    price: 999,
    discountPrice: 949,
    category: 'Electronics',
    brand: 'Apple',
    stock: 50,
    featured: true,
    images: [{ public_id: 'iphone15', url: 'https://images.unsplash.com/photo-1696446702093-aaa79b2c2e2a?w=800' }],
    ratings: 4.8,
    numReviews: 127
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen, 200MP camera, Snapdragon 8 Gen 3. Stunning 6.8-inch display.',
    price: 1199,
    discountPrice: 1099,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 35,
    featured: true,
    images: [{ public_id: 'galaxys24', url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800' }],
    ratings: 4.7,
    numReviews: 98
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones. 30-hour battery life, exceptional sound quality.',
    price: 399,
    discountPrice: 349,
    category: 'Electronics',
    brand: 'Sony',
    stock: 80,
    featured: true,
    images: [{ public_id: 'sonywh1000', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800' }],
    ratings: 4.9,
    numReviews: 245
  },
  {
    name: 'MacBook Pro 14" M3',
    description: 'Powerful laptop with M3 chip, 16GB RAM, 512GB SSD. Liquid Retina XDR display, 17 hours battery.',
    price: 1999,
    category: 'Electronics',
    brand: 'Apple',
    stock: 25,
    featured: true,
    images: [{ public_id: 'macbookpro', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800' }],
    ratings: 4.9,
    numReviews: 156
  },
  {
    name: 'iPad Air M2 11-inch',
    description: '11-inch Liquid Retina display, M2 chip, 256GB storage. Supports Apple Pencil and Magic Keyboard.',
    price: 749,
    discountPrice: 699,
    category: 'Electronics',
    brand: 'Apple',
    stock: 45,
    images: [{ public_id: 'ipadair', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800' }],
    ratings: 4.7,
    numReviews: 89
  },
  {
    name: 'Dell XPS 15 Laptop',
    description: '15.6" 4K OLED display, Intel Core i7, 32GB RAM, 1TB SSD, NVIDIA RTX 4050. Premium build.',
    price: 1899,
    discountPrice: 1749,
    category: 'Electronics',
    brand: 'Dell',
    stock: 18,
    images: [{ public_id: 'dellxps', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800' }],
    ratings: 4.6,
    numReviews: 112
  },
  {
    name: 'Canon EOS R6 Mark II Camera',
    description: 'Full-frame mirrorless camera, 24.2MP sensor, 40fps shooting, 6K video. Professional photography.',
    price: 2499,
    category: 'Electronics',
    brand: 'Canon',
    stock: 12,
    featured: true,
    images: [{ public_id: 'canonr6', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800' }],
    ratings: 4.9,
    numReviews: 76
  },
  {
    name: 'Bose QuietComfort Earbuds II',
    description: 'Premium wireless earbuds with world-class noise cancellation. CustomTune technology, 6-hour battery.',
    price: 299,
    discountPrice: 249,
    category: 'Electronics',
    brand: 'Bose',
    stock: 65,
    images: [{ public_id: 'boseqc', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800' }],
    ratings: 4.7,
    numReviews: 234
  },
  {
    name: 'LG 55" OLED C3 4K TV',
    description: '4K OLED TV with AI processor, perfect blacks, infinite contrast. Dolby Vision IQ, 120Hz gaming.',
    price: 1499,
    discountPrice: 1299,
    category: 'Electronics',
    brand: 'LG',
    stock: 22,
    featured: true,
    images: [{ public_id: 'lgoled', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800' }],
    ratings: 4.8,
    numReviews: 145
  },
  {
    name: 'Amazon Echo Show 15',
    description: '15.6" Full HD smart display with Alexa. Widget home screen, visual ID, smart home control.',
    price: 279,
    discountPrice: 229,
    category: 'Electronics',
    brand: 'Amazon',
    stock: 55,
    images: [{ public_id: 'echoshow', url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800' }],
    ratings: 4.4,
    numReviews: 198
  },
  {
    name: 'GoPro HERO12 Black',
    description: 'Waterproof action camera, 5.3K60 video, HyperSmooth 6.0, HDR. Perfect for adventure.',
    price: 399,
    discountPrice: 349,
    category: 'Electronics',
    brand: 'GoPro',
    stock: 38,
    images: [{ public_id: 'gopro12', url: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=800' }],
    ratings: 4.6,
    numReviews: 167
  },
  {
    name: 'Microsoft Surface Pro 9',
    description: '13" touchscreen, Intel Core i7, 16GB RAM, 512GB SSD. Versatile 2-in-1 with Surface Pen.',
    price: 1599,
    discountPrice: 1449,
    category: 'Electronics',
    brand: 'Microsoft',
    stock: 28,
    images: [{ public_id: 'surfacepro', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800' }],
    ratings: 4.5,
    numReviews: 92
  },
  {
    name: 'PlayStation 5 Console',
    description: 'Next-gen gaming console with ultra-high speed SSD, 4K gaming, haptic feedback. Includes DualSense.',
    price: 499,
    category: 'Electronics',
    brand: 'Sony',
    stock: 20,
    featured: true,
    images: [{ public_id: 'ps5', url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800' }],
    ratings: 4.8,
    numReviews: 345
  },
  {
    name: 'Nintendo Switch OLED',
    description: '7-inch OLED screen, enhanced audio, 64GB storage. Play at home or on the go. Includes Joy-Con.',
    price: 349,
    category: 'Electronics',
    brand: 'Nintendo',
    stock: 42,
    featured: true,
    images: [{ public_id: 'switcholed', url: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800' }],
    ratings: 4.8,
    numReviews: 312
  },
  {
    name: 'Kindle Paperwhite Signature',
    description: 'Premium e-reader, 6.8" display, 32GB storage, wireless charging, auto-adjusting light. Waterproof.',
    price: 189,
    discountPrice: 159,
    category: 'Electronics',
    brand: 'Amazon',
    stock: 75,
    images: [{ public_id: 'kindlepw', url: 'https://images.unsplash.com/photo-1592422002554-c7b7fc657f15?w=800' }],
    ratings: 4.7,
    numReviews: 456
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    description: 'Wireless mouse with MagSpeed scrolling, 8K DPI sensor. Multi-device connectivity, rechargeable.',
    price: 99,
    discountPrice: 79,
    category: 'Electronics',
    brand: 'Logitech',
    stock: 120,
    images: [{ public_id: 'mxmaster', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800' }],
    ratings: 4.8,
    numReviews: 278
  },
  {
    name: 'Ring Video Doorbell Pro 2',
    description: 'HD+ video doorbell with 3D motion detection, bird\'s eye view. Requires Ring Protect subscription.',
    price: 249,
    discountPrice: 199,
    category: 'Electronics',
    brand: 'Ring',
    stock: 48,
    images: [{ public_id: 'ringdoorbell', url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800' }],
    ratings: 4.5,
    numReviews: 189
  },
  {
    name: 'JBL Flip 6 Bluetooth Speaker',
    description: 'Portable waterproof speaker with powerful JBL Original Pro Sound. 12 hours playtime, PartyBoost.',
    price: 129,
    discountPrice: 99,
    category: 'Electronics',
    brand: 'JBL',
    stock: 95,
    images: [{ public_id: 'jblflip', url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800' }],
    ratings: 4.6,
    numReviews: 312
  },
  {
    name: 'Fitbit Charge 6',
    description: 'Advanced fitness tracker with heart rate, GPS, stress management. 7-day battery, water-resistant.',
    price: 159,
    discountPrice: 139,
    category: 'Electronics',
    brand: 'Fitbit',
    stock: 78,
    images: [{ public_id: 'fitbitcharge', url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800' }],
    ratings: 4.4,
    numReviews: 223
  },
  {
    name: 'Anker PowerCore 20000mAh',
    description: 'Portable charger with fast charging technology. Charges iPhone 13 4+ times, USB-C and USB-A ports.',
    price: 49,
    discountPrice: 39,
    category: 'Electronics',
    brand: 'Anker',
    stock: 145,
    images: [{ public_id: 'ankerbattery', url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800' }],
    ratings: 4.7,
    numReviews: 567
  },

  // CLOTHING (12 products)
  {
    name: 'Classic Cotton T-Shirt',
    description: '100% premium cotton t-shirt with comfortable fit. Pre-shrunk fabric, reinforced seams.',
    price: 29,
    discountPrice: 24,
    category: 'Clothing',
    brand: 'Generic',
    stock: 200,
    images: [{ public_id: 'tshirt', url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800' }],
    ratings: 4.3,
    numReviews: 67
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'Iconic straight-fit jeans with button fly. Made from durable denim, classic 5-pocket styling.',
    price: 89,
    discountPrice: 79,
    category: 'Clothing',
    brand: 'Levi\'s',
    stock: 150,
    images: [{ public_id: 'levis501', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800' }],
    ratings: 4.7,
    numReviews: 203
  },
  {
    name: 'North Face Thermoball Jacket',
    description: 'Lightweight insulated jacket with ThermoBall Eco. Water-resistant, packable design.',
    price: 199,
    discountPrice: 159,
    category: 'Clothing',
    brand: 'The North Face',
    stock: 75,
    featured: true,
    images: [{ public_id: 'northfacejacket', url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800' }],
    ratings: 4.7,
    numReviews: 145
  },
  {
    name: 'Patagonia Better Sweater',
    description: 'Classic fleece pullover from recycled polyester. Quarter-zip, durable water-repellent finish.',
    price: 139,
    discountPrice: 119,
    category: 'Clothing',
    brand: 'Patagonia',
    stock: 88,
    images: [{ public_id: 'patagoniasweater', url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800' }],
    ratings: 4.8,
    numReviews: 203
  },
  {
    name: 'Lululemon Define Jacket',
    description: 'Slim-fit jacket with cottony-soft handfeel. Lycra for shape retention, thumbholes, secure zips.',
    price: 118,
    category: 'Clothing',
    brand: 'Lululemon',
    stock: 62,
    images: [{ public_id: 'lulujacket', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800' }],
    ratings: 4.6,
    numReviews: 167
  },
  {
    name: 'Carhartt Work Pants',
    description: 'Durable canvas work pants with reinforced knees, multiple tool pockets. Relaxed fit.',
    price: 59,
    discountPrice: 49,
    category: 'Clothing',
    brand: 'Carhartt',
    stock: 140,
    images: [{ public_id: 'carharttpants', url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800' }],
    ratings: 4.7,
    numReviews: 312
  },
  {
    name: 'Champion Reverse Weave Hoodie',
    description: 'Iconic pullover hoodie with brushed fleece interior. Ribbed side panels reduce shrinkage.',
    price: 70,
    discountPrice: 55,
    category: 'Clothing',
    brand: 'Champion',
    stock: 95,
    images: [{ public_id: 'championhoodie', url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800' }],
    ratings: 4.5,
    numReviews: 234
  },
  {
    name: 'Ralph Lauren Oxford Shirt',
    description: 'Classic button-down shirt in premium cotton. Signature embroidered pony, button-down collar.',
    price: 89,
    discountPrice: 69,
    category: 'Clothing',
    brand: 'Ralph Lauren',
    stock: 110,
    featured: true,
    images: [{ public_id: 'ralphshirt', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800' }],
    ratings: 4.6,
    numReviews: 187
  },
  {
    name: 'Uniqlo Heattech Ultra Warm',
    description: 'Advanced thermal underwear with moisture-wicking. Extra warm layer for extreme cold.',
    price: 39,
    discountPrice: 29,
    category: 'Clothing',
    brand: 'Uniqlo',
    stock: 180,
    images: [{ public_id: 'uniqlothermal', url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800' }],
    ratings: 4.4,
    numReviews: 298
  },
  {
    name: 'Columbia Cargo Shorts',
    description: 'Omni-Shade UPF 50 sun protection, quick-dry fabric, multiple pockets. Perfect for hiking.',
    price: 45,
    discountPrice: 35,
    category: 'Clothing',
    brand: 'Columbia',
    stock: 125,
    images: [{ public_id: 'columbiashorts', url: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800' }],
    ratings: 4.5,
    numReviews: 176
  },
  {
    name: 'Tommy Hilfiger Polo Shirt',
    description: 'Classic fit pique polo in 100% cotton. Signature flag logo, ribbed collar and cuffs.',
    price: 49,
    discountPrice: 39,
    category: 'Clothing',
    brand: 'Tommy Hilfiger',
    stock: 155,
    images: [{ public_id: 'tommypolo', url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800' }],
    ratings: 4.4,
    numReviews: 221
  },
  {
    name: 'Wrangler Cowboy Cut Jeans',
    description: 'Original cowboy-cut jeans with regular fit. Heavyweight denim, riveted pockets.',
    price: 54,
    discountPrice: 44,
    category: 'Clothing',
    brand: 'Wrangler',
    stock: 98,
    images: [{ public_id: 'wranglerjeans', url: 'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=800' }],
    ratings: 4.6,
    numReviews: 145
  },

  // SHOES (10 products)
  {
    name: 'Nike Air Max 2024',
    description: 'Classic running shoes with Air Max cushioning. Breathable mesh upper, durable rubber outsole.',
    price: 150,
    discountPrice: 129,
    category: 'Shoes',
    brand: 'Nike',
    stock: 120,
    images: [{ public_id: 'nikeairmax', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' }],
    ratings: 4.5,
    numReviews: 89
  },
  {
    name: 'Adidas Ultraboost Running Shoes',
    description: 'Premium running shoes with Boost cushioning. Primeknit upper, Continental rubber outsole.',
    price: 180,
    category: 'Shoes',
    brand: 'Adidas',
    stock: 95,
    images: [{ public_id: 'adidasultraboost', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800' }],
    ratings: 4.6,
    numReviews: 112
  },
  {
    name: 'New Balance 990v6',
    description: 'Premium running shoe with ENCAP midsole. Pigskin and mesh upper, classic design. Made in USA.',
    price: 185,
    discountPrice: 165,
    category: 'Shoes',
    brand: 'New Balance',
    stock: 70,
    featured: true,
    images: [{ public_id: 'nb990', url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800' }],
    ratings: 4.8,
    numReviews: 256
  },
  {
    name: 'Converse Chuck Taylor All Star',
    description: 'Iconic canvas sneaker with rubber toe cap. Timeless design, versatile style.',
    price: 60,
    discountPrice: 49,
    category: 'Shoes',
    brand: 'Converse',
    stock: 200,
    images: [{ public_id: 'conversechuck', url: 'https://images.unsplash.com/photo-1542219550-37153d387c27?w=800' }],
    ratings: 4.5,
    numReviews: 487
  },
  {
    name: 'Vans Old Skool',
    description: 'Classic skate shoe with signature side stripe. Durable canvas and suede, padded collar.',
    price: 70,
    discountPrice: 55,
    category: 'Shoes',
    brand: 'Vans',
    stock: 145,
    images: [{ public_id: 'vansoldskool', url: 'https://images.unsplash.com/photo-1543508282-5f1fa3e0b5f1?w=800' }],
    ratings: 4.6,
    numReviews: 324
  },
  {
    name: 'Dr. Martens 1460 Boots',
    description: '8-eye classic boot in smooth leather. Air-cushioned sole, yellow stitching, scripted heel.',
    price: 170,
    discountPrice: 149,
    category: 'Shoes',
    brand: 'Dr. Martens',
    stock: 55,
    featured: true,
    images: [{ public_id: 'drmartens', url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800' }],
    ratings: 4.7,
    numReviews: 198
  },
  {
    name: 'Crocs Classic Clogs',
    description: 'Lightweight comfortable clogs with Croslite foam. Ventilation ports, easy to clean.',
    price: 50,
    discountPrice: 39,
    category: 'Shoes',
    brand: 'Crocs',
    stock: 250,
    images: [{ public_id: 'crocsclassic', url: 'https://images.unsplash.com/photo-1627394449913-0384f0af6e46?w=800' }],
    ratings: 4.3,
    numReviews: 567
  },
  {
    name: 'Timberland 6-Inch Premium Boot',
    description: 'Waterproof nubuck leather boot. Seam-sealed, padded collar, anti-fatigue technology.',
    price: 198,
    discountPrice: 169,
    category: 'Shoes',
    brand: 'Timberland',
    stock: 68,
    images: [{ public_id: 'timberlandboot', url: 'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800' }],
    ratings: 4.7,
    numReviews: 234
  },
  {
    name: 'Skechers Go Walk Slip-On',
    description: 'Comfortable walking shoe with Air-Cooled Goga Mat insole. Breathable mesh, lightweight.',
    price: 75,
    discountPrice: 59,
    category: 'Shoes',
    brand: 'Skechers',
    stock: 115,
    images: [{ public_id: 'skecherswalk', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800' }],
    ratings: 4.4,
    numReviews: 289
  },
  {
    name: 'Birkenstock Arizona Sandals',
    description: 'Two-strap sandal with contoured cork footbed. Adjustable buckles, shock-absorbing EVA sole.',
    price: 110,
    discountPrice: 95,
    category: 'Shoes',
    brand: 'Birkenstock',
    stock: 88,
    images: [{ public_id: 'birkenstock', url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800' }],
    ratings: 4.6,
    numReviews: 412
  },

  // BOOKS (8 products)
  {
    name: 'The Psychology of Money',
    description: 'Bestselling book by Morgan Housel about wealth psychology and financial decision-making.',
    price: 18,
    category: 'Books',
    brand: 'Harriman House',
    stock: 75,
    images: [{ public_id: 'psychmoney', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800' }],
    ratings: 4.8,
    numReviews: 432
  },
  {
    name: 'Atomic Habits',
    description: 'Transform your life with tiny changes. James Clear\'s guide to building good habits.',
    price: 16,
    category: 'Books',
    brand: 'Avery',
    stock: 60,
    images: [{ public_id: 'atomichabits', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800' }],
    ratings: 4.9,
    numReviews: 587
  },
  {
    name: 'Educated by Tara Westover',
    description: 'Memoir about a woman who grows up in survivalist family and escapes through education.',
    price: 17,
    category: 'Books',
    brand: 'Random House',
    stock: 85,
    images: [{ public_id: 'educatedbook', url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800' }],
    ratings: 4.8,
    numReviews: 678
  },
  {
    name: 'Sapiens by Yuval Noah Harari',
    description: 'Brief history of humankind from Stone Age to modern age. Explores biology and history.',
    price: 19,
    category: 'Books',
    brand: 'Harper',
    stock: 92,
    featured: true,
    images: [{ public_id: 'sapiens', url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800' }],
    ratings: 4.7,
    numReviews: 892
  },
  {
    name: 'The Silent Patient',
    description: 'Psychological thriller about a woman who shoots her husband and never speaks. Shocking twist.',
    price: 15,
    category: 'Books',
    brand: 'Celadon Books',
    stock: 110,
    images: [{ public_id: 'silentpatient', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800' }],
    ratings: 4.6,
    numReviews: 534
  },
  {
    name: 'Thinking, Fast and Slow',
    description: 'Nobel Prize winner Daniel Kahneman explains two systems that drive how we think.',
    price: 20,
    category: 'Books',
    brand: 'Farrar, Straus and Giroux',
    stock: 78,
    images: [{ public_id: 'thinkingfast', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800' }],
    ratings: 4.7,
    numReviews: 445
  },
  {
    name: 'Where the Crawdads Sing',
    description: 'Coming-of-age story and murder mystery set in North Carolina marshes. Beautiful prose.',
    price: 16,
    category: 'Books',
    brand: 'G.P. Putnam\'s Sons',
    stock: 95,
    images: [{ public_id: 'crawdads', url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800' }],
    ratings: 4.5,
    numReviews: 723
  },
  {
    name: 'The 48 Laws of Power',
    description: 'Distills 3,000 years of history of power into 48 laws. Guide to strategy and tactics.',
    price: 25,
    discountPrice: 19,
    category: 'Books',
    brand: 'Penguin Books',
    stock: 68,
    images: [{ public_id: '48laws', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800' }],
    ratings: 4.6,
    numReviews: 389
  },

  // HOME & KITCHEN (12 products)
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Multi-functional pressure cooker with 7 modes. 6-quart, 14 smart programs, stainless steel.',
    price: 99,
    discountPrice: 79,
    category: 'Home & Kitchen',
    brand: 'Instant Pot',
    stock: 45,
    images: [{ public_id: 'instantpot', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800' }],
    ratings: 4.7,
    numReviews: 328
  },
  {
    name: 'KitchenAid Stand Mixer',
    description: 'Professional 5-quart mixer with 10 speeds. Includes beater, dough hook, wire whip.',
    price: 379,
    discountPrice: 329,
    category: 'Home & Kitchen',
    brand: 'KitchenAid',
    stock: 30,
    featured: true,
    images: [{ public_id: 'kitchenaid', url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800' }],
    ratings: 4.9,
    numReviews: 412
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Cordless vacuum with laser dust detection. Powerful suction, 60 minutes runtime.',
    price: 699,
    category: 'Home & Kitchen',
    brand: 'Dyson',
    stock: 28,
    images: [{ public_id: 'dysonvacuum', url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800' }],
    ratings: 4.7,
    numReviews: 167
  },
  {
    name: 'Nespresso Vertuo Coffee Maker',
    description: 'Single-serve coffee maker with Centrifusion technology. Brews 5 cup sizes, includes frother.',
    price: 189,
    discountPrice: 149,
    category: 'Home & Kitchen',
    brand: 'Nespresso',
    stock: 48,
    featured: true,
    images: [{ public_id: 'nespresso', url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800' }],
    ratings: 4.6,
    numReviews: 312
  },
  {
    name: 'Ninja Air Fryer Max XL',
    description: 'Large capacity air fryer with Max Crisp. 5.5-quart, multiple functions, dishwasher-safe.',
    price: 119,
    discountPrice: 99,
    category: 'Home & Kitchen',
    brand: 'Ninja',
    stock: 72,
    images: [{ public_id: 'ninjafryer', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800' }],
    ratings: 4.7,
    numReviews: 445
  },
  {
    name: 'OXO Good Grips Knife Set',
    description: '15-piece professional knife set with wooden block. High-carbon stainless steel blades.',
    price: 199,
    discountPrice: 169,
    category: 'Home & Kitchen',
    brand: 'OXO',
    stock: 35,
    images: [{ public_id: 'oxoknives', url: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800' }],
    ratings: 4.8,
    numReviews: 234
  },
  {
    name: 'Cuisinart Food Processor',
    description: '14-cup capacity food processor with extra-large feed tube. Multiple blades, touchpad controls.',
    price: 199,
    discountPrice: 159,
    category: 'Home & Kitchen',
    brand: 'Cuisinart',
    stock: 42,
    images: [{ public_id: 'cuisinartfp', url: 'https://images.unsplash.com/photo-1621557589107-c7c30e45c14b?w=800' }],
    ratings: 4.6,
    numReviews: 287
  },
  {
    name: 'Lodge Cast Iron Skillet Set',
    description: '3-piece pre-seasoned cast iron set (8", 10", 12"). Even heat, versatile, oven-safe.',
    price: 89,
    discountPrice: 69,
    category: 'Home & Kitchen',
    brand: 'Lodge',
    stock: 95,
    images: [{ public_id: 'lodgeskillet', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800' }],
    ratings: 4.8,
    numReviews: 567
  },
  {
    name: 'Vitamix Professional Blender',
    description: 'Professional blender with 2.2 HP motor. Variable speed, self-cleaning, makes hot soup.',
    price: 449,
    discountPrice: 399,
    category: 'Home & Kitchen',
    brand: 'Vitamix',
    stock: 28,
    featured: true,
    images: [{ public_id: 'vitamix', url: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800' }],
    ratings: 4.9,
    numReviews: 389
  },
  {
    name: 'Pyrex Glass Storage Set',
    description: '18-piece glass food storage with BPA-free lids. Microwave, oven, freezer, dishwasher safe.',
    price: 39,
    discountPrice: 29,
    category: 'Home & Kitchen',
    brand: 'Pyrex',
    stock: 155,
    images: [{ public_id: 'pyrexstorage', url: 'https://images.unsplash.com/photo-1584990347449-39b14c2b2fdf?w=800' }],
    ratings: 4.7,
    numReviews: 678
  },
  {
    name: 'Roomba j7+ Robot Vacuum',
    description: 'Self-emptying robot vacuum with smart mapping and obstacle avoidance. Works with Alexa.',
    price: 799,
    discountPrice: 699,
    category: 'Home & Kitchen',
    brand: 'iRobot',
    stock: 32,
    images: [{ public_id: 'roombaj7', url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800' }],
    ratings: 4.5,
    numReviews: 234
  },
  {
    name: 'Keurig K-Elite Coffee Maker',
    description: 'Single-serve K-Cup coffee maker with iced coffee setting. 75oz reservoir, strong brew.',
    price: 169,
    discountPrice: 139,
    category: 'Home & Kitchen',
    brand: 'Keurig',
    stock: 58,
    images: [{ public_id: 'keurig', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800' }],
    ratings: 4.5,
    numReviews: 512
  },

  // SPORTS & OUTDOORS (6 products)
  {
    name: 'Yoga Mat Premium',
    description: 'Extra thick 6mm yoga mat with non-slip surface. Eco-friendly TPE, includes carrying strap.',
    price: 39,
    discountPrice: 29,
    category: 'Sports & Outdoors',
    brand: 'Gaiam',
    stock: 110,
    images: [{ public_id: 'yogamat', url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800' }],
    ratings: 4.4,
    numReviews: 78
  },
  {
    name: 'Adjustable Dumbbells Set',
    description: 'Space-saving adjustable dumbbells, 5-52.5 lbs per hand. Quick-change weight selection.',
    price: 299,
    category: 'Sports & Outdoors',
    brand: 'Bowflex',
    stock: 40,
    images: [{ public_id: 'dumbbells', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800' }],
    ratings: 4.6,
    numReviews: 156
  },
  {
    name: 'Hydro Flask Water Bottle',
    description: '32 oz insulated water bottle with TempShield. Keeps cold 24 hours, hot 12 hours. BPA-free.',
    price: 45,
    discountPrice: 35,
    category: 'Sports & Outdoors',
    brand: 'Hydro Flask',
    stock: 185,
    images: [{ public_id: 'hydroflask', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800' }],
    ratings: 4.8,
    numReviews: 823
  },
  {
    name: 'Coleman Camping Tent 4-Person',
    description: 'Weatherproof camping tent with WeatherTec. Easy setup, fits 2 queen air mattresses.',
    price: 129,
    discountPrice: 99,
    category: 'Sports & Outdoors',
    brand: 'Coleman',
    stock: 48,
    images: [{ public_id: 'colemantent', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800' }],
    ratings: 4.6,
    numReviews: 312
  },
  {
    name: 'Spalding NBA Basketball',
    description: 'Official size and weight basketball with deep channel. Indoor/outdoor use, durable rubber.',
    price: 29,
    discountPrice: 22,
    category: 'Sports & Outdoors',
    brand: 'Spalding',
    stock: 145,
    images: [{ public_id: 'spaldingball', url: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=800' }],
    ratings: 4.5,
    numReviews: 456
  },
  {
    name: 'Schwinn Mountain Bike 29"',
    description: '21-speed mountain bike with aluminum frame. Front suspension, alloy brakes, dual sport tires.',
    price: 399,
    discountPrice: 349,
    category: 'Sports & Outdoors',
    brand: 'Schwinn',
    stock: 22,
    featured: true,
    images: [{ public_id: 'schwinnbike', url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800' }],
    ratings: 4.4,
    numReviews: 178
  },

  // TOYS & GAMES (3 products)
  {
    name: 'LEGO Star Wars Millennium Falcon',
    description: 'Ultimate collector edition with 7,541 pieces. Detailed exterior, removable panels, minifigures.',
    price: 849,
    category: 'Toys & Games',
    brand: 'LEGO',
    stock: 15,
    featured: true,
    images: [{ public_id: 'legomf', url: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800' }],
    ratings: 5.0,
    numReviews: 89
  },
  {
    name: 'Monopoly Classic Board Game',
    description: 'The classic real estate board game. Buy, sell, and trade properties. Ages 8+, 2-8 players.',
    price: 24,
    discountPrice: 19,
    category: 'Toys & Games',
    brand: 'Hasbro',
    stock: 125,
    images: [{ public_id: 'monopoly', url: 'https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=800' }],
    ratings: 4.6,
    numReviews: 234
  },
  {
    name: 'Rubik\'s Cube 3x3',
    description: 'Original 3x3 Rubik\'s Cube puzzle. Improved mechanism, smoother turns, ultimate brain teaser.',
    price: 14,
    discountPrice: 11,
    category: 'Toys & Games',
    brand: 'Rubik\'s',
    stock: 180,
    images: [{ public_id: 'rubikscube', url: 'https://images.unsplash.com/photo-1591991731833-b8c6d5f8a71d?w=800' }],
    ratings: 4.7,
    numReviews: 456
  },

  // BEAUTY & PERSONAL CARE (3 products)
  {
    name: 'Neutrogena Hydro Boost',
    description: 'Water gel moisturizer with hyaluronic acid. Oil-free, non-comedogenic, long-lasting hydration.',
    price: 19,
    category: 'Beauty & Personal Care',
    brand: 'Neutrogena',
    stock: 180,
    images: [{ public_id: 'neutrogena', url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800' }],
    ratings: 4.5,
    numReviews: 234
  },
  {
    name: 'Olaplex Hair Repair Treatment',
    description: 'Bond building hair treatment. Repairs damaged hair, increases shine and manageability.',
    price: 28,
    category: 'Beauty & Personal Care',
    brand: 'Olaplex',
    stock: 95,
    images: [{ public_id: 'olaplex', url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800' }],
    ratings: 4.8,
    numReviews: 567
  },
  {
    name: 'CeraVe Facial Cleanser',
    description: 'Hydrating facial cleanser with ceramides and hyaluronic acid. Gentle, non-irritating formula.',
    price: 15,
    category: 'Beauty & Personal Care',
    brand: 'CeraVe',
    stock: 215,
    images: [{ public_id: 'cerave', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800' }],
    ratings: 4.6,
    numReviews: 689
  },

  // AUTOMOTIVE (2 products)
  {
    name: 'Michelin Windshield Wipers',
    description: 'All-season windshield wiper blades. EZ Lok connector, fits 99% of vehicles. Set of 2.',
    price: 29,
    discountPrice: 24,
    category: 'Automotive',
    brand: 'Michelin',
    stock: 145,
    images: [{ public_id: 'wipers', url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800' }],
    ratings: 4.5,
    numReviews: 312
  },
  {
    name: 'Armor All Car Care Kit',
    description: 'Complete car cleaning kit. Includes wash, wax, tire shine, interior cleaner, microfiber towels.',
    price: 39,
    discountPrice: 32,
    category: 'Automotive',
    brand: 'Armor All',
    stock: 88,
    images: [{ public_id: 'armorall', url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800' }],
    ratings: 4.4,
    numReviews: 178
  },

  // HEALTH & WELLNESS (2 products)
  {
    name: 'Nature Made Multivitamin',
    description: 'Daily multivitamin with 23 essential nutrients. Supports overall health, 300 tablets.',
    price: 24,
    discountPrice: 19,
    category: 'Health & Wellness',
    brand: 'Nature Made',
    stock: 200,
    images: [{ public_id: 'multivitamin', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800' }],
    ratings: 4.6,
    numReviews: 445
  },
  {
    name: 'Theragun Prime Massage Gun',
    description: 'Percussive therapy device for muscle recovery. 4 speeds, 4 attachments, quiet operation.',
    price: 299,
    discountPrice: 249,
    category: 'Health & Wellness',
    brand: 'Therabody',
    stock: 42,
    images: [{ public_id: 'theragun', url: 'https://images.unsplash.com/photo-1608452964553-9b4d97b2752f?w=800' }],
    ratings: 4.7,
    numReviews: 289
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();

    console.log('✅ Data cleared');

    console.log('👥 Creating users...');
    
    // Create users
    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0];

    console.log('✅ Users created');
    console.log('\n📧 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: admin@shopsphere.com');
    console.log('  Password: admin123');
    console.log('\nUser:');
    console.log('  Email: john@example.com');
    console.log('  Password: user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📦 Creating products...');
    
    // Add createdBy field to products
    const productsWithCreator = products.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    await Product.create(productsWithCreator);

    console.log('✅ Products created');
    console.log(`\n🎉 Database seeded successfully!`);
    console.log(`   - ${createdUsers.length} users created`);
    console.log(`   - ${products.length} products created`);
    console.log('\n💡 Run "npm run dev" to start the server\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();
