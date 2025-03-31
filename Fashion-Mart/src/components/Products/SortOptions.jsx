import React from 'react'
import { useSearchParams } from 'react-router-dom';

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    searchParams.set("SortBy", sortBy);
    setSearchParams(searchParams);
  }

  return (
    <div className="mb-4 flex items-center justify-end">
      <select id="sort" className="border p-2 rounded-md focus:outline-none">
        onChange={handleSortChange}
        value={searchParams.get("sortBy") || ""}
        <option value="">Default</option>
        <option value="">Price: Low to High</option>
        <option value="">Price: High to Low</option>
        <option value="">Popularity</option>
      </select>
    </div>
  )
}

export default SortOptions; 

