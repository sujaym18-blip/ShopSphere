import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  stock: {
    type: Number,
    required: true
  }
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [cartItemSchema],
    subtotal: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Calculate subtotal before saving
cartSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
