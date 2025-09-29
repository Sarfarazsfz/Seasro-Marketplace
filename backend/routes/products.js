const express = require('express');
const router = express.Router();

// Mock products database
const products = [
  {
    _id: '1',
    name: 'Premium Basmati Rice - 25kg Bag',
    description: 'Premium long grain basmati rice, perfect for commercial use',
    price: 2500,
    category: 'Grains',
    image: 'https://via.placeholder.com/300x200/007bff/ffffff?text=Basmati+Rice',
    stock: 100
  },
  {
    _id: '2',
    name: 'Sunflower Oil - 15L Can',
    description: 'Pure sunflower oil for cooking and frying',
    price: 1800,
    category: 'Oils',
    image: 'https://via.placeholder.com/300x200/28a745/ffffff?text=Sunflower+Oil',
    stock: 50
  },
  {
    _id: '3',
    name: 'Sugar - 50kg Bag',
    description: 'Fine quality sugar for commercial use',
    price: 2200,
    category: 'Sweeteners',
    image: 'https://via.placeholder.com/300x200/dc3545/ffffff?text=Sugar',
    stock: 75
  },
  {
    _id: '4',
    name: 'Wheat Flour - 25kg Pack',
    description: 'High quality wheat flour for bakery and cooking',
    price: 1200,
    category: 'Flour',
    image: 'https://via.placeholder.com/300x200/ffc107/000000?text=Wheat+Flour',
    stock: 200
  },
  {
    _id: '5',
    name: 'Tea Leaves - 10kg Box',
    description: 'Premium tea leaves for restaurants and cafes',
    price: 3500,
    category: 'Beverages',
    image: 'https://via.placeholder.com/300x200/6f42c1/ffffff?text=Tea+Leaves',
    stock: 30
  },
  {
    _id: '6',
    name: 'Spices Combo - 5kg Set',
    description: 'Assorted spices for commercial kitchen use',
    price: 4500,
    category: 'Spices',
    image: 'https://via.placeholder.com/300x200/fd7e14/ffffff?text=Spices+Combo',
    stock: 40
  }
];

// Get all products
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    
    let filteredProducts = products;

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Search by name or description
    if (search) {
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  try {
    const product = products.find(p => p._id === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;