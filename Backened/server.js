const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const connectDB = require('./config/db'); // Ensure this path is correct
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

// Connect to MongoDB
connectDB().catch(err => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send("Welcome to Rabbit API!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// API Routes
app.use('/api/users', userRoutes);
app.use("/api/product", productRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 
