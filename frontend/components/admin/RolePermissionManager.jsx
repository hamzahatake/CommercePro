"use client";

import { useState, useEffect } from "react";
import {
    useGetRolePermissionsByRoleQuery,
    useGetAvailablePermissionsForRoleQuery,
    useAssignRolePermissionsMutation
} from "@/features/api/apiSlice";
import RolePermissionManagerHeader from "./RolePermissionManagerHeader";
import RolePermissionManagerControls from "./RolePermissionManagerControls";
import PermissionList from "./PermissionList";
import RolePermissionManagerActions from "./RolePermissionManagerActions";
import RolePermissionManagerLoading from "./RolePermissionManagerLoading";

export default function RolePermissionManager({ selectedRole, onClose }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [isModified, setIsModified] = useState(false);

    // API hooks
    const { data: rolePermissions = {}, isLoading: isLoadingAssigned } = useGetRolePermissionsByRoleQuery(selectedRole);
    const { data: availablePermissions = [], isLoading: isLoadingAvailable } = useGetAvailablePermissionsForRoleQuery(selectedRole);
    const [assignRolePermissions, { isLoading: isAssigning }] = useAssignRolePermissionsMutation();

    // Initialize selected permissions when data loads
    useEffect(() => {
        if (rolePermissions.permissions) {
            setSelectedPermissions(rolePermissions.permissions.map(p => p.id));
            setIsModified(false);
        }
    }, [rolePermissions]);

    const handlePermissionToggle = (permissionId) => {
        setSelectedPermissions(prev => {
            const newSelection = prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId];
            setIsModified(true);
            return newSelection;
        });
    };

    const handleSelectAll = () => {
        const allPermissionIds = [
            ...(rolePermissions.permissions || []).map(p => p.id),
            ...availablePermissions.map(p => p.id)
        ];
        setSelectedPermissions(allPermissionIds);
        setIsModified(true);
    };

    const handleSelectNone = () => {
        setSelectedPermissions([]);
        setIsModified(true);
    };

    const handleSave = async () => {
        try {
            await assignRolePermissions({
                role: selectedRole,
                permissions: selectedPermissions
            }).unwrap();
            setIsModified(false);
            alert('Role permissions updated successfully!');
        } catch (error) {
            console.error('Error assigning permissions:', error);
            alert('Error assigning permissions. Please try again.');
        }
    };

    const filteredAvailablePermissions = availablePermissions.filter(permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.codename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredAssignedPermissions = (rolePermissions.permissions || []).filter(permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permission.codename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoadingAssigned || isLoadingAvailable) {
        return <RolePermissionManagerLoading />;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <RolePermissionManagerHeader 
                    selectedRole={selectedRole}
                    onClose={onClose}
                />

                <RolePermissionManagerControls 
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onSelectAll={handleSelectAll}
                    onSelectNone={handleSelectNone}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PermissionList 
                        title="Available Permissions"
                        permissions={filteredAvailablePermissions}
                        selectedPermissions={selectedPermissions}
                        onPermissionToggle={handlePermissionToggle}
                    />

                    <PermissionList 
                        title="Assigned Permissions"
                        permissions={filteredAssignedPermissions}
                        selectedPermissions={selectedPermissions}
                        onPermissionToggle={handlePermissionToggle}
                    />
                </div>

                <RolePermissionManagerActions 
                    isModified={isModified}
                    isAssigning={isAssigning}
                    selectedPermissionsCount={selectedPermissions.length}
                    onSave={handleSave}
                />
            </div>
        </div>
    );
}
