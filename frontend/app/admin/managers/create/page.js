"use client";

import CreateManagerFormComponent from "@/components/admin/CreateManagerForm";
import AccessDeniedError from "@/components/auth/AccessDeniedError";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateManagerPage() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const authUser = useSelector(state => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated || authUser?.role !== 'admin') {
            router.push('/login');
        }
    }, [isAuthenticated, authUser, router]);

    if (!isAuthenticated || authUser?.role !== 'admin') {
        return <AccessDeniedError role="admin" loginPath="/login" />;
    }

    return <CreateManagerFormComponent />;
}