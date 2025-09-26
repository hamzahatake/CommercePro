"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from "@/features/api/apiSlice";
import { 
    Users, 
    UserPlus, 
    Search, 
    Filter, 
    Edit, 
    Trash2, 
    Eye,
    UserCheck,
    UserX,
    Mail,
    Phone,
    Calendar,
    Shield
} from "lucide-react";

export default function UsersManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // Use real API calls instead of mock data
    const { data: users = [], isLoading, isError, refetch } = useGetUsersQuery({
        search: searchTerm,
        role: roleFilter,
        is_active: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : undefined
    });
    
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to deactivate this user?')) {
            try {
                await deleteUser(userId).unwrap();
                alert('User deactivated successfully!');
                refetch();
            } catch (error) {
                console.error('Error deactivating user:', error);
                alert('Failed to deactivate user. Please try again.');
            }
        }
    };

    const handleActivateUser = async (userId) => {
        try {
            await updateUser({ id: userId, is_active: true }).unwrap();
            alert('User activated successfully!');
            refetch();
        } catch (error) {
            console.error('Error activating user:', error);
            alert('Failed to activate user. Please try again.');
        }
    };

    const handlePermanentDelete = async (userId) => {
        if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            try {
                await deleteUser(userId).unwrap();
                alert('User permanently deleted!');
                refetch();
            } catch (error) {
                console.error('Error permanently deleting user:', error);
                alert('Failed to permanently delete user. Please try again.');
            }
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'manager': return 'bg-purple-100 text-purple-800';
            case 'vendor': return 'bg-blue-100 text-blue-800';
            case 'customer': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <Shield className="w-4 h-4" />;
            case 'manager': return <Users className="w-4 h-4" />;
            case 'vendor': return <Users className="w-4 h-4" />;
            case 'customer': return <Users className="w-4 h-4" />;
            default: return <Users className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Loading users...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-red-600 mb-4">Error loading users</p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                            <p className="text-gray-600">Manage all users and their roles</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add New User
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search users by name, email, or username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="vendor">Vendor</option>
                            <option value="customer">Customer</option>
                        </select>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Users</h3>
                        <p className="text-3xl font-bold text-green-600">{users.filter(user => user.is_active).length}</p>
                    </div>
                    <div className="bg-red-50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Inactive Users</h3>
                        <p className="text-3xl font-bold text-red-600">{users.filter(user => !user.is_active).length}</p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Admins</h3>
                        <p className="text-3xl font-bold text-blue-600">{users.filter(user => user.role === 'admin').length}</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Users</h2>
                
                {users.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No users found</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">User</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Contact</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Role</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Joined</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-3">
                                                {user.profile_picture ? (
                                                    <img
                                                        src={user.profile_picture}
                                                        alt={`${user.first_name} ${user.last_name}`}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <Users className="w-5 h-5 text-gray-600" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.first_name} {user.last_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">@{user.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{user.email}</span>
                                                </div>
                                                {user.phone_number && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{user.phone_number}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                                                {getRoleIcon(user.role)}
                                                {user.role_display || user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                                                user.is_active 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {user.is_active ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900">{new Date(user.date_joined).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => user.is_active ? handleDeleteUser(user.id) : handleActivateUser(user.id)}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        user.is_active 
                                                            ? 'text-red-600 hover:bg-red-100' 
                                                            : 'text-green-600 hover:bg-green-100'
                                                    }`}
                                                    title={user.is_active ? "Deactivate User" : "Activate User"}
                                                >
                                                    {user.is_active ? <Trash2 className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handlePermanentDelete(user.id)}
                                                    className="p-2 text-red-800 hover:bg-red-200 rounded-lg transition-colors"
                                                    title="Permanently Delete User"
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
        </div>
    );
}
