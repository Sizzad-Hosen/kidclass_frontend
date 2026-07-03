"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useLogoutUserMutation } from "@/features/auth/authApi";
import { logout } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/lib/hooks";

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      toast.success("Signed out successfully.");
    } catch {
      toast.message("Signed out locally.");
    } finally {
      dispatch(logout());
      router.replace("/login");
    }
  };

  return { logout: handleLogout, isLoading };
}
