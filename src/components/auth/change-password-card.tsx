"use client";

import { useState, type FormEvent } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PasswordInput } from "@/components/auth/auth-input";
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

export function ChangePasswordCard() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
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
            className="h-12 rounded-full bg-[#14698d] px-7 font-bold text-white hover:bg-[#0d5877] sm:col-span-2 sm:w-fit"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <KeyRound />}
            {isLoading ? "Changing password..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
