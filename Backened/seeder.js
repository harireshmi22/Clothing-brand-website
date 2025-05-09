const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");

const products = require("./data/products");

dotenv.config();

// Connect to mongoDB with error handling
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("DB Connected"))
    .catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        // Clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // Create admin user (password will be hashed by User model pre-save hook)
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "123456", // Ensure your User model hashes this
            role: "admin",
        });

        // Assign user to products
        const sampleProducts = products.map(product => ({
            ...product,
            user: createdUser._id
        }));

        await Product.insertMany(sampleProducts);

        console.log("Data seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
}

seedData();