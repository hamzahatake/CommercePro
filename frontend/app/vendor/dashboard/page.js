import VendorDashboard from "@/components/vendor/VendorDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function VendorDashboardPage() {
    return (
        <ProtectedRoute requireAuth={true} allowedRoles={['vendor']}>
            <VendorDashboard />
        </ProtectedRoute>
    );
}
