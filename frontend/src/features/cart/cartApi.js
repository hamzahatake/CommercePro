import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/cart" }),
  tagTypes: ["Cart"], 
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation({
      query: (addItem) => ({
        url: "/add",
        method: "POST",
        body: addItem,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation({
      query: (removeItem) => ({
        url: `/remove/${removeItem.id}/`,
        method: "POST",
        body: removeItem,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCart: builder.mutation({
      query: (updateCart) => ({
        url: `/update/${updateCart.id}/`,
        method: "POST",
        body: updateCart,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});


export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
} = cartApi;
