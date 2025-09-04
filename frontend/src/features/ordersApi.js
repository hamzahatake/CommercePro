import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const ordersApi = createApi ({
    reducerPath: "ordersApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/orders"}),
    endpoints: (builder) => ({
        getCheckout: builder.query({
            query: () => "/checkout"
        }),
        getOrderHistory: builder.query({
            query: () => ""
        }),
    }),
});

export const { useGetCheckoutQuery, useGetOrderHistory } = ordersApi
