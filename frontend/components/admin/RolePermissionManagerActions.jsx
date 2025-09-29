import { Save } from "lucide-react";

export default function RolePermissionManagerActions({ 
    isModified, 
    isAssigning, 
    selectedPermissionsCount, 
    onSave 
}) {
    return (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
                <span className="font-medium">{selectedPermissionsCount}</span> permissions selected
                {isModified && <span className="ml-2 text-orange-600">• Modified</span>}
            </div>
            <div className="flex gap-4">
                <button
                    onClick={onSave}
                    disabled={!isModified || isAssigning}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {isAssigning ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
