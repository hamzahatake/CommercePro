"use client";

import CheckoutFormComponent from "@/components/checkout/CheckoutForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CheckoutPage() {
    return (
        <ProtectedRoute allowedRoles={['customer']}>
            <CheckoutFormComponent />
        </ProtectedRoute>
    );
}
