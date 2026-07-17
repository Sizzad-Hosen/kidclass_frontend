"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  CourseCard,
  CourseGridSkeleton,
  EmptyState,
  ErrorState,
  StudentLayout,
} from "@/components/kidclass/shared";
import { BookOpen } from "@/components/kidclass/shared";
import {
  getId,
  useGetMyEnrollmentsQuery,
} from "@/redux/features/learning/learningApi";

export default function StudentCoursesPage() {
  const {
    data: enrollments,
    isLoading,
    isError,
  } = useGetMyEnrollmentsQuery();
  const activeEnrollments = enrollments?.filter(
    (enrollment) => enrollment.status !== "cancelled" && enrollment.course,
  );

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <main className="mx-auto max-w-7xl px-5 py-10 md:py-14">
          <h1 className="text-5xl font-black text-sky-700">My Learning Quest</h1>
          <p className="mt-4 max-w-3xl text-2xl text-slate-600">
            Welcome back, Hero! Which adventure would you like to continue today?
          </p>
          <div className="mt-10">
            {isLoading ? <CourseGridSkeleton /> : null}
            {isError ? <ErrorState message="Could not load your courses." /> : null}
            {!isLoading && activeEnrollments?.length ? (
              <div className="grid gap-8 md:grid-cols-3">
                {activeEnrollments.map((enrollment) => (
                  <CourseCard
                    action="Continue Adventure"
                    course={enrollment.course!}
                    href={`/student/enrollments/${getId(enrollment)}`}
                    key={getId(enrollment)}
                  />
                ))}
              </div>
            ) : null}
            {!isLoading && !isError && !activeEnrollments?.length ? (
              <EmptyState icon={<BookOpen />} title="No enrolled courses" message="Browse courses and enroll once to add a class here." />
            ) : null}
          </div>
        </main>
      </StudentLayout>
    </ProtectedRoute>
  );
}
