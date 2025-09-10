import React from "react";
import CatalogCard from "../components/CatalogCard";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import ShoeLoader from "../components/ShoeLoader";
import ShoeNotAvailable from "../components/ShoeNotAvailable";
import { useGetProductsQuery } from "../features/products/productApi";
import { useState } from "react";

import BestSeller from "../../public/Catalog/BestSellers.webp";
import Mens from "../../public/Catalog/Mens.webp";
import Women from "../../public/Catalog/Women.webp";
import Cruiser from "../../public/Catalog/Cruiser.webp";

const catalogs = [
    { image: BestSeller, alt: "Best Seller" },
    { image: Mens, alt: "Mens" },
    { image: Women, alt: "Women" },
    { image: Cruiser, alt: "Cruiser" },
];

export function Home() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5;

    const { data, isLoading, error } = useGetProductsQuery({ page: currentPage });

    const handlePageChange = (page) => {
        setCurrentPage(page); // Fetches new products based on the new page
    }

    { if (isLoading) return <ShoeLoader /> }
    { if (error) return <ShoeNotAvailable /> }

    return (
        <div className="w-full px-4">
            {/* Desktop */}
            <div className="hidden md:grid grid-cols-4 gap-3">
                {catalogs.map((item, i) => (
                    <CatalogCard key={i} image={item.image} alt={item.alt} />
                ))}
            </div>

            {/* Mobile */}
            <div className="flex md:hidden gap-3 overflow-x-auto no-scrollbar">
                {catalogs.map((item, i) => (
                    <CatalogCard key={i} image={item.image} alt={item.alt} />
                ))}
            </div>

            <div className="flex gap-3 mt-8">
                {data?.results?.map((product) => (
                    <div key={product.id} className="mb-4">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            <div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange} />
            </div>
        </div>
    );
}
