import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from "react-icons/fa"
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productsSlice';

const CollectionPage = () => {

    const { collection } = useParams(); // Get collection from URL params
    const [searchParams] = useSearchParams(); // Get search params from URL
    const dispatch = useDispatch(); // Initialize dispatch function

    const { products, isLoading, error } = useSelector((state) => state.products); // Get products from Redux store

    // Get all query params as an object
    const queryParams = Object.fromEntries([...searchParams]);

    useEffect(() => {
        dispatch(fetchProductsByFilters({ collection, ...queryParams }));
        // eslint-disable-next-line
    }, [dispatch, collection, searchParams.toString()]); // <--- This ensures it updates on any param change

    const sidebarRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickOutside = (e) => {
        // Close sidebar if clicked outside
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        // Add event listener for clicks
        document.addEventListener("mousedown", handleClickOutside);

        // Clean event listener 
        return () => {
            // Clean event listener
            document.removeEventListener("mousedown", handleClickOutside);
        }

    }, []);


    return (
        <div className="flex flex-col lg:flex-row">
            <button onClick={toggleSidebar}
                className="lg:hidden border p-2 flex justify-center items-center">
                <FaFilter /> Filters
            </button>

            {/* Filter Sidebar */}
            <div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 z-50
                left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static 
                lg:translate-x-0`}>
                <FilterSidebar />
            </div>

            <div className="flex-grow p-4">
                <h2 className="text-2xl uppercase mb-4">All Collection</h2>

                {/* Sort Options */}
                <SortOptions />

                {/* Product Grid */}
                <ProductGrid products={products} loading={isLoading} error={error} />
            </div>
        </div>
    )
}

export default CollectionPage