"use client";

import { useState, useEffect } from "react";
import { useGetVendorsQuery, useApproveVendorMutation, useRejectVendorMutation } from "@/features/api/apiSlice";
import { Store, ArrowLeft, Mail, Phone, Calendar, MapPin, Building, CheckCircle, XCircle, Edit, Save, X } from "lucide-react";
import Link from "next/link";

export default function VendorDetailComponent({ vendorId, router }) {
    const { data: vendors = [], isLoading, isError, refetch } = useGetVendorsQuery();
    const [approveVendor] = useApproveVendorMutation();
    const [rejectVendor] = useRejectVendorMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        shop_name: '',
        business_email: '',
        phone_number: '',
        address: '',
        tax_id: '',
        bank_name: '',
        account_number: ''
    });

    const [errors, setErrors] = useState({});

    const vendor = vendors.find(v => v.id == vendorId);

    useEffect(() => {
        if (vendor) {
            setFormData({
                shop_name: vendor.shop_name || '',
                business_email: vendor.business_email || '',
                phone_number: vendor.phone_number || '',
                address: vendor.address || '',
                tax_id: vendor.tax_id || '',
                bank_name: vendor.bank_name || '',
                account_number: vendor.account_number || ''
            });
        }
    }, [vendor]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleApproveVendor = async () => {
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

    const handleRejectVendor = async () => {
        if (window.confirm('Are you sure you want to reject this vendor? This will delete their account.')) {
            try {
                await rejectVendor(vendorId).unwrap();
                alert('Vendor rejected successfully!');
                router.push('/admin/vendors');
            } catch (error) {
                console.error('Error rejecting vendor:', error);
                alert('Failed to reject vendor. Please try again.');
            }
        }
    };

    const handleCancel = () => {
        if (vendor) {
            setFormData({
                shop_name: vendor.shop_name || '',
                business_email: vendor.business_email || '',
                phone_number: vendor.phone_number || '',
                address: vendor.address || '',
                tax_id: vendor.tax_id || '',
                bank_name: vendor.bank_name || '',
                account_number: vendor.account_number || ''
            });
        }
        setIsEditing(false);
        setErrors({});
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Loading vendor details...</p>
                </div>
            </div>
        );
    }

    if (isError || !vendor) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-red-600 mb-4">Vendor not found</p>
                    <Link
                        href="/admin/vendors"
                        className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                        Back to Vendors
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-3xl mt-10 shadow-sm p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/vendors"
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Store className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Vendor Details</h1>
                            <p className="text-gray-600">View and manage vendor information</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                        >
                            <Edit className="w-5 h-5" />
                            {isEditing ? 'Cancel Edit' : 'Edit Vendor'}
                        </button>
                        {!vendor.approved && (
                            <button
                                onClick={handleApproveVendor}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                            >
                                <CheckCircle className="w-5 h-5" />
                                Approve
                            </button>
                        )}
                        <button
                            onClick={handleRejectVendor}
                            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                        >
                            <XCircle className="w-5 h-5" />
                            Reject
                        </button>
                    </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${vendor.approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {vendor.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                </div>
            </div>

            {/* Vendor Details Form */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Shop Logo */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Shop Logo
                            </label>
                            <div className="flex items-center gap-4">
                                {vendor.shop_logo ? (
                                    <img
                                        src={vendor.shop_logo}
                                        alt={vendor.shop_name}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Store className="w-10 h-10 text-gray-600" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-500">Shop logo uploaded by vendor</p>
                                </div>
                            </div>
                        </div>

                        {/* Vendor Info */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendor Information</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Vendor Name
                            </label>
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                {vendor.user?.first_name} {vendor.user?.last_name}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email
                            </label>
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{vendor.user?.email}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">@{vendor.user?.username}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Joined Date
                            </label>
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                {new Date(vendor.user?.date_joined).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Shop Details */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shop Details</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Building className="w-4 h-4 inline mr-2" />
                                Shop Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="shop_name"
                                    value={formData.shop_name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.shop_name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter shop name"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{vendor.shop_name}</p>
                            )}
                            {errors.shop_name && <p className="text-red-500 text-sm mt-1">{errors.shop_name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Business Email
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="business_email"
                                    value={formData.business_email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.business_email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter business email"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{vendor.business_email}</p>
                            )}
                            {errors.business_email && <p className="text-red-500 text-sm mt-1">{errors.business_email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Phone Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.phone_number ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter phone number"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{vendor.phone_number}</p>
                            )}
                            {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tax ID
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="tax_id"
                                    value={formData.tax_id}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.tax_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter tax ID"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{vendor.tax_id}</p>
                            )}
                            {errors.tax_id && <p className="text-red-500 text-sm mt-1">{errors.tax_id}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Address
                            </label>
                            {isEditing ? (
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter address"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{vendor.address}</p>
                            )}
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                        </div>

                        {/* Banking Details */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Details</h3>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bank Name
                            </label>
                            {isEditing ? (
                                <select
                                    name="bank_name"
                                    value={formData.bank_name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="">Select Bank</option>
                                    <option value="HBL">Habib Bank Limited</option>
                                    <option value="MCB">Muslim Commercial Bank</option>
                                    <option value="UBL">United Bank Limited</option>
                                </select>
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{vendor.bank_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Account Number
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="account_number"
                                    value={formData.account_number}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${errors.account_number ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Enter account number"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{vendor.account_number}</p>
                            )}
                            {errors.account_number && <p className="text-red-500 text-sm mt-1">{errors.account_number}</p>}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    {isEditing && (
                        <div className="flex justify-end gap-4 pt-6">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
