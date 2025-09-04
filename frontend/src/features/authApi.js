import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api" }),
    endpoints: (builder) => ({
        getLogin: builder.mutation({
            query:({ username, password }) => ({
                url: "/auth/login/",
                method: "POST",
                body: { username, password }
            })
        }),
        getRegister: builder.mutation({
            query:({ username, email, password }) => ({
                url: "/auth/register/",
                method: "POST",
                body: { username, email, password }
            }) 
        }),
        getRereshToken: builder.mutation({
            query:({ refresh }) => ({
                url: "/auth/token/refresh/",
                method: "POST",
                body: { refresh }
            })
        }),
    }),
});

export const { useGetLoginMutation, useGetRegisterMutation, useGetRefreshTokenMutation } = authApi