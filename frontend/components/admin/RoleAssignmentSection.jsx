import { Store, UserCheck, Shield } from "lucide-react";

const roles = [
    { value: "vendor", label: "Vendor", icon: Store, color: "bg-green-100 text-green-700" },
    { value: "manager", label: "Manager", icon: UserCheck, color: "bg-purple-100 text-purple-700" },
    { value: "admin", label: "Admin", icon: Shield, color: "bg-red-100 text-red-700" }
];

export default function RoleAssignmentSection({ selectedRole, onRoleChange, onManagePermissions }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Role Permission Assignment</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                        <div key={role.value} className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 ${role.color.split(' ')[0]} rounded-full flex items-center justify-center`}>
                                    <IconComponent className={`w-5 h-5 ${role.color.split(' ')[1]}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{role.label}</h3>
                                    <p className="text-sm text-gray-600">Role permissions</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onManagePermissions(role.value)}
                                className="w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Manage Permissions
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
