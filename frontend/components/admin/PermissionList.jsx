import { CheckCircle, Circle, Users } from "lucide-react";

export default function PermissionList({ 
    title, 
    permissions, 
    selectedPermissions, 
    onPermissionToggle 
}) {
    return (
        <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {title} ({permissions.length})
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
                {permissions.map((permission) => {
                    const isSelected = selectedPermissions.includes(permission.id);
                    return (
                        <div
                            key={permission.id}
                            onClick={() => onPermissionToggle(permission.id)}
                            className="flex items-center gap-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex-shrink-0">
                                {isSelected ? (
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{permission.name}</h4>
                                <p className="text-sm text-gray-600">{permission.codename}</p>
                                {permission.description && (
                                    <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
