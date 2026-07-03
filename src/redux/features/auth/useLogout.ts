"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import { logout } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";

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
