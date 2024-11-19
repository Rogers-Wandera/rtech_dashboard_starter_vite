import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { AuthEndpoint } from "@/lib/endpoints/server.core.endpoints";
import {
  ServerErrorResponse,
  ServerResponse,
  UserModuleRes,
} from "@/types/server/server.main.types";
import { LoginResponse, RegisterResponse } from "@/types/app/auth/auth.types";
import { User } from "@/types/app/core/user.type";

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
        url: `${AuthEndpoint}/users/login`,
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
    Register: builder.mutation({
      query: (
        payload: Partial<User> & { confirmpassword: string; positionId: string }
      ) => ({
        url: `${AuthEndpoint}/users/register`,
        method: "POST",
        body: payload,
      }),
      transformErrorResponse: (error: FetchBaseQueryError) => {
        if (error.data) {
          return error.data as ServerErrorResponse;
        }
        return error;
      },
      transformResponse: (response: RegisterResponse) => {
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
    ResetPassword: builder.mutation({
      query: (payload: {
        userId: string;
        password: string;
        confirmpassword: string;
      }) => ({
        url: `${AuthEndpoint}/users/reset/${payload.userId}`,
        method: "POST",
        body: {
          password: payload.password,
          confirmpassword: payload.confirmpassword,
        },
      }),
      transformErrorResponse: (error: FetchBaseQueryError) => {
        if (error.data) {
          return error.data as ServerErrorResponse;
        }
        return error;
      },
      transformResponse: (response: ServerResponse) => {
        return response;
      },
    }),
    ResetPasswordLink: builder.mutation({
      query: (payload: { email: string }) => ({
        url: `${AuthEndpoint}/users/resetlink`,
        method: "POST",
        body: payload,
      }),
      transformErrorResponse: (error: FetchBaseQueryError) => {
        if (error.data) {
          return error.data as ServerErrorResponse;
        }
        return error;
      },
      transformResponse: (response: ServerResponse) => {
        return response;
      },
    }),
    FromLinkResetPassword: builder.mutation({
      query: (payload: {
        userId: string;
        token: string;
        confirmpassword: string;
        password: string;
      }) => ({
        url: `${AuthEndpoint}/users/resetpassword/${payload.userId}/${payload.token}`,
        method: "POST",
        body: {
          password: payload.password,
          confirmpassword: payload.confirmpassword,
        },
      }),
      transformErrorResponse: (error: FetchBaseQueryError) => {
        if (error.data) {
          return error.data as ServerErrorResponse;
        }
        return error;
      },
      transformResponse: (response: ServerResponse) => {
        return response;
      },
    }),
    verifyAccount: builder.mutation({
      query: (payload: { userId: string; token: string }) => ({
        url: `${AuthEndpoint}/users/verification/verify/${payload.userId}/${payload.token}`,
        method: "POST",
        body: {},
      }),
      transformErrorResponse: (error: FetchBaseQueryError) => {
        if (error.data) {
          return error.data as ServerErrorResponse;
        }
        return error;
      },
      transformResponse: (response: ServerResponse) => {
        return response;
      },
    }),
    resendVerificationLink: builder.mutation({
      query: (payload: { userId: string }) => ({
        url: `${AuthEndpoint}/users/verification/resend/${payload.userId}`,
        method: "POST",
        body: {},
      }),
      transformErrorResponse: (error: FetchBaseQueryError) => {
        if (error.data) {
          return error.data as ServerErrorResponse;
        }
        return error;
      },
      transformResponse: (response: ServerResponse & { emailsent: string }) => {
        return response;
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetUserModulesQuery,
  useResetPasswordMutation,
  useResetPasswordLinkMutation,
  useFromLinkResetPasswordMutation,
  useVerifyAccountMutation,
  useResendVerificationLinkMutation,
  useRegisterMutation,
} = AuthApi;
