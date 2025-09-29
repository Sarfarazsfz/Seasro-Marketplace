const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  businessType: { type: String, enum: ['kirana', 'restaurant', 'cafe', 'hotel', 'other'] },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  purchaseHistory: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    purchaseDate: Date,
    price: Number
  }],
  preferences: {
    categories: [String],
    priceRange: {
      min: Number,
      max: Number
    }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);