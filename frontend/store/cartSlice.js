import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: false,
    error: null,
    lastUpdated: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Local cart actions for optimistic updates
        addItem: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(i => i.product?.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ 
                    id: Date.now() + Math.random(), // Temporary ID for local state
                    product: product,
                    product_title: product.title,
                    product_price: product.price,
                    product_category: product.category?.name,
                    product_image: product.main_image || product.image || product.images?.[0],
                    quantity: quantity 
                });
            }
            
            // Recalculate totals
            cartSlice.caseReducers.calculateTotals(state);
        },
        
        removeItem: (state, action) => {
            const itemId = action.payload;
            state.items = state.items.filter(item => item.id !== itemId);
            cartSlice.caseReducers.calculateTotals(state);
        },
        
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.items.find(i => i.id === id);
            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(i => i.id !== id);
                } else {
                    item.quantity = quantity;
                }
                cartSlice.caseReducers.calculateTotals(state);
            }
        },
        
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            state.itemCount = 0;
            state.lastUpdated = Date.now();
        },
        
        // API sync actions
        setCartFromAPI: (state, action) => {
            const { cart_items } = action.payload;
            const apiItems = cart_items.map(item => ({
                id: item.id,
                product: item.product,
                product_title: item.product_title,
                product_price: item.product_price,
                product_category: item.product?.category?.name,
                product_image: item.product?.main_image || item.product?.image || item.product?.images?.[0],
                quantity: item.quantity
            }));
            
            // Merge API items with existing local items
            // Keep local items that don't exist in API response
            const existingProductIds = new Set(apiItems.map(item => item.product?.id));
            const localItemsToKeep = state.items.filter(item => 
                !existingProductIds.has(item.product?.id)
            );
            
            state.items = [...localItemsToKeep, ...apiItems];
            cartSlice.caseReducers.calculateTotals(state);
            state.lastUpdated = Date.now();
        },
        
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        
        setError: (state, action) => {
            state.error = action.payload;
        },
        
        // Helper reducer for calculating totals
        calculateTotals: (state) => {
            state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
            state.total = state.items.reduce((sum, item) => {
                const price = parseFloat(item.product_price || item.product?.price || 0);
                return sum + (price * item.quantity);
            }, 0);
        },
    },
});

export const { 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    setCartFromAPI, 
    setLoading, 
    setError,
    calculateTotals 
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartLoading = (state) => state.cart.isLoading;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;
