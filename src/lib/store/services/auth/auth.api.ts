import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { AuthEndpoint } from "@/lib/endpoints/server.core.endpoints";
import {
  ServerErrorResponse,
  UserModuleRes,
} from "@/types/server/server.main.types";
import { LoginResponse } from "@/types/app/auth/auth.types";

export const AuthApi = createApi({
  reducerPath: "authapi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}${
      import.meta.env.VITE_SERVER_PREFIX
    }`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).appState.authuser.token;
      headers.set("Content-Type", "application/json");
      if (token && token !== "") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    Login: builder.mutation({
      query: (payload: { email: string; password: string }) => ({
        url: `${AuthEndpoint}/user/login`,
        method: "POST",
        body: payload,
      }),
      transformErrorResponse: (error: FetchBaseQueryError) => {
        if (error.data) {
          return error.data as ServerErrorResponse;
        }
        return error;
      },
      transformResponse: (response: LoginResponse) => {
        return response;
      },
    }),
    getUserModules: builder.query({
      query: (userId: string) => ({
        url: `${AuthEndpoint}/linkroles/user/${userId}`,
      }),
      transformErrorResponse: (error: FetchBaseQueryError) => {
        if (error.data) {
          return error.data as ServerErrorResponse;
        }
        return error;
      },
      transformResponse: (response: UserModuleRes) => {
        return response;
      },
    }),
  }),
});

export const { useLoginMutation, useGetUserModulesQuery } = AuthApi;
