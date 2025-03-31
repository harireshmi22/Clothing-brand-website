const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route POST /api/users/register
// @desc Register a new user 
// @access Public 

router.post("/register", function (req, res) {
    const { name, email, password } = req.body;

    User.findOne({ email })
        .then(function (existingUser) {
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            // Create a new user instance
            const user = new User({ name, email, password });

            // Save the user to the database
            return user.save();
        })
        .then(function (user) {

            // Create JWT Payload 
            const payload = { user: { id: user._id, role: user.role } };

            // Sign and return the token along with user data 
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, function (err, token) {
                if (err) throw err;

                // Send the user and token in response
                res.status(201).json({
                    user: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token,
                });
            });
        })
        .catch(function (error) {
            console.error(error);  // It's a good practice to use console.error for errors
            res.status(500).json({ message: "Server Error", error: error.message });  // Send detailed error message for debugging
        });
});

// @router POST /api/users/login 
// @desc Authenticate user 
// @access Public 

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email 
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid Credentials" });

        // We need to match the password for the user 
        const isMatch = await user.matchPassword(password);

        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        const payload = { user: { id: user._id, role: user.role } };

        // Sign and return the token along with user data 
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
            if (err) throw err;

            // Send the user and token in response 
            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// @route GET /api/users/profile 
// @desc GET logged-in user's profile 
// @access Private 
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});

module.exports = router;