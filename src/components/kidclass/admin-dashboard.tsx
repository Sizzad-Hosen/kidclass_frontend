"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckSquare,
  Shapes,
  TrendingUp,
  UserRound,
} from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminCard, AdminShell } from "@/components/kidclass/admin-shell";
import { Progress } from "@/components/ui/progress";
import {
  useGetDashboardCoursesQuery,
  useGetDashboardEnrollmentsQuery,
  useGetDashboardMetadataQuery,
  useGetDashboardOverviewQuery,
  useGetDashboardRecentActivityQuery,
  useGetDashboardStudentsQuery,
} from "@/redux/features/dashboard/dashboardApi";
import type { DashboardActivity } from "@/redux/features/dashboard/dashboardApi";
import { useAppSelector } from "@/redux/hooks";

const fallbackProgress = [
  { label: "Bangla & Language", value: 82, color: "bg-[#1f7199]" },
  { label: "Arts & Creative", value: 94, color: "bg-[#86d7bd]" },
  { label: "Math & Logic", value: 68, color: "bg-[#b58b68]" },
  { label: "English", value: 75, color: "bg-[#6fb7e8]" },
];

const fallbackActivity = [
  {
    id: "1",
    userName: "Liam Hudson",
    action: "Completed Module",
    target: "Space Exploration 101",
    status: "Success",
    time: "2 mins ago",
  },
  {
    id: "2",
    userName: "Maya Chen",
    action: "Joined Course",
    target: "Basic Number Theory",
    status: "Success",
    time: "18 mins ago",
  },
  {
    id: "3",
    userName: "Jordan Smith",
    action: "Submitted Assignment",
    target: "Bangla Vocabulary",
    status: "Review",
    time: "1 hour ago",
  },
];

