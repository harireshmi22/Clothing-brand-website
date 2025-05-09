const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db'); // Ensure this path is correct
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require('./routes/subscriberRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Ensure this path is correct
const productAdminRoutes = require('./routes/productAdminRoutes'); // Ensure this path is correct
const adminOrderRoutes = require('./routes/adminOrderRoutes'); // Ensure this path is correct

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9000;

// Connect to MongoDB
connectDB().catch(err => console.error("MongoDB connection error:", err));

// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:9000',
    'http://localhost:3000'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Enable static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send("Welcome to Rabbit API!");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// API Routes
app.use('/api/users', userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use('/api/subscribe', subscriberRoutes);

// Admin routes
app.use('/api/admin/users', adminRoutes); // Ensure this path is correct
app.use('/api/admin/products', productAdminRoutes); // Ensure this path is correct
app.use('/api/admin/orders', adminOrderRoutes); // Ensure this path is correct  

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
