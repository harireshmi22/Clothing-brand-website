const express = require('express');
const Subscriber = require('../models/Subscriber');
const router = express.Router();

// @route POST /api/subscribe
// @desc Handle newsletter subscription
// @access Public
router.post('/', async (req, res) => {  // Changed from '/subscribe' to '/'
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Check if the email already exists in the database
        const existingSubscriber = await Subscriber.findOne({ email });  // Better variable naming
        if (existingSubscriber) {
            return res.status(400).json({ message: 'Email already subscribed' });
        }

        // Create a new subscriber
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();

        res.status(201).json({
            message: "Successfully subscribed to the newsletter",
            subscriber: newSubscriber
        });
    } catch (error) {
        console.error('Error subscribing:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;