import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/authSlice";
import { baseApi } from "@/lib/api";
import { loadAuthState } from "@/lib/auth-storage";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  preloadedState: {
    auth: loadAuthState(),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
