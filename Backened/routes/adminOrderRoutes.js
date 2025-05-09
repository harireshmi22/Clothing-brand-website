const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const Order = require('../models/Order');
const router = express.Router();

// @route   GET /api/admin/orders
// @desc    Get all orders (admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email');
        return res.json(orders);
    } catch (error) {
        console.error('Admin route error:', error);
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// @route   PUT /api/admin/orders/:id
// @desc    Update order status (admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update order status
        order.status = status || order.status;
        order.isDelivered = status === "Delivered";
        order.deliveredAt = status === "Delivered" ? Date.now() : order.deliveredAt;

        const updatedOrder = await order.save();
        return res.json(updatedOrder);
    } catch (error) {
        console.error('Admin route error:', error);
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// @route   DELETE /api/admin/orders/:id
// @desc    Delete order
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.deleteOne();
        return res.json({ message: 'Order removed successfully' });
    } catch (error) {
        console.error('Delete order error:', error);
        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
});

module.exports = router;