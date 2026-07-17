"use client";

import { use } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { CourseBuilder } from "@/components/course-management/course-builder";
import { AdminShell } from "@/components/kidclass/admin-shell";

export default function BuilderPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  return <ProtectedRoute allowedRoles={["admin","super_admin"]}><AdminShell><CourseBuilder courseId={courseId} /></AdminShell></ProtectedRoute>;
}
