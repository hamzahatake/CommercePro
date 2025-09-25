"use client";

import React from "react";
import { useGetProductsQuery } from "@/features/api/apiSlice";
import { useQueryParams } from "@/utils/useQueryParams";
import ShoeLoader from "@/components/ShoeLoader";
import ShoeNotAvailable from "@/components/ShoeNotAvailable";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/Pagination";
import FilterPanel from "@/components/FilterPanel";
import { SneakerBanner } from "@/components/SneakersHero";

export default function ProductsListContent() {
    const [query, setQuery] = useQueryParams();

    const { data, isLoading, error } = useGetProductsQuery(query);

    const currentPage = Number(query.page) || 1;
    const pageSize = Number(query.page_size) || 20;
    const totalCount = data?.count || 0;
    const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 0;

    // Frontend filtering for price, color, and size
    const filteredProducts = React.useMemo(() => {
        if (!data?.results) return [];
        
        let filtered = [...data.results];
        console.log('Initial products:', filtered.length);
        console.log('Query params:', query);
        
        // Price filtering
        if (query.price_filter) {
            const [minPrice, maxPrice] = query.price_filter.split('-').map(Number);
            console.log('Price filter:', { minPrice, maxPrice });
            filtered = filtered.filter(product => {
                const price = product.base_price || product.price || 0;
                const matches = price >= minPrice && price <= maxPrice;
                if (!matches) console.log('Product filtered out by price:', product.title, price);
                return matches;
            });
            console.log('After price filter:', filtered.length);
        }
        
        // Color filtering (if implemented in product data)
        if (query.color) {
            const colors = Array.isArray(query.color) ? query.color : [query.color];
            console.log('Color filter:', colors);
            filtered = filtered.filter(product => {
                // Check if product has any of the selected colors
                const matches = colors.some(color => 
                    product.title?.toLowerCase().includes(color.toLowerCase()) ||
                    product.description?.toLowerCase().includes(color.toLowerCase()) ||
                    product.variants?.some(variant => 
                        variant.color?.toLowerCase().includes(color.toLowerCase())
                    )
                );
                if (!matches) console.log('Product filtered out by color:', product.title);
                return matches;
            });
            console.log('After color filter:', filtered.length);
        }
        
        // Size filtering (if implemented in product data)
        if (query.size) {
            const sizes = Array.isArray(query.size) ? query.size : [query.size];
            console.log('Size filter:', sizes);
            filtered = filtered.filter(product => {
                // Check if product has any of the selected sizes
                const matches = product.variants?.some(variant => 
                    variant.sizes?.some(size => 
                        sizes.includes(size.label || size.size)
                    )
                );
                if (!matches) console.log('Product filtered out by size:', product.title);
                return matches;
            });
            console.log('After size filter:', filtered.length);
        }
        
        console.log('Final filtered products:', filtered.length);
        return filtered;
    }, [data?.results, query.price_filter, query.color, query.size]);

    const handlePageChange = (page) => {
        if (page < 1 || (totalPages && page > totalPages)) return;
        setQuery({ page });
    };

    const changePage = () => setQuery({ page: 2 });
    const clearCategory = () => setQuery({ category: null });

    return (
        <div className="w-full px-4 pt-16">
            <div className="w-full">
                {isLoading && <ShoeLoader />}
                {error && <ShoeNotAvailable />}

                {!isLoading && !error && (
                    <>
                        <div>
                            <SneakerBanner />
                        </div>
                        <div className="mt-4 mb-4 md:mb-6">
                            <FilterPanel productCount={filteredProducts.length} />
                        </div>
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
                                {filteredProducts?.map((product) => (
                                    <div key={product.id} className="flex mx-auto">
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg mb-2">No products found</div>
                                <div className="text-gray-400 text-sm">Try adjusting your filters or search terms</div>
                            </div>
                        )}
                        
                        <div>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>

                        <button onClick={changePage}></button>
                        <button onClick={clearCategory}></button>
                    </>
                )}
            </div>
        </div>
    );
}
