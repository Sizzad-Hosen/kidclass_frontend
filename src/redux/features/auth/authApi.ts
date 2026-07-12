import { baseApi } from "@/redux/api/baseApi";
import type {
  ApiResponse,
  AuthPayload,
  AuthUser,
} from "@/redux/features/auth/types";

const authRoute = "/auth";

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
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

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<AuthPayload>, RegisterRequest>({
      query: (body) => ({
        url: `${authRoute}/register`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Me"],
    }),
    login: builder.mutation<ApiResponse<AuthPayload>, LoginRequest>({
      query: (body) => ({
        url: `${authRoute}/login`,
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
        url: `${authRoute}/forgot-password`,
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<
      ApiResponse<{ reset: boolean } | null>,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: `${authRoute}/reset-password`,
        method: "POST",
        body,
      }),
    }),
    changePassword: builder.mutation<
      ApiResponse<{ changed: boolean }>,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: `${authRoute}/change-password`,
        method: "POST",
        body,
      }),
    }),
    refreshToken: builder.mutation<ApiResponse<AuthPayload>, RefreshTokenRequest>({
      query: (body) => ({
        url: `${authRoute}/refresh-token`,
        method: "POST",
        body,
      }),
    }),
    logoutUser: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: `${authRoute}/logout`,
        method: "POST",
      }),
      invalidatesTags: ["Me"],
    }),
    me: builder.query<ApiResponse<AuthUser>, void>({
      query: () => `${authRoute}/me`,
      providesTags: ["Me"],
    }),
  }),
});

export const {
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useLazyMeQuery,
  useLoginMutation,
  useLogoutUserMutation,
  useMeQuery,
  useRefreshTokenMutation,
  useRegisterMutation,
  useResetPasswordMutation,
} = authApi;
