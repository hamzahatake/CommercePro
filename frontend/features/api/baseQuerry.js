import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { logout, refreshAccessToken } from "../auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/",
    prepareHeaders: (headers, { getState }) => {
        const authState = getState().auth;
        console.log('Auth state in baseQuerry:', authState);
        const token = getState().auth.accessToken;
        console.log('Token from state:', token);
        console.log('Full auth state:', getState().auth);
        if (token && token !== "null" && token !== "undefined") {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshToken = api.getState().auth.refreshToken;

        if (refreshToken) {
            const refreshResult = await baseQuery(
                {
                    url: "auth/token/refresh/",
                    method: "POST",
                    body: { refresh: refreshToken },
                },
                api,
                extraOptions
            );

            if (refreshResult?.data) {
                api.dispatch(refreshAccessToken(refreshResult.data));
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        } else {
            api.dispatch(logout());
        }
    }

    return result;
}