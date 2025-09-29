import { Key, Settings } from "lucide-react";

export default function RolesPermissionsHeader({ onManagePermissions }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Key className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
                        <p className="text-gray-600">Manage user roles and their access permissions</p>
                    </div>
                </div>
                <button
                    onClick={onManagePermissions}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    Manage Permissions
                </button>
            </div>
        </div>
    );
}