export function AdminDashboard() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: overview } = useGetDashboardOverviewQuery();
  const { data: metadata } = useGetDashboardMetadataQuery();
  const { data: activity } = useGetDashboardRecentActivityQuery();
  const { data: courses } = useGetDashboardCoursesQuery();
  const { data: students } = useGetDashboardStudentsQuery();
  const { data: enrollments } = useGetDashboardEnrollmentsQuery();

  const totalStudents =
    overview?.totalStudents ?? overview?.students ?? students?.total ?? 1248;
  const totalCourses =
    overview?.totalCourses ?? overview?.courses ?? courses?.length ?? 42;
  const totalEnrollments =
    overview?.totalEnrollments ?? overview?.enrollments ?? enrollments?.total ?? 3800;
  const categoryCount = metadata?.categories ?? 6;
  const rows: DashboardActivity[] = activity?.length ? activity : fallbackActivity;
  const progressRows = courses?.length
    ? courses.slice(0, 4).map((course, index) => ({
        label: course.category ?? course.title ?? fallbackProgress[index]?.label,
        value: course.completionRate ?? course.progress ?? fallbackProgress[index]?.value ?? 70,
        color: fallbackProgress[index]?.color ?? "bg-[#1f7199]",
      }))
    : fallbackProgress;

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminShell>
        <section>
          <h1 className="text-4xl font-bold tracking-normal">
            Good Morning, {user?.name?.split(" ")[0] ?? "Admin"}!
          </h1>
          <p className="mt-3 text-xl text-slate-600">
            Here&apos;s what&apos;s happening in your academy today.
          </p>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <StatCard
              icon={<UserRound className="size-7" />}
              label="Total Students"
              meta="+12% this month"
              value={formatCompact(totalStudents)}
            />
            <StatCard
              icon={<Shapes className="size-7" />}
              label="Courses"
              meta={`Across ${categoryCount} categories`}
              tone="warm"
              value={formatCompact(totalCourses)}
            />
            <StatCard
              icon={<CheckSquare className="size-7" />}
              label="Enrollments"
              meta="Active sessions"
              value={formatCompact(totalEnrollments)}
            />
          </div>
        </section>

        <AdminCard className="mt-8 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-8">
            <div>
              <h2 className="text-2xl font-semibold">Courses</h2>
              <p className="mt-1 text-slate-600">
                Published and draft courses available to administrators.
              </p>
            </div>
            <Link
              className="rounded-xl bg-[#1f7199] px-5 py-3 font-semibold text-white"
              href="/course-management/courses"
            >
              Manage All Courses
            </Link>
          </div>
          {courses?.length ? (
            <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.slice(0, 6).map((course, index) => (
                <article
                  className="rounded-2xl border border-slate-200 p-5"
                  key={course._id ?? `${course.title}-${index}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sky-100 text-sky-700">
                      <BookOpen className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-bold">{course.title ?? "Untitled course"}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${course.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm capitalize text-slate-500">
                        {course.category ?? "general"} · {course.milestoneCount ?? 0} milestones
                      </p>
                    </div>
                  </div>
                  {course._id ? (
                    <Link
                      className="mt-4 inline-flex font-semibold text-[#14698d]"
                      href={`/course-management/courses/${course._id}/builder`}
                    >
                      Open Builder
                    </Link>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">No courses have been created yet.</div>
          )}
        </AdminCard>

        <AdminCard className="mt-8 max-w-5xl p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Student Progress Overview</h2>
              <p className="mt-1 text-lg text-slate-600">
                Average completion rates by department
              </p>
            </div>
            <button className="rounded-xl bg-slate-100 px-6 py-3 font-semibold" type="button">
              Last 30 Days
            </button>
          </div>
          <div className="mt-9 space-y-8">
            {progressRows.map((item) => (
              <div key={item.label}>
                <div className="mb-3 flex justify-between text-lg">
                  <span>{item.label}</span>
                  <span className="font-semibold text-[#14698d]">{item.value}%</span>
                </div>
                <Progress
                  className="h-4 bg-slate-100"
                  indicatorClassName={item.color}
                  value={item.value}
                />
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard className="mt-8 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 p-8">
            <h2 className="text-2xl font-semibold">Recent Activity</h2>
            <button className="text-lg font-semibold text-[#14698d]" type="button">
              View All Activities
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-slate-50 text-sm uppercase tracking-widest text-slate-700">
                <tr>
                  <th className="px-8 py-5">User</th>
                  <th className="px-8 py-5">Action</th>
                  <th className="px-8 py-5">Target</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Time</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr className="border-t border-slate-100" key={item._id ?? item.id}>
                    <td className="px-8 py-6">
                      <span className="mr-4 inline-grid size-10 place-items-center rounded-full bg-[#d9edf8] text-sm font-bold text-[#14698d]">
                        {initials(item.userName ?? item.user ?? "User")}
                      </span>
                      <span className="font-semibold">{item.userName ?? item.user}</span>
                    </td>
                    <td className="px-8 py-6">{item.action}</td>
                    <td className="px-8 py-6">{item.target}</td>
                    <td className="px-8 py-6">
                      <span className="rounded-full bg-[#a9ebd2] px-4 py-1 text-sm font-semibold text-[#207055]">
                        {item.status ?? "Success"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-slate-600">
                      {item.time ?? item.createdAt ?? "Just now"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </AdminShell>
    </ProtectedRoute>
  );
}

function StatCard({
  icon,
  label,
  meta,
  tone = "blue",
  value,
}: {
  icon: React.ReactNode;
  label: string;
  meta: string;
  tone?: "blue" | "warm";
  value: string;
}) {
  return (
    <AdminCard className="min-h-64 p-8">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-xl uppercase tracking-widest text-slate-700">{label}</p>
          <p className="mt-6 text-5xl font-bold">{value}</p>
          <p className="mt-6 flex items-center gap-2 text-lg text-[#1f6f56]">
            <TrendingUp className="size-4" />
            {meta}
          </p>
        </div>
        <div
          className={`grid size-16 place-items-center rounded-2xl ${
            tone === "warm" ? "bg-[#f0e7df] text-[#8d6343]" : "bg-[#d9edf8] text-[#14698d]"
          }`}
        >
          {icon}
        </div>
      </div>
    </AdminCard>
  );
}

function formatCompact(value: number) {
  if (value >= 1000) {
    return Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: value >= 10000 ? 0 : 1,
    }).format(value);
  }

  return Intl.NumberFormat("en").format(value);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
