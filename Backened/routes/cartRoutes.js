const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const router = express.Router();

// Helper function to get a cart by user Id or guest ID
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else {
        return await Cart.findOne({ guestId });
    }
    return null;
};

// @route POST /api/cart 
// @desc Add a product to the cart for a guest or logged in user 
// @access Public 

router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Determine if the user is logged in or guest 
        let cart = await getCart(userId, guestId);

        // If the cart exists, update it 
        if (cart) {
            // Convert productId to string for consistent comparison
            const strProductId = productId.toString();

            const productIndex = cart.products.findIndex((p) =>
                p.productId.toString() === strProductId &&
                (p.size === size || (!p.size && !size)) &&  // Handle undefined/null cases
                (p.color === color || (!p.color && !color))
            );

            if (productIndex > -1) {
                // if the product already exists, update the quantity 
                cart.products[productIndex].quantity += Number(quantity); // Ensure quantity is a number
            } else {
                // add new product 
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size: size || undefined, // Store as undefined if not provided
                    color: color || undefined,
                    quantity: Number(quantity),
                })
            }

            // Recalculate the total Price 
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);

            await cart.save();
            return res.status(200).json(cart);
        } else {
            // Create a new cart... (rest of your code)
            // Create a new cart for the guest or user 
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity,
                    },
                ],

                totalPrice: product.price * quantity,
            });

            return res.status(201).json(newCart);

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route PUT /api/cart 
// @desc Update product quantity in the cart for a great or logged-in user 
// @access Public 

router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex((p) =>
            p.productId.toString() === productId.toString() &&
            (p.size === size || (!p.size && !size)) &&  // Handle undefined/null cases
            (p.color === color || (!p.color && !color))
        );

        if (productIndex > -1) {

            if (quantity > 0) {

                // if the product already exists, update the quantity 
                cart.products[productIndex].quantity = Number(quantity); // Ensure quantity is a number
            } else {
                cart.products.splice(productIndex, 1); // Remove product if quantityis is 0
            }
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {

            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});


// @route DELETE /api/cart 
// @desc Remove a product from the Cart 
// @access Public 

router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        const productIndex = cart.products.findIndex((p) =>
            p.productId.toString() === productId.toString() &&
            (p.size === size || (!p.size && !size)) &&
            (p.color === color || (!p.color && !color))
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);
            cart.totalPrice = cart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
});

// @route GET /api/cart 
// @desc Get logged-in user's or guest user's cart 
// @access Public 

router.get("/", async (req, res) => {
    const { userId, guestId } = req.query;
    try {
        const cart = await getCart(userId, guestId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

//  @route POST /api/cart/merge 
// @desc Merge guest cart into user cart on login 
// @access Private 

// router.post("/merge", async (req, res) => {
//     const { guestId } = req.body;

//     try {
//         // Find the guest cart and user cart    
//         const guestCart = await Cart.findOne({ guestId });
//         const userCart = await Cart.findOne({ user: req.user._id });

//         if (guestCart) {
//             if (guestCart.products.length === 0) {
//                 return res.status(400).json({ message: "Guest Cart is empty" });
//             }

//             if (userCart) {
//                 // Merge guest cart into user cart 
//                 guestCart.products.forEach((guestItem) => {
//                     const productIndex = userCart.products.findIndex((item) =>
//                         item.productId.toString() === guestItem.productId.toString() &&
//                         item.size === guestItem.size &&
//                         item.color === guestItem.color
//                     );

//                     if (productIndex > -1) {

//                     }
//                 })
//             }
//         }
//     } catch (error) {

//     }
// });



router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.body;
    const userId = req.user._id; // From auth middleware

    try {
        // 1. Find both carts at the same time (faster)
        const [guestCart, userCart] = await Promise.all([
            Cart.findOne({ guestId }),
            Cart.findOne({ user: userId }),
        ]);

        // 2. Check if guest cart exists & has items
        if (!guestCart || guestCart.products.length === 0) {
            return res.status(400).json({ message: "Guest cart is empty!" });
        }

        // 3. If user cart doesn't exist, just convert guest cart to user cart
        if (!userCart) {
            guestCart.user = userId;
            guestCart.guestId = undefined; // Remove guestId
            await guestCart.save();
            return res.json({ success: true, cart: guestCart });
        }

        // 4. If user cart exists, merge products
        guestCart.products.forEach((guestProduct) => {
            // Check if the same product (same ID, size, color) exists in user cart
            const existingProduct = userCart.products.find(
                (userProduct) =>
                    userProduct.productId.equals(guestProduct.productId) &&
                    userProduct.size === guestProduct.size &&
                    userProduct.color === guestProduct.color
            );

            if (existingProduct) {
                // If exists, increase quantity
                existingProduct.quantity += guestProduct.quantity;
            } else {
                // If not, add the new product
                userCart.products.push(guestProduct);
            }
        });

        // 5. Update total price
        userCart.totalPrice = userCart.products.reduce(
            (total, product) => total + product.price * product.quantity, 0);

        // 6. Save the merged cart & delete guest cart
        await userCart.save();
        await Cart.deleteOne({ guestId });

        res.json({ success: true, cart: userCart });
    } catch (error) {
        console.error("Merge error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;    