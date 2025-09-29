import { X, Shield, Store, UserCheck } from "lucide-react";

const roles = [
    { value: "vendor", label: "Vendor", icon: Store, color: "bg-green-100 text-green-700" },
    { value: "manager", label: "Manager", icon: UserCheck, color: "bg-purple-100 text-purple-700" },
    { value: "admin", label: "Admin", icon: Shield, color: "bg-red-100 text-red-700" }
];

export default function RolePermissionManagerHeader({ selectedRole, onClose }) {
    const currentRole = roles.find(r => r.value === selectedRole);
    const IconComponent = currentRole?.icon || Shield;

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${currentRole?.color.split(' ')[0]} rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 ${currentRole?.color.split(' ')[1]}`} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Manage {currentRole?.label} Permissions
                    </h2>
                    <p className="text-gray-600">Assign permissions to the {currentRole?.label.toLowerCase()} role</p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
    );
}
