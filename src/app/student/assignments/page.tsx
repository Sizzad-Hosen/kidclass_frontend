"use client";

import Link from "next/link";
import { ClipboardCheck, Clock3, FilePenLine } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { EmptyState, ErrorState, PageLoader, StudentLayout } from "@/components/kidclass/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getId, useGetMyAssignmentsQuery } from "@/redux/features/learning/learningApi";

export default function StudentAssignmentsPage() {
  const { data: assignments = [], isLoading, isError } = useGetMyAssignmentsQuery();

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <main className="mx-auto max-w-6xl px-5 py-10">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-pink-700">Course work</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900 sm:text-5xl">My Assignments</h1>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Open an assignment, enter your answer, attach requested work, and submit it for marking.
          </p>

          <div className="mt-9">
            {isLoading ? <PageLoader label="Loading assignments" /> : null}
            {isError ? <ErrorState message="Could not load your assignments." /> : null}
            {!isLoading && !isError && !assignments.length ? (
              <EmptyState icon={<ClipboardCheck />} title="No assignments yet" message="Assignments from your enrolled courses will appear here." />
            ) : null}
            {assignments.length ? (
              <div className="grid gap-5 md:grid-cols-2">
                {assignments.map((assignment) => {
                  const submitted = Boolean(assignment.submission);
                  return (
                    <Card className="rounded-[2rem] bg-white p-6 shadow-sm" key={getId(assignment)}>
                      <CardContent>
                        <div className="flex items-start justify-between gap-4">
                          <span className="grid size-12 place-items-center rounded-2xl bg-pink-100 text-pink-700">
                            <FilePenLine />
                          </span>
                          <Badge variant={submitted ? "green" : "pink"}>{submitted ? "Submitted" : "Pending"}</Badge>
                        </div>
                        <h2 className="mt-5 text-2xl font-black text-slate-900">{assignment.title}</h2>
                        <p className="mt-2 line-clamp-2 text-slate-600">{assignment.instructions}</p>
                        <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-slate-500">
                          <span className="flex items-center gap-1"><Clock3 className="size-4" /> {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "No deadline"}</span>
                          <span>{assignment.points ?? 0} points</span>
                          {assignment.submission?.score !== undefined ? (
                            <span className="text-sky-700">Mark: {assignment.submission.score}/{assignment.submission.totalPoints ?? assignment.points ?? 0}</span>
                          ) : null}
                        </div>
                        <Button asChild className="mt-6 h-12 w-full rounded-full bg-[#14698d]">
                          <Link href={`/student/assignments/${getId(assignment)}`}>
                            {submitted ? "View or Update Answer" : "Open Answer Form"}
                          </Link>
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
