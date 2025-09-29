import { X, Save, AlertCircle } from "lucide-react";

export default function PermissionAssignmentPanel({ 
    showPanel, 
    selectedRole, 
    allPermissions, 
    selectedPermissions,
    isLoadingAllPermissions,
    isAssigning,
    onClose, 
    onPermissionToggle, 
    onAssignPermissions 
}) {
    if (!showPanel) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Assign Permissions to {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Role
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    {isLoadingAllPermissions ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading permissions...</p>
                        </div>
                    ) : Array.isArray(allPermissions) && allPermissions.length > 0 ? (
                        allPermissions.map((permission) => {
                            const isSelected = selectedPermissions.includes(permission.id);
                            return (
                                <div key={permission.id} className="bg-gray-50 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{permission.name}</h3>
                                            <p className="text-sm text-gray-600">{permission.codename}</p>
                                            {permission.description && (
                                                <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                                            )}
                                        </div>
                                        
                                        {/* Interactive Sliding Bar */}
                                        <div className="ml-4">
                                            <button
                                                onClick={() => onPermissionToggle(permission.id)}
                                                className={`relative w-16 h-8 rounded-full transition-all duration-300 ${isSelected ? 'bg-green-500' : 'bg-gray-300'}`}
                                            >
                                                <div
                                                    className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${isSelected ? 'translate-x-8' : 'translate-x-1'}`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-8">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No permissions available</p>
                            <button onClick={() => window.location.href = '/admin/permissions'}>
                                Create Permissions
                            </button>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">{selectedPermissions.length}</span> permissions selected
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onAssignPermissions}
                            disabled={isAssigning}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {isAssigning ? 'Assigning...' : 'Assign Permissions'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
