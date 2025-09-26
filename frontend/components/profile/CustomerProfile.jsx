"use client";

import { useState, useEffect } from "react";
import { useUserProfileQuery } from "@/features/api/apiSlice";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, CreditCard, Edit3, Save, X, Upload, Camera, ShoppingBag, Heart, Package, Clock, Settings } from "lucide-react";

export default function CustomerProfileComponent({ authUser }) {
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
        skip: !authUser
    });

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

            if (response.ok) {
                alert('Profile updated successfully!');
                setIsEditing(false);
                refetch();
            } else {
                alert('Failed to update profile. Please try again.');
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
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {profile?.first_name} {profile?.last_name}
                                </h1>
                                <p className="text-gray-600">{profile?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            <Edit3 className="w-5 h-5" />
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{formData.first_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{formData.last_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="w-4 h-4 inline mr-2" />
                                        Email
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{formData.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{formData.phone_number || 'Not provided'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-2" />
                                        Shipping Address
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{formData.shipping_address || 'Not provided'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <CreditCard className="w-4 h-4 inline mr-2" />
                                        Billing Address
                                    </label>
                                    {isEditing ? (
                                        <textarea
                                            name="billing_address"
                                            value={formData.billing_address}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{formData.billing_address || 'Not provided'}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Payment Method</label>
                                    {isEditing ? (
                                        <select
                                            name="preferred_payment_method"
                                            value={formData.preferred_payment_method}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="">Select payment method</option>
                                            <option value="credit_card">Credit Card</option>
                                            <option value="debit_card">Debit Card</option>
                                            <option value="paypal">PayPal</option>
                                            <option value="bank_transfer">Bank Transfer</option>
                                        </select>
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{formData.preferred_payment_method || 'Not selected'}</p>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end gap-4 mt-6">
                                    <button
                                        onClick={handleCancel}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl shadow-sm p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                                    <span className="text-gray-700">Order History</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                                    <Heart className="w-5 h-5 text-red-600" />
                                    <span className="text-gray-700">Wishlist</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-xl transition-colors">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700">Settings</span>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-3xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Package className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Order #12345</p>
                                        <p className="text-xs text-gray-500">Delivered</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Order #12344</p>
                                        <p className="text-xs text-gray-500">Processing</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Added to Wishlist</p>
                                        <p className="text-xs text-gray-500">2 items</p>
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
