import { Key, Plus } from "lucide-react";

export default function PermissionHeader({ onCreatePermission }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Key className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-gray-900">Permission Management</h1>
                        <p className="text-gray-600">Manage system permissions and role assignments</p>
                    </div>
                </div>
                <button
                    onClick={onCreatePermission}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Permission
                </button>
            </div>
        </div>
    );
}
