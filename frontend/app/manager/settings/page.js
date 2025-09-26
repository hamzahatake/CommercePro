"use client";

import ManagerSettingsComponent from "@/components/manager/ManagerSettings";
import AccessDeniedError from "@/components/auth/AccessDeniedError";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagerSettings() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || authUser?.role !== 'manager') {
            router.push('/login');
        }
    }, [isAuthenticated, authUser, router]);

    if (!isAuthenticated || authUser?.role !== 'manager') {
        return <AccessDeniedError role="manager" loginPath="/login" />;
    }

    return <ManagerSettingsComponent authUser={authUser} />;
}