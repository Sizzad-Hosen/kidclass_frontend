"use client";

import Link from "next/link";
import { BookOpen, UserRound } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/lib/hooks";

export default function StudentDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <main className="min-h-screen bg-emerald-50 px-6 py-10">
        <section className="mx-auto max-w-4xl">
          <Card className="rounded-3xl border-emerald-100 bg-white shadow-xl shadow-emerald-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-3xl font-bold text-sky-700">
                <BookOpen className="size-8" />
                Student Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-lg text-slate-600">
                Welcome, {user?.name ?? "student"}. Your protected student route
                is ready.
              </p>
              <Link
                className="inline-flex h-10 items-center gap-2 rounded-full bg-sky-700 px-4 text-sm font-semibold text-white hover:bg-sky-600"
                href="/profile/me"
              >
                <UserRound className="size-4" />
                View Profile
              </Link>
            </CardContent>
          </Card>
        </section>
      </main>
    </ProtectedRoute>
  );
}
