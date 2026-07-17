"use client";

import Link from "next/link";
import { Award, BookOpen, CheckCircle2, ClipboardCheck, GraduationCap } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  CourseCard,
  CourseGridSkeleton,
  EmptyState,
  ErrorState,
  StudentLayout,
} from "@/components/kidclass/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getId,
  useGetCertificatesQuery,
  useGetMyAssignmentsQuery,
  useGetMyEnrollmentsQuery,
  useGetStudentLearningSummaryQuery,
} from "@/redux/features/learning/learningApi";
import { useAppSelector } from "@/redux/hooks";

export default function StudentDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: enrollments, isLoading, isError } = useGetMyEnrollmentsQuery();
  const { data: summary } = useGetStudentLearningSummaryQuery();
  const { data: certificates = [] } = useGetCertificatesQuery();
  const { data: assignments = [] } = useGetMyAssignmentsQuery();
  const activeCourses =
    enrollments?.filter(
      (enrollment) => enrollment.status !== "cancelled" && enrollment.course,
    ) ?? [];
  const gradedAssignments = assignments.filter(
    (assignment) => assignment.submission?.score !== undefined,
  );
  const assignmentAverage = gradedAssignments.length
    ? Math.round(
        gradedAssignments.reduce((sum, assignment) => {
          const score = assignment.submission?.score ?? 0;
          const total = assignment.submission?.totalPoints ?? assignment.points ?? 0;
          return sum + (total ? (score / total) * 100 : 0);
        }, 0) / gradedAssignments.length,
      )
    : 0;

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <main className="mx-auto max-w-7xl space-y-9 px-5 py-10">
          <section className="rounded-[2rem] bg-gradient-to-r from-[#075f84] to-[#1689ae] p-8 text-white shadow-lg sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-100">Student dashboard</p>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">
              Welcome back, {user?.name?.split(" ")[0] ?? "Student"}
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-sky-50">
              Continue enrolled courses, complete lessons, submit assignments, and collect certificates.
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard icon={<BookOpen />} label="Enrolled Courses" value={summary?.enrolledCourses ?? activeCourses.length} />
            <SummaryCard icon={<CheckCircle2 />} label="Lessons Completed" value={summary?.completedLessons ?? 0} tone="green" />
            <SummaryCard icon={<Award />} label="Certificates" value={certificates.length} tone="yellow" />
            <SummaryCard icon={<ClipboardCheck />} label="Assignment Mark" value={gradedAssignments.length ? `${assignmentAverage}%` : "—"} tone="pink" />
          </section>

          {isError ? <ErrorState message="Could not load your dashboard data." /> : null}

          <section>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-wider text-sky-700">My learning</p>
                <h2 className="mt-1 text-3xl font-black">Enrolled Courses</h2>
              </div>
              <Button asChild variant="outline"><Link href="/courses">Browse Courses</Link></Button>
            </div>
            {isLoading ? <CourseGridSkeleton /> : null}
            {!isLoading && activeCourses.length ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {activeCourses.map((enrollment) => (
                  <CourseCard
                    action="Continue Class"
                    course={enrollment.course!}
                    href={`/student/enrollments/${getId(enrollment)}`}
                    key={getId(enrollment)}
                  />
                ))}
              </div>
            ) : null}
            {!isLoading && !activeCourses.length ? (
              <EmptyState icon={<GraduationCap />} title="No enrolled courses" message="Browse the course catalog and enroll to start learning." />
            ) : null}
          </section>

          <section className="grid gap-7 lg:grid-cols-2">
            <Card className="rounded-[2rem] bg-white p-6">
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-black">Assignments & Marks</h2>
                  <Link className="font-bold text-sky-700" href="/student/assignments">View all</Link>
                </div>
                <div className="mt-5 space-y-3">
                  {assignments.slice(0, 4).map((assignment) => (
                    <Link className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 hover:bg-sky-50" href={`/student/assignments/${getId(assignment)}`} key={getId(assignment)}>
                      <span>
                        <strong className="block text-slate-800">{assignment.title}</strong>
                        <span className="text-sm text-slate-500">{assignment.submission ? "Submitted" : "Pending"}</span>
                      </span>
                      <strong className="text-sky-700">
                        {assignment.submission?.score !== undefined
                          ? `${assignment.submission.score}/${assignment.submission.totalPoints ?? assignment.points ?? 0}`
                          : `${assignment.points ?? 0} pts`}
                      </strong>
                    </Link>
                  ))}
                  {!assignments.length ? <p className="rounded-2xl bg-slate-50 p-5 text-slate-500">No assignments are available for your courses yet.</p> : null}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] bg-white p-6">
              <CardContent>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-black">Certificates</h2>
                  <Link className="font-bold text-sky-700" href="/student/certificates">View all</Link>
                </div>
                <div className="mt-5 space-y-3">
                  {certificates.slice(0, 4).map((certificate) => (
                    <div className="flex items-center gap-4 rounded-2xl bg-emerald-50 p-4" key={getId(certificate)}>
                      <Award className="size-6 text-emerald-600" />
                      <div className="min-w-0 flex-1">
                        <strong className="block truncate">{certificate.enrollment?.course?.title ?? "Course Certificate"}</strong>
                        <span className="text-sm text-emerald-700">{certificate.certificateNo}</span>
                      </div>
                    </div>
                  ))}
                  {!certificates.length ? <p className="rounded-2xl bg-slate-50 p-5 text-slate-500">Complete a course to unlock your first certificate.</p> : null}
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </StudentLayout>
    </ProtectedRoute>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  tone = "blue",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tone?: "blue" | "green" | "yellow" | "pink";
}) {
  const tones = {
    blue: "bg-sky-100 text-sky-700",
    green: "bg-emerald-100 text-emerald-700",
    yellow: "bg-amber-100 text-amber-700",
    pink: "bg-pink-100 text-pink-700",
  };
  return (
    <Card className="rounded-3xl bg-white p-5 shadow-sm">
      <CardContent className="flex items-center gap-4">
        <span className={`grid size-13 shrink-0 place-items-center rounded-2xl ${tones[tone]}`}>{icon}</span>
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="text-3xl font-black text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
