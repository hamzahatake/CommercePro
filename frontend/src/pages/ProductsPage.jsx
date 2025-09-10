import { useGetProductsQuery } from "../features/products/productApi"; 
import { useQueryParams } from "../utils/useQueryParams";
import ShoeLoader from "../components/ShoeLoader";
import ShoeNotAvailable from "../components/ShoeNotAvailable";
import ProductCard from "../components/ProductCard";

export const Products = () => {
  const [query, setQuery] = useQueryParams(); // Getting used in useGetProductQuery

  const changePage = () => setQuery({ page: 2 });
  const clearCategory = () => setQuery({ category: null });

  const { data: products, isLoading, error } = useGetProductsQuery(query); // Taking page, serach, category, ordering etc from user and sending to the RTK

  return (
    <div>
      {isLoading && <ShoeLoader />}
      {error && <ShoeNotAvailable />}
      {products?.map((product) => (
        <div key={product.id}>
          <ProductCard />
        </div>
      ))}

      <button onClick={changePage}>Go to page 2</button>
      <button onClick={clearCategory}>Clear Category</button>
    </div>
  );
}