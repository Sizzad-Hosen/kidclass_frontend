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

const AUTH_URL = "/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<AuthPayload>, RegisterRequest>({
      query: (body) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
    login: builder.mutation<ApiResponse<AuthPayload>, LoginRequest>({
      query: (body) => ({
        url: `${AUTH_URL}/login`,
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
        url: `${AUTH_URL}/forgot-password`,
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      ApiResponse<{ reset: boolean } | null>,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: `${AUTH_URL}/reset-password`,
        method: "POST",
        body,
      }),
    }),
    refreshToken: builder.mutation<ApiResponse<AuthPayload>, RefreshTokenRequest>({
      query: (body) => ({
        url: `${AUTH_URL}/refresh-token`,
        method: "POST",
        body,
      }),
    }),
    logoutUser: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["Me"],
    }),
    me: builder.query<ApiResponse<AuthUser>, void>({
      query: () => `${AUTH_URL}/me`,
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
