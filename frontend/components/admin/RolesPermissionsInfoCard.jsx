import { Info } from "lucide-react";

export default function RolesPermissionsInfoCard() {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-blue-600 mt-0.5" />
                <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Dynamic Permission Management</h3>
                    <p className="text-blue-700 text-sm">
                        This system uses dynamic role-based access control (RBAC). 
                        Administrators have complete control over which permissions are assigned to each role. 
                        No default permissions are assigned - all permissions must be manually configured.
                    </p>
                </div>
            </div>
        </div>
    );
}
