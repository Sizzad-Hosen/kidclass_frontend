"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { useMeQuery } from "@/features/auth/authApi";
import { logout, setUser } from "@/features/auth/authSlice";
import { getAuthErrorMessage } from "@/features/auth/auth-errors";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { UserRole } from "@/lib/auth-types";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
};

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const { data, error, isFetching } = useMeQuery(undefined, {
    skip: !accessToken,
  });

  useEffect(() => {
    if (!accessToken) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [accessToken, pathname, router]);

  useEffect(() => {
    if (data?.data) {
      dispatch(setUser(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(getAuthErrorMessage(error, "Please sign in again."));
      dispatch(logout());
      router.replace("/login");
    }
  }, [dispatch, error, router]);

  useEffect(() => {
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      toast.error("You do not have permission to view that page.");
      router.replace("/login");
    }
  }, [allowedRoles, router, user]);

  if (!accessToken || isFetching || !user) {
    return (
      <main className="grid min-h-screen place-items-center bg-sky-50">
        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-sky-700 shadow-lg">
          <Loader2 className="size-4 animate-spin" />
          Checking your session
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
