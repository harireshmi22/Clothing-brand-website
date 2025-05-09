import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { createCheckoutSession } from '../../redux/slices/checkoutSlice';
import PayPalButton from './PayPalButton'; // Assuming you have a PayPalButton component

const Checkout = () => {
    const navigate = useNavigate();
    const [checkoutId, setCheckoutId] = useState(null);
    const { user } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart); // Use Redux cart state
    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
    });
    const dispatch = useDispatch();

    const handleCreateCheckout = async (e) => {
        e.preventDefault();
        if (!cart || !cart.products || cart.products.length === 0) {
            alert('Your cart is empty');
            return;
        }
        if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            alert('Please fill in all required shipping address fields');
            return;
        }
        try {
            const checkoutData = {
                checkoutItems: cart.products.map(product => ({
                    productId: product.productId || product._id,
                    name: product.name,
                    quantity: parseInt(product.quantity) || 1,
                    image: product.images && product.images[0] ? product.images[0].url : product.image,
                    price: parseFloat(product.price),
                    size: product.size,
                    color: product.color
                })),
                shippingAddress: {
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    postalCode: shippingAddress.postalCode,
                    country: shippingAddress.country.trim().charAt(0).toUpperCase() + shippingAddress.country.trim().slice(1).toLowerCase()
                },
                paymentMethod: "PayPal",
                totalPrice: parseFloat(cart.totalPrice)
            };
            const result = await dispatch(createCheckoutSession(checkoutData)).unwrap();
            if (result && result._id) {
                setCheckoutId(result._id);
                console.log('Checkout session created:', result);
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            alert(err.response?.data?.message || 'Failed to create checkout session. Please try again.');
        }
    };

    const handlePaymentSuccess = async (details) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/pay`, { paymentStatus: "paid", paymentDetails: details },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                }
            );

            if (response.status === 200) {
                await handleFinalizeCheckout(checkoutId);  // Finalize checkout if payment is successful 
            } else {
                console.error('Payment verification failed');
            }
        } catch (error) {
            console.error('Payment processing error:', error);
        }
    };

    const handleFinalizeCheckout = async (checkoutId) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            navigate("/order-confirmation");
        } catch (error) {
            console.log(error);
        }
    }

    if (!cart) {
        return <p>Loading cart data...</p>; // Show a loading state while fetching cart data
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
            {/* Left Section */}
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl uppercase mb-6">Checkout</h2>
                <form onSubmit={handleCreateCheckout}>
                    <h3 className="text-lg mb-4">Contact Details</h3>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={user ? user.email : ""}

                            readOnly
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <h3 className="text-lg mb-4">Delivery</h3>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">First Name</label>
                            <input
                                type="text"
                                value={shippingAddress.firstName}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Last Name</label>
                            <input
                                type="text"
                                value={shippingAddress.lastName}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Address</label>
                        <input
                            type="text"
                            value={shippingAddress.address}
                            onChange={(e) =>
                                setShippingAddress({ ...shippingAddress, address: e.target.value })
                            }
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">City</label>
                            <input
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Postal Code</label>
                            <input
                                type="text"
                                value={shippingAddress.postalCode}
                                onChange={(e) =>
                                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Country</label>
                        <input
                            type="text"
                            value={shippingAddress.country}
                            onChange={(e) =>
                                setShippingAddress({ ...shippingAddress, country: e.target.value })
                            }
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Phone</label>
                        <input
                            type="tel"
                            value={shippingAddress.phone}
                            onChange={(e) =>
                                setShippingAddress({ ...shippingAddress, phone: e.target.value })
                            }
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="mt-6">
                        {!checkoutId ? (
                            <button type="submit" className="w-full bg-black text-white py-3 rounded">
                                Continue to Payment
                            </button>
                        ) : (
                            <div>
                                <h3 className="text-lg mb-4">Pay with Paypal</h3>
                                {/* PayPal Component */}
                                <PayPalButton
                                    amount={cart.totalPrice}
                                    onSuccess={handlePaymentSuccess}
                                    onError={() => alert("Payment failed. Try again.")}
                                />
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Right Section */}
            <div className="bg-gray-100 rounded-lg p-6">
                <h2 className="text-2xl uppercase mb-6">Order Summary</h2>
                <ul className="mb-6">
                    {cart.products.map((product, index) => (
                        <li key={index} className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded mr-4"
                                />
                                <div>
                                    <h3 className="text-lg font-medium">{product.name}</h3>
                                    <p className="text-sm text-gray-600">
                                        Size: {product.size} | Color: {product.color}
                                    </p>
                                </div>
                            </div>
                            <p className="text-lg font-medium">${product.price}</p>
                        </li>
                    ))}
                </ul>
                <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-lg font-medium">${cart.totalPrice}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-lg font-medium">Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${cart.totalPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;