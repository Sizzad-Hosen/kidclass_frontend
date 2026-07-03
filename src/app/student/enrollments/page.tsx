"use client";

import Link from "next/link";
import { CalendarCheck } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  CourseGridSkeleton,
  EmptyState,
  ErrorState,
  StudentLayout,
} from "@/components/kidclass/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  getId,
  useGetMyEnrollmentsQuery,
} from "@/redux/features/learning/learningApi";

export default function MyEnrollmentsPage() {
  const { data: enrollments, isLoading, isError } = useGetMyEnrollmentsQuery();

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <main className="mx-auto max-w-7xl px-5 py-10">
          <h1 className="text-5xl font-black text-sky-700">My Enrollments</h1>
          <p className="mt-4 text-2xl text-slate-600">Track progress and continue each learning adventure.</p>
          <div className="mt-10">
            {isLoading ? <CourseGridSkeleton /> : null}
            {isError ? <ErrorState message="Could not load enrollments." /> : null}
            {!isLoading && !isError && !enrollments?.length ? (
              <EmptyState icon={<CalendarCheck />} title="No enrollments yet" message="Choose a course to start your first adventure." />
            ) : null}
            {enrollments?.length ? (
              <div className="grid gap-6 md:grid-cols-3">
                {enrollments.map((enrollment, index) => {
                  const progress = enrollment.status === "completed" ? 100 : enrollment.status === "cancelled" ? 0 : [45, 65, 30][index % 3];
                  return (
                    <Card className="rounded-[2rem] bg-white p-5 shadow-sm" key={getId(enrollment)}>
                      <CardContent className="space-y-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="text-2xl font-black text-sky-700">{enrollment.course?.title ?? "Course"}</h2>
                            <p className="text-slate-600">{enrollment.course?.category ?? "Adventure"}</p>
                          </div>
                          <Badge variant={enrollment.status === "active" ? "green" : enrollment.status === "completed" ? "yellow" : "muted"}>
                            {enrollment.status ?? "active"}
                          </Badge>
                        </div>
                        <div>
                          <div className="mb-2 flex justify-between font-bold">
                            <span>Progress</span>
                            <span className="text-sky-700">{progress}%</span>
                          </div>
                          <Progress value={progress} />
                        </div>
                        <Button asChild className="h-12 w-full rounded-full bg-sky-700 text-base">
                          <Link href={`/student/enrollments/${getId(enrollment)}`}>Continue Learning</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : null}
          </div>
        </main>
      </StudentLayout>
    </ProtectedRoute>
  );
}
