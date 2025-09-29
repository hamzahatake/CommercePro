import { Lock, Edit, Trash2, Shield } from "lucide-react";

const roles = [
    { value: "vendor", label: "Vendor", icon: Shield, color: "bg-green-100 text-green-700" },
    { value: "manager", label: "Manager", icon: Shield, color: "bg-purple-100 text-purple-700" },
    { value: "admin", label: "Admin", icon: Shield, color: "bg-red-100 text-red-700" }
];

export default function AssignedPermissionsList({ 
    allRolePermissions, 
    isLoadingAllRolePermissions, 
    permissions,
    onEdit,
    onDelete 
}) {
    if (isLoadingAllRolePermissions) {
        return (
            <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Assigned Permissions</h2>
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading assigned permissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Assigned Permissions</h2>
            
            <div className="space-y-4">
                {Array.isArray(allRolePermissions) && allRolePermissions.length > 0 ? (
                    allRolePermissions.map((rolePermission) => {
                        const role = roles.find(r => r.value === rolePermission.role);
                        const IconComponent = role?.icon || Shield;
                        
                        return (
                            <div key={`${rolePermission.role}-${rolePermission.id}`} className="bg-gray-50 rounded-xl p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${role?.color?.split(' ')[0] || 'bg-gray-100'}`}>
                                                <IconComponent className={`w-4 h-4 ${role?.color?.split(' ')[1] || 'text-gray-600'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{rolePermission.permission_name}</h3>
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Role:</span> {rolePermission.role_display || rolePermission.role}
                                                    <span className="mx-2">•</span>
                                                    <span className="font-medium">Code:</span> {rolePermission.permission_codename}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 ml-11">
                                            Assigned on: {new Date(rolePermission.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const permission = permissions.find(p => p.id === rolePermission.permission);
                                                if (permission) {
                                                    onEdit(permission);
                                                }
                                            }}
                                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const permission = permissions.find(p => p.id === rolePermission.permission);
                                                if (permission) {
                                                    onDelete(permission);
                                                }
                                            }}
                                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Permissions Assigned</h3>
                        <p className="text-gray-600">
                            No permissions have been assigned to any roles yet. 
                            Use the role management buttons above to assign permissions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
