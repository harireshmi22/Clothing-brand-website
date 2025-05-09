import React, { useEffect, useState } from 'react'
import Hero from '../components/Layout/Hero'
import GenderCollectionSection from '../components/Products/GenderCollectionSection';
import NewArrivals from '../components/Products/NewArrivals';
import ProductDetails from '../components/Products/ProductDetails';
import ProductGrid from '../components/Products/ProductGrid';
import FeaturedCollection from '../components/Products/FeaturedCollection';
import FeaturesSection from '../components/Products/FeaturesSection';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';
import axios from 'axios';


const Home = () => {
  const dispatch = useDispatch();
  const { products, isLoading, error } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSeller] = useState(null);

  useEffect(() => {
    // Fetch limited products (limit: 8)
    dispatch(fetchProductsByFilters({ limit: 8 }));
    // Fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        setBestSeller(response.data);
      } catch (error) {
        console.error("Error fetching best seller:", error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollectionSection />
      <NewArrivals />

      {/* Best Seller  */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerProduct ? (<ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center text-gray-500">Loading best seller...</p>
      )}

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears For Women
        </h2>
        <ProductGrid products={products} loading={isLoading} error={error} />
      </div>

      <FeaturedCollection />

      <FeaturesSection />
    </div>
  )
}

export default Home; 