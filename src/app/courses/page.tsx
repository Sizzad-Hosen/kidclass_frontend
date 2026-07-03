"use client";

import { BookOpen } from "lucide-react";

import {
  CourseCard,
  CourseGridSkeleton,
  EmptyState,
  ErrorState,
  PageShell,
} from "@/components/kidclass/shared";
import { Badge } from "@/components/ui/badge";
import { useGetCoursesQuery } from "@/redux/features/learning/learningApi";

export default function CoursesPage() {
  const { data: courses, isLoading, isError } = useGetCoursesQuery();

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
              {courses.map((course) => (
                <CourseCard course={course} href={`/courses/${course._id ?? course.id}`} key={course._id ?? course.id} action="View Course" />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
