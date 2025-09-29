const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

const sampleProducts = [
    {
        name: "Premium Basmati Rice",
        category: "Groceries",
        subcategory: "Rice & Grains",
        price: 899,
        brand: "India Gate",
        description: "Long grain basmati rice, perfect for biryani",
        tags: ["staple", "premium", "long-grain"]
    },
    {
        name: "Olive Oil",
        category: "Cooking Oil",
        price: 450,
        brand: "Figaro",
        description: "Extra virgin olive oil for healthy cooking",
        tags: ["healthy", "cooking", "oil"]
    },
    // Add more sample products...
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});

        // Insert sample products
        await Product.insertMany(sampleProducts);
        console.log('Sample data inserted successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();