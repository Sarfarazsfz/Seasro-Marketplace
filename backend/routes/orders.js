const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');

// Create order
router.post('/', auth, async (req, res) => {
    try {
        const order = new Order({
            userId: req.user.id,
            ...req.body
        });
        await order.save();
        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating order'
        });
    }
});

// Get order history
router.get('/history', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate('products.productId')
            .sort({ orderDate: -1 });
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order history'
        });
    }
});

module.exports = router;