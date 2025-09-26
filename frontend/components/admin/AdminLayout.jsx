"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    Shield, 
    Users, 
    UserPlus, 
    Edit, 
    Settings, 
    ChevronDown, 
    ChevronRight,
    Store,
    UserCheck,
    Key,
    Lock,
    Database,
    BarChart3,
    Home
} from "lucide-react";

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

    useEffect(() => {
        if (!isAuthenticated || authUser?.role !== 'admin') {
            router.push('/login');
        }
    }, [isAuthenticated, authUser, router]);

    const toggleMenu = (menu) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const isActive = (path) => {
        return pathname === path;
    };

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

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: '#EDEAE4' }}>
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-lg`}>
                <div className="p-6 mt-14">

                    {/* Navigation */}
                    <nav className="space-y-2">
                        {/* Dashboard */}
                        <Link
                            href="/admin/dashboard"
                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                isActive('/admin/dashboard')
                                    ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Home className="w-5 h-5" />
                            {sidebarOpen && <span>Dashboard</span>}
                        </Link>

                        {/* Users Management Dropdown */}
                        <div>
                            <button 
                                onClick={() => toggleMenu('users')}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                                    pathname.startsWith('/admin/users')
                                        ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5" />
                                    {sidebarOpen && <span>Manage Users</span>}
                                </div>
                                {sidebarOpen && (expandedMenus.users ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                            </button>
                            {expandedMenus.users && sidebarOpen && (
                                <div className="ml-6 mt-2 space-y-1">
                                    <Link
                                        href="/admin/users"
                                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                            isActive('/admin/users')
                                                ? 'bg-red-50 text-red-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>All Users</span>
                                    </Link>
                                    <Link
                                        href="/admin/users/create"
                                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                            isActive('/admin/users/create')
                                                ? 'bg-red-50 text-red-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>Add User</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* System Management Dropdown */}
                        <div>
                            <button 
                                onClick={() => toggleMenu('system')}
                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                                    pathname.startsWith('/admin/vendors') || 
                                    pathname.startsWith('/admin/managers') || 
                                    pathname.startsWith('/admin/roles')
                                        ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                                        : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5" />
                                    {sidebarOpen && <span>System Management</span>}
                                </div>
                                {sidebarOpen && (expandedMenus.system ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                            </button>
                            {expandedMenus.system && sidebarOpen && (
                                <div className="ml-6 mt-2 space-y-1">
                                    <Link
                                        href="/admin/roles"
                                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                            isActive('/admin/roles')
                                                ? 'bg-red-50 text-red-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>Roles & Permissions</span>
                                    </Link>
                                    <Link
                                        href="/admin/vendors"
                                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                            isActive('/admin/vendors')
                                                ? 'bg-red-50 text-red-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>Manage Vendors</span>
                                    </Link>
                                    <Link
                                        href="/admin/managers"
                                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                                            isActive('/admin/managers')
                                                ? 'bg-red-50 text-red-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span>Manage Managers</span>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        <Link
                            href="/admin/settings"
                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                isActive('/admin/settings')
                                    ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Settings className="w-5 h-5" />
                            {sidebarOpen && <span>Settings</span>}
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="bg-white shadow-sm p-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
