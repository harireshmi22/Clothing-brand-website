import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../redux/slices/cartSlice'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';

const OrderConfirmationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const checkoutState = useSelector((state) => state.checkout);
    const checkout = checkoutState?.checkout;

    useEffect(() => {
        // Only clear cart and localStorage if we have a valid checkout
        if (checkout?._id) {
            dispatch(clearCart());
            localStorage.removeItem("cart");
        } else {
            navigate("/my-orders");
        }
    }, [checkout, dispatch, navigate]);

    if (!checkout) {
        return null; // or return a loading state
    }

    const calculateEstimatedDelivery = (createdAt) => {
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() + 10); // Add 10 days to the order date
        return orderDate.toLocaleDateString();
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
                Thank You for Your Order!
            </h1>
            {checkout && <div className="p-6 rounded-lg border">
                <div className="flex justify-between mb-20">
                    {/* Order Id and Date */}
                    <div>
                        <h2 className="text-xl font-semibold">
                            Order ID: {checkout._id}
                        </h2>
                        <p className="text-gray-500">
                            Order date: {new Date(checkout.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    {/* Estimated Delivery */}
                    <div>
                        <p className="text-emerald-700 text-sm">
                            Estimated Delivery:{""}
                            {calculateEstimatedDelivery(checkout.createdAt)}
                        </p>
                    </div>
                </div>
                {/* Order Items */}
                <div className="mb-20">
                    {checkout.checkoutItems.map((item) => (
                        <div key={item.productId} className="flex items-center mb-4">
                            <div className="flex items-center flex-grow">
                                <img 
                                    src={item.images?.[0]?.url || item.image} 
                                    alt={item.name} 
                                    className="w-16 h-16 object-cover rounded-md mr-4" 
                            
                                />
                                <div>
                                    <h4 className="text-md font-semibold">{item.name}</h4>
                                    <p className="text-sm text-gray-500">
                                        {item.color} | {item.size}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-md">${item.price}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Payment and Delivery Information */}
                <div className="grid grid-cols-2 gap-8">
                    {/* Payment Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Payment</h4>
                        <p className="text-gray-600">PayPal</p>
                    </div>

                    {/* Delivery Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                        <p className="text-gray-600">
                            {checkout.shippingAddress.address}
                        </p>
                        <p className="text-gray-600">{checkout.shippingAddress.city}, {" "}
                            {checkout.shippingAddress.country}
                        </p>
                    </div>
                </div>
            </div>
            }
        </div>
    );
};

export default OrderConfirmationPage;