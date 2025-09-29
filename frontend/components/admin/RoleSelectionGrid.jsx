import { Store, UserCheck, Shield } from "lucide-react";

const roles = [
    {
        name: 'Vendor',
        value: 'vendor',
        description: 'Sellers who can manage their shop, add products, and handle orders',
        color: 'bg-green-100 text-green-700',
        icon: Store
    },
    {
        name: 'Manager',
        value: 'manager',
        description: 'Staff members who oversee vendors and manage operations',
        color: 'bg-purple-100 text-purple-700',
        icon: UserCheck
    },
    {
        name: 'Admin',
        value: 'admin',
        description: 'System administrators with full access to all features',
        color: 'bg-red-100 text-red-700',
        icon: Shield
    }
];

export default function RoleSelectionGrid({ selectedRole, onRoleSelect }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Role to View Permissions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => {
                    const IconComponent = role.icon;
                    const isSelected = selectedRole === role.value;
                    return (
                        <button
                            key={role.value}
                            onClick={() => onRoleSelect(role.value)}
                            className={`p-6 rounded-xl border-2 transition-all ${
                                isSelected 
                                    ? 'border-red-500 bg-red-50' 
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role.color}`}>
                                    <IconComponent className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                                    <p className="text-sm text-gray-600">{role.value}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 text-left">{role.description}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
