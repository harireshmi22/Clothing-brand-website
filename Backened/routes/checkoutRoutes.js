const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Checkout = require('../models/Checkout');

// Create checkout session
router.post('/', protect, async (req, res) => {
    try {
        const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

        if (!checkoutItems || checkoutItems.length === 0) {
            return res.status(400).json({ message: 'No items to checkout' });
        }

        // Validate checkout items structure
        const validItems = checkoutItems.every(item =>
            item.name &&
            item.qty &&
            item.image &&
            item.price &&
            item.product
        );

        if (!validItems) {
            return res.status(400).json({
                message: 'Invalid checkout items - each item must have name, qty, image, price and product ID'
            });
        }

        if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            return res.status(400).json({ message: 'Complete shipping address is required' });
        }

        // Create checkout session
        const checkout = await Checkout.create({
            user: req.user._id,
            checkoutItems,
            shippingAddress: {
                ...shippingAddress,
                // Ensure proper country name formatting
                country: shippingAddress.country.charAt(0).toUpperCase() + shippingAddress.country.slice(1).toLowerCase()
            },
            paymentMethod,
            totalPrice: Number(totalPrice)
        });

        res.status(201).json(checkout);
    } catch (error) {
        console.error('Checkout creation error:', error);
        res.status(400).json({ message: error.message });
    }
});

// Update payment status
router.put('/pay', protect, async (req, res) => {
    try {
        const { paymentDetails } = req.body;

        const checkout = await Checkout.findOne({
            user: req.user._id,
            isFinalized: false
        }).sort({ createdAt: -1 });

        if (!checkout) {
            return res.status(404).json({ message: 'Checkout session not found' });
        }

        checkout.isPaid = true;
        checkout.paymentStatus = 'Paid';
        checkout.paymentDetails = paymentDetails;
        checkout.paidAt = Date.now();

        const updatedCheckout = await checkout.save();
        res.json(updatedCheckout);
    } catch (error) {
        console.error('Payment update error:', error);
        res.status(400).json({ message: error.message });
    }
});

// Finalize checkout
router.post('/:id/finalize', protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: 'Checkout session not found' });
        }

        if (!checkout.isPaid) {
            return res.status(400).json({ message: 'Payment must be completed before finalizing' });
        }

        checkout.isFinalized = true;
        checkout.finalizedAt = Date.now();

        const updatedCheckout = await checkout.save();
        res.json(updatedCheckout);
    } catch (error) {
        console.error('Finalize checkout error:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;