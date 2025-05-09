const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        return res.json(users); // Added return statement
    } catch (error) {
        console.error('Admin route error:', error);
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// @route   POST /api/admin/users
// @desc    Create new user (admin only)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check for required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create new user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: 'user' // Default role
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user by ID (admin only)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user fields if provided
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) user.email = req.body.email.toLowerCase();
        if (req.body.role) user.role = req.body.role;

        // Only update password if provided
        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
                __v: updatedUser.__v
            }
        });

    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user (admin only)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.deleteOne();
        return res.json({ message: 'User removed' }); // Added return statement

    } catch (error) {
        console.error('Delete user error:', error);
        return res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
});

module.exports = router;