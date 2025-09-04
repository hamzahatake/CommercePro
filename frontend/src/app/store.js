import { configureStore } from "@reduxjs/toolkit";
import { cartApi } from "../features/cartApi";
import { authApi } from "../features/authApi";
import { ordersApi } from "../features/ordersApi";
import { productApi } from "../features/productApi";

// import authReducer from "../features/authSlice"; 
// import cartReducer from "../features/cartSlice";

export const store = configureStore({
  reducer: {
    // auth: authReducer,
    // cart: cartReducer,

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
