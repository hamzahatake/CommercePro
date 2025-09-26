"use client";

import { 
    Shield, 
    Users, 
    Store, 
    UserCheck, 
    Key,
    Lock,
    Database,
    Info
} from "lucide-react";

export default function RolesPermissionsComponent() {
    const roles = [
        {
            name: 'Customer',
            value: 'customer',
            description: 'Regular users who can browse products, make purchases, and manage their profile',
            permissions: [
                'View products',
                'Add to cart',
                'Create orders',
                'Manage profile',
                'View order history'
            ],
            color: 'bg-blue-100 text-blue-700',
            icon: Users
        },
        {
            name: 'Vendor',
            value: 'vendor',
            description: 'Sellers who can manage their shop, add products, and handle orders',
            permissions: [
                'Manage shop profile',
                'Add/edit products',
                'View orders',
                'Manage inventory',
                'View analytics'
            ],
            color: 'bg-green-100 text-green-700',
            icon: Store
        },
        {
            name: 'Manager',
            value: 'manager',
            description: 'Staff members who oversee vendors and manage operations',
            permissions: [
                'Manage vendors',
                'View reports',
                'Approve products',
                'Handle disputes',
                'Access analytics'
            ],
            color: 'bg-purple-100 text-purple-700',
            icon: UserCheck
        },
        {
            name: 'Admin',
            value: 'admin',
            description: 'System administrators with full access to all features',
            permissions: [
                'Manage all users',
                'System configuration',
                'View all data',
                'Manage roles',
                'Full admin access'
            ],
            color: 'bg-red-100 text-red-700',
            icon: Shield
        }
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Key className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
                        <p className="text-gray-600">Manage user roles and their access permissions</p>
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <Info className="w-6 h-6 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">Role-Based Access Control</h3>
                            <p className="text-blue-700 text-sm">
                                This system uses role-based access control (RBAC) to manage user permissions. 
                                Each role has specific permissions that determine what actions users can perform.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {roles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                        <div key={role.value} className="bg-white rounded-3xl shadow-sm p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${role.color}`}>
                                    <IconComponent className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{role.name}</h2>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${role.color}`}>
                                        {role.value}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6">{role.description}</p>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Permissions
                                </h3>
                                <div className="space-y-2">
                                    {role.permissions.map((permission, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                            <span className="text-gray-700">{permission}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Database className="w-4 h-4" />
                                        <span>System Role</span>
                                    </div>
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Additional Information */}
            <div className="mt-8 bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Role Management Guidelines</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Role Hierarchy</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-red-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Admin</p>
                                    <p className="text-sm text-gray-600">Highest level access</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                    <UserCheck className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Manager</p>
                                    <p className="text-sm text-gray-600">Operational oversight</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <Store className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Vendor</p>
                                    <p className="text-sm text-gray-600">Shop management</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Customer</p>
                                    <p className="text-sm text-gray-600">Basic user access</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Permission Management</h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <h4 className="font-medium text-gray-900 mb-2">Adding Permissions</h4>
                                <p className="text-sm text-gray-600">
                                    Permissions can be added to roles through the admin panel. 
                                    Changes take effect immediately.
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <h4 className="font-medium text-gray-900 mb-2">Role Assignment</h4>
                                <p className="text-sm text-gray-600">
                                    Users can be assigned roles during registration or 
                                    through the user management interface.
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <h4 className="font-medium text-gray-900 mb-2">Security</h4>
                                <p className="text-sm text-gray-600">
                                    All role changes are logged and require admin privileges 
                                    to prevent unauthorized access.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
