"use client";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, User, Lock, Bell, Settings, Save, Database } from "lucide-react";

export default function AdminSettings() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('account');
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [adminData, setAdminData] = useState({
        access_level: "admin",
        notes: ""
    });

    useEffect(() => {
        if (!isAuthenticated || authUser?.role !== 'admin') {
            router.push('/login');
        }
    }, [isAuthenticated, authUser, router]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAdminChange = (e) => {
        const { name, value } = e.target;
        setAdminData(prev => ({
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

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        alert('Admin profile updated successfully!');
    };

    if (!isAuthenticated || authUser?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-600 mb-4">Access denied. Admin privileges required.</p>
                    <a
                        href="/login"
                        className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#EDEAE4' }}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
                            <p className="text-gray-600">Manage your admin account and system preferences</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab('account')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'account'
                                        ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <User className="w-4 h-4 inline mr-3" />
                                Account
                            </button>
                            <button
                                onClick={() => setActiveTab('admin')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'admin'
                                        ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Shield className="w-4 h-4 inline mr-3" />
                                Admin Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'security'
                                        ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Lock className="w-4 h-4 inline mr-3" />
                                Security
                            </button>
                            <button
                                onClick={() => setActiveTab('system')}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${activeTab === 'system'
                                        ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Database className="w-4 h-4 inline mr-3" />
                                System
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
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
                                            value="Administrator"
                                            disabled
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-100"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'admin' && (
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Profile</h2>
                                <form onSubmit={handleAdminSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Access Level
                                        </label>
                                        <select
                                            name="access_level"
                                            value={adminData.access_level}
                                            onChange={handleAdminChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Admin Notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={adminData.notes}
                                            onChange={handleAdminChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Add any notes about this admin account..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Update Admin Profile
                                    </button>
                                </form>
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Change Password
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'system' && (
                            <div className="bg-white rounded-2xl shadow-sm p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Management</h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border border-gray-200 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Database Status</h3>
                                            <p className="text-sm text-gray-600 mb-4">Check system database health</p>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                Check Status
                                            </button>
                                        </div>
                                        <div className="border border-gray-200 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">System Logs</h3>
                                            <p className="text-sm text-gray-600 mb-4">View system activity logs</p>
                                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                                View Logs
                                            </button>
                                        </div>
                                        <div className="border border-gray-200 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Backup System</h3>
                                            <p className="text-sm text-gray-600 mb-4">Create system backup</p>
                                            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                                                Create Backup
                                            </button>
                                        </div>
                                        <div className="border border-gray-200 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cache Management</h3>
                                            <p className="text-sm text-gray-600 mb-4">Clear system cache</p>
                                            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                                Clear Cache
                                            </button>
                                        </div>
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
