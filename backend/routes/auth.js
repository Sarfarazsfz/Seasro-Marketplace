const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock user database
let users = [
  {
    id: '1',
    name: 'Kirana Store Owner',
    email: 'kirana@demo.com',
    password: 'demo123',
    businessType: 'Kirana Store',
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '123 Kirana Street'
    },
    preferences: {
      categories: ['Grains', 'Oils', 'Spices'],
      priceRange: { min: 1000, max: 5000 }
    }
  }
];

// Login endpoint
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
      { expiresIn: '7d' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      token,
      user: userWithoutPassword,
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Register endpoint
router.post('/register', (req, res) => {
  try {
    const { name, email, password, businessType, location } = req.body;

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      password,
      businessType: businessType || 'kirana',
      location: location || { city: '', state: '', address: '' },
      preferences: {
        categories: [],
        priceRange: { min: 0, max: 10000 }
      },
      createdAt: new Date(),
      purchaseHistory: []
    };

    users.push(newUser);

    // Create token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your_super_secret_jwt_key_here',
      { expiresIn: '7d' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      token,
      user: userWithoutPassword,
      message: 'Registration successful'
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Get user profile
router.get('/profile', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_here');
    const user = users.find(u => u.id === decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;