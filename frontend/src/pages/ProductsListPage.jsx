import React from "react";
import { useGetProductsQuery } from "../features/products/productApi";
import { useQueryParams } from "../utils/useQueryParams";
import ShoeLoader from "../components/ShoeLoader";
import ShoeNotAvailable from "../components/ShoeNotAvailable";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import FilterPanel from "../components/FilterPanel";

export const ProductsList = () => {
  const [query, setQuery] = useQueryParams();

  // Fetch products based on query params from URL (page, search, category, ordering, etc.)
  const { data, isLoading, error } = useGetProductsQuery(query);

  const currentPage = Number(query.page) || 1;
  const pageSize = Number(query.page_size) || 20; // backend default
  const totalCount = data?.count || 0;
  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 0;

  const handlePageChange = (page) => {
    if (page < 1 || (totalPages && page > totalPages)) return;
    setQuery({ page });
  };

  const changePage = () => setQuery({ page: 2 });
  const clearCategory = () => setQuery({ category: null });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6">
      {isLoading && <ShoeLoader />}
      {error && <ShoeNotAvailable />}

      {!isLoading && !error && (
        <>
          <div className="mb-4 md:mb-6">
            <FilterPanel />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {data?.results?.map((product) => (
              <div key={product.id} className="">
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
  );
}