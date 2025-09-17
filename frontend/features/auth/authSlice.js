import { createSlice } from "@reduxjs/toolkit";

// Initialize state safely for SSR
const getInitialState = () => {
    if (typeof window === 'undefined') {
        return {
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
        };
    }

    const userInfoStr = localStorage.getItem("userInfo");
    let user = null;
    try {
        user = userInfoStr ? JSON.parse(userInfoStr) : null;
    } catch {
        user = null;
    }

    const tokenStr = localStorage.getItem("accessToken");
    const refreshStr = localStorage.getItem("refreshToken");

    return {
        user: user,
        accessToken: tokenStr || null,
        refreshToken: refreshStr || null,
        isAuthenticated: !!tokenStr,
    };
};

const initialState = getInitialState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { user, accessToken, refreshToken } = action.payload;
            state.user = user;
            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;

            if (typeof window !== 'undefined') {
                localStorage.setItem("userInfo", JSON.stringify(user));
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("refreshToken", refreshToken);
            }
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;

            if (typeof window !== 'undefined') {
                localStorage.removeItem("userInfo");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        },
        refreshAccessToken: (state, action) => {
            state.accessToken = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem("accessToken", action.payload);
            }
        },
    },
});

export const { loginSuccess, logout, refreshAccessToken } = authSlice.actions;
export default authSlice.reducer;
