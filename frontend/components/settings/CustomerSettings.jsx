"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Lock, Bell, Shield, Trash2, Save, Edit3, Camera, Upload } from "lucide-react";
import { useUserProfileQuery } from "@/features/api/apiSlice";

export default function CustomerSettingsComponent({ authUser, router }) {
    const [activeTab, setActiveTab] = useState('account');
    const [isEditing, setIsEditing] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [profileData, setProfileData] = useState({
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
    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: false
    });

    const { data: profile, isLoading, refetch } = useUserProfileQuery(undefined, {
        skip: !authUser
    });

    useEffect(() => {
        if (profile) {
            setProfileData({
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

    const handleProfileSave = async () => {
        try {
            const formDataToSend = new FormData();
            
            // Add form data
            Object.keys(profileData).forEach(key => {
                if (profileData[key] !== null && profileData[key] !== undefined) {
                    formDataToSend.append(key, profileData[key]);
                }
            });
            
            // Add profile picture if selected
            if (profilePicture) {
                formDataToSend.append('profile_picture', profilePicture);
            }

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

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        alert('Password changed successfully!');
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    const handleNotificationChange = (setting) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deletion requested. Please contact support.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                            <p className="text-gray-600">Manage your account preferences and security</p>
                        </div>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="bg-white rounded-3xl shadow-sm p-8">
                    {/* Tabs */}
                    <div className="flex gap-2 mb-8">
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                                activeTab === 'account' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <User className="w-4 h-4 inline mr-2" />
                            Account
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                                activeTab === 'security' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <Lock className="w-4 h-4 inline mr-2" />
                            Security
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                                activeTab === 'notifications' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <Bell className="w-4 h-4 inline mr-2" />
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                                activeTab === 'privacy' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <Shield className="w-4 h-4 inline mr-2" />
                            Privacy
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'account' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>

                            {/* Profile Picture */}
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    {profilePicturePreview ? (
                                        <img
                                            src={profilePicturePreview}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-100">
                                            <User className="w-12 h-12 text-blue-600" />
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
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {profile?.first_name} {profile?.last_name}
                                    </h3>
                                    <p className="text-gray-600">{profile?.email}</p>
                                </div>
                            </div>

                            {/* Profile Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={profileData.first_name}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profileData.first_name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={profileData.last_name}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profileData.last_name}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profileData.email}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone_number"
                                            value={profileData.phone_number}
                                            onChange={handleProfileChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ) : (
                                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{profileData.phone_number || 'Not provided'}</p>
                                    )}
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleProfileSave}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                    <div>
                                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                        <p className="text-sm text-gray-600">Receive updates via email</p>
                                    </div>
                                    <button
                                        onClick={() => handleNotificationChange('emailNotifications')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            notificationSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                    <div>
                                        <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                                        <p className="text-sm text-gray-600">Receive updates via SMS</p>
                                    </div>
                                    <button
                                        onClick={() => handleNotificationChange('smsNotifications')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            notificationSettings.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            notificationSettings.smsNotifications ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                    <div>
                                        <h3 className="font-medium text-gray-900">Marketing Emails</h3>
                                        <p className="text-sm text-gray-600">Receive promotional content</p>
                                    </div>
                                    <button
                                        onClick={() => handleNotificationChange('marketingEmails')}
                                        className={`w-12 h-6 rounded-full transition-colors ${
                                            notificationSettings.marketingEmails ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                            notificationSettings.marketingEmails ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Privacy Tab */}
                    {activeTab === 'privacy' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
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
                                        Once you delete your account, there is no going back. Please be certain.
                                    </p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
