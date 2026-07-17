"use client";

import { useRouter } from "next/navigation";
import { BookPlus } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { CourseForm } from "@/components/course-management/course-form";
import { AdminCard, AdminShell } from "@/components/kidclass/admin-shell";

export default function CreateCoursePage() {
  const router = useRouter();
  return <ProtectedRoute allowedRoles={["admin","super_admin"]}><AdminShell><div className="mx-auto max-w-4xl"><div className="mb-6 flex items-center gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-sky-100 text-sky-700"><BookPlus /></span><div><p className="text-sm font-bold uppercase tracking-widest text-sky-700">Course Management</p><h1 className="text-3xl font-black">Create a new course</h1></div></div><AdminCard className="p-6 sm:p-8"><CourseForm onSuccess={(course) => router.push(`/course-management/courses/${course._id}/builder`)} /></AdminCard></div></AdminShell></ProtectedRoute>;
}
