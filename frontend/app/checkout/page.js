"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { 
    CreditCard, 
    Lock, 
    Truck, 
    Shield, 
    CheckCircle, 
    ArrowLeft,
    User,
    Mail,
    MapPin,
    Calendar,
    Eye,
    EyeOff
} from "lucide-react";
import { 
    selectCartItems, 
    selectCartTotal, 
    selectCartItemCount,
    clearCart 
} from "@/store/cartSlice";
import { useCreateOrderMutation } from "@/features/api/apiSlice";

function CheckOutPageContent() {
    const router = useRouter();
    const dispatch = useDispatch();
    
    // Redux selectors
    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const cartItemCount = useSelector(selectCartItemCount);
    
    // API hooks
    const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
    
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        shipping_address: "",
        city: "",
        state: "",
        zipCode: "",
        payment: {
            method: "card",
            card_number: "",
            expiry: "",
            cvv: "",
            name_on_card: ""
        }
    });
    
    const [showCVV, setShowCVV] = useState(false);
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0) {
            router.push('/cart');
        }
    }, [cartItems.length, router]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!userInfo.firstName.trim()) newErrors.firstName = "First name is required";
        if (!userInfo.lastName.trim()) newErrors.lastName = "Last name is required";
        if (!userInfo.email.trim()) newErrors.email = "Email is required";
        if (!userInfo.phone.trim()) newErrors.phone = "Phone number is required";
        if (!userInfo.shipping_address.trim()) newErrors.shipping_address = "Address is required";
        if (!userInfo.city.trim()) newErrors.city = "City is required";
        if (!userInfo.state.trim()) newErrors.state = "State is required";
        if (!userInfo.zipCode.trim()) newErrors.zipCode = "ZIP code is required";
        
        if (userInfo.payment.method === "card") {
            if (!userInfo.payment.card_number.trim()) newErrors.card_number = "Card number is required";
            if (!userInfo.payment.expiry.trim()) newErrors.expiry = "Expiry date is required";
            if (!userInfo.payment.cvv.trim()) newErrors.cvv = "CVV is required";
            if (!userInfo.payment.name_on_card.trim()) newErrors.name_on_card = "Name on card is required";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);
        
        try {
            // Create order data
            const orderData = {
                shipping_address: `${userInfo.shipping_address}, ${userInfo.city}, ${userInfo.state} ${userInfo.zipCode}`,
                payment_method: userInfo.payment.method,
                items: cartItems.map(item => ({
                    product: item.product.id,
                    quantity: item.quantity
                }))
            };
            
            await createOrder(orderData).unwrap();
            
            // Clear cart and redirect
            dispatch(clearCart());
            router.push("/ordersummary");
        } catch (error) {
            console.error("Order creation failed:", error);
            alert("Failed to create order. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setUserInfo((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setUserInfo((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#EDEAE4" }}>
                <div className="text-center">
                    <h2 className="text-2xl font-light mb-4" style={{ color: "#1A1A1A" }}>Your cart is empty</h2>
                    <p className="text-lg mb-8" style={{ color: "#555555" }}>Add some items to your cart to proceed to checkout</p>
                    <button 
                        onClick={() => router.push('/cart')}
                        className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90"
                        style={{ backgroundColor: "#000000" }}
                    >
                        Back to Cart
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16" style={{ backgroundColor: "#EDEAE4" }}>
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm font-medium mb-4 hover:opacity-80 transition-colors"
                        style={{ color: "#555555" }}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Cart
                    </button>
                    <h1 className="text-4xl font-light mb-2" style={{ color: "#1A1A1A" }}>
                        Checkout
                    </h1>
                    <p className="text-lg" style={{ color: "#555555" }}>
                        Complete your order securely
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Personal Information */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl p-6 shadow-sm"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <User className="h-5 w-5" style={{ color: "#1A1A1A" }} />
                                    <h2 className="text-xl font-medium" style={{ color: "#1A1A1A" }}>Personal Information</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: "#555555" }}>
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={userInfo.firstName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                                                errors.firstName 
                                                    ? 'border-red-300 focus:ring-red-200' 
                                                    : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
                                            }`}
                                            placeholder="John"
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                        )}
                                    </div>
                                    
                        <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: "#555555" }}>
                                            Last Name *
                                        </label>
                            <input
                                type="text"
                                            name="lastName"
                                            value={userInfo.lastName}
                                onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                                                errors.lastName 
                                                    ? 'border-red-300 focus:ring-red-200' 
                                                    : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
                                            }`}
                                            placeholder="Doe"
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                        )}
                                    </div>
                        </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: "#555555" }}>
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: "#888888" }} />
                            <input
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                                                    errors.email 
                                                        ? 'border-red-300 focus:ring-red-200' 
                                                        : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
                                                }`}
                                                placeholder="john@example.com"
                            />
                        </div>
                                        {errors.email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: "#555555" }}>
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={userInfo.phone}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                                                errors.phone 
                                                    ? 'border-red-300 focus:ring-red-200' 
                                                    : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
                                            }`}
                                            placeholder="+1 (555) 123-4567"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Shipping Address */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl p-6 shadow-sm"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <MapPin className="h-5 w-5" style={{ color: "#1A1A1A" }} />
                                    <h2 className="text-xl font-medium" style={{ color: "#1A1A1A" }}>Shipping Address</h2>
                                </div>
                                
                                <div className="space-y-4">
                        <div>
                                        <label className="block text-sm font-medium mb-2" style={{ color: "#555555" }}>
                                            Street Address *
                                        </label>
                                        <input
                                            type="text"
                                name="shipping_address"
                                value={userInfo.shipping_address}
                                onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                                                errors.shipping_address 
                                                    ? 'border-red-300 focus:ring-red-200' 
                                                    : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
                                            }`}
                                            placeholder="123 Main Street"
                                        />
                                        {errors.shipping_address && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shipping_address}</p>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: "#555555" }}>
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={userInfo.city}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                                                    errors.city 
                                                        ? 'border-red-300 focus:ring-red-200' 
                                                        : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
                                                }`}
                                                placeholder="New York"
                                            />
                                            {errors.city && (
                                                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: "#555555" }}>
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={userInfo.state}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                                                    errors.state 
                                                        ? 'border-red-300 focus:ring-red-200' 
                                                        : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
                                                }`}
                                                placeholder="NY"
                                            />
                                            {errors.state && (
                                                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                                            )}
                        </div>

                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: "#555555" }}>
                                                ZIP Code *
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={userInfo.zipCode}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                                                    errors.zipCode 
                                                        ? 'border-red-300 focus:ring-red-200' 
                                                        : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
                                                }`}
                                                placeholder="10001"
                                            />
                                            {errors.zipCode && (
                                                <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Payment Information */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl p-6 shadow-sm"
                            >
                                <div className="flex items-center gap-2 mb-6">
                                    <CreditCard className="h-5 w-5" style={{ color: "#1A1A1A" }} />
                                    <h2 className="text-xl font-medium" style={{ color: "#1A1A1A" }}>Payment Information</h2>
                                </div>
                                
                                {/* Payment Method Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-3" style={{ color: "#555555" }}>
                                        Payment Method
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setUserInfo(prev => ({ 
                                                ...prev, 
                                                payment: { ...prev.payment, method: "card" } 
                                            }))}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                                userInfo.payment.method === "card" 
                                                    ? 'border-black bg-gray-50' 
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <CreditCard className="h-5 w-5" style={{ color: "#1A1A1A" }} />
                                                <span className="font-medium" style={{ color: "#1A1A1A" }}>Credit Card</span>
                                            </div>
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={() => setUserInfo(prev => ({ 
                                                ...prev, 
                                                payment: { ...prev.payment, method: "paypal" } 
                                            }))}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                                userInfo.payment.method === "paypal" 
                                                    ? 'border-black bg-gray-50' 
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 bg-yellow-400 rounded flex items-center justify-center">
                                                    <span className="text-xs font-bold text-black">PP</span>
                                                </div>
                                                <span className="font-medium" style={{ color: "#1A1A1A" }}>PayPal</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {userInfo.payment.method === "card" && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: "#555555" }}>
                                                Name on Card *
                                            </label>
                                            <input
                                                type="text"
                                                name="payment.name_on_card"
                                                value={userInfo.payment.name_on_card}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                                                    errors.name_on_card 
                                                        ? 'border-red-300 focus:ring-red-200' 
                                                        : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
                                                }`}
                                                placeholder="John Doe"
                                            />
                                            {errors.name_on_card && (
                                                <p className="text-red-500 text-sm mt-1">{errors.name_on_card}</p>
                                            )}
                                        </div>
                                        
                                <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: "#555555" }}>
                                                Card Number *
                                            </label>
                                    <input
                                                type="text"
                                        name="payment.card_number"
                                        value={userInfo.payment.card_number}
                                        onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                                                    errors.card_number 
                                                        ? 'border-red-300 focus:ring-red-200' 
                                                        : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
                                                }`}
                                        placeholder="1234 5678 9012 3456"
                                    />
                                            {errors.card_number && (
                                                <p className="text-red-500 text-sm mt-1">{errors.card_number}</p>
                                            )}
                                </div>

                                        <div className="grid grid-cols-2 gap-4">
                                    <div>
                                                <label className="block text-sm font-medium mb-2" style={{ color: "#555555" }}>
                                                    Expiry Date *
                                                </label>
                                        <input
                                                    type="text"
                                            name="payment.expiry"
                                            value={userInfo.payment.expiry}
                                            onChange={handleChange}
                                                    className={`w-full px-4 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                                                        errors.expiry 
                                                            ? 'border-red-300 focus:ring-red-200' 
                                                            : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
                                                    }`}
                                            placeholder="MM/YY"
                                        />
                                                {errors.expiry && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
                                                )}
                                    </div>

                                    <div>
                                                <label className="block text-sm font-medium mb-2" style={{ color: "#555555" }}>
                                                    CVV *
                                                </label>
                                                <div className="relative">
                                        <input
                                                        type={showCVV ? "text" : "password"}
                                            name="payment.cvv"
                                            value={userInfo.payment.cvv}
                                            onChange={handleChange}
                                                        className={`w-full px-4 py-3 pr-10 rounded-xl border transition-colors focus:outline-none focus:ring-2 ${
                                                            errors.cvv 
                                                                ? 'border-red-300 focus:ring-red-200' 
                                                                : 'border-gray-300 focus:ring-gray-200 focus:border-gray-400'
                                                        }`}
                                            placeholder="123"
                                        />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCVV(!showCVV)}
                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                    >
                                                        {showCVV ? (
                                                            <EyeOff className="h-5 w-5" style={{ color: "#888888" }} />
                                                        ) : (
                                                            <Eye className="h-5 w-5" style={{ color: "#888888" }} />
                                                        )}
                                                    </button>
                                                </div>
                                                {errors.cvv && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {userInfo.payment.method === "paypal" && (
                                    <div className="p-6 bg-gray-50 rounded-xl text-center">
                                        <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl font-bold text-black">PP</span>
                                        </div>
                                        <p className="text-sm" style={{ color: "#555555" }}>
                                            You'll be redirected to PayPal to complete your payment
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl p-6 shadow-sm"
                            >
                                <h3 className="text-xl font-medium mb-6" style={{ color: "#1A1A1A" }}>
                                    Order Summary
                                </h3>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
                                                    <CreditCard className="h-6 w-6" style={{ color: "#888888" }} />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium truncate" style={{ color: "#1A1A1A" }}>
                                                    {item.product_title || item.product?.title || 'Product'}
                                                </h4>
                                                <p className="text-xs" style={{ color: "#555555" }}>
                                                    {item.product?.category?.name || item.product_category || 'Category'} • Qty: {item.quantity}
                                                </p>
                                                <p className="text-sm font-medium" style={{ color: "#1A1A1A" }}>
                                                    ${(parseFloat(item.product_price || item.product?.price || 0) * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Summary Details */}
                                <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between">
                                        <span style={{ color: "#555555" }}>Subtotal ({cartItemCount} items)</span>
                                        <span style={{ color: "#1A1A1A" }}>${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#555555" }}>Shipping</span>
                                        <span style={{ color: "#1A1A1A" }}>Free</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span style={{ color: "#555555" }}>Tax</span>
                                        <span style={{ color: "#1A1A1A" }}>Calculated at checkout</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between text-lg font-medium">
                                            <span style={{ color: "#1A1A1A" }}>Total</span>
                                            <span style={{ color: "#1A1A1A" }}>${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                                {/* Place Order Button */}
                            <button
                                    onClick={handleSubmit}
                                    disabled={isProcessing || isCreatingOrder}
                                    className="w-full py-4 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: "#000000" }}
                                >
                                    {isProcessing || isCreatingOrder ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-5 w-5" />
                                Place Order
                                        </>
                                    )}
                            </button>

                                {/* Security badges */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex items-center justify-center gap-4 text-xs" style={{ color: "#888888" }}>
                                        <div className="flex items-center gap-1">
                                            <Shield className="h-4 w-4" />
                                            <span>Secure Payment</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Truck className="h-4 w-4" />
                                            <span>Free Shipping</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckOutPage() {
    return (
        <ProtectedRoute requireAuth={true} allowedRoles={['customer', 'user']}>
            <CheckOutPageContent />
        </ProtectedRoute>
    );
}