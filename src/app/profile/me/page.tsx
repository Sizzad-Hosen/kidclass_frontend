"use client";

import { Mail, ShieldCheck, UserRound } from "lucide-react";

import { ChangePasswordCard } from "@/components/auth/change-password-card";
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
import { useLogout } from "@/redux/features/auth/useLogout";
import { useAppSelector } from "@/redux/hooks";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);
  const { logout, isLoading: isLoggingOut } = useLogout();

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <main className="px-5 py-8 sm:px-8 lg:px-12">
          <section className="mx-auto max-w-4xl space-y-6">
            <Card className="rounded-3xl border-sky-100 bg-white shadow-xl shadow-sky-900/10">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-sky-700">
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your student account and password.</CardDescription>
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

            <ChangePasswordCard />
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
