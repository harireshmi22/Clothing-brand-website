const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const Product = require('../models/Product'); // Ensure this path is correct
const router = express.Router();

// @route   GET /api/admin/products
// @desc    Get all products (admin only)
// @access  Private/Admin

router.get('/', protect, admin, async (req, res) => {
    try {
        const products = await Product.find({});
        return res.json(products); // Added return statement
    } catch (error) {
        console.error('Admin route error:', error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
}
);

// @route   POST /api/admin/products

// @route   PUT /api/admin/products/:id - Update a product
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Update all fields, including images
        product.name = req.body.name || product.name;
        product.description = req.body.description || product.description;
        product.price = req.body.price || product.price;
        product.countInStock = req.body.countInStock || product.countInStock;
        product.sku = req.body.sku || product.sku;
        product.category = req.body.category || product.category;
        product.brand = req.body.brand || product.brand;
        product.sizes = req.body.sizes || product.sizes;
        product.colors = req.body.colors || product.colors;
        product.collections = req.body.collections || product.collections;
        product.material = req.body.material || product.material;
        product.gender = req.body.gender || product.gender;
        product.images = req.body.images || product.images;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;
