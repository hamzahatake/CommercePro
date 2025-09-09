import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserInfo = {
  id: string;
  name: string;
  email: string;
  // add more fields as needed
};

type AuthState = {
  user: UserInfo | null;
  token: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
};

const userInfoStr = localStorage.getItem("userInfo");
const tokenStr = localStorage.getItem("token");
const refreshStr = localStorage.getItem("refresh_token");

const initialState: AuthState = {
  user: userInfoStr ? (JSON.parse(userInfoStr) as UserInfo) : null,
  token: tokenStr || null,
  refresh: refreshStr || null,
  isAuthenticated: !!tokenStr,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserInfo; token: string; refresh: string }>
    ) => {
      const { user, token, refresh } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.refresh = refresh;

      localStorage.setItem("userInfo", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("refresh_token", refresh);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refresh = null;
      state.isAuthenticated = false;

      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
