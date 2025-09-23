"use client";

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

    const handlePageChange = (page) => {
        if (page < 1 || (totalPages && page > totalPages)) return;
        setQuery({ page });
    };

    const changePage = () => setQuery({ page: 2 });
    const clearCategory = () => setQuery({ category: null });

    return (
        <div className="w-full px-4">
            <div className="w-full">
                {isLoading && <ShoeLoader />}
                {error && <ShoeNotAvailable />}

                {!isLoading && !error && (
                    <>
                        <div>
                            <SneakerBanner />
                        </div>
                        <div className="mt-4 mb-4 md:mb-6">
                            <FilterPanel />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-1">
                            {data?.results?.map((product) => (
                                <div key={product.id} className="flex mx-auto">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                        
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
