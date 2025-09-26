"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Lock, Bell, Shield, Trash2, Save, Building } from "lucide-react";

export default function ManagerSettingsComponent({ authUser }) {
    const [activeTab, setActiveTab] = useState('account');
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [profileData, setProfileData] = useState({
        department: "sales",
        phone_number: "",
        permissions_level: "basic"
    });

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
        alert('Profile updated successfully!');
    };

    return (
        <div className="min-h-screen pt-16" style={{ backgroundColor: '#EDEAE4' }}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                            <Settings className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Manager Settings</h1>
                            <p className="text-gray-600">Manage your account and preferences</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                                    activeTab === 'account' 
                                        ? 'bg-purple-100 text-purple-700' 
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
                                        ? 'bg-purple-100 text-purple-700' 
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
                                        ? 'bg-purple-100 text-purple-700' 
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
                                        ? 'bg-purple-100 text-purple-700' 
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
                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900">Account Information</h2>
                                    
                                    <form onSubmit={handleProfileSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                                <select
                                                    name="department"
                                                    value={profileData.department}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                >
                                                    <option value="sales">Sales</option>
                                                    <option value="marketing">Marketing</option>
                                                    <option value="operations">Operations</option>
                                                    <option value="finance">Finance</option>
                                                    <option value="hr">Human Resources</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone_number"
                                                    value={profileData.phone_number}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions Level</label>
                                                <select
                                                    name="permissions_level"
                                                    value={profileData.permissions_level}
                                                    onChange={handleProfileChange}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                >
                                                    <option value="basic">Basic</option>
                                                    <option value="intermediate">Intermediate</option>
                                                    <option value="advanced">Advanced</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center gap-2"
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
                                                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                                <p className="text-sm text-gray-600">Receive updates via email</p>
                                            </div>
                                            <button className="w-12 h-6 bg-purple-600 rounded-full">
                                                <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                            <div>
                                                <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                                                <p className="text-sm text-gray-600">Receive updates via SMS</p>
                                            </div>
                                            <button className="w-12 h-6 bg-gray-300 rounded-full">
                                                <div className="w-5 h-5 bg-white rounded-full translate-x-0.5" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                                            <div>
                                                <h3 className="font-medium text-gray-900">System Alerts</h3>
                                                <p className="text-sm text-gray-600">Receive system-wide alerts</p>
                                            </div>
                                            <button className="w-12 h-6 bg-purple-600 rounded-full">
                                                <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
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
                                                Once you delete your account, there is no going back. Please be certain.
                                            </p>
                                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                                Delete Account
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
