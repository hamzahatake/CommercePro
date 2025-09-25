"use client"

import { useVendorProfileQuery } from "@/features/api/apiSlice";
import { logout } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Edit3, Settings, Store, Mail, Phone, MapPin, CreditCard, Building, CheckCircle, XCircle } from "lucide-react";

export default function VendorProfile() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const dispatch = useDispatch();

    // Only make the API call if user is authenticated and is a vendor
    const { data: vendorProfile, isLoading, isError, error } = useVendorProfileQuery(undefined, {
        skip: !isAuthenticated || authUser?.role !== 'vendor'
    });

    useEffect(() => {
        if (error && error.status === 401 && isAuthenticated) {
            dispatch(logout());
        }
    }, [error, dispatch, isAuthenticated]);

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-600 mb-4">Please log in to view your vendor profile</p>
                    <a 
                        href="/login/vendor" 
                        className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                        Go to Vendor Login
                    </a>
                </div>
            </div>
        );
    }

    // If not a vendor, show error
    if (authUser?.role !== 'vendor') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-600 mb-4">This page is for vendors only</p>
                    <a 
                        href="/profile" 
                        className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                        Go to Profile
                    </a>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Loading your vendor profile...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-red-600 mb-4">Error loading vendor profile</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#ECE9E2' }}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start lg:justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                {vendorProfile?.shop_logo ? (
                                    <img
                                        src={vendorProfile.shop_logo}
                                        alt="Shop Logo"
                                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-100"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-100">
                                        <Store className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                                    vendorProfile?.approved ? 'bg-green-500' : 'bg-yellow-500'
                                }`}>
                                    {vendorProfile?.approved ? (
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-white" />
                                    )}
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                    {vendorProfile?.shop_name || 'Unnamed Shop'}
                                </h1>
                                <p className="text-gray-500 text-lg">
                                    {authUser?.first_name} {authUser?.last_name}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        vendorProfile?.approved 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {vendorProfile?.approved ? 'Approved Vendor' : 'Pending Approval'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors">
                                <Edit3 className="w-4 h-4" />
                                Edit Profile
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors">
                                <Settings className="w-4 h-4" />
                                Settings
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Business Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Business Information */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Store className="w-5 h-5 text-gray-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Shop Name</label>
                                        <p className="text-lg text-gray-900 mt-1">{vendorProfile?.shop_name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Business Email</label>
                                        <p className="text-lg text-gray-900 mt-1 flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            {vendorProfile?.business_email || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone Number</label>
                                        <p className="text-lg text-gray-900 mt-1 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            {vendorProfile?.phone_number || 'Not provided'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tax ID</label>
                                        <p className="text-lg text-gray-900 mt-1">{vendorProfile?.tax_id || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-gray-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Address Information</h2>
                            </div>
                            
                            <div className="bg-gray-50 rounded-2xl p-6">
                                <p className="text-lg text-gray-900 font-medium">
                                    {vendorProfile?.address || 'Address not provided'}
                                </p>
                                <button className="mt-4 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                                    Update Address
                                </button>
                            </div>
                        </div>

                        {/* Banking Information */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-gray-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Banking Information</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Bank Name</label>
                                    <p className="text-lg text-gray-900 mt-1 flex items-center gap-2">
                                        <Building className="w-4 h-4" />
                                        {vendorProfile?.bank_name || 'Not provided'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Account Number</label>
                                    <p className="text-lg text-gray-900 mt-1">{vendorProfile?.account_number || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Quick Stats & Actions */}
                    <div className="space-y-8">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Products</span>
                                    <span className="text-2xl font-bold text-gray-900">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Orders</span>
                                    <span className="text-2xl font-bold text-gray-900">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Revenue</span>
                                    <span className="text-2xl font-bold text-gray-900">$0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Member Since</span>
                                    <span className="text-2xl font-bold text-gray-900">2024</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                            <div className="space-y-3">
                                <a 
                                    href="/vendor/dashboard" 
                                    className="block w-full text-center py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors">
                                    Go to Dashboard
                                </a>
                                <a 
                                    href="/vendor/products" 
                                    className="block w-full text-center py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors">
                                    Manage Products
                                </a>
                                <a 
                                    href="/vendor/orders" 
                                    className="block w-full text-center py-3 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors">
                                    View Orders
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
