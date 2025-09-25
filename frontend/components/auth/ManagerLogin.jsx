"use client";

import Link from "next/link";
import { useLoginMutation } from "@/features/api/apiSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { loginSuccess } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Settings, Eye, EyeOff } from "lucide-react";

export default function ManagerLogin() {
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
            
            // Check if user is a manager
            if (result.user.role === 'manager') {
                dispatch(
                    loginSuccess({
                        user: result.user,
                        accessToken: result.tokens.access,
                        refreshToken: result.tokens.refresh,
                    })
                );
                
                // Redirect to manager dashboard
                router.push('/manager/dashboard');
            } else {
                alert("This login is for managers only. Please use the appropriate login page for your role.");
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
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Manager Login</h1>
                    <p className="text-gray-600">Access the management dashboard</p>
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
                            placeholder="manager@example.com"
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
                        className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Signing In..." : "Sign In as Manager"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 mb-4">Need access? Contact the system administrator.</p>
                    <div className="space-y-2">
                        <Link 
                            href="/login" 
                            className="block text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            Back to Login Options
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
