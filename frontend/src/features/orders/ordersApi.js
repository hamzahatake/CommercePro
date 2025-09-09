import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
  endpoints: (builder) => ({
    getCheckout: builder.query({
      query: () => "/orders/checkout",
    }),
    getOrderHistory: builder.query({
      query: () => "/orders",
    }),
  }),
});

export const { useGetCheckoutQuery, useGetOrderHistoryQuery } = ordersApi;
