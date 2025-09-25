"use client";

import Link from "next/link";
import { useRegisterUserMutation, useRegisterVendorMutation } from "@/features/api/apiSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { loginSuccess } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserPlus, Store, Eye, EyeOff, User, Mail, Lock, Building } from "lucide-react";

export default function RegistrationForm() {
    const [registerUser, { isLoading: userLoading, error: userError }] =
        useRegisterUserMutation();
    const [registerVendor, { isLoading: vendorLoading, error: vendorError }] =
        useRegisterVendorMutation();
    const dispatch = useDispatch();
    const router = useRouter();

    const [role, setRole] = useState("user");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            let result;

            if (role === "user") {
                result = await registerUser({
                    username,
                    email,
                    password,
                    password_confirm: confirmPassword,
                    first_name: firstName,
                    last_name: lastName,
                }).unwrap();
            } else {
                result = await registerVendor({
                    username,
                    email,
                    password,
                    password_confirm: confirmPassword,
                    first_name: firstName,
                    last_name: lastName,
                    business_name: businessName,
                }).unwrap();
            }

            // Handle successful registration
            if (result.access && result.refresh) {
                dispatch(
                    loginSuccess({
                        user: result.user || null,
                        accessToken: result.access,
                        refreshToken: result.refresh,
                    })
                );
            } else {
                dispatch(
                    loginSuccess({
                        user: result,
                        accessToken: null,
                        refreshToken: null,
                    })
                );
            }

            // Redirect based on role
            if (role === "vendor") {
                router.push('/vendor/dashboard');
            } else {
                router.push('/products');
            }
        } catch (err) {
            console.error("Registration failed:", err?.data || err);
            alert(JSON.stringify(err?.data || err));
        }
    };

    const isLoading = userLoading || vendorLoading;
    const error = userError || vendorError;

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: "#EDEAE4" }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#000000" }}>
                            {role === "vendor" ? (
                                <Store className="h-8 w-8 text-white" />
                            ) : (
                                <UserPlus className="h-8 w-8 text-white" />
                            )}
                        </div>
                    </div>
                    <h2 className="text-3xl font-light mb-2" style={{ color: "#1A1A1A" }}>
                        Create Account
                    </h2>
                    <p className="text-sm" style={{ color: "#555555" }}>
                        Join as a {role === "vendor" ? "vendor" : "customer"}
                    </p>
                </div>

                {/* Role Selection */}
                <div className="mb-8">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setRole("user")}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${role === "user"
                                    ? "bg-white text-black shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <User className="h-4 w-4" />
                                Customer
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole("vendor")}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${role === "vendor"
                                    ? "bg-white text-black shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Store className="h-4 w-4" />
                                Vendor
                            </div>
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm text-center">
                            {error?.data?.detail || "Registration failed"}
                        </p>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleRegister}>
                    {/* Name Fields */}
                    {role === "user" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                                    placeholder="Enter your first name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                                    placeholder="Enter your last name"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Business Name for Vendors */}
                    {role === "vendor" && (
                        <div>
                            <label htmlFor="businessName" className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                                Business Name
                            </label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    id="businessName"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                                    placeholder="Enter your business name"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Username */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                            Username
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                                placeholder="Create a password"
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

                    {/* Confirm Password */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: "#1A1A1A" }}>
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-colors"
                                placeholder="Confirm your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "#000000" }}
                    >
                        {isLoading ? "Creating Account..." : `Create ${role === "vendor" ? "Vendor" : "Customer"} Account`}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 space-y-4">
                    <div className="text-center">
                        <Link
                            href="/login/customer"
                            className="text-sm hover:underline"
                            style={{ color: "#555555" }}
                        >
                            Already have a customer account? Sign in
                        </Link>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/login/vendor"
                            className="text-sm hover:underline"
                            style={{ color: "#555555" }}
                        >
                            Already have a vendor account? Sign in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
