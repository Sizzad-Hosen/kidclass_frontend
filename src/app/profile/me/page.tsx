"use client";

import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLogout } from "@/redux/features/auth/useLogout";
import { useAppSelector } from "@/redux/hooks";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const { logout, isLoading } = useLogout();

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-sky-50 px-6 py-10">
        <section className="mx-auto max-w-3xl">
          <Card className="rounded-3xl border-sky-100 bg-white shadow-xl shadow-sky-900/10">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-sky-700">
                My KidClass Profile
              </CardTitle>
              <CardDescription>
                Your current account is loaded from the protected /auth/me API.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-sky-50 p-4">
                  <UserRound className="size-5 text-sky-700" />
                  <p className="mt-3 text-sm text-slate-500">Name</p>
                  <p className="font-semibold">{user?.name ?? "KidClass User"}</p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-4">
                  <Mail className="size-5 text-sky-700" />
                  <p className="mt-3 text-sm text-slate-500">Email</p>
                  <p className="break-words font-semibold">
                    {user?.email ?? "Not provided"}
                  </p>
                </div>
                <div className="rounded-2xl bg-sky-50 p-4">
                  <ShieldCheck className="size-5 text-sky-700" />
                  <p className="mt-3 text-sm text-slate-500">Role</p>
                  <p className="font-semibold">{user?.role ?? "student"}</p>
                </div>
              </div>

              <Button
                className="h-11 rounded-full bg-sky-700 px-6 text-white hover:bg-sky-600"
                disabled={isLoading}
                onClick={logout}
              >
                {isLoading ? "Signing out..." : "Logout"}
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </ProtectedRoute>
  );
}
