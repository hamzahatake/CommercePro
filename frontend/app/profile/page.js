"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserProfileQuery } from "@/features/api/apiSlice";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, CreditCard, Edit3, Save, X, Upload, Camera, ShoppingBag, Heart, Package, Clock, Settings } from "lucide-react";

export default function CustomerProfile() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        shipping_address: "",
        billing_address: "",
        preferred_payment_method: ""
    });
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);

    const { data: profile, isLoading, refetch } = useUserProfileQuery(undefined, {
        skip: !isAuthenticated
    });

    useEffect(() => {
        if (!isAuthenticated || authUser?.role !== 'customer') {
            router.push('/login/customer');
        }
    }, [isAuthenticated, authUser, router]);

    useEffect(() => {
        if (profile) {
            setFormData({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                email: profile.email || "",
                phone_number: profile.phone_number || "",
                shipping_address: profile.shipping_address || "",
                billing_address: profile.billing_address || "",
                preferred_payment_method: profile.preferred_payment_method || ""
            });
            if (profile.profile_picture) {
                setProfilePicturePreview(profile.profile_picture);
            }
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePicturePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const formDataToSend = new FormData();
            
            // Add form data
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    formDataToSend.append(key, formData[key]);
                }
            });
            
            // Add profile picture if selected
            if (profilePicture) {
                formDataToSend.append('profile_picture', profilePicture);
                console.log('Adding profile picture:', profilePicture.name);
            }

            console.log('Sending form data:', Object.fromEntries(formDataToSend.entries()));

            const response = await fetch('http://localhost:8000/api/users/api/profile/customer/', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: formDataToSend,
            });

            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (response.ok) {
                alert('Profile updated successfully!');
                setIsEditing(false);
                refetch();
            } else {
                alert(`Failed to update profile: ${responseData.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form data to original values
        if (profile) {
            setFormData({
                first_name: profile.first_name || "",
                last_name: profile.last_name || "",
                email: profile.email || "",
                phone_number: profile.phone_number || "",
                shipping_address: profile.shipping_address || "",
                billing_address: profile.billing_address || "",
                preferred_payment_method: profile.preferred_payment_method || ""
            });
        }
        // Reset profile picture changes
        setProfilePicture(null);
        setProfilePicturePreview(profile?.profile_picture || null);
    };

    if (!isAuthenticated || authUser?.role !== 'customer') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-600 mb-4">Access denied. Customer privileges required.</p>
                    <a 
                        href="/login/customer" 
                        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                        Go to Customer Login
                    </a>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16" style={{ backgroundColor: '#EDEAE4' }}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                {profilePicturePreview ? (
                                    <img
                                        src={profilePicturePreview}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-100">
                                        <User className="w-10 h-10 text-blue-600" />
                                    </div>
                                )}
                                {isEditing && (
                                    <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                                        <Camera className="w-4 h-4 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleProfilePictureChange}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">
                                    Welcome back, {profile?.first_name || 'Customer'}!
                                </h1>
                                <p className="text-gray-600 text-lg">Manage your account and track your orders</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.push('/settings')}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                Settings
                            </button>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                <Edit3 className="w-4 h-4" />
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Quick Stats */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Total Orders</p>
                                        <p className="text-lg font-semibold text-gray-900">12</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                    <Package className="w-6 h-6 text-green-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Pending Orders</p>
                                        <p className="text-lg font-semibold text-gray-900">2</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                                    <Heart className="w-6 h-6 text-red-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Wishlist Items</p>
                                        <p className="text-lg font-semibold text-gray-900">8</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl shadow-sm p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push('/cart')}
                                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                                    <span className="text-gray-700">View Cart</span>
                                </button>
                                <button
                                    onClick={() => router.push('/wishlist')}
                                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    <Heart className="w-5 h-5 text-red-600" />
                                    <span className="text-gray-700">Wishlist</span>
                                </button>
                                <button
                                    onClick={() => router.push('/orders')}
                                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    <Package className="w-5 h-5 text-green-600" />
                                    <span className="text-gray-700">Order History</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                            
                            {isEditing ? (
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* First Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            />
                                        </div>

                                        {/* Last Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            />
                                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            />
                                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Shipping Address
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                name="shipping_address"
                                                value={formData.shipping_address}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            />
                                            <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Billing Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Billing Address
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                name="billing_address"
                                                value={formData.billing_address}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            />
                                            <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Preferred Payment Method */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Payment Method
                                        </label>
                                        <div className="relative">
                                            <select
                                                name="preferred_payment_method"
                                                value={formData.preferred_payment_method}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                            >
                                                <option value="">Select payment method</option>
                                                <option value="cash_on_delivery">Cash on Delivery</option>
                                                <option value="stripe">Stripe</option>
                                                <option value="paypal">PayPal</option>
                                                <option value="amazonpay">Amazon Pay</option>
                                            </select>
                                            <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <User className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Full Name</p>
                                                <p className="font-semibold text-gray-900">
                                                    {profile?.first_name} {profile?.last_name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <Mail className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Email</p>
                                                <p className="font-semibold text-gray-900">{profile?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <Phone className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p className="font-semibold text-gray-900">{profile?.phone_number || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <CreditCard className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <p className="text-sm text-gray-600">Payment Method</p>
                                                <p className="font-semibold text-gray-900">
                                                    {profile?.preferred_payment_method ? 
                                                        profile.preferred_payment_method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) 
                                                        : 'Not set'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {profile?.shipping_address && (
                                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                            <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-600">Shipping Address</p>
                                                <p className="font-semibold text-gray-900">{profile.shipping_address}</p>
                                            </div>
                                        </div>
                                    )}

                                    {profile?.billing_address && (
                                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                            <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                                            <div>
                                                <p className="text-sm text-gray-600">Billing Address</p>
                                                <p className="font-semibold text-gray-900">{profile.billing_address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}