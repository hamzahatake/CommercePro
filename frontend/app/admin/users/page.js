"use client";

import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UsersManagement from "@/components/admin/UsersManagement";

export default function UserManagementPage() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || authUser?.role !== 'admin') {
            router.push('/login');
        }
    }, [isAuthenticated, authUser, router]);

    if (!isAuthenticated || authUser?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-600 mb-4">Access denied. Admin privileges required.</p>
                    <a 
                        href="/login" 
                        className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return <UsersManagement />;
}