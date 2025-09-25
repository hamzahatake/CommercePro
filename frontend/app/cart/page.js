import CartPageContent from "@/components/cart/CartPageContent";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CartPage() {
    return (
        <ProtectedRoute requireAuth={true} allowedRoles={['customer', 'user']}>
            <CartPageContent />
        </ProtectedRoute>
    );
}