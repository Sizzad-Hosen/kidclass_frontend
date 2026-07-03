import {
  createApi,
  fetchBaseQuery,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

import { logout, setCredentials } from "@/features/auth/authSlice";
import type { AuthPayload, ApiResponse } from "@/lib/auth-types";
import type { RootState } from "@/lib/store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await rawBaseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        body: { refreshToken },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const response = refreshResult.data as ApiResponse<AuthPayload>;
      api.dispatch(setCredentials(response.data));
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Me"],
  endpoints: () => ({}),
});
