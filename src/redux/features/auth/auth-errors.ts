import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type ErrorWithMessage = {
  message?: string;
  data?: {
    message?: string;
    error?: string;
  };
};

export const getAuthErrorMessage = (error: unknown, fallback: string) => {
  if (!error) {
    return fallback;
  }

  const fetchError = error as FetchBaseQueryError;

  if (typeof fetchError.data === "object" && fetchError.data !== null) {
    const data = fetchError.data as ErrorWithMessage["data"];
    return data?.message ?? data?.error ?? fallback;
  }

  const maybeError = error as ErrorWithMessage;
  return maybeError.data?.message ?? maybeError.message ?? fallback;
};
