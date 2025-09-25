"use client";

import React, { useState, useEffect } from "react";
import { 
    useGetCartQuery, 
    useAddToCartMutation, 
    useRemoveFromCartMutation, 
    useUpdateCartMutation 
} from "@/features/api/apiSlice";
import {
    selectCartItems,
    selectCartTotal,
    selectCartItemCount,
    setCartFromAPI,
    addItem,
    removeItem,
    updateQuantity
} from "@/store/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2, CreditCard, Shield, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPageContent() {
    const router = useRouter();
    const dispatch = useDispatch();

    // Redux selectors
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const cartItemCount = useSelector(selectCartItemCount);

    // API hooks
    const { data: cart, isLoading, isError, refetch } = useGetCartQuery();
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
    const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
    const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
    
    const [updatingItems, setUpdatingItems] = useState(new Set());
    const [removingItems, setRemovingItems] = useState(new Set());

    // Sync API data with Redux store
    useEffect(() => {
        if (cart?.cart_items) {
            console.log('Syncing cart data from API:', cart);
            console.log('Cart items:', cart.cart_items);
            cart.cart_items.forEach((item, index) => {
                console.log(`Item ${index}:`, {
                    id: item.id,
                    product: item.product,
                    product_title: item.product_title,
                    product_price: item.product_price,
                    product_image: item.product?.main_image || item.product?.image || item.product?.images?.[0]
                });
            });
            dispatch(setCartFromAPI(cart));
        }
    }, [cart, dispatch]);

    if (isLoading) {
    return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#EDEAE4" }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-lg font-medium" style={{ color: "#1A1A1A" }}>Loading your cart...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#EDEAE4" }}>
                <div className="text-center">
                    <ShoppingBag className="h-16 w-16 mx-auto mb-4" style={{ color: "#888888" }} />
                    <p className="text-lg font-medium" style={{ color: "#1A1A1A" }}>Failed to load cart</p>
                    <p className="text-sm mt-2" style={{ color: "#555555" }}>Please try again later</p>
                    <button 
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-black text-white rounded-full text-sm hover:opacity-90"
                    >
                        Try Again
                    </button>
                    </div>
            </div>
        );
    }

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        const item = cartItems.find(item => item.id === itemId);
        if (!item) return;

        console.log('Updating quantity for item:', item, 'new quantity:', newQuantity);

        // Optimistic update
        dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
        setUpdatingItems(prev => new Set(prev).add(itemId));
        
        try {
            const result = await updateCart({ 
                cartItemId: item.id, 
                quantity: newQuantity 
            }).unwrap();
            console.log('Update result:', result);
        } catch (error) {
            console.error("Failed to update quantity:", error);
            // Revert on error
            dispatch(updateQuantity({ id: itemId, quantity: item.quantity }));
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (itemId) => {
        const item = cartItems.find(item => item.id === itemId);
        if (!item) return;

        console.log('Removing item:', item);

        // Optimistic update
        dispatch(removeItem(itemId));
        setRemovingItems(prev => new Set(prev).add(itemId));
        
        try {
            const result = await removeFromCart({ cartItemId: item.id }).unwrap();
            console.log('Remove result:', result);
        } catch (error) {
            console.error("Failed to remove item:", error);
            // Revert on error - add item back
            dispatch(addItem({ product: item.product, quantity: item.quantity }));
        } finally {
            setRemovingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    // Filter out invalid items (items without proper product data)
    const validCartItems = cartItems.filter(item => 
        item && item.id && (item.product || item.product_title) && item.quantity > 0
    );

    console.log('All cart items:', cartItems);
    console.log('Valid cart items:', validCartItems);
    console.log('Cart items length:', cartItems.length);
    console.log('Valid cart items length:', validCartItems.length);

    const subtotal = validCartItems.reduce((sum, item) => {
        const price = parseFloat(item.product_price || item.product?.price || 0);
        return sum + (price * item.quantity);
    }, 0);
    const totalItems = validCartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (validCartItems.length === 0) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: "#EDEAE4" }}>
                <div className="text-center max-w-md mx-auto px-6">
                    <ShoppingBag className="h-24 w-24 mx-auto mb-6" style={{ color: "#888888" }} />
                    <h2 className="text-3xl font-light mb-4" style={{ color: "#1A1A1A" }}>Your cart is empty</h2>
                    <p className="text-lg mb-8" style={{ color: "#555555" }}>
                        Looks like you haven't added any items to your cart yet.
                    </p>
                    <button 
                        onClick={() => router.push('/products')}
                        className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90"
                        style={{ backgroundColor: "#000000" }}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16" style={{ backgroundColor: "#EDEAE4" }}>
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-light mb-2" style={{ color: "#1A1A1A" }}>
                        Shopping Cart
                    </h1>
                    <p className="text-lg" style={{ color: "#555555" }}>
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {validCartItems.map((item, index) => {
                            const isUpdating = updatingItems.has(item.id);
                            const isRemoving = removingItems.has(item.id);
                            const currentQuantity = item.quantity;
                            
                            console.log('Cart item:', item);
                            
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: isRemoving ? 0.5 : 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className={`bg-white rounded-2xl p-6 shadow-sm transition-opacity ${isRemoving ? 'opacity-50' : ''}`}
                                >
                                    <div className="flex gap-6">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0">
                                            <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100">
                                                {item.product_image ? (
                                                    <img
                                                        src={item.product_image}
                                                        alt={item.product_title || item.product?.title || 'Product'}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className="w-full h-full flex items-center justify-center" style={{ display: item.product_image ? 'none' : 'flex' }}>
                                                        <ShoppingBag className="h-8 w-8" style={{ color: "#888888" }} />
                                                    </div>
                                            </div>
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-xl font-medium mb-1" style={{ color: "#1A1A1A" }}>
                                                        {item.product_title || item.product?.title || 'Product Title'}
                                                    </h3>
                                                    <p className="text-sm" style={{ color: "#555555" }}>
                                                        {item.product?.category?.name || item.product_category || 'Category'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    disabled={isRemoving}
                                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isRemoving ? (
                                                        <Loader2 className="h-5 w-5 animate-spin" style={{ color: "#888888" }} />
                                                    ) : (
                                                        <Trash2 className="h-5 w-5" style={{ color: "#888888" }} />
                                                    )}
                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* Price */}
                                                <div className="text-2xl font-medium" style={{ color: "#1A1A1A" }}>
                                                    ${(parseFloat(item.product_price || item.product?.price || 0)).toFixed(2)}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, currentQuantity - 1)}
                                                        disabled={isUpdating || isRemoving || currentQuantity <= 1}
                                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isUpdating ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Minus className="h-4 w-4" />
                                                        )}
                    </button>
                                                    <span className="w-12 text-center font-medium" style={{ color: "#1A1A1A" }}>
                                                        {currentQuantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, currentQuantity + 1)}
                                                        disabled={isUpdating || isRemoving}
                                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isUpdating ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Plus className="h-4 w-4" />
                                                        )}
                    </button>
                                                </div>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <div className="flex justify-between text-sm">
                                                    <span style={{ color: "#555555" }}>Subtotal:</span>
                                                    <span className="font-medium" style={{ color: "#1A1A1A" }}>
                                                        ${(currentQuantity * parseFloat(item.product_price || item.product?.price || 0)).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xl font-medium mb-6" style={{ color: "#1A1A1A" }}>
                                    Order Summary
                                </h3>

                                {/* Summary Details */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span style={{ color: "#555555" }}>Subtotal ({totalItems} items)</span>
                                        <span style={{ color: "#1A1A1A" }}>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#555555" }}>Shipping</span>
                                        <span style={{ color: "#1A1A1A" }}>Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#555555" }}>Tax</span>
                                        <span style={{ color: "#1A1A1A" }}>Calculated at checkout</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex justify-between text-lg font-medium">
                                            <span style={{ color: "#1A1A1A" }}>Total</span>
                                            <span style={{ color: "#1A1A1A" }}>${subtotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button 
                                    onClick={() => router.push('/checkout')}
                                    disabled={cartItems.length === 0}
                                    className="w-full py-4 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: "#000000" }}
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="h-5 w-5" />
                    </button>

                                {/* Payment Methods */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center gap-2 mb-4">
                                        <CreditCard className="h-5 w-5" style={{ color: "#555555" }} />
                                        <p className="text-sm font-medium" style={{ color: "#555555" }}>
                                        We accept
                                    </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                                                <span className="text-xs font-bold text-white">VISA</span>
                                            </div>
                                            <span className="text-xs font-medium" style={{ color: "#555555" }}>Visa</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-5 bg-red-600 rounded flex items-center justify-center">
                                                <span className="text-xs font-bold text-white">MC</span>
                                            </div>
                                            <span className="text-xs font-medium" style={{ color: "#555555" }}>Mastercard</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-5 bg-blue-500 rounded flex items-center justify-center">
                                                <span className="text-xs font-bold text-white">AMEX</span>
                                            </div>
                                            <span className="text-xs font-medium" style={{ color: "#555555" }}>Amex</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-5 bg-yellow-400 rounded flex items-center justify-center">
                                                <span className="text-xs font-bold text-black">PP</span>
                                            </div>
                                            <span className="text-xs font-medium" style={{ color: "#555555" }}>PayPal</span>
                                        </div>
                                        </div>

                                    {/* Security badges */}
                                    <div className="mt-4 flex items-center justify-center gap-4 text-xs" style={{ color: "#888888" }}>
                                        <div className="flex items-center gap-1">
                                            <Shield className="h-4 w-4" />
                                            <span>Secure</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Truck className="h-4 w-4" />
                                            <span>Free Shipping</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
