"use client"

import { useUserProfileQuery } from "@/features/api/apiSlice";
import { logout } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ProfilePic = "https://mir-s3-cdn-cf.behance.net/user/230/38a1b71463912565.68c900e45bc03.jpg";

export default function UserProfile() {
    const { data: user, isLoading, isError, error } = useUserProfileQuery();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const dispatch = useDispatch();

    useEffect(() => {
        if (error && error.status === 401 && isAuthenticated) {
            dispatch(logout());
        }
    }, [error, dispatch, isAuthenticated]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-3xl">

                {isLoading && <p>Loading...</p>}
                {isError && <p>Error... Retry</p>}

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={ProfilePic}
                            alt="User Avatar"
                            className="w-28 h-28 rounded-full object-cover border-4 border-gray-200"
                        />
                        <div>
                            {user && (
                                <h2 className="text-2xl font-bold">{user.first_name}</h2>
                            )}
                            {user && (
                                <p className="text-gray-500">@{user.username}</p>
                            )}
                        </div>
                    </div>

                    <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
                        Edit Profile
                    </button>
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                        onClick={() => dispatch(logout())}>
                        Logout
                    </button>
                </div>

                {/* Profile Details */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">Personal Info</h3>
                        {user &&
                            (<p><span className="font-medium">Name:</span> {user.first_name}</p>)}
                        {user &&
                            (<p><span className="font-medium">Email:</span> {user.email}</p>)}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                        <h3 className="font-semibold text-lg mb-2">Shipping Address</h3>
                        <p>123 Main Street</p>
                        <p>Los Angeles, CA 90001</p>
                        <p>United States</p>
                    </div>
                </div>

                {/* Order History */}
                <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">Order ID</th>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Status</th>
                                    <th className="px-4 py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="px-4 py-2">#12345</td>
                                    <td className="px-4 py-2">Sep 10, 2025</td>
                                    <td className="px-4 py-2 text-green-600 font-medium">Delivered</td>
                                    <td className="px-4 py-2 font-semibold">$120</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="px-4 py-2">#12344</td>
                                    <td className="px-4 py-2">Aug 29, 2025</td>
                                    <td className="px-4 py-2 text-yellow-600 font-medium">Pending</td>
                                    <td className="px-4 py-2 font-semibold">$80</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}