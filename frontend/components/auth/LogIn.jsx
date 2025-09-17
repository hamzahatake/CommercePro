"use client";

import Link from "next/link";
import { useLoginMutation } from "@/features/api/apiSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { loginSuccess } from "@/features/auth/authSlice";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [login, { isLoading, isError, error }] = useLoginMutation();
    const dispatch = useDispatch();

    const handleLogIn = async (e) => {
        e.preventDefault();
        try {
            const result = await login({ username, password }).unwrap();
            console.log('Login result:', result);
            console.log('User in result:', result.user);
            dispatch(
                loginSuccess({
                    user: result.user,
                    accessToken: result.access,
                    refreshToken: result.refresh,
                })
            );
            console.log("Success")
            console.log(result)
        } catch (err) {
            console.error("Unsuccessful Login:", err);
            console.log("Failed Login")
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {isError && (
                    <p className="text-red-500 text-center mb-2">
                        {error || "Invalid username or password"}
                    </p>
                )}

                <form className="space-y-4" onSubmit={handleLogIn}>
                    <div className="flex flex-col">
                        <label htmlFor="username" className="mb-1 font-medium">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Goku123"
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="password" className="mb-1 font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="********"
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-500 mt-4">
                    Don't have an account?{" "}
                    <Link
                        href="/registration"
                        className="text-blue-600 font-medium cursor-pointer"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
