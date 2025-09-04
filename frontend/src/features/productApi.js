import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const productApi = createApi ({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/products"}),
    endpoints: (builder) => ({
        getProducts: builder.query({
            query:() => ""
        }),
        getProductDetail: builder.mutation({
            query: (productDetail) => ({
                url: `/${productDetail.slug}`,
                method: "POST",
                body: productDetail
            }),
        }),
    }),
});

export const { useGetProductsQuery, useGetProductDetailMutation } = productApi
