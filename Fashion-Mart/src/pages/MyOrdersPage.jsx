import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUserOrders } from '../redux/slices/orderSlice';

const MyOrdersPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const { orders, isLoading, error } = useSelector((state) => state.order);
    
    useEffect(() => {
        dispatch(fetchUserOrders());
        // Fetch orders when the component mounts
    }, [dispatch]);

    const handleRowClick = (orderId) => {
        navigate(`/order/${orderId}`);
    }

    // Add null check for orderItems
    const getFirstImage = (order) => {
        if (!order.orderItems || order.orderItems.length === 0) {
            return 'placeholder-image-url'; // Add a placeholder image
        }
        return order.orderItems[0]?.image;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loader">Loading....</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Error: {error}</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
            <div className="relative shadow-md sm:rounded-lg overflow-hidden">
                <table className="min-w-full text-left text-gray-500">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                        <tr>
                            {/* ... table headers remain same ... */}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order) => {
                                const orderDate = order.createdAt ? new Date(order.createdAt) : null;
                                const shippingAddress = order.shippingAddress || {};
                                
                                return (
                                    <tr key={order._id} onClick={() => handleRowClick(order._id)}
                                        className="border-b hover:border-gray-50 cursor-pointer">
                                        <td className="py-2 px-2 sm:py-4 sm:px-4">
                                            <img src={getFirstImage(order)}
                                                alt={order.orderItems[0]?.name || 'Product image'}
                                                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg" />
                                        </td>
                                        <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                                            #{order._id?.slice(-6) || 'N/A'}
                                        </td>
                                        <td className="py-2 px-2 sm:py-4 sm:px-4">
                                            {orderDate ? 
                                                `${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}` 
                                                : 'N/A'}
                                        </td>
                                        <td className="py-2 px-2 sm:py-4 sm:px-4">
                                            {shippingAddress.city && shippingAddress.country ? 
                                                `${shippingAddress.city}, ${shippingAddress.country}` 
                                                : "N/A"}
                                        </td>
                                        <td className="py-2 px-2 sm:py-4 sm:px-4">
                                            {order.orderItems?.length || 0} item(s)
                                        </td>
                                        <td className="py-2 px-2 sm:py-4 sm:px-4">
                                            ${order.totalPrice?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="py-2 px-2 sm:py-4 sm:px-4">
                                            <span className={`${order.isPaid
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"} px-2 py-1 rounded-full text-xs sm:text-sm font-medium`}>
                                                {order.isPaid ? "Paid" : "Pending"}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                                    You have no orders
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MyOrdersPage;