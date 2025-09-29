import { Home } from "lucide-react";
import Link from "next/link";

export default function DashboardNavItem({ isActive, sidebarOpen }) {
    return (
        <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                isActive
                    ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
            <Home className="w-5 h-5" />
            {sidebarOpen && <span>Dashboard</span>}
        </Link>
    );
}
