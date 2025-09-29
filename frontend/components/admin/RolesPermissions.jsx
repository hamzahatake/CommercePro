"use client";

import { useState, useEffect } from "react";
import {
    useGetRolePermissionsByRoleQuery,
    useGetPermissionsQuery,
    useAssignRolePermissionsMutation
} from "@/features/api/apiSlice";
import RolesPermissionsHeader from "./RolesPermissionsHeader";
import RolesPermissionsInfoCard from "./RolesPermissionsInfoCard";
import RoleSelectionGrid from "./RoleSelectionGrid";
import SelectedRolePermissions from "./SelectedRolePermissions";
import PermissionAssignmentPanel from "./PermissionAssignmentPanel";

export default function RolesPermissionsComponent() {
    const [selectedRole, setSelectedRole] = useState("vendor");
    const [showPermissionManager, setShowPermissionManager] = useState(false);
    const [showAssignPermissionsPanel, setShowAssignPermissionsPanel] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // Get permissions for the selected role
    const { data: rolePermissions = {}, isLoading: isLoadingPermissions } = useGetRolePermissionsByRoleQuery(selectedRole);
    const { data: allPermissionsData, isLoading: isLoadingAllPermissions, error: permissionsError } = useGetPermissionsQuery();
    const [assignRolePermissions, { isLoading: isAssigning }] = useAssignRolePermissionsMutation();

    // Safely extract permissions array
    const allPermissions = Array.isArray(allPermissionsData) ? allPermissionsData : 
                          allPermissionsData?.results ? allPermissionsData.results : 
                          allPermissionsData?.data ? allPermissionsData.data : [];

    // Debug logging
    console.log('Raw all permissions data:', allPermissionsData);
    console.log('Processed all permissions:', allPermissions);
    console.log('Permissions loading:', isLoadingAllPermissions);
    console.log('Permissions error:', permissionsError);

    // Initialize selected permissions when role changes
    useEffect(() => {
        if (rolePermissions.permissions && Array.isArray(rolePermissions.permissions)) {
            setSelectedPermissions(rolePermissions.permissions.map(p => p.id));
        }
    }, [rolePermissions, selectedRole]);

    const handlePermissionToggle = (permissionId) => {
        setSelectedPermissions(prev => {
            const newSelection = prev.includes(permissionId)
                ? prev.filter(id => id !== permissionId)
                : [...prev, permissionId];
            return newSelection;
        });
    };

    const handleAssignPermissions = async () => {
        try {
            await assignRolePermissions({
                role: selectedRole,
                permissions: selectedPermissions
            }).unwrap();
            setShowAssignPermissionsPanel(false);
            alert('Permissions assigned successfully!');
        } catch (error) {
            console.error('Error assigning permissions:', error);
            alert('Error assigning permissions. Please try again.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <RolesPermissionsHeader onManagePermissions={() => setShowPermissionManager(true)} />
            
            <RolesPermissionsInfoCard />

            <RoleSelectionGrid 
                selectedRole={selectedRole}
                onRoleSelect={setSelectedRole}
            />

            <SelectedRolePermissions 
                selectedRole={selectedRole}
                rolePermissions={rolePermissions}
                isLoadingPermissions={isLoadingPermissions}
                onAssignPermissions={() => setShowAssignPermissionsPanel(true)}
            />

            <PermissionAssignmentPanel 
                showPanel={showAssignPermissionsPanel}
                selectedRole={selectedRole}
                allPermissions={allPermissions}
                selectedPermissions={selectedPermissions}
                isLoadingAllPermissions={isLoadingAllPermissions}
                isAssigning={isAssigning}
                onClose={() => setShowAssignPermissionsPanel(false)}
                onPermissionToggle={handlePermissionToggle}
                onAssignPermissions={handleAssignPermissions}
            />
        </div>
    );
}
