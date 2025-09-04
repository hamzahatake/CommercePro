import { createSlice } from "@reduxjs/toolkit";

const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;

const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : null;

const initialState = {
    user: userInfo,
    token: token,
    isAuthenticated: !!token,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;

            state.user = user;
            state.token = token;
            state.isAuthenticated = true;

            localStorage.setItem("userInfo", JSON.stringify(user));
            localStorage.setItem("token", token);
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;

            localStorage.removeItem("userInfo");
            localStorage.removeItem("token");
        },
    },
});


export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
