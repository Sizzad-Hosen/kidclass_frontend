"use client";

import { BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  CourseCard,
  CourseGridSkeleton,
  EmptyState,
  ErrorState,
  PageShell,
} from "@/components/kidclass/shared";
import { Badge } from "@/components/ui/badge";
import {
  getId,
  useCreateEnrollmentMutation,
  useGetCoursesQuery,
  useGetMyEnrollmentsQuery,
} from "@/redux/features/learning/learningApi";
import { useAppSelector } from "@/redux/hooks";

export default function CoursesPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: courses, isLoading, isError } = useGetCoursesQuery();
  const { data: enrollments } = useGetMyEnrollmentsQuery(undefined, {
    skip: user?.role !== "student",
  });
  const [enroll, enrollState] = useCreateEnrollmentMutation();

  const enrollmentFor = (courseId: string) =>
    enrollments?.find(
      (item) => getId(item.course) === courseId && item.status !== "cancelled",
    );

  const enrollCourse = async (courseId: string) => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent("/courses")}`);
      return;
    }
    if (user.role !== "student") {
      toast.error("Only student accounts can enroll in courses.");
      return;
    }
    const existing = enrollmentFor(courseId);
    if (existing) {
      toast.info(`Already enrolled. Enrollment ID: ${getId(existing)}`);
      router.push(`/student/enrollments/${getId(existing)}`);
      return;
    }
    try {
      const created = await enroll({ course: courseId }).unwrap();
      toast.success(`Enrolled successfully. Enrollment ID: ${getId(created)}`);
      router.push(`/student/enrollments/${getId(created)}`);
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message ?? "Could not enroll in this course.");
    }
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 py-12">
        <Badge variant="yellow">Pick Your Class</Badge>
        <h1 className="mt-5 text-5xl font-black text-sky-700">Adventure Lessons</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-600">
          Every grade has its own special world of discovery. Choose a published course and start your quest.
        </p>
        <div className="mt-10">
          {isLoading ? <CourseGridSkeleton /> : null}
          {isError ? <ErrorState message="Could not load courses from the server." /> : null}
          {!isLoading && !isError && !courses?.length ? (
            <EmptyState icon={<BookOpen />} title="No courses available" message="Published courses will show here." />
          ) : null}
          {courses?.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {courses.map((course) => {
                const courseId = getId(course);
                const existing = enrollmentFor(courseId);
                return (
                  <CourseCard
                    action={existing ? "Continue Class" : "Enroll Now"}
                    actionDisabled={enrollState.isLoading}
                    course={course}
                    href={`/courses/${courseId}`}
                    key={courseId}
                    onAction={() => enrollCourse(courseId)}
                  />
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
