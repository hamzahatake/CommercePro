"use client";

import { useState } from "react";
import Link from "next/link";
import { useGetManagersQuery, useCreateManagerMutation, useUpdateManagerMutation, useDeleteManagerMutation } from "@/features/api/apiSlice";
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Mail,
    Phone,
    Calendar,
    Building,
    ArrowLeft
} from "lucide-react";

export default function ManagersManagementComponent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("");

    const { data: managers = [], isLoading, isError, refetch } = useGetManagersQuery();
    const [createManager] = useCreateManagerMutation();
    const [updateManager] = useUpdateManagerMutation();
    const [deleteManager] = useDeleteManagerMutation();

    const handleDeleteManager = async (managerId) => {
        if (window.confirm('Are you sure you want to delete this manager?')) {
            try {
                await deleteManager(managerId).unwrap();
                alert('Manager deleted successfully!');
                refetch();
            } catch (error) {
                console.error('Error deleting manager:', error);
                alert('Failed to delete manager. Please try again.');
            }
        }
    };

    const filteredManagers = managers.filter(manager => {
        const matchesSearch = !searchTerm ||
            manager.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            manager.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            manager.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDepartment = !departmentFilter || manager.department === departmentFilter;

        return matchesSearch && matchesDepartment;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Loading managers...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-red-600 mb-4">Error loading managers</p>
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
                        <Link
                            href="/admin/dashboard"
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Manager Management</h1>
                            <p className="text-gray-600">Manage all managers and their departments</p>
                        </div>
                    </div>
                    <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add Manager
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Total Managers</p>
                                <p className="text-2xl font-bold text-gray-900">{managers.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Building className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Departments</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {new Set(managers.map(m => m.department)).size}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {managers.filter(m => m.user?.is_active).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">This Month</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {managers.filter(m => {
                                        const created = new Date(m.user?.date_joined);
                                        const now = new Date();
                                        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                                    }).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-col md:flex-row gap-4 mt-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search managers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="md:w-64">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                            >
                                <option value="">All Departments</option>
                                <option value="sales">Sales</option>
                                <option value="marketing">Marketing</option>
                                <option value="operations">Operations</option>
                                <option value="finance">Finance</option>
                                <option value="hr">Human Resources</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Managers Table */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Managers ({filteredManagers.length})</h2>

                {filteredManagers.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No managers found</p>
                        <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Manager</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Contact</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Department</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Joined</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredManagers.map((manager) => (
                                    <tr key={manager.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <Users className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {manager.user?.first_name} {manager.user?.last_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">@{manager.user?.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900">{manager.user?.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900">{manager.phone_number || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                {manager.department?.charAt(0).toUpperCase() + manager.department?.slice(1)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                manager.user?.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {manager.user?.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900">{new Date(manager.user?.date_joined).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleDeleteManager(manager.id)}
                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                    title="Delete Manager"
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
