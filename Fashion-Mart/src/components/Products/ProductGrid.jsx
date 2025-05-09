import React from 'react';
import { Link } from "react-router-dom"; // Corrected import

const ProductGrid = ({ products, loading, error, hideEmptyMessage }) => {
    console.log("ProductGrid products:", products, "loading:", loading, "error:", error);

    if (loading) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    if (!products || products.length === 0) {
        if (hideEmptyMessage) return null;
        return <p className="text-center text-gray-500">No products found.</p>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`} className="block">
                    <div className="bg-white p-4 rounded-lg">
                        <div className="w-full h-96 mb-4">
                            <img
                                src={product.images && product.images[0] ? product.images[0].url : '/placeholder.jpg'}
                                alt={product.images && product.images[0] ? (product.images[0].altText || product.name) : product.name}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                        <h3 className="text-sm mb-2">{product.name}</h3>
                        <p className="text-gray-500 font-medium text-sm tracking-tighter">${product.price}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

export default ProductGrid;
