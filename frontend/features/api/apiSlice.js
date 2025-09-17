import { createApi } from "@reduxjs/toolkit/query/react";
import { formatQueryParams } from "@/utils/queryParams.js";
import { normalizeProduct } from "@/features/products/productNormalization.js";
import { baseQueryWithReauth } from "./baseQuerry.js";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cart", "Wishlist", "Products", "Orders", "Vendors"],
  endpoints: (builder) => ({

    // --- User ---
    userProfile: builder.query({
      query: () => "users/profile/"
    }),

    login: builder.mutation({
      query: ({ username, password }) => ({
        url: "users/auth/login/",
        method: "POST",
        body: { username, password },
      }),
    }),

    registerUser: builder.mutation({
      query: ({ username, email, password, password_confirm, first_name, last_name }) => ({
        url: "users/auth/register/",
        method: "POST",
        body: { username, email, password, password_confirm, first_name, last_name },
      }),
    }),

    registerVendor: builder.mutation({
      query: ({ username, email, password, password_confirm, first_name, last_name, business_name }) => ({
        url: "users/auth/vendor-register/",
        method: "POST",
        body: { username, email, password, password_confirm, first_name, last_name, business_name },
      }),
    }),

    refreshToken: builder.mutation({
      query: ({ refresh }) => ({
        url: "users/auth/token/refresh/",
        method: "POST",
        body: { refresh },
      }),
    }),

    // --- Cart ---
    getCart: builder.query({
      query: () => "cart/",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: ({ product, quantity }) => ({
        url: "cart/add/",
        method: "POST",
        body: { product, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: ({ product }) => ({
        url: `cart/remove/${product}/`,
        method: "POST",
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCart: builder.mutation({
      query: ({ product, quantity }) => ({
        url: `cart/update/${product}/`,
        method: "POST",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"], // keep it simple
    }),


    // --- Wishlist ---
    getWishlist: builder.query({
      query: () => "wishlist/",
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation({
      query: ({ product }) => ({
        url: "wishlist/add/",
        method: "POST",
        body: { product },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation({
      query: ({ product }) => ({
        url: `wishlist/remove/${product}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // --- Orders ---
    getOrders: builder.query({ query: () => "orders/" }),
    createOrder: builder.mutation({
      query: (body) => ({ url: "orders/create/", method: "POST", body }),
    }),

    // --- Products ---
    getProducts: builder.query({
      query: ({ page = 1, search, category, ordering } = {}) => {
        const query = formatQueryParams({ page, search, category, ordering });
        return `products/${query}`;
      },
      providesTags: ['Product'],
    }),

    getProductDetail: builder.query({
      query: ({ slug }) => `products/${slug}/`,
      transformResponse: (response) => normalizeProduct(response),
      providesTags: (result, error, { slug }) => [{ type: 'Product', id: slug }],
    }),

    addProduct: builder.mutation({
      query: (body) => ({
        url: "vendor/products/",
        method: "POST",
        body,
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `vendor/products/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        'Product',
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `vendor/products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Product', id },
        'Product',
      ],
    }),

    // --- Vendors (Admin) ---
    getVendors: builder.query({ query: () => "admin/vendors/" }),
    approveVendor: builder.mutation({
      query: (id) => ({ url: `admin/vendors/${id}/approve/`, method: "PATCH" }),
    }),
    rejectVendor: builder.mutation({
      query: (id) => ({ url: `admin/vendors/${id}/reject/`, method: "PATCH" }),
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useGetProductsQuery,
  useGetProductDetailQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetVendorsQuery,
  useApproveVendorMutation,
  useRejectVendorMutation,
  useUserProfileQuery,
  useLoginMutation,
  useRegisterUserMutation,
  useRegisterVendorMutation,
  useRefreshTokenMutation,
} = apiSlice;
