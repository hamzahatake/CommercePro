import { createApi } from "@reduxjs/toolkit/query/react";
import { formatQueryParams } from "@/utils/queryParams.js";
import { normalizeProduct } from "@/features/products/productNormalization.js";
import { baseQueryWithReauth } from "./baseQuerry.js";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Cart", "Wishlist", "Products", "Orders", "Vendors", "Product", "Managers", "Users"],
  endpoints: (builder) => ({

    // --- User ---
    userProfile: builder.query({
      query: () => "auth/profile/"
    }),

    // --- Vendor Profile ---
    vendorProfile: builder.query({
      query: () => "users/api/profile/vendor/"
    }),
    updateVendorProfile: builder.mutation({
      query: (data) => ({
        url: "users/api/profile/vendor/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["VendorProfile"],
    }),

    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "auth/login/",
        method: "POST",
        body: { email, password },
      }),
    }),

    registerUser: builder.mutation({
      query: ({ username, email, password, password_confirm, first_name, last_name }) => ({
        url: "auth/register/",
        method: "POST",
        body: { username, email, password, password_confirm, first_name, last_name },
      }),
    }),

    registerVendor: builder.mutation({
      query: ({ username, email, password, password_confirm, first_name, last_name, business_name }) => ({
        url: "auth/register/",
        method: "POST",
        body: { username, email, password, password_confirm, first_name, last_name, business_name, role: "vendor" },
      }),
    }),

    refreshToken: builder.mutation({
      query: ({ refresh }) => ({
        url: "auth/token/refresh/",
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
      query: ({ cartItemId }) => ({
        url: `cart/remove/${cartItemId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCart: builder.mutation({
      query: ({ cartItemId, quantity }) => ({
        url: `cart/update/${cartItemId}/`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
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
      query: ({ page = 1, search, category, ordering, price_min, price_max, color, size } = {}) => {
        const query = formatQueryParams({ page, search, category, ordering, price_min, price_max, color, size });
        return `products/${query}`;
      },
      transformResponse: (response) => ({
        ...response,
        results: response.results.map(product => normalizeProduct(product))
      }),
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
    getVendors: builder.query({ 
      query: () => "admin/vendors/",
      transformResponse: (response) => {
        // Handle both array and paginated response formats
        return Array.isArray(response) ? response : response.results || [];
      }
    }),
    approveVendor: builder.mutation({
      query: (id) => ({ url: `admin/vendors/${id}/approve/`, method: "PATCH" }),
    }),
    rejectVendor: builder.mutation({
      query: (id) => ({ url: `admin/vendors/${id}/reject/`, method: "PATCH" }),
    }),

    // --- Managers (Admin) ---
    getManagers: builder.query({ 
      query: () => "admin/managers/",
      providesTags: ["Managers"],
      transformResponse: (response) => {
        // Handle both array and paginated response formats
        return Array.isArray(response) ? response : response.results || [];
      }
    }),
    createManager: builder.mutation({
      query: (body) => ({
        url: "admin/managers/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Managers"],
    }),
    updateManager: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `admin/managers/${id}/update/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Managers"],
    }),
    deleteManager: builder.mutation({
      query: (id) => ({
        url: `admin/managers/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Managers"],
    }),

    // --- User Management (Admin) ---
    getUsers: builder.query({
      query: ({ search, role, is_active } = {}) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (role) params.append('role', role);
        if (is_active !== undefined) params.append('is_active', is_active);
        const query = params.toString();
        return `admin/users/${query ? `?${query}` : ''}`;
      },
      providesTags: ["Users"],
      transformResponse: (response) => {
        return Array.isArray(response) ? response : response.results || [];
      }
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: "admin/users/create/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
    }),
    getUserDetail: builder.query({
      query: (id) => `admin/users/${id}/`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `admin/users/${id}/`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users", id },
        "Users",
      ],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `admin/users/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Users", id },
        "Users",
      ],
    }),

    // Note: Removed complex role management endpoints as we simplified to use simple role field
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
  useGetManagersQuery,
  useCreateManagerMutation,
  useUpdateManagerMutation,
  useDeleteManagerMutation,
  useUserProfileQuery,
  useVendorProfileQuery,
  useUpdateVendorProfileMutation,
  useLoginMutation,
  useRegisterUserMutation,
  useRegisterVendorMutation,
  useRefreshTokenMutation,
  // User Management
  useGetUsersQuery,
  useCreateUserMutation,
  useGetUserDetailQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = apiSlice;
