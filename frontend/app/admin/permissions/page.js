"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
    useGetPermissionsQuery,
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
    useDeletePermissionMutation,
    useGetRolePermissionsByRoleQuery,
    useAssignRolePermissionsMutation,
    useGetRolePermissionsQuery
} from "@/features/api/apiSlice";
import PermissionHeader from "@/components/admin/PermissionHeader";
import PermissionSearch from "@/components/admin/PermissionSearch";
import RoleAssignmentSection from "@/components/admin/RoleAssignmentSection";
import AssignedPermissionsList from "@/components/admin/AssignedPermissionsList";
import PermissionModal from "@/components/admin/PermissionModal";
import RolePermissionsModal from "@/components/admin/RolePermissionsModal";

export default function PermissionManagementPage() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const router = useRouter();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showRoleAssignmentModal, setShowRoleAssignmentModal] = useState(false);
    const [editingPermission, setEditingPermission] = useState(null);
    const [selectedRole, setSelectedRole] = useState("vendor");
    const [showRolePermissionsModal, setShowRolePermissionsModal] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        codename: "",
        description: ""
    });

    // API hooks
    const { data: permissionsData, isLoading, error, refetch } = useGetPermissionsQuery({ search: searchTerm });
    const [createPermission, { isLoading: isCreating }] = useCreatePermissionMutation();
    const [updatePermission, { isLoading: isUpdating }] = useUpdatePermissionMutation();
    const [deletePermission, { isLoading: isDeleting }] = useDeletePermissionMutation();
    const { data: rolePermissions = {}, isLoading: isLoadingRolePermissions } = useGetRolePermissionsByRoleQuery(selectedRole);
    const [assignRolePermissions, { isLoading: isAssigning }] = useAssignRolePermissionsMutation();
    const { data: allRolePermissionsData, isLoading: isLoadingAllRolePermissions } = useGetRolePermissionsQuery();

    // Safely extract permissions array
    const permissions = Array.isArray(permissionsData) ? permissionsData :
        permissionsData?.results ? permissionsData.results :
            permissionsData?.data ? permissionsData.data : [];

    // Safely extract allRolePermissions array
    const allRolePermissions = Array.isArray(allRolePermissionsData) ? allRolePermissionsData :
        allRolePermissionsData?.results ? allRolePermissionsData.results :
            allRolePermissionsData?.data ? allRolePermissionsData.data : [];

    // Debug logging
    console.log('Raw permissions data:', permissionsData);
    console.log('Processed permissions:', permissions);
    console.log('Permissions loading:', isLoading);
    console.log('Permissions error:', error);
    console.log('Raw allRolePermissions data:', allRolePermissionsData);
    console.log('Processed allRolePermissions:', allRolePermissions);
    console.log('AllRolePermissions loading:', isLoadingAllRolePermissions);

    // Initialize selected permissions when role changes
    useEffect(() => {
        if (rolePermissions.permissions && Array.isArray(rolePermissions.permissions)) {
            setSelectedPermissions(rolePermissions.permissions.map(p => p.id));
        }
    }, [rolePermissions, selectedRole]);

    useEffect(() => {
        if (!isAuthenticated || authUser?.role !== 'admin') {
            router.push('/login');
        }
    }, [isAuthenticated, authUser, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generateCodename = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingPermission) {
                await updatePermission({
                    id: editingPermission.id,
                    ...formData
                }).unwrap();
            } else {
                await createPermission({
                    ...formData,
                    codename: formData.codename || generateCodename(formData.name)
                }).unwrap();
            }
            
            resetForm();
            refetch();
        } catch (error) {
            console.error('Error saving permission:', error);
        }
    };

    const handleEdit = (permission) => {
        setEditingPermission(permission);
        setFormData({
            name: permission.name,
            codename: permission.codename,
            description: permission.description || ""
        });
        setShowCreateModal(true);
    };

    const handleDelete = async (permission) => {
        if (window.confirm(`Are you sure you want to delete "${permission.name}"?`)) {
            try {
                await deletePermission(permission.id).unwrap();
                refetch();
            } catch (error) {
                console.error('Error deleting permission:', error);
            }
        }
    };

    const resetForm = () => {
        setShowCreateModal(false);
        setEditingPermission(null);
        setFormData({ name: "", codename: "", description: "" });
    };

    const handleRolePermissionClick = (role) => {
        setSelectedRole(role);
        setShowRolePermissionsModal(true);
    };

    const handlePermissionToggle = (permissionId) => {
        setSelectedPermissions(prev => 
            prev.includes(permissionId) 
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId]
        );
    };

    const handleAssignPermissions = async () => {
        try {
            await assignRolePermissions({
                role: selectedRole,
                permission_ids: selectedPermissions
            }).unwrap();
            
            setShowRolePermissionsModal(false);
            // Refresh the assigned permissions list
            window.location.reload();
        } catch (error) {
            console.error('Error assigning permissions:', error);
        }
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

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#EDEAE4' }}>
            <div className="max-w-7xl mx-auto p-8">
                <PermissionHeader 
                    onCreatePermission={() => {
                        setEditingPermission(null);
                        setFormData({ name: "", codename: "", description: "" });
                        setShowCreateModal(true);
                    }}
                />

                <PermissionSearch 
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    hasResults={permissions.length > 0}
                />

                <RoleAssignmentSection 
                    selectedRole={selectedRole}
                    onRoleChange={setSelectedRole}
                    onManagePermissions={handleRolePermissionClick}
                />

                <AssignedPermissionsList 
                    allRolePermissions={allRolePermissions}
                    isLoadingAllRolePermissions={isLoadingAllRolePermissions}
                    permissions={permissions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <PermissionModal 
                    showModal={showCreateModal}
                    editingPermission={editingPermission}
                    formData={formData}
                    isLoading={isCreating || isUpdating}
                    onClose={resetForm}
                    onSubmit={handleSubmit}
                    onInputChange={handleInputChange}
                />

                <RolePermissionsModal 
                    showModal={showRolePermissionsModal}
                    selectedRole={selectedRole}
                    permissions={permissions}
                    selectedPermissions={selectedPermissions}
                    isLoading={isLoading}
                    isAssigning={isAssigning}
                    onClose={() => setShowRolePermissionsModal(false)}
                    onPermissionToggle={handlePermissionToggle}
                    onAssignPermissions={handleAssignPermissions}
                />
            </div>
        </div>
    );
}
