"use client";

import { useState, useEffect } from "react";
import { useGetUserDetailQuery, useUpdateUserMutation } from "@/features/api/apiSlice";
import { 
    Users, 
    ArrowLeft, 
    Mail,
    User,
    Calendar,
    Shield,
    Edit,
    Save,
    X
} from "lucide-react";
import Link from "next/link";

export default function UserDetailComponent({ userId, router }) {
    const { data: user, isLoading, isError, refetch } = useGetUserDetailQuery(userId);
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        role: '',
        is_active: true
    });
    
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                username: user.username || '',
                role: user.role || '',
                is_active: user.is_active
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await updateUser({ id: userId, ...formData }).unwrap();
            alert('User updated successfully!');
            setIsEditing(false);
            refetch();
        } catch (error) {
            console.error('Error updating user:', error);
            if (error.data) {
                setErrors(error.data);
            } else {
                alert('Failed to update user. Please try again.');
            }
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                username: user.username || '',
                role: user.role || '',
                is_active: user.is_active
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
                    <p className="text-lg font-medium">Loading user details...</p>
                </div>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ECE9E2' }}>
                <div className="text-center">
                    <p className="text-lg font-medium text-red-600 mb-4">User not found</p>
                    <Link 
                        href="/admin/users" 
                        className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                        Back to Users
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-sm p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/users"
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
                            <p className="text-gray-600">View and manage user information</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                        <Edit className="w-5 h-5" />
                        {isEditing ? 'Cancel Edit' : 'Edit User'}
                    </button>
                </div>
            </div>

            {/* User Details Form */}
            <div className="bg-white rounded-3xl shadow-sm p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Picture */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Profile Picture
                            </label>
                            <div className="flex items-center gap-4">
                                {user.profile_picture ? (
                                    <img 
                                        src={user.profile_picture} 
                                        alt={`${user.first_name} ${user.last_name}`}
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                        <Users className="w-10 h-10 text-gray-600" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-500">Profile picture from user's profile</p>
                                </div>
                            </div>
                        </div>

                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                        errors.first_name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter first name"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.first_name}</p>
                            )}
                            {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                        errors.last_name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter last name"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.last_name}</p>
                            )}
                            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter email address"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">{user.email}</p>
                            )}
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Username
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                        errors.username ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter username"
                                />
                            ) : (
                                <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">@{user.username}</p>
                            )}
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Shield className="w-4 h-4 inline mr-2" />
                                Role
                            </label>
                            {isEditing ? (
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="customer">Customer</option>
                                    <option value="vendor">Vendor</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            ) : (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                    user.role === 'manager' ? 'bg-purple-100 text-purple-700' :
                                    user.role === 'vendor' ? 'bg-green-100 text-green-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                </span>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            {isEditing ? (
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                    <span className="text-gray-700">Active User</span>
                                </label>
                            ) : (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                </span>
                            )}
                        </div>

                        {/* Date Joined */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Date Joined
                            </label>
                            <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                                {new Date(user.date_joined).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
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
                                type="submit"
                                disabled={isUpdating}
                                className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isUpdating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
