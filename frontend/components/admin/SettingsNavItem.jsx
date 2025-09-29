import { Settings } from "lucide-react";
import Link from "next/link";

export default function SettingsNavItem({ isActive, sidebarOpen }) {
    return (
        <Link
            href="/admin/settings"
            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                isActive
                    ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                    : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span>Settings</span>}
        </Link>
    );
}
