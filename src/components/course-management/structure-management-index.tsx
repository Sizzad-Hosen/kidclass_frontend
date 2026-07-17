"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Layers3,
  Plus,
  type LucideIcon,
} from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminShell } from "@/components/kidclass/admin-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetManagedCoursesQuery } from "@/redux/features/course-management/courseManagementApi";

export function StructureManagementIndex({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  const {
    data: courses = [],
    isLoading,
    isError,
    refetch,
  } = useGetManagedCoursesQuery();

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminShell>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sky-100 text-sky-700">
              <Icon className="size-7" />
            </span>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">
                Course Structure
              </p>
              <h1 className="mt-1 text-3xl font-black text-slate-900">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-slate-500">{description}</p>
            </div>
          </div>
          <Button asChild className="h-11 rounded-xl bg-[#14698d]">
            <Link href="/course-management/courses/create">
              <Plus />
              Create Course
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Skeleton className="h-56 rounded-3xl" key={item} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-red-100 bg-white p-10 text-center">
            <h2 className="text-xl font-black">Unable to load courses</h2>
            <p className="mt-2 text-slate-500">
              Check the API on localhost:8000 and retry.
            </p>
            <Button className="mt-5" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BookOpen className="mx-auto size-12 text-sky-300" />
            <h2 className="mt-4 text-xl font-black">Create a course first</h2>
            <p className="mt-2 text-slate-500">
              Structure items always belong to a specific course.
            </p>
            <Button asChild className="mt-5">
              <Link href="/course-management/courses/create">
                Create Course
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <article
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                key={course._id}
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-sky-50 text-sky-700">
                    <Layers3 />
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${course.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-wider text-sky-700">
                  {course.category}
                </p>
                <h2 className="mt-1 line-clamp-2 text-xl font-black">
                  {course.title}
                </h2>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-500">
                  {course.description ||
                    "Add milestones, modules, lessons, and quizzes to this course."}
                </p>
                <Button asChild className="mt-5 w-full rounded-xl bg-[#14698d]">
                  <Link
                    href={`/course-management/courses/${course._id}/builder`}
                  >
                    Manage {title}
                    <ArrowRight />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </AdminShell>
    </ProtectedRoute>
  );
}
