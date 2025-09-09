import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { formatQueryParams } from "../../utils/queryParams.js";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, search, category, ordering } = {}) => {
        const query = formatQueryParams({ page, search, category, ordering });
        return `products/${query}`; // Taking current page, search, category, ordering info from "query" state inside Product component
      },
    }),
    getProductDetail: builder.query({
      query: ({ slug }) => `/products/${slug}`,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailQuery } = productApi;
