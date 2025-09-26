"use client";

import Link from "next/link";
import { useLoginMutation } from "@/features/api/apiSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { loginSuccess } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Settings, Eye, EyeOff, Users } from "lucide-react";

export default function ManagerAdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [login] = useLoginMutation();
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await login({ email, password }).unwrap();
            
            // Check if user is a manager or admin
            if (result.user.role === 'manager' || result.user.role === 'admin') {
                dispatch(
                    loginSuccess({
                        user: result.user,
                        accessToken: result.tokens.access,
                        refreshToken: result.tokens.refresh,
                    })
                );
                
                // Redirect based on role
                if (result.user.role === 'manager') {
                    router.push('/manager/dashboard');
                } else if (result.user.role === 'admin') {
                    router.push('/admin/dashboard');
                }
            } else {
                alert("This login is for managers and administrators only. Please use the appropriate login page for your role.");
            }
        } catch (err) {
            console.error("Login failed:", err);
            alert("Login failed. Please check your credentials and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: "#EDEAE4" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="flex items-center gap-1">
                            <Settings className="w-6 h-6 text-purple-600" />
                            <Shield className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Login</h1>
                    <p className="text-gray-600">Access management and administrative dashboards</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                            placeholder="staff@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors pr-12"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Signing In...
                            </>
                        ) : (
                            <>
                                <Users className="w-5 h-5" />
                                Sign In
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-4">Role Information</p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-purple-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Settings className="w-4 h-4 text-purple-600" />
                                <span className="font-medium text-purple-800">Manager</span>
                            </div>
                            <p className="text-purple-600">Operations & Vendor Management</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Shield className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-red-800">Admin</span>
                            </div>
                            <p className="text-red-600">System Administration</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link 
                        href="/login" 
                        className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        ← Back to Login Options
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
