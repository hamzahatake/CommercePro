import { Shield, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SystemNavSection({ 
    expandedMenus, 
    sidebarOpen, 
    pathname, 
    isActive, 
    onToggleMenu 
}) {
    return (
        <div>
            <button 
                onClick={() => onToggleMenu('system')}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                    pathname.startsWith('/admin/vendors') || 
                    pathname.startsWith('/admin/managers') || 
                    pathname.startsWith('/admin/roles') ||
                    pathname.startsWith('/admin/permissions')
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
                        href="/admin/permissions"
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                            isActive('/admin/permissions')
                                ? 'bg-red-50 text-red-600'
                                : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        <span>Manage Permissions</span>
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
    );
}
