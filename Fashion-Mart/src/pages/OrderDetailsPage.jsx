import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails } from '../redux/slices/orderSlice';
import { useEffect } from 'react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, isLoading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <p>No order details found</p>
      </div>
    );
  }

  const totalAmount = orderDetails.orderItems?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>
      <div className="p-4 sm:6 rounded-lg border">
        {/* Order Info */}
        <div className="flex flex-col sm:flex-row justify-between mb-8">
          <div>
            <h3 className="text-lg md:text-xl font-semibold">
              Order Id: #{orderDetails._id}
            </h3>
            <p className="text-gray-600">
              {new Date(orderDetails.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col items-center sm:items-end mt-4 sm:mt-0">
            <span className={`${orderDetails.isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} 
            px-3 py-1 rounded-full text-sm font-medium mb-2`}>
              {orderDetails.isPaid ? "Paid" : "Pending"}
            </span>
            <span className={`${orderDetails.isDelivered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} 
            px-3 py-1 rounded-full text-sm font-medium mb-2`}>
              {orderDetails.isDelivered ? "Delivered" : "Pending"}
            </span>
          </div>
        </div>

        {/* Customer, Payment, Shipping info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
            <p>Payment Method: {orderDetails.paymentMethod}</p>
            <p>Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
            <p>Method: {orderDetails.shippingMethod || "Standard"}</p>
            <p>Address: {orderDetails.shippingAddress?.address}</p>
            <p>{orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.country}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Order Summary</h4>
            <p>Items: {orderDetails.orderItems?.length || 0}</p>
            <p>Total: ${totalAmount}</p>
          </div>
        </div>

        {/* Product lists */}
        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold mb-4">Products</h4>
          <table className="min-w-full text-gray-600 mb-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4">Unit Price</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.orderItems?.map((item) => (
                <tr key={item.productId} className="border-b">
                  <td className="py-2 px-4 flex items-center">
                    <img
                      src={item.images?.[0]?.url || item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <Link to={`/product/${item.productId}`} className="hover:text-blue-600">{item.name}</Link>
                      <p className="text-sm text-gray-500">
                        {item.size} | {item.color}
                      </p>
                    </div>
                  </td>
                  <td className="py-2 px-4">${item.price}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">${item.price * item.quantity}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td colSpan="3" className="py-4 px-4 text-right">Total Amount:</td>
                <td className="py-4 px-4">${totalAmount}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Back to Orders Link */}
        <Link to="/my-orders" className="text-blue-500 hover:underline">
          ← Back to My Orders
        </Link>
      </div>
    </div>
  );
}

export default OrderDetailsPage;