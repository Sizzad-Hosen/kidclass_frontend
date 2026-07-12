"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, Mail, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";

import { PasswordInput } from "@/components/auth/auth-input";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { StudentLayout } from "@/components/kidclass/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthErrorMessage } from "@/redux/features/auth/auth-errors";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { useLogout } from "@/redux/features/auth/useLogout";
import { useAppSelector } from "@/redux/hooks";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const { logout, isLoading: isLoggingOut } = useLogout();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      const response = await changePassword({ currentPassword, newPassword }).unwrap();
      toast.success(response.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Could not change password. Try again."));
    }
  };

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <main className="px-5 py-8 sm:px-8 lg:px-12">
          <section className="mx-auto max-w-4xl space-y-6">
            <Card className="rounded-3xl border-sky-100 bg-white shadow-xl shadow-sky-900/10">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-sky-700">
                  My KidClass Profile
                </CardTitle>
                <CardDescription>Your student account details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <ProfileItem icon={UserRound} label="Name" value={user?.name ?? "KidClass User"} />
                  <ProfileItem icon={Mail} label="Email" value={user?.email ?? "Not provided"} />
                  <ProfileItem icon={ShieldCheck} label="Role" value={user?.role ?? "student"} />
                </div>

                <Button
                  className="h-11 rounded-full bg-sky-700 px-6 text-white hover:bg-sky-600"
                  disabled={isLoggingOut}
                  onClick={logout}
                >
                  {isLoggingOut ? "Signing out..." : "Logout"}
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-sky-100 bg-white shadow-xl shadow-sky-900/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-yellow-100 text-yellow-700">
                    <KeyRound className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-sky-700">Change Password</CardTitle>
                    <CardDescription>Use at least 8 characters for your new password.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4 sm:grid-cols-2" onSubmit={handlePasswordChange}>
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-semibold">Current password</span>
                    <PasswordInput
                      autoComplete="current-password"
                      onChange={(event) => setCurrentPassword(event.target.value)}
                      placeholder="Enter current password"
                      required
                      value={currentPassword}
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">New password</span>
                    <PasswordInput
                      autoComplete="new-password"
                      minLength={8}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="Enter new password"
                      required
                      value={newPassword}
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Confirm new password</span>
                    <PasswordInput
                      autoComplete="new-password"
                      minLength={8}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Repeat new password"
                      required
                      value={confirmPassword}
                    />
                  </label>
                  <Button
                    className="h-12 rounded-full bg-yellow-600 px-7 font-bold text-white hover:bg-yellow-500 sm:col-span-2 sm:w-fit"
                    disabled={isChangingPassword}
                    type="submit"
                  >
                    {isChangingPassword ? "Changing password..." : "Change Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>
        </main>
      </StudentLayout>
    </ProtectedRoute>
  );
}

function ProfileItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-sky-50 p-4">
      <Icon className="size-5 text-sky-700" />
      <p className="mt-3 text-sm text-slate-500">{label}</p>
      <p className="break-words font-semibold capitalize">{value}</p>
    </div>
  );
}
