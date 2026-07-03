export type UserRole = "super_admin" | "admin" | "student";

export type AuthUser = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role: UserRole;
  classLevel?: string;
  avatar?: string;
  [key: string]: unknown;
};

export type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type AuthPayload = Partial<AuthState> & {
  token?: string;
  access_token?: string;
  refresh_token?: string;
};

export const roleRedirectPath = (role?: UserRole) => {
  if (role === "student") {
    return "/student/dashboard";
  }

  if (role === "admin" || role === "super_admin") {
    return "/admin/dashboard";
  }

  return "/login";
};
