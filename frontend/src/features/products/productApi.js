import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { formatQueryParams } from "../../utils/queryParams.js";
import { normalizeProduct } from "./productNormalization.js";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/" }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, search, category, ordering } = {}) => {
        const query = formatQueryParams({ page, search, category, ordering });
        return `products/${query}`;
      },
    }),
    getProductDetail: builder.query({
      query: ({ slug }) => `products/${slug}/`,
      transformResponse: (response) => normalizeProduct(response),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductDetailQuery } = productApi;
