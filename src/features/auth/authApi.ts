import { baseApi } from "@/lib/api";
import type { ApiResponse, AuthPayload, AuthUser } from "@/lib/auth-types";

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  role: "student" | "admin";
  classLevel?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  password: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<AuthPayload>, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
    login: builder.mutation<ApiResponse<AuthPayload>, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
    forgotPassword: builder.mutation<
      ApiResponse<{ email: string } | null>,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      ApiResponse<{ reset: boolean } | null>,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    refreshToken: builder.mutation<ApiResponse<AuthPayload>, RefreshTokenRequest>({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body,
      }),
    }),
    logoutUser: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Me"],
    }),
    me: builder.query<ApiResponse<AuthUser>, void>({
      query: () => "/auth/me",
      providesTags: ["Me"],
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useLazyMeQuery,
  useLoginMutation,
  useLogoutUserMutation,
  useMeQuery,
  useRefreshTokenMutation,
  useRegisterMutation,
  useResetPasswordMutation,
} = authApi;
