import { configureStore } from "@reduxjs/toolkit";
import { cartApi } from "../features/cart/cartApi.js";
import { authApi } from "../features/auth/authApi.js";
import { ordersApi } from "../features/orders/ordersApi.js";
import { productApi } from "../features/products/productApi.js";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      cartApi.middleware,
      ordersApi.middleware,
      productApi.middleware
    ),
  devTools: true,
});

export default store;
