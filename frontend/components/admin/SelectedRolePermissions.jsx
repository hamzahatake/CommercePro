import { Shield, Lock, AlertCircle, Plus } from "lucide-react";

const roles = [
    {
        name: 'Vendor',
        value: 'vendor',
        description: 'Sellers who can manage their shop, add products, and handle orders',
        color: 'bg-green-100 text-green-700',
        icon: Shield
    },
    {
        name: 'Manager',
        value: 'manager',
        description: 'Staff members who oversee vendors and manage operations',
        color: 'bg-purple-100 text-purple-700',
        icon: Shield
    },
    {
        name: 'Admin',
        value: 'admin',
        description: 'System administrators with full access to all features',
        color: 'bg-red-100 text-red-700',
        icon: Shield
    }
];

export default function SelectedRolePermissions({ 
    selectedRole, 
    rolePermissions, 
    isLoadingPermissions, 
    onAssignPermissions 
}) {
    const role = roles.find(r => r.value === selectedRole);
    const IconComponent = role?.icon || Shield;

    return (
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        role?.color?.split(' ')[0] || 'bg-gray-100'
                    }`}>
                        <IconComponent className={`w-6 h-6 ${role?.color?.split(' ')[1] || 'text-gray-600'}`} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {role?.name} Permissions
                        </h2>
                        <p className="text-gray-600">
                            Current permissions assigned to the {selectedRole} role
                        </p>
                    </div>
                </div>
            </div>

            {isLoadingPermissions ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading permissions...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Assigned Permissions ({rolePermissions.permissions?.length || 0})
                    </h3>
                    
                    {rolePermissions.permissions && Array.isArray(rolePermissions.permissions) && rolePermissions.permissions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rolePermissions.permissions.map((permission) => (
                                <div key={permission.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{permission.name}</h4>
                                        <p className="text-sm text-gray-600">{permission.codename}</p>
                                        {permission.description && (
                                            <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Permissions Assigned</h3>
                            <p className="text-gray-600 mb-4">
                                This role currently has no permissions assigned. 
                                Click "Manage Permissions" to assign permissions to this role.
                            </p>
                            <button
                                onClick={onAssignPermissions}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors mx-auto"
                            >
                                <Plus className="w-5 h-5" />
                                Assign Permissions
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
