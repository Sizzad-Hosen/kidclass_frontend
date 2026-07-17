"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Edit3 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { CourseForm } from "@/components/course-management/course-form";
import { AdminCard, AdminShell } from "@/components/kidclass/admin-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetManagedCourseQuery } from "@/redux/features/course-management/courseManagementApi";

export default function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params); const router = useRouter(); const { data, isLoading } = useGetManagedCourseQuery(courseId);
  return <ProtectedRoute allowedRoles={["admin","super_admin"]}><AdminShell><div className="mx-auto max-w-4xl"><div className="mb-6 flex items-center gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-sky-100 text-sky-700"><Edit3 /></span><div><p className="text-sm font-bold uppercase tracking-widest text-sky-700">Course Management</p><h1 className="text-3xl font-black">Edit course details</h1></div></div>{isLoading || !data ? <Skeleton className="h-[620px] rounded-3xl" /> : <AdminCard className="p-6 sm:p-8"><CourseForm course={data} onSuccess={() => router.push(`/course-management/courses/${courseId}/builder`)} /></AdminCard>}</div></AdminShell></ProtectedRoute>;
}
