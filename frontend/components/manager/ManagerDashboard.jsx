"use client";

import { Settings, Users, Store, BarChart3, LogOut } from "lucide-react";
import { motion } from "framer-motion";

export default function ManagerDashboardComponent({ authUser, handleLogout }) {
    return (
        <div className="min-h-screen" style={{ backgroundColor: '#EDEAE4' }}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                                <Settings className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
                                <p className="text-gray-600">Welcome back, {authUser?.first_name} {authUser?.last_name}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl shadow-sm p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Assigned Vendors</h3>
                                <p className="text-3xl font-bold text-blue-600">0</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-sm p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Store className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Active Shops</h3>
                                <p className="text-3xl font-bold text-green-600">0</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl shadow-sm p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Pending Reviews</h3>
                                <p className="text-3xl font-bold text-yellow-600">0</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl shadow-sm p-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Settings className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Department</h3>
                                <p className="text-sm text-gray-600">Sales</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Assigned Vendors */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl shadow-sm p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Assigned Vendors</h2>
                        <div className="text-center py-8">
                            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No vendors assigned yet</p>
                            <p className="text-sm text-gray-400 mt-2">Contact admin to get vendor assignments</p>
                        </div>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-2xl shadow-sm p-6"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
                        <div className="text-center py-8">
                            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No recent activity</p>
                            <p className="text-sm text-gray-400 mt-2">Activity will appear here as you work</p>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white rounded-2xl shadow-sm p-6 mt-8"
                >
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                            <Users className="w-6 h-6 text-blue-600 mb-2" />
                            <h3 className="font-semibold text-gray-900">Manage Vendors</h3>
                            <p className="text-sm text-gray-600">View and manage assigned vendors</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                            <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
                            <h3 className="font-semibold text-gray-900">View Reports</h3>
                            <p className="text-sm text-gray-600">Access performance reports</p>
                        </button>
                        <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
                            <Settings className="w-6 h-6 text-purple-600 mb-2" />
                            <h3 className="font-semibold text-gray-900">Settings</h3>
                            <p className="text-sm text-gray-600">Manage your profile and preferences</p>
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
