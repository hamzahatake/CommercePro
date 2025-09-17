"use client";

import Link from "next/link";
import { useRegisterUserMutation, useRegisterVendorMutation } from "@/features/api/apiSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { loginSuccess } from "@/features/auth/authSlice";

export default function RegistrationForm() {
    const [registerUser, { isLoading: userLoading, error: userError }] =
        useRegisterUserMutation();
    const [registerVendor, { isLoading: vendorLoading, error: vendorError }] =
        useRegisterVendorMutation();
    const dispatch = useDispatch();

    const [role, setRole] = useState("user");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [businessName, setBusinessName] = useState("");

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

            // ⚡ depends on backend:
            // If registration ALSO returns tokens:
            if (result.access && result.refresh) {
                dispatch(
                    loginSuccess({
                        user: result.user || null,
                        token: result.token,
                        refresh: result.refresh,
                    })
                );
            } else {
                // If only user is returned
                dispatch(
                    loginSuccess({
                        user: result,
                        token: null,
                        refresh: null,
                    })
                );
            }
        } catch (err) {
            console.error("Registration failed:", err?.data || err);
            alert(JSON.stringify(err?.data || err));
        }
    };

    const isLoading = userLoading || vendorLoading;
    const error = userError || vendorError;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {error && (
                    <p className="text-red-500 text-center mb-4">
                        {error?.data?.detail || "Registration failed"}
                    </p>
                )}

                <form
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    onSubmit={handleRegister}
                >
                    {role === "user" && (
                        <>
                            <div className="flex flex-col">
                                <label htmlFor="firstName" className="mb-1 font-medium">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="John"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="lastName" className="mb-1 font-medium">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    placeholder="Doe"
                                />
                            </div>
                        </>
                    )}

                    {role === "vendor" && (
                        <div className="flex flex-col md:col-span-2">
                            <label htmlFor="businessName" className="mb-1 font-medium">
                                Business Name
                            </label>
                            <input
                                type="text"
                                id="businessName"
                                value={businessName}
                                onChange={(e) => setBusinessName(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                                placeholder="Company Inc."
                            />
                        </div>
                    )}

                    <div className="flex flex-col">
                        <label htmlFor="username" className="mb-1 font-medium">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="johndoe"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="email" className="mb-1 font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1 font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="********"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="mb-1 font-medium">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="********"
                        />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label htmlFor="role" className="mb-1 font-medium">
                            Select Role
                        </label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                        >
                            <option value="user">User</option>
                            <option value="vendor">Vendor</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                            disabled={isLoading}
                        >
                            {isLoading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>

                <p className="text-sm text-center text-gray-500 mt-4">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-blue-600 font-medium cursor-pointer"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
