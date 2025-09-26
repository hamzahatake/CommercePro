"use client";

import { useAuth } from "../auth/AuthProvider";
import { motion } from "framer-motion";
import { Store, Package, Users, DollarSign, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VendorDashboard() {
    const { user } = useAuth();
    const router = useRouter();

    const handleAddProduct = () => {
        router.push('/vendor/products/create');
    };

    const handleManageStore = () => {
        router.push('/vendor/settings');
    };

    const handleViewOrders = () => {
        router.push('/vendor/orders');
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#EDEAE4" }}>
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-light mb-2" style={{ color: "#1A1A1A" }}>
                        Vendor Dashboard
                    </h1>
                    <p className="text-lg" style={{ color: "#555555" }}>
                        Welcome back, {user?.first_name}! Manage your store and products.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium" style={{ color: "#555555" }}>Total Products</p>
                                <p className="text-3xl font-bold" style={{ color: "#1A1A1A" }}>24</p>
                            </div>
                            <Package className="h-8 w-8 text-green-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium" style={{ color: "#555555" }}>Total Sales</p>
                                <p className="text-3xl font-bold" style={{ color: "#1A1A1A" }}>$12,450</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-2xl p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium" style={{ color: "#555555" }}>Orders</p>
                                <p className="text-3xl font-bold" style={{ color: "#1A1A1A" }}>156</p>
                            </div>
                            <Users className="h-8 w-8 text-green-600" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-2xl p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium" style={{ color: "#555555" }}>Store Status</p>
                                <p className="text-lg font-bold text-green-600">Active</p>
                            </div>
                            <Store className="h-8 w-8 text-green-600" />
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-2xl p-8 shadow-sm"
                    >
                        <h3 className="text-xl font-medium mb-6" style={{ color: "#1A1A1A" }}>
                            Quick Actions
                        </h3>
                        <div className="space-y-4">
                            <button 
                                onClick={handleAddProduct}
                                className="w-full py-3 px-4 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-left flex items-center gap-3"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Add New Product</span>
                            </button>
                            <button 
                                onClick={handleManageStore}
                                className="w-full py-3 px-4 rounded-lg border border-green-300 hover:bg-green-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <Store className="h-5 w-5 text-green-600" />
                                    <span className="text-green-700">Manage Store Settings</span>
                                </div>
                            </button>
                            <button 
                                onClick={handleViewOrders}
                                className="w-full py-3 px-4 rounded-lg border border-green-300 hover:bg-green-50 transition-colors text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="h-5 w-5 text-green-600" />
                                    <span className="text-green-700">View Orders</span>
                                </div>
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-2xl p-8 shadow-sm"
                    >
                        <h3 className="text-xl font-medium mb-6" style={{ color: "#1A1A1A" }}>
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm">New order received</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm">Product updated</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm">Low stock alert</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
