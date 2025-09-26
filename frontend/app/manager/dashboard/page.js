"use client";

import ManagerDashboardComponent from "@/components/manager/ManagerDashboard";
import AccessDeniedError from "@/components/auth/AccessDeniedError";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagerDashboardPage() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || authUser?.role !== 'manager') {
            router.push('/login');
        }
    }, [isAuthenticated, authUser, router]);

    const handleLogout = () => {
        // Clear auth state and redirect to login
        localStorage.removeItem('persist:root');
        router.push('/login');
    };

    if (!isAuthenticated || authUser?.role !== 'manager') {
        return <AccessDeniedError role="manager" loginPath="/login" />;
    }

    return <ManagerDashboardComponent authUser={authUser} handleLogout={handleLogout} />;
}
