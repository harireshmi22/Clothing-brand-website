const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user 
// @access Public 
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user instance
        const user = new User({
            name,
            email,
            password // Password will be hashed by the pre-save hook in the User model
        });

        // Save the user to the database
        const savedUser = await user.save();

        // Create JWT Payload 
        const payload = {
            user: {
                id: savedUser._id,
                role: savedUser.role
            }
        };

        // Sign and return the token along with user data 
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "40h" },
            (err, token) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Error generating token" });
                }

                res.status(201).json({
                    user: {
                        _id: savedUser._id,
                        name: savedUser.name,
                        email: savedUser.email,
                        role: savedUser.role,
                    },
                    token,
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// @route POST /api/users/login 
// @desc Authenticate user 
// @access Public 
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        // Sign and return the token along with user data 
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "40h" },
            (err, token) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "Error generating token" });
                }

                res.json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token,
                });
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// @route GET /api/users/profile 
// @desc GET logged-in user's profile 
// @access Private 
router.get("/profile", protect, async (req, res) => {
    try {
        // The protect middleware should have attached the user to req.user
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

module.exports = router;