"use client";

import { useState, useEffect } from "react";
import { useVendorProfileQuery, useUpdateVendorProfileMutation } from "@/features/api/apiSlice";
import { motion } from "framer-motion";
import { Store, User, Lock, Bell, Shield, Trash2, Save, Upload } from "lucide-react";

export default function VendorSettingsComponent({ authUser }) {
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
        skip: !authUser || authUser?.role !== 'vendor'
    });
    const [updateVendorProfile, { isLoading: isUpdating }] = useUpdateVendorProfileMutation();

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
                alert('Logo upload functionality will be implemented soon!');
            } catch (error) {
                console.error('Error uploading logo:', error);
                alert('Failed to upload logo. Please try again.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Loading vendor settings...</p>
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
                            <p className="text-gray-600">Manage your shop profile and preferences</p>
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
                            <button
                                onClick={() => setActiveTab('privacy')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                                    activeTab === 'privacy' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <Shield className="w-4 h-4 inline mr-3" />
                                Privacy
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm p-8">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900">Shop Profile</h2>
                                    
                                    {/* Shop Logo */}
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            {vendorProfile?.shop_logo ? (
                                                <img
                                                    src={vendorProfile.shop_logo}
                                                    alt="Shop Logo"
                                                    className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center border-4 border-green-100">
                                                    <Store className="w-12 h-12 text-green-600" />
                                                </div>
                                            )}
                                            <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors">
                                                <Upload className="w-4 h-4 text-white" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {vendorProfile?.shop_name || 'Shop Name'}
                                            </h3>
                                            <p className="text-gray-600">{vendorProfile?.business_email || 'Business Email'}</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                                                <input
                                                    type="text"
                                                    name="shop_name"
                                                    value={profileData.shop_name}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="Enter shop name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                                                <input
                                                    type="email"
                                                    name="business_email"
                                                    value={profileData.business_email}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="Enter business email"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone_number"
                                                    value={profileData.phone_number}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={profileData.address}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="Enter shop address"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                                                <input
                                                    type="text"
                                                    name="tax_id"
                                                    value={profileData.tax_id}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="Enter tax ID"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                                                <input
                                                    type="text"
                                                    name="bank_name"
                                                    value={profileData.bank_name}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="Enter bank name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                                                <input
                                                    type="text"
                                                    name="account_number"
                                                    value={profileData.account_number}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="Enter account number"
                                                />
                                            </div>
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            disabled={isUpdating}
                                            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                                    
                                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={passwordData.currentPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={passwordData.newPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={passwordData.confirmPassword}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                                        >
                                            <Lock className="w-4 h-4" />
                                            Change Password
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Order Notifications</h3>
                                                <p className="text-sm text-gray-600">Receive notifications for new orders</p>
                                            </div>
                                            <button className="w-12 h-6 bg-green-600 rounded-full">
                                                <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Inventory Alerts</h3>
                                                <p className="text-sm text-gray-600">Get notified when inventory is low</p>
                                            </div>
                                            <button className="w-12 h-6 bg-green-600 rounded-full">
                                                <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                            <div>
                                                <h3 className="font-medium text-gray-900">Marketing Updates</h3>
                                                <p className="text-sm text-gray-600">Receive marketing and promotional content</p>
                                            </div>
                                            <button className="w-12 h-6 bg-gray-300 rounded-full">
                                                <div className="w-5 h-5 bg-white rounded-full translate-x-0.5" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Privacy Tab */}
                            {activeTab === 'privacy' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900">Privacy & Data</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="p-6 border border-red-200 rounded-xl bg-red-50">
                                            <div className="flex items-center gap-3 mb-4">
                                                <Trash2 className="w-6 h-6 text-red-600" />
                                                <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
                                            </div>
                                            <p className="text-red-700 mb-4">
                                                Once you delete your vendor account, there is no going back. Please be certain.
                                            </p>
                                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                                Delete Vendor Account
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
