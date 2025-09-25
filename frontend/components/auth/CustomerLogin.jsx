"use client";

import Link from "next/link";
import { useLoginMutation } from "@/features/api/apiSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { loginSuccess } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Eye, EyeOff } from "lucide-react";

export default function CustomerLogin() {
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
            
            // Check if user is a customer (role should be 'customer' or 'user')
            if (result.user.role === 'customer' || result.user.role === 'user') {
                dispatch(
                    loginSuccess({
                        user: result.user,
                        accessToken: result.tokens.access,
                        refreshToken: result.tokens.refresh,
                    })
                );
                
                // Redirect to profile page after successful login
                router.push('/profile');
            } else {
                alert("This login is for customers only. Please use the vendor login if you're a vendor.");
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
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#000000" }}>
                            <ShoppingBag className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-light mb-2" style={{ color: "#1A1A1A" }}>
                        Customer Login
                    </h2>
                    <p className="text-sm" style={{ color: "#555555" }}>
                        Sign in to your customer account
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors pr-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "#000000" }}
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 space-y-4">
                    <div className="text-center">
                        <Link
                            href="/login/vendor"
                            className="text-sm hover:underline"
                            style={{ color: "#555555" }}
                        >
                            Are you a vendor? Sign in here
                        </Link>
                    </div>
                    
                    <div className="text-center">
                        <Link
                            href="/registration"
                            className="text-sm hover:underline"
                            style={{ color: "#555555" }}
                        >
                            Don't have an account? Register
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
