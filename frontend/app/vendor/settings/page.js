"use client";

import VendorSettingsComponent from "@/components/vendor/VendorSettings";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VendorSettings() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || authUser?.role !== 'vendor') {
            router.push('/login/vendor');
        }
    }, [isAuthenticated, authUser, router]);

    if (!isAuthenticated || authUser?.role !== 'vendor') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-600 mb-4">Access denied. Vendor privileges required.</p>
                    <a 
                        href="/login/vendor" 
                        className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                        Go to Vendor Login
                    </a>
                </div>
            </div>
        );
    }

    return <VendorSettingsComponent authUser={authUser} />;
}
