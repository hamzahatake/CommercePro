"use client";

import { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useRefreshTokenMutation } from '@/features/api/apiSlice';
import { loginSuccess, logout } from '@/features/auth/authSlice';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, accessToken, refreshToken, isAuthenticated } = useSelector(state => state.auth);
    const [refreshTokenMutation] = useRefreshTokenMutation();

    // Auto-refresh token when it expires
    useEffect(() => {
        if (refreshToken && !accessToken) {
            refreshTokenMutation({ refresh: refreshToken })
                .unwrap()
                .then((result) => {
                    dispatch(loginSuccess({
                        user,
                        accessToken: result.access,
                        refreshToken: result.refresh,
                    }));
                })
                .catch(() => {
                    dispatch(logout());
                    router.push('/');
                });
        }
    }, [refreshToken, accessToken, refreshTokenMutation, dispatch, user, router]);
    
    const value = {
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        isCustomer: user?.role === 'customer' || user?.role === 'user',
        isVendor: user?.role === 'vendor',
        isManager: user?.role === 'manager',
        isAdmin: user?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
