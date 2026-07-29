"use client";

import { type FormEvent } from "react";
import { Loader2, Mail, ShieldCheck, UserRound } from "lucide-react";
import { toast } from "sonner";

import { ChangePasswordCard } from "@/components/auth/change-password-card";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminShell } from "@/components/kidclass/admin-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getAuthErrorMessage } from "@/redux/features/auth/auth-errors";
import { setUser } from "@/redux/features/auth/authSlice";
import type { AuthUser } from "@/redux/features/auth/types";
import { useUpdateUserMutation } from "@/redux/features/user-management/userManagementApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

export default function AdminSettingsPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const handleEmailChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userId = String(user?.id ?? user?._id ?? "");
    const form = new FormData(event.currentTarget);
    const nextEmail = String(form.get("email") ?? "").trim().toLowerCase();

    if (!userId) {
      toast.error("Could not identify the current account.");
      return;
    }

    if (!nextEmail) {
      toast.error("Email is required.");
      return;
    }

    try {
      const updated = await updateUser({
        userId,
        body: { email: nextEmail },
      }).unwrap();
      dispatch(setUser({ ...user, email: updated.email ?? nextEmail } as AuthUser));
      toast.success("Email updated successfully.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Could not update email."));
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminShell>
        <div className="mx-auto max-w-4xl space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-[#0d6386]">Account Settings</h1>
            <p className="mt-2 text-lg text-slate-600">
              Manage your admin email and password.
            </p>
          </div>

          <Card className="rounded-3xl border-sky-100 bg-white shadow-xl shadow-sky-900/10">
            <CardHeader>
              <CardTitle className="text-2xl text-sky-700">Admin Account</CardTitle>
              <CardDescription>Your current account details and sign-in email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <AccountItem icon={UserRound} label="Name" value={user?.name ?? "Admin User"} />
                <AccountItem
                  icon={ShieldCheck}
                  label="Role"
                  value={user?.role?.replace("_", " ") ?? "admin"}
                />
              </div>

              <form className="border-t border-slate-200 pt-6" key={user?.email} onSubmit={handleEmailChange}>
                <label className="block max-w-xl">
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Mail className="size-4" />
                    Email address
                  </span>
                  <Input
                    autoComplete="email"
                    className="h-12"
                    defaultValue={user?.email ?? ""}
                    name="email"
                    placeholder="admin@example.com"
                    required
                    type="email"
                  />
                </label>
                <Button
                  className="mt-4 h-11 bg-[#14698d] px-6 hover:bg-[#0d5877]"
                  disabled={isLoading}
                  type="submit"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : <Mail />}
                  {isLoading ? "Saving..." : "Update Email"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <ChangePasswordCard />
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}

function AccountItem({
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
      <p className="font-semibold capitalize">{value}</p>
    </div>
  );
}
