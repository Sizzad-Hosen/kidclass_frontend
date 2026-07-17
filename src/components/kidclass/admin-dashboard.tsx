"use client";

import Link from "next/link";
import { BookOpen, CheckSquare, FileVideo, UserRound } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminCard, AdminShell } from "@/components/kidclass/admin-shell";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetDashboardCoursesQuery,
  useGetDashboardOverviewQuery,
} from "@/redux/features/dashboard/dashboardApi";
import { useAppSelector } from "@/redux/hooks";

export function AdminDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const overviewQuery = useGetDashboardOverviewQuery();
  const coursesQuery = useGetDashboardCoursesQuery();
  const overview = overviewQuery.data;
  const courses = coursesQuery.data ?? [];

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminShell>
        <section>
          <h1 className="text-4xl font-bold tracking-normal">
            Welcome, {user?.name?.split(" ")[0] ?? "Admin"}
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Current academy totals from the Kidclass database.
          </p>

          {overviewQuery.isLoading ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton className="h-44 rounded-3xl" key={index} />
              ))}
            </div>
          ) : overviewQuery.isError || !overview ? (
            <AdminCard className="mt-8 p-8 text-center text-red-600">
              Dashboard totals could not be loaded from the API.
            </AdminCard>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={<UserRound />} label="Students" value={overview.users.students} />
              <StatCard icon={<BookOpen />} label="Courses" value={overview.courses.total} />
              <StatCard icon={<CheckSquare />} label="Enrollments" value={overview.enrollments.total} />
              <StatCard icon={<FileVideo />} label="Lessons" value={overview.content.lessons} />
            </div>
          )}
        </section>

        <AdminCard className="mt-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-6 sm:p-8">
            <div>
              <h2 className="text-2xl font-semibold">Courses</h2>
              <p className="mt-1 text-slate-600">Real published and draft course records.</p>
            </div>
            <Link className="rounded-xl bg-[#1f7199] px-5 py-3 font-semibold text-white" href="/course-management/courses">
              Manage Courses
            </Link>
          </div>

          {coursesQuery.isLoading ? (
            <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton className="h-36 rounded-2xl" key={index} />
              ))}
            </div>
          ) : coursesQuery.isError ? (
            <div className="p-8 text-center text-red-600">Courses could not be loaded.</div>
          ) : courses.length ? (
            <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.slice(0, 6).map((course, index) => (
                <article className="rounded-2xl border border-slate-200 p-5" key={course._id ?? index}>
                  <div className="flex items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700"><BookOpen /></span>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold">{course.title ?? "Untitled course"}</h3>
                      <p className="mt-1 text-sm capitalize text-slate-500">{course.category ?? "general"}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                        <span className={course.isPublished ? "rounded-full bg-emerald-100 px-2 py-1 text-emerald-700" : "rounded-full bg-amber-100 px-2 py-1 text-amber-700"}>
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{course.enrollmentCount ?? 0} enrollments</span>
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">{course.milestoneCount ?? 0} milestones</span>
                      </div>
                    </div>
                  </div>
                  {course._id ? <Link className="mt-4 inline-flex font-semibold text-[#14698d]" href={`/course-management/courses/${course._id}/builder`}>Open Builder</Link> : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">No courses have been created.</div>
          )}
        </AdminCard>
      </AdminShell>
    </ProtectedRoute>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <AdminCard className="p-6">
      <div className="flex items-center gap-4">
        <span className="grid size-14 place-items-center rounded-2xl bg-sky-100 text-sky-700">{icon}</span>
        <div>
          <p className="font-semibold text-slate-500">{label}</p>
          <p className="text-4xl font-black text-slate-900">{Intl.NumberFormat("en").format(value)}</p>
        </div>
      </div>
    </AdminCard>
  );
}
