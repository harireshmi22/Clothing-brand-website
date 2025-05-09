import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import ProductGrid from './ProductGrid';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductDetails, fetchSimilarProducts } from '../../redux/slices/productsSlice';
import { addToCart } from '../../redux/slices/cartSlice';

const ProductDetails = ({ productId }) => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { productDetails, isLoading, error, similarProducts } = useSelector((state) => state.products);
    const { user, guestId } = useSelector((state) => state.auth);

    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    useEffect(() => {
        const productFetchId = productId || id;
        if (productFetchId) {
            dispatch(fetchProductDetails(productFetchId));
            dispatch(fetchSimilarProducts(productFetchId));
        }
    }, [dispatch, productId, id]);

    // Reset selections when product changes
    useEffect(() => {
        setMainImageIndex(0);
        setSelectedSize("");
        if (productDetails && productDetails.colors && productDetails.colors.length > 0) {
            setSelectedColor(productDetails.colors[0]);
        }
    }, [productDetails]);

    if (isLoading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">Error: {error}</div>;
    if (!productDetails || !productDetails.images || productDetails.images.length === 0) return null;

    const mainImage = productDetails.images[mainImageIndex];

    const handleQuantityChange = (action) => {
        if (action === "plus") setQuantity((prev) => prev + 1);
        if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please select a size before adding to cart.", { duration: 1000 });
            return;
        }
        if (!selectedColor) {
            toast.error("Please select a color before adding to cart.", { duration: 1000 });
            return;
        }
        if (!productDetails || !productDetails._id) {
            toast.error("Product details not loaded. Please try again.", { duration: 1000 });
            return;
        }

        setIsButtonDisabled(true);

        dispatch(addToCart({
            productId: productDetails._id,
            quantity,
            size: selectedSize,
            color: selectedColor,
            guestId,
            userId: user?._id,
        }))
            .then(() => {
                toast.success("Product added to cart successfully!", { duration: 1000 });
            })
            .finally(() => {
                setIsButtonDisabled(false);
            });
    };

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
                <div className="flex flex-col md:flex-row">
                    {/* Thumbnails */}
                    <div className="hidden md:flex flex-col space-y-4 mr-6">
                        {productDetails.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={image.altText || `Thumbnail ${index}`}
                                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImageIndex === index ? "border-black" : "border-gray-300"}`}
                                onClick={() => setMainImageIndex(index)}
                            />
                        ))}
                    </div>

                    {/* Main Image */}
                    <div className="md:w-1/2">
                        <div className="mb-4">
                            <img
                                src={mainImage.url}
                                alt={mainImage.altText || "Main Product"}
                                className="w-full h-auto object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Mobile Thumbnails */}
                    <div className="md:hidden flex space-x-4 mb-4">
                        {productDetails.images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url}
                                alt={image.altText || `Thumbnail ${index}`}
                                className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
                                onClick={() => setMainImageIndex(index)}
                            />
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="md:w-1/2 md:ml-10">
                        <h1>{productDetails.name}</h1>
                        <p>{productDetails.price}</p>
                        <p>{productDetails.description}</p>
                        <p>Brand: {productDetails.brand}</p>
                        <p>Material: {productDetails.material}</p>

                        <div className="mb-4">
                            <p className="text-gray-700">Color:</p>
                            <div className="flex gap-2 mt-2">
                                {(productDetails.colors || []).map((color) => (
                                    <button
                                        key={color}
                                        className={`w-8 h-8 rounded-full border ${selectedColor === color ? "border-4 border-black" : "border-gray-300"}`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        onClick={() => setSelectedColor(color)}
                                    ></button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-700">Size:</p>
                            <div className="flex gap-2 mt-2">
                                {(productDetails.sizes || []).map((size) => (
                                    <button
                                        onClick={() => setSelectedSize(size)}
                                        key={size}
                                        className={`px-4 py-2 rounded border ${selectedSize === size ? "bg-black text-white" : ""}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700">Quantity:</p>
                            <div className="flex items-center space-x-4 mt-2">
                                <button onClick={() => handleQuantityChange("minus")} className="px-2 py-1 bg-gray-200 rounded text-lg"> - </button>
                                <span className="text-lg">{quantity}</span>
                                <button onClick={() => handleQuantityChange("plus")} className="px-2 py-1 bg-gray-200 rounded text-lg"> + </button>
                            </div>
                        </div>

                        <button onClick={handleAddToCart}
                            disabled={isButtonDisabled}
                            className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${isButtonDisabled ? "cursor-not-allowed opacity-50" : "hover-bg-gray-900"}`}>{isButtonDisabled ? "Adding..." : "ADD TO CART"}</button>

                        <div className="mt-10 text-gray-700">
                            <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                            <table className="w-full text-left text-sm text-gray-600">
                                <tbody>
                                    <tr>
                                        <td className="py-1">Brand</td>
                                        <td className="py-1">{productDetails.brand}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-1">Material</td>
                                        <td className="py-1">{productDetails.material}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="mt-20">
                    <h2 className="text-2xl text-center font-medium mb-4">You May Also Like</h2>
                    <ProductGrid products={similarProducts} loading={isLoading} error={error} hideEmptyMessage={true} />
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
