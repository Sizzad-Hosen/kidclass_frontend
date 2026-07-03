import type { AuthState } from "@/redux/features/auth/types";

const AUTH_STORAGE_KEY = "kidclass_auth";

export const emptyAuthState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

export const loadAuthState = (): AuthState => {
  if (typeof window === "undefined") {
    return emptyAuthState;
  }

  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

    if (!rawValue) {
      return emptyAuthState;
    }

    return { ...emptyAuthState, ...JSON.parse(rawValue) };
  } catch {
    return emptyAuthState;
  }
};

export const saveAuthState = (state: AuthState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
};

export const clearAuthState = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};
