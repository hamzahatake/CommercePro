"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
    Settings,
    Plus,
    Search,
    Edit,
    Trash2,
    Key,
    Shield,
    Calendar,
    Lock
} from "lucide-react";

export default function PermissionManagementPage() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const router = useRouter();
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingPermission, setEditingPermission] = useState(null);
    const [formData, setFormData] = useState({
        permission_name: "",
        permission_key: "",
        description: ""
    });

    useEffect(() => {
        if (!isAuthenticated || authUser?.role !== 'admin') {
            router.push('/login');
        }
    }, [isAuthenticated, authUser, router]);

    // Mock data - replace with actual API calls
    useEffect(() => {
        const mockPermissions = [
            {
                id: 1,
                permission_name: "View Products",
                permission_key: "view_products",
                description: "Allows users to view product listings and details",
                created_at: "2024-01-15T10:00:00Z",
                updated_at: "2024-01-15T10:00:00Z"
            },
            {
                id: 2,
                permission_name: "Place Orders",
                permission_key: "place_orders",
                description: "Allows users to place orders and make purchases",
                created_at: "2024-01-15T10:00:00Z",
                updated_at: "2024-01-15T10:00:00Z"
            },
            {
                id: 3,
                permission_name: "Access Premium Content",
                permission_key: "access_premium",
                description: "Allows access to premium features and content",
                created_at: "2024-01-15T10:00:00Z",
                updated_at: "2024-01-15T10:00:00Z"
            },
            {
                id: 4,
                permission_name: "Manage Products",
                permission_key: "manage_products",
                description: "Allows creating, editing, and deleting products",
                created_at: "2024-01-15T10:00:00Z",
                updated_at: "2024-01-15T10:00:00Z"
            },
            {
                id: 5,
                permission_name: "View Orders",
                permission_key: "view_orders",
                description: "Allows viewing order history and details",
                created_at: "2024-01-15T10:00:00Z",
                updated_at: "2024-01-15T10:00:00Z"
            },
            {
                id: 6,
                permission_name: "Update Inventory",
                permission_key: "update_inventory",
                description: "Allows updating product inventory levels",
                created_at: "2024-01-15T10:00:00Z",
                updated_at: "2024-01-15T10:00:00Z"
            },
            {
                id: 7,
                permission_name: "Manage Users",
                permission_key: "manage_users",
                description: "Allows managing user accounts and profiles",
                created_at: "2024-01-15T10:00:00Z",
                updated_at: "2024-01-15T10:00:00Z"
            },
            {
                id: 8,
                permission_name: "View Reports",
                permission_key: "view_reports",
                description: "Allows viewing system reports and analytics",
                created_at: "2024-01-15T10:00:00Z",
                updated_at: "2024-01-15T10:00:00Z"
            },
            {
                id: 9,
                permission_name: "Moderate Content",
                permission_key: "moderate_content",
                description: "Allows moderating user-generated content",
                created_at: "2024-01-15T10:00:00Z",
                updated_at: "2024-01-15T10:00:00Z"
            }
        ];

        setTimeout(() => {
            setPermissions(mockPermissions);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredPermissions = permissions.filter(permission =>
        permission.permission_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.permission_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreatePermission = () => {
        setEditingPermission(null);
        setFormData({ permission_name: "", permission_key: "", description: "" });
        setShowCreateModal(true);
    };

    const handleEditPermission = (permission) => {
        setEditingPermission(permission);
        setFormData({
            permission_name: permission.permission_name,
            permission_key: permission.permission_key,
            description: permission.description
        });
        setShowCreateModal(true);
    };

    const handleDeletePermission = (permissionId) => {
        if (window.confirm('Are you sure you want to delete this permission? This action cannot be undone.')) {
            setPermissions(permissions.filter(permission => permission.id !== permissionId));
            alert('Permission deleted successfully!');
        }
    };

    const generatePermissionKey = (name) => {
        return name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const permissionKey = formData.permission_key || generatePermissionKey(formData.permission_name);

        if (editingPermission) {
            // Update existing permission
            setPermissions(permissions.map(permission =>
                permission.id === editingPermission.id
                    ? {
                        ...permission,
                        permission_name: formData.permission_name,
                        permission_key: permissionKey,
                        description: formData.description,
                        updated_at: new Date().toISOString()
                    }
                    : permission
            ));
            alert('Permission updated successfully!');
        } else {
            // Create new permission
            const newPermission = {
                id: Math.max(...permissions.map(p => p.id)) + 1,
                permission_name: formData.permission_name,
                permission_key: permissionKey,
                description: formData.description,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            setPermissions([...permissions, newPermission]);
            alert('Permission created successfully!');
        }

        setShowCreateModal(false);
        setFormData({ permission_name: "", permission_key: "", description: "" });
        setEditingPermission(null);
    };

    if (!isAuthenticated || authUser?.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-gray-600 mb-4">Access denied. Admin privileges required.</p>
                    <a
                        href="/login"
                        className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Loading permissions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#EDEAE4' }}>
            <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Settings className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Permission Management</h1>
                            <p className="text-gray-600">Create and manage system permissions</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCreatePermission}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Create Permission
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Permissions</h3>
                        <p className="text-3xl font-bold text-gray-900">{permissions.length}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Permissions</h3>
                        <p className="text-3xl font-bold text-green-600">{permissions.length}</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search permissions by name, key, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Permissions Table */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Permissions ({filteredPermissions.length})</h2>

                {filteredPermissions.length === 0 ? (
                    <div className="text-center py-12">
                        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No permissions found</p>
                        <p className="text-sm text-gray-400 mt-2">Create your first permission to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Permission</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Key</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Description</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Created</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPermissions.map((permission) => (
                                    <tr key={permission.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Lock className="w-4 h-4 text-green-600" />
                                                </div>
                                                <span className="font-medium text-gray-900">{permission.permission_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                                                {permission.permission_key}
                                            </code>
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className="text-gray-600">{permission.description}</span>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-600">
                                                    {new Date(permission.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditPermission(permission)}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit Permission"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePermission(permission.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Delete Permission"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create/Edit Permission Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {editingPermission ? 'Edit Permission' : 'Create New Permission'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Permission Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.permission_name}
                                    onChange={(e) => setFormData({ ...formData, permission_name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter permission name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Permission Key
                                </label>
                                <input
                                    type="text"
                                    value={formData.permission_key}
                                    onChange={(e) => setFormData({ ...formData, permission_key: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
                                    placeholder="Enter permission key (auto-generated if empty)"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Leave empty to auto-generate from permission name
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    placeholder="Enter permission description"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                                >
                                    {editingPermission ? 'Update Permission' : 'Create Permission'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingPermission(null);
                                        setFormData({ permission_name: "", permission_key: "", description: "" });
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
