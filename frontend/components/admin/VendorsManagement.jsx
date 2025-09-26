"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useGetVendorsQuery, useApproveVendorMutation, useRejectVendorMutation } from "@/features/api/apiSlice";
import { 
    Store, 
    CheckCircle, 
    XCircle, 
    Search, 
    Filter, 
    Eye,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Building
} from "lucide-react";

export default function VendorsManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const { data: vendors = [], isLoading, isError, refetch } = useGetVendorsQuery();
    const [approveVendor] = useApproveVendorMutation();
    const [rejectVendor] = useRejectVendorMutation();

    const handleApproveVendor = async (vendorId) => {
        if (window.confirm('Are you sure you want to approve this vendor?')) {
            try {
                await approveVendor(vendorId).unwrap();
                alert('Vendor approved successfully!');
                refetch();
            } catch (error) {
                console.error('Error approving vendor:', error);
                alert('Failed to approve vendor. Please try again.');
            }
        }
    };

    const handleRejectVendor = async (vendorId) => {
        if (window.confirm('Are you sure you want to reject this vendor?')) {
            try {
                await rejectVendor(vendorId).unwrap();
                alert('Vendor rejected successfully!');
                refetch();
            } catch (error) {
                console.error('Error rejecting vendor:', error);
                alert('Failed to reject vendor. Please try again.');
            }
        }
    };

    const getStatusColor = (approved) => {
        return approved 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800';
    };

    const getStatusIcon = (approved) => {
        return approved 
            ? <CheckCircle className="w-4 h-4" />
            : <XCircle className="w-4 h-4" />;
    };

    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = !searchTerm || 
            vendor.shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.business_email?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = !statusFilter || 
            (statusFilter === 'approved' && vendor.approved) ||
            (statusFilter === 'pending' && !vendor.approved);
        
        return matchesSearch && matchesStatus;
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Loading vendors...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-red-600 mb-4">Error loading vendors</p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const pendingVendors = vendors.filter(vendor => !vendor.approved);
    const approvedVendors = vendors.filter(vendor => vendor.approved);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Store className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
                        <p className="text-gray-600">Manage vendor approvals and information</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search vendors by shop name, owner name, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending Approval</option>
                            <option value="approved">Approved</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Vendors</h3>
                        <p className="text-3xl font-bold text-gray-900">{vendors.length}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Approval</h3>
                        <p className="text-3xl font-bold text-yellow-600">{pendingVendors.length}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved</h3>
                        <p className="text-3xl font-bold text-green-600">{approvedVendors.length}</p>
                    </div>
                </div>
            </div>

            {/* Vendors Table */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Vendors</h2>
                
                {filteredVendors.length === 0 ? (
                    <div className="text-center py-12">
                        <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No vendors found</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Vendor</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Contact</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Business Info</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Status</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Joined</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVendors.map((vendor) => (
                                    <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-3">
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
                                                    <p className="font-medium text-gray-900">
                                                        {vendor.shop_name || 'Unnamed Shop'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {vendor.user?.first_name} {vendor.user?.last_name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{vendor.business_email || 'No email'}</span>
                                                </div>
                                                {vendor.phone_number && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="w-4 h-4" />
                                                        <span>{vendor.phone_number}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="space-y-1">
                                                {vendor.address && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="truncate max-w-32">{vendor.address}</span>
                                                    </div>
                                                )}
                                                {vendor.tax_id && (
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Building className="w-4 h-4" />
                                                        <span>Tax ID: {vendor.tax_id}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(vendor.approved)}`}>
                                                {getStatusIcon(vendor.approved)}
                                                {vendor.approved ? 'Approved' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <span className="text-gray-900">{new Date(vendor.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/admin/vendors/${vendor.id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                {!vendor.approved && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveVendor(vendor.id)}
                                                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                                            title="Approve Vendor"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectVendor(vendor.id)}
                                                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                                            title="Reject Vendor"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
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
