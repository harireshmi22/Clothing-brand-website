import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { fetchProductDetails } from '../../redux/slices/productsSlice';
import axios from 'axios';
import { useEffect } from 'react';
import { updateProduct } from '../../redux/slices/adminProductSlice';


const EditProductPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { productDetails, isLoading, error } = useSelector((state) => state.products);

    const [productData, setProductData] = useState({
        name: "",
        description: "",
        price: 0,
        countInStock: 0,
        sku: "",
        category: "",
        brand: "",
        sizes: [],
        colors: [],
        collections: "",
        material: "",
        gender: "",
        images: []
    })

    useEffect(() => {
        dispatch(fetchProductDetails(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (productDetails) {
            // Filter out invalid images from backend
            const filteredImages = (productDetails.images || []).filter(
                img => img && img.url && typeof img.url === 'string' && img.url.trim() !== ""
            );
            setProductData({ ...productDetails, images: filteredImages });
        }
    }, [productDetails]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            if (data.imageUrl && typeof data.imageUrl === 'string' && data.imageUrl.trim() !== "") {
                setProductData((prevData) => ({
                    ...prevData,
                    images: [...prevData.images, { url: data.imageUrl, altText: "" }],
                }));
            }
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        // Filter out images with no url or empty url
        const filteredImages = (productData.images || []).filter(
            img => img.url && typeof img.url === 'string' && img.url.trim() !== ""
        );
        dispatch(updateProduct({ id, productData: { ...productData, images: filteredImages } }));
        navigate(`/admin/products`);
    }

    const handleDeleteImage = (index) => {
        setProductData((prevData) => {
            const newImages = prevData.images.filter((_, i) => i !== index);
            // Debug: log the images after deletion
            console.log("Images after delete:", newImages);
            return {
                ...prevData,
                images: newImages,
            };
        });
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Debug: log the images array on every render
    console.log("Current images (render):", productData.images);

    return (
        <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
            <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
            <form onSubmit={handleSubmit}>
                {/* Name */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Name</label>
                    <input type="text" name="name" value={productData.name || ''} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 required" />
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Product Description</label>
                    <textarea name="description" value={productData.description} onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2" rows={4} required>
                    </textarea>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Price</label>
                    <input type="text" name="price" value={productData.price}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2" />
                </div>

                {/* Count In Stock */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Count in Stock</label>
                    <input type="number" name="countInStock" value={productData.countInStock}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2" />
                </div>

                {/* SKU */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">SKU</label>
                    <input type="text" name="sku" value={productData.sku}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2" />
                </div>

                {/* Sizes */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Sizes (comma-separated)</label>
                    <input type="text" name="sizes" value={(productData.sizes || []).join(", ")}
                        onChange={(e) => setProductData({
                            ...productData,
                            sizes: e.target.value.split(",").map((size) => size.trim())
                        })}
                        className="w-full border border-gray-300 rounded-md p-2" />
                </div>

                {/* Colors */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Colors (comma-separated)</label>
                    <input type="text" name="colors" value={(productData.colors || []).join(", ")}
                        onChange={(e) => setProductData({
                            ...productData,
                            colors: e.target.value.split(",").map((color) => color.trim())
                        })}
                        className="w-full border border-gray-300 rounded-md p-2" />
                </div>

                {/* Image Upload  */}
                <div className="mb-6">
                    <label className="block font-semibold mb-2">Upload Image</label>
                    <input type="file" onChange={handleImageUpload} />
                    <div className="flex gap-4 mt-4">
                        {(productData.images || []).filter(img => img.url && img.url.trim() !== "").map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image.url}
                                    alt={image.altText || "Product Image"}
                                    className="w-20 h-20 object-cover rounded-md shadow-md"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(index)}
                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    title="Delete image"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 
                transition-colors" type="submit">Update Product</button>
            </form>
        </div>
    )
}

export default EditProductPage; 