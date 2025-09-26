"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
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

export default function CheckoutFormComponent() {
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
            const orderData = {
                items: cartItems.map(item => ({
                    product: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                shipping_address: `${userInfo.shipping_address}, ${userInfo.city}, ${userInfo.state} ${userInfo.zipCode}`,
                payment_method: userInfo.payment.method,
                total_amount: cartTotal
            };

            const result = await createOrder(orderData).unwrap();
            
            // Clear cart after successful order
            dispatch(clearCart());
            
            // Redirect to success page or show success message
            alert('Order placed successfully!');
            router.push('/');
            
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('payment.')) {
            const paymentField = name.split('.')[1];
            setUserInfo(prev => ({
                ...prev,
                payment: {
                    ...prev.payment,
                    [paymentField]: value
                }
            }));
        } else {
            setUserInfo(prev => ({
                ...prev,
                [name]: value
            }));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        if (parts.length) {
            return parts.join(' ');
        } else {
            return v;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-600 mb-4">Your cart is empty</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16" style={{ backgroundColor: '#EDEAE4' }}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => router.push('/cart')}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                            <p className="text-gray-600">Complete your order securely</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Shipping Information */}
                            <div className="bg-white rounded-3xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <Truck className="w-6 h-6 text-blue-600" />
                                    Shipping Information
                                </h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <User className="w-4 h-4 inline mr-2" />
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={userInfo.firstName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.firstName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter first name"
                                        />
                                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={userInfo.lastName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.lastName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter last name"
                                        />
                                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="w-4 h-4 inline mr-2" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={userInfo.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter email address"
                                        />
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={userInfo.phone}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter phone number"
                                        />
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>
                                    
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <MapPin className="w-4 h-4 inline mr-2" />
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="shipping_address"
                                            value={userInfo.shipping_address}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.shipping_address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter street address"
                                        />
                                        {errors.shipping_address && <p className="text-red-500 text-sm mt-1">{errors.shipping_address}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={userInfo.city}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.city ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter city"
                                        />
                                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={userInfo.state}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.state ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter state"
                                        />
                                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={userInfo.zipCode}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.zipCode ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter ZIP code"
                                        />
                                        {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="bg-white rounded-3xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <CreditCard className="w-6 h-6 text-blue-600" />
                                    Payment Information
                                </h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                        <select
                                            name="payment.method"
                                            value={userInfo.payment.method}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="card">Credit/Debit Card</option>
                                            <option value="paypal">PayPal</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                        </select>
                                    </div>
                                    
                                    {userInfo.payment.method === "card" && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                                <input
                                                    type="text"
                                                    name="payment.card_number"
                                                    value={userInfo.payment.card_number}
                                                    onChange={(e) => {
                                                        const formatted = formatCardNumber(e.target.value);
                                                        handleInputChange({
                                                            target: {
                                                                name: 'payment.card_number',
                                                                value: formatted
                                                            }
                                                        });
                                                    }}
                                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        errors.card_number ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength="19"
                                                />
                                                {errors.card_number && <p className="text-red-500 text-sm mt-1">{errors.card_number}</p>}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        name="payment.expiry"
                                                        value={userInfo.payment.expiry}
                                                        onChange={(e) => {
                                                            const formatted = formatExpiry(e.target.value);
                                                            handleInputChange({
                                                                target: {
                                                                    name: 'payment.expiry',
                                                                    value: formatted
                                                                }
                                                            });
                                                        }}
                                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                            errors.expiry ? 'border-red-500' : 'border-gray-300'
                                                        }`}
                                                        placeholder="MM/YY"
                                                        maxLength="5"
                                                    />
                                                    {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                                    <div className="relative">
                                                        <input
                                                            type={showCVV ? "text" : "password"}
                                                            name="payment.cvv"
                                                            value={userInfo.payment.cvv}
                                                            onChange={handleInputChange}
                                                            className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                                errors.cvv ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                            placeholder="123"
                                                            maxLength="4"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowCVV(!showCVV)}
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                        >
                                                            {showCVV ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                        </button>
                                                    </div>
                                                    {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
                                                <input
                                                    type="text"
                                                    name="payment.name_on_card"
                                                    value={userInfo.payment.name_on_card}
                                                    onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                        errors.name_on_card ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                    placeholder="Enter name as it appears on card"
                                                />
                                                {errors.name_on_card && <p className="text-red-500 text-sm mt-1">{errors.name_on_card}</p>}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-6 h-6 text-green-600" />
                                    <div>
                                        <h3 className="font-semibold text-green-900">Secure Checkout</h3>
                                        <p className="text-sm text-green-700">Your payment information is encrypted and secure.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isProcessing || isCreatingOrder}
                                className="w-full px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-semibold"
                            >
                                {isProcessing || isCreatingOrder ? (
                                    <>
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-6 h-6" />
                                        Complete Order - ${cartTotal.toFixed(2)}
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-sm p-8 sticky top-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
                            
                            <div className="space-y-4 mb-6">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-semibold">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-semibold">$0.00</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Free shipping on all orders</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
