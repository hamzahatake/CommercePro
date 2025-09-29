import { Users, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function UsersNavSection({ 
    expandedMenus, 
    sidebarOpen, 
    pathname, 
    isActive, 
    onToggleMenu 
}) {
    return (
        <div>
            <button 
                onClick={() => onToggleMenu('users')}
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
    );
}
