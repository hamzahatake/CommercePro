"use client";

import CustomerProfileComponent from "@/components/profile/CustomerProfile";
import AccessDeniedError from "@/components/auth/AccessDeniedError";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerProfile() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || authUser?.role !== 'customer') {
            router.push('/login/customer');
        }
    }, [isAuthenticated, authUser, router]);

    if (!isAuthenticated || authUser?.role !== 'customer') {
        return <AccessDeniedError role="customer" loginPath="/login/customer" />;
    }

    return <CustomerProfileComponent authUser={authUser} />;
}
