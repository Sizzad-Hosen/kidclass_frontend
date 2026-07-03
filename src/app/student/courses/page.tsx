"use client";

import Image from "next/image";

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
  useGetCoursesQuery,
  useGetMyEnrollmentsQuery,
} from "@/redux/features/learning/learningApi";

export default function StudentCoursesPage() {
  const { data: courses, isLoading, isError } = useGetCoursesQuery();
  const {
    data: enrollments,
    isLoading: isEnrollmentsLoading,
    isError: isEnrollmentsError,
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
            {isLoading || isEnrollmentsLoading ? <CourseGridSkeleton /> : null}
            {isError || isEnrollmentsError ? <ErrorState message="Could not load your courses." /> : null}
            {!isLoading && !isEnrollmentsLoading && activeEnrollments?.length ? (
              <div className="grid gap-8 md:grid-cols-3">
                {activeEnrollments.map((enrollment, index) => (
                  <CourseCard
                    action="Continue Adventure"
                    course={enrollment.course!}
                    href={`/student/enrollments/${getId(enrollment)}`}
                    key={getId(enrollment)}
                    progress={[65, 30, 85][index % 3]}
                  />
                ))}
              </div>
            ) : null}
            {!isLoading && !isEnrollmentsLoading && !activeEnrollments?.length && !courses?.length ? (
              <EmptyState icon={<BookOpen />} title="No courses yet" message="Published courses will appear here." />
            ) : null}
            {!isLoading && !isEnrollmentsLoading && !activeEnrollments?.length && courses?.length ? (
              <div className="grid gap-8 md:grid-cols-3">
                {courses.map((course) => (
                  <CourseCard
                    action="Start Adventure"
                    course={course}
                    href={`/student/courses/${course._id ?? course.id}`}
                    key={course._id ?? course.id}
                  />
                ))}
              </div>
            ) : null}
          </div>
          <div className="mt-16 flex items-center gap-4 rounded-[2rem] bg-blue-100 p-6 text-xl">
            <Image
              alt="Tip coach"
              className="rounded-xl"
              height={80}
              src="/kidclass-mascot.png"
              width={80}
            />
            <p>
              <strong>Tip:</strong> Keep going, Explorer! Completing a course will earn you a shiny badge.
            </p>
          </div>
        </main>
      </StudentLayout>
    </ProtectedRoute>
  );
}
