"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import AdminLoadingState from "./AdminLoadingState";
import AdminAccessDenied from "./AdminAccessDenied";

export default function AdminLayout({ children }) {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState({
        users: false,
        system: false
    });
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && (!isAuthenticated || authUser?.role !== 'admin')) {
            router.push('/login');
        }
    }, [isAuthenticated, authUser, router, isClient]);

    const toggleMenu = (menu) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const isActive = (path) => {
        return pathname === path;
    };

    // Show loading state during hydration to prevent mismatch
    if (!isClient) {
        return <AdminLoadingState />;
    }

    if (!isAuthenticated || authUser?.role !== 'admin') {
        return <AdminAccessDenied />;
    }

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: '#EDEAE4' }}>
            <AdminSidebar 
                sidebarOpen={sidebarOpen}
                expandedMenus={expandedMenus}
                pathname={pathname}
                isActive={isActive}
                onToggleMenu={toggleMenu}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <AdminTopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                {/* Page Content */}
                <div className="flex-1 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
