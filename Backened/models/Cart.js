const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true, // Ensure product name is always stored
    },
    image: {
      type: String,
      required: true, // Ensure image URL is always stored
    },
    price: {
      type: Number, // Changed from String to Number (for calculations)
      required: true,
    },
    size: {
      type: String,
      default: null, // Explicitly handle missing size
    },
    color: {
      type: String,
      default: null, // Explicitly handle missing color
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1, // Prevent negative/zero quantities
    },
  },
  { _id: false } // Correct: Prevents duplicate _id for subdocuments
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true, // Added for faster queries
    },
    guestId: {
      type: String,
      index: true, // Added for faster queries
      unique: true, // Prevent duplicate guest carts
      sparse: true, // Allow null for user carts
    },
    products: [cartItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0, // Prevent negative totals
    },
  },
  { timestamps: true } // Correct: Adds createdAt/updatedAt
);

// Add compound index for better query performance
cartSchema.index({ user: 1, guestId: 1 });

module.exports = mongoose.model("Cart", cartSchema);