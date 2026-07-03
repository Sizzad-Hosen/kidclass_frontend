import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import {
  clearAuthState,
  emptyAuthState,
  saveAuthState,
} from "@/redux/features/auth/authStorage";
import type { AuthPayload, AuthState, AuthUser } from "@/redux/features/auth/types";

const normalizeAuthPayload = (
  payload: AuthPayload,
  currentState: AuthState = emptyAuthState,
): AuthState => ({
  user: (payload.user ?? currentState.user) as AuthUser | null,
  accessToken: payload.accessToken ?? payload.token ?? payload.access_token ?? null,
  refreshToken: payload.refreshToken ?? payload.refresh_token ?? currentState.refreshToken,
});

const authSlice = createSlice({
  name: "auth",
  initialState: emptyAuthState,
  reducers: {
    hydrateAuth: (_state, action: PayloadAction<AuthState>) => action.payload,
    setCredentials: (state, action: PayloadAction<AuthPayload>) => {
      const nextState = normalizeAuthPayload(action.payload, state);
      saveAuthState(nextState);
      return nextState;
    },
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      saveAuthState({
        user: action.payload,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      });
    },
    logout: () => {
      clearAuthState();
      return emptyAuthState;
    },
  },
});

export const { hydrateAuth, logout, setCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;
