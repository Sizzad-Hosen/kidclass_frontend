import { ProtectedRoute } from "@/components/auth/protected-route";
import { CourseList } from "@/components/course-management/course-list";
import { AdminShell } from "@/components/kidclass/admin-shell";

export default function CoursesPage() {
  return <ProtectedRoute allowedRoles={["admin", "super_admin"]}><AdminShell><CourseList /></AdminShell></ProtectedRoute>;
}
