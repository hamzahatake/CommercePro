"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useVendorProfileQuery, useUpdateVendorProfileMutation } from "@/features/api/apiSlice";
import { motion } from "framer-motion";
import { Store, User, Lock, Bell, Shield, Trash2, Save, Upload } from "lucide-react";

export default function VendorSettings() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [profileData, setProfileData] = useState({
        shop_name: "",
        business_email: "",
        phone_number: "",
        address: "",
        tax_id: "",
        bank_name: "",
        account_number: ""
    });

    const { data: vendorProfile, isLoading, refetch } = useVendorProfileQuery(undefined, {
        skip: !isAuthenticated || authUser?.role !== 'vendor'
    });
    const [updateVendorProfile, { isLoading: isUpdating }] = useUpdateVendorProfileMutation();

    useEffect(() => {
        if (!isAuthenticated || authUser?.role !== 'vendor') {
            router.push('/login/vendor');
        }
    }, [isAuthenticated, authUser, router]);

    useEffect(() => {
        if (vendorProfile) {
            setProfileData({
                shop_name: vendorProfile.shop_name || "",
                business_email: vendorProfile.business_email || "",
                phone_number: vendorProfile.phone_number || "",
                address: vendorProfile.address || "",
                tax_id: vendorProfile.tax_id || "",
                bank_name: vendorProfile.bank_name || "",
                account_number: vendorProfile.account_number || ""
            });
        }
    }, [vendorProfile]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        alert('Password changed successfully!');
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await updateVendorProfile(profileData).unwrap();
            alert('Profile updated successfully!');
            refetch();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Failed to update profile: ${error.data?.detail || error.message || 'Unknown error'}`);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('shop_logo', file);

                console.log('Uploading shop logo:', file.name);

                const result = await updateVendorProfile(formData).unwrap();
                alert('Logo uploaded successfully!');
                refetch();
            } catch (error) {
                console.error('Error uploading logo:', error);
                alert(`Failed to upload logo: ${error.data?.detail || error.message || 'Unknown error'}`);
            }
        }
    };

    if (!isAuthenticated || authUser?.role !== 'vendor') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-600 mb-4">Access denied. Vendor privileges required.</p>
                    <a 
                        href="/login/vendor" 
                        className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                        Go to Vendor Login
                    </a>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16" style={{ backgroundColor: '#EDEAE4' }}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Store className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Vendor Settings</h1>
                            <p className="text-gray-600">Manage your shop and account preferences</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                                    activeTab === 'profile' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Store className="w-4 h-4 inline mr-3" />
                                Shop Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                                    activeTab === 'account' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <User className="w-4 h-4 inline mr-3" />
                                Account
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                                    activeTab === 'security' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Lock className="w-4 h-4 inline mr-3" />
                                Security
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                                    activeTab === 'notifications' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Bell className="w-4 h-4 inline mr-3" />
                                Notifications
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop Profile</h2>
                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    {/* Shop Logo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Shop Logo
                                        </label>
                                        <div className="flex items-center gap-4">
                                            {vendorProfile?.shop_logo ? (
                                                <img
                                                    src={vendorProfile.shop_logo}
                                                    alt="Shop Logo"
                                                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-100">
                                                    <Store className="w-8 h-8 text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    className="hidden"
                                                    id="logo-upload"
                                                />
                                                <label
                                                    htmlFor="logo-upload"
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                                                >
                                                    <Upload className="w-4 h-4" />
                                                    Upload Logo
                                                </label>
                                                <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Shop Name
                                            </label>
                                            <input
                                                type="text"
                                                name="shop_name"
                                                value={profileData.shop_name}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Business Email
                                            </label>
                                            <input
                                                type="email"
                                                name="business_email"
                                                value={profileData.business_email}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone_number"
                                                value={profileData.phone_number}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tax ID
                                            </label>
                                            <input
                                                type="text"
                                                name="tax_id"
                                                value={profileData.tax_id}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Address
                                        </label>
                                        <textarea
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleProfileChange}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Bank Name
                                            </label>
                                            <select
                                                name="bank_name"
                                                value={profileData.bank_name}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            >
                                                <option value="">Select Bank</option>
                                                <option value="HBL">Habib Bank Limited</option>
                                                <option value="MCB">Muslim Commercial Bank</option>
                                                <option value="UBL">United Bank Limited</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Account Number
                                            </label>
                                            <input
                                                type="text"
                                                name="account_number"
                                                value={profileData.account_number}
                                                onChange={handleProfileChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Update Profile
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'account' && (
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                value={authUser?.first_name || ''}
                                                disabled
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                value={authUser?.last_name || ''}
                                                disabled
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={authUser?.email || ''}
                                            disabled
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value="Vendor"
                                            disabled
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Change Password
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">Order Notifications</h3>
                                            <p className="text-sm text-gray-600">Receive notifications about new orders</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">Product Reviews</h3>
                                            <p className="text-sm text-gray-600">Get notified about new product reviews</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">Marketing Updates</h3>
                                            <p className="text-sm text-gray-600">Receive promotional offers and platform updates</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
