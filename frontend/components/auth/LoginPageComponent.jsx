"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { User, Store, Shield, Settings, Users } from "lucide-react";

export default function LoginPageComponent() {
    return (
        <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: "#EDEAE4" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl mx-4"
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome Back</h1>
                    <p className="text-gray-600 text-lg">Choose your login type to continue</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Customer Login */}
                    <Link 
                        href="/login/customer"
                        className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 transform hover:scale-105"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer</h3>
                            <p className="text-gray-600 text-sm">Shop and browse products</p>
                        </div>
                    </Link>

                    {/* Vendor Login */}
                    <Link 
                        href="/login/vendor"
                        className="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 hover:from-green-100 hover:to-green-200 transition-all duration-300 transform hover:scale-105"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                                <Store className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Vendor</h3>
                            <p className="text-gray-600 text-sm">Manage your shop and products</p>
                        </div>
                    </Link>

                    {/* Staff Login (Manager & Admin) */}
                    <Link 
                        href="/login/staff"
                        className="group bg-gradient-to-br from-purple-50 to-red-100 rounded-2xl p-6 hover:from-purple-100 hover:to-red-200 transition-all duration-300 transform hover:scale-105"
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-purple-600 group-hover:to-red-600 transition-colors">
                                <div className="flex items-center gap-1">
                                    <Settings className="w-6 h-6 text-white" />
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Staff</h3>
                            <p className="text-gray-600 text-sm">Manager & Admin access</p>
                        </div>
                    </Link>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-600 mb-4">Don't have an account?</p>
                    <div className="space-y-2">
                        <Link 
                            href="/registration" 
                            className="inline-block px-8 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                        >
                            Register as Customer/Vendor
                        </Link>
                        <p className="text-sm text-gray-500 mt-2">
                            Managers and admins are created by system administrators
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
