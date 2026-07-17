import { baseApi } from "@/redux/api/baseApi";
import type { ApiResponse, UserRole } from "@/redux/features/auth/types";

export type ManagedUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole | string;
  classLevel?: string;
  grade?: string;
  avatar?: string;
  status?: "active" | "inactive" | "enrolled" | string;
  phone?: string;
  address?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  coursesCount?: number;
  progress?: number;
  averageProgress?: number;
  enrollmentDate?: string;
  createdAt?: string;
  updatedAt?: string;
  medicalNotes?: string;
  [key: string]: unknown;
};

export type UserListParams = {
  search?: string;
  role?: string;
  status?: string;
  classLevel?: string;
  page?: number;
  limit?: number;
};

export type UserListResponse = {
  users: ManagedUser[];
  total?: number;
  page?: number;
  limit?: number;
};

export type CreateUserPayload = Partial<ManagedUser> & {
  password?: string;
};

export type UpdateUserPayload = Partial<ManagedUser>;

const unwrap = <T>(response: ApiResponse<T>) => response.data;

const normalizeUsers = (response: ApiResponse<ManagedUser[] | UserListResponse>) => {
  const data = response.data;

  if (Array.isArray(data)) {
    return { users: data, total: data.length };
  }

  return {
    ...data,
    users: data.users ?? [],
  };
};

export const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, UserListParams | void>({
      query: (params) => ({
        url: "/users",
        params: params ?? undefined,
      }),
      transformResponse: normalizeUsers,
      providesTags: (result) => [
        "Users",
        ...(result?.users.map((user) => ({
          type: "User" as const,
          id: user._id ?? user.id,
        })) ?? []),
      ],
    }),
    getUser: builder.query<ManagedUser, string>({
      query: (userId) => `/users/${userId}`,
      transformResponse: unwrap<ManagedUser>,
      providesTags: (_result, _error, userId) => [{ type: "User", id: userId }],
    }),
    createUser: builder.mutation<ManagedUser, CreateUserPayload>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      transformResponse: unwrap<ManagedUser>,
      invalidatesTags: ["Users", "Dashboard"],
    }),
    updateUser: builder.mutation<
      ManagedUser,
      { userId: string; body: UpdateUserPayload }
    >({
      query: ({ userId, body }) => ({
        url: `/users/${userId}`,
        method: "PATCH",
        body,
      }),
      transformResponse: unwrap<ManagedUser>,
      invalidatesTags: (_result, _error, { userId }) => [
        "Users",
        "Dashboard",
        { type: "User", id: userId },
      ],
    }),
    deleteUser: builder.mutation<ManagedUser, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      transformResponse: unwrap<ManagedUser>,
      invalidatesTags: ["Users", "Dashboard"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
} = userManagementApi;
