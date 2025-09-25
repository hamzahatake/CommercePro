"use client";

import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Lock } from 'lucide-react';

export default function ProtectedRoute({ 
    children, 
    requireAuth = true, 
    allowedRoles = [], 
    redirectTo = '/login/customer' 
}) {
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (requireAuth && !isAuthenticated) {
            router.push(redirectTo);
            return;
        }

        if (requireAuth && allowedRoles.length > 0 && user) {
            const hasAllowedRole = allowedRoles.includes(user.role);
            if (!hasAllowedRole) {
                // Redirect based on user role
                if (user.role === 'vendor') {
                    router.push('/login/vendor');
                } else {
                    router.push('/login/customer');
                }
                return;
            }
        }
    }, [isAuthenticated, user, requireAuth, allowedRoles, redirectTo, router]);

    // Show loading while checking authentication
    if (requireAuth && !isAuthenticated) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: "#EDEAE4" }}>
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: "#000000" }} />
                    <p className="text-lg font-medium" style={{ color: "#1A1A1A" }}>Checking authentication...</p>
                </div>
            </div>
        );
    }

    // Show access denied if role doesn't match
    if (requireAuth && allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: "#EDEAE4" }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md mx-auto px-6"
                >
                    <Lock className="h-24 w-24 mx-auto mb-6" style={{ color: "#888888" }} />
                    <h2 className="text-3xl font-light mb-4" style={{ color: "#1A1A1A" }}>Access Denied</h2>
                    <p className="text-lg mb-8" style={{ color: "#555555" }}>
                        You don't have permission to access this page.
                    </p>
                    <button 
                        onClick={() => router.push('/')}
                        className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:opacity-90"
                        style={{ backgroundColor: "#000000" }}
                    >
                        Go Home
                    </button>
                </motion.div>
            </div>
        );
    }

    return children;
}
