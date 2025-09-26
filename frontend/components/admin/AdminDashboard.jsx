"use client";

import { useState } from "react";
import { useGetVendorsQuery, useApproveVendorMutation, useRejectVendorMutation, useGetManagersQuery, useCreateManagerMutation, useDeleteManagerMutation } from "@/features/api/apiSlice";
import { Shield, CheckCircle, XCircle, Eye, Store, Mail, Phone, MapPin, Users, Plus, Trash2, Settings } from "lucide-react";
import ManagerRegistrationForm from "@/components/auth/ManagerRegistrationForm";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('vendors');
    const [showManagerForm, setShowManagerForm] = useState(false);

    const { data: vendors, isLoading, isError, refetch } = useGetVendorsQuery();
    const { data: managers, isLoading: managersLoading, isError: managersError, refetch: refetchManagers } = useGetManagersQuery();
    const [approveVendor] = useApproveVendorMutation();
    const [rejectVendor] = useRejectVendorMutation();
    const [createManager] = useCreateManagerMutation();
    const [deleteManager] = useDeleteManagerMutation();

    const handleApprove = async (vendorId) => {
        try {
            await approveVendor(vendorId).unwrap();
            refetch();
            alert('Vendor approved successfully!');
        } catch (error) {
            console.error('Error approving vendor:', error);
            alert('Failed to approve vendor. Please try again.');
        }
    };

    const handleReject = async (vendorId) => {
        try {
            await rejectVendor(vendorId).unwrap();
            refetch();
            alert('Vendor rejected successfully!');
        } catch (error) {
            console.error('Error rejecting vendor:', error);
            alert('Failed to reject vendor. Please try again.');
        }
    };

    const handleCreateManager = async (managerData) => {
        try {
            await createManager(managerData).unwrap();
            refetchManagers();
            alert('Manager created successfully!');
        } catch (error) {
            console.error('Error creating manager:', error);
            alert('Failed to create manager. Please try again.');
            throw error;
        }
    };

    const handleDeleteManager = async (managerId) => {
        if (window.confirm('Are you sure you want to delete this manager?')) {
            try {
                await deleteManager(managerId).unwrap();
                refetchManagers();
                alert('Manager deleted successfully!');
            } catch (error) {
                console.error('Error deleting manager:', error);
                alert('Failed to delete manager. Please try again.');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Loading vendors...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-red-600 mb-4">Error loading vendors</p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const pendingVendors = vendors?.filter(vendor => !vendor.approved) || [];
    const approvedVendors = vendors?.filter(vendor => vendor.approved) || [];

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#EDEAE4' }}>
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                            <Shield className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600">Manage vendors, managers and system settings</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('vendors')}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === 'vendors'
                                ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Store className="w-5 h-5 inline mr-2" />
                            Vendors
                        </button>
                        <button
                            onClick={() => setActiveTab('managers')}
                            className={`px-6 py-3 rounded-xl font-medium transition-colors ${activeTab === 'managers'
                                ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Users className="w-5 h-5 inline mr-2" />
                            Managers
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Vendors</h3>
                            <p className="text-3xl font-bold text-gray-900">{vendors?.length || 0}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Approval</h3>
                            <p className="text-3xl font-bold text-yellow-600">{pendingVendors.length}</p>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved</h3>
                            <p className="text-3xl font-bold text-green-600">{approvedVendors.length}</p>
                        </div>
                        <div className="bg-red-50 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Managers</h3>
                            <p className="text-3xl font-bold text-red-600">{managers?.length || 0}</p>
                        </div>
                    </div>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'vendors' && (
                    <>
                        {/* Pending Vendors */}
                        <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Vendor Approvals</h2>

                            {pendingVendors.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No pending vendor approvals</p>
                            ) : (
                                <div className="space-y-6">
                                    {pendingVendors.map((vendor) => (
                                        <div key={vendor.id} className="border border-gray-200 rounded-2xl p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                                <div className="flex items-start gap-4">
                                                    {vendor.shop_logo ? (
                                                        <img
                                                            src={vendor.shop_logo}
                                                            alt="Shop Logo"
                                                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-100">
                                                            <Store className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                    )}

                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                            {vendor.shop_name || 'Unnamed Shop'}
                                                        </h3>
                                                        <p className="text-gray-600 mb-1">
                                                            {vendor.user?.first_name} {vendor.user?.last_name}
                                                        </p>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Mail className="w-4 h-4" />
                                                                <span>{vendor.business_email || 'No email'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <Phone className="w-4 h-4" />
                                                                <span>{vendor.phone_number || 'No phone'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                <MapPin className="w-4 h-4" />
                                                                <span>{vendor.address || 'No address'}</span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                <span className="font-medium">Tax ID:</span> {vendor.tax_id || 'Not provided'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleApprove(vendor.id)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full hover:from-green-700 hover:to-green-800 transition-all duration-300"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(vendor.id)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Approved Vendors */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Approved Vendors</h2>

                            {approvedVendors.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No approved vendors yet</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {approvedVendors.map((vendor) => (
                                        <div key={vendor.id} className="border border-gray-200 rounded-2xl p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                {vendor.shop_logo ? (
                                                    <img
                                                        src={vendor.shop_logo}
                                                        alt="Shop Logo"
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-100">
                                                        <Store className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">
                                                        {vendor.shop_name || 'Unnamed Shop'}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {vendor.user?.first_name} {vendor.user?.last_name}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    <span className="truncate">{vendor.business_email || 'No email'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    <span>{vendor.phone_number || 'No phone'}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                <span className="text-sm text-green-600 font-medium">Approved</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Manager Management */}
                {activeTab === 'managers' && (
                    <div className="bg-white rounded-3xl shadow-sm p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Manager Management</h2>
                            <button
                                onClick={() => setShowManagerForm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300"
                            >
                                <Plus className="w-4 h-4" />
                                Add Manager
                            </button>
                        </div>

                        {managersLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                                <p className="text-lg font-medium">Loading managers...</p>
                            </div>
                        ) : managersError ? (
                            <div className="text-center py-8">
                                <p className="text-lg font-medium text-red-600 mb-4">Error loading managers</p>
                                <button
                                    onClick={() => refetchManagers()}
                                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full hover:from-red-700 hover:to-red-800 transition-all duration-300">
                                    Retry
                                </button>
                            </div>
                        ) : managers?.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">No managers found</p>
                                <p className="text-sm text-gray-400 mt-2">Create your first manager to get started</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {managers.map((manager) => (
                                    <div key={manager.id} className="border border-gray-200 rounded-2xl p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                                <Settings className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {manager.user?.first_name} {manager.user?.last_name}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {manager.user?.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center gap-2">
                                                <Settings className="w-4 h-4" />
                                                <span className="capitalize">{manager.department}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-4 h-4" />
                                                <span>{manager.phone_number || 'No phone'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                <span className="capitalize">{manager.permissions_level.replace('_', ' ')}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDeleteManager(manager.id)}
                                                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-600 rounded-lg hover:from-red-200 hover:to-red-300 transition-all duration-300"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Manager Registration Form Modal */}
                <ManagerRegistrationForm
                    isOpen={showManagerForm}
                    onClose={() => setShowManagerForm(false)}
                    onSubmit={handleCreateManager}
                />
            </div>
        </div>
    );
}
