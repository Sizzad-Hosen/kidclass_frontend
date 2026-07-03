"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, Map } from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  ErrorState,
  PageLoader,
  StudentLayout,
  StructurePreview,
} from "@/components/kidclass/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  getId,
  useCancelEnrollmentMutation,
  useGetCourseStructureQuery,
  useGetEnrollmentQuery,
  useGetProgressByEnrollmentQuery,
} from "@/redux/features/learning/learningApi";

export default function EnrollmentDetailsPage() {
  const params = useParams<{ enrollmentId: string }>();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: enrollment, isLoading, isError } = useGetEnrollmentQuery(params.enrollmentId);
  const courseId = getId(enrollment?.course);
  const { data: structure } = useGetCourseStructureQuery(courseId, { skip: !courseId });
  const { data: progress } = useGetProgressByEnrollmentQuery(params.enrollmentId);
  const [cancelEnrollment, { isLoading: isCancelling }] = useCancelEnrollmentMutation();

  const completion = progress?.completionPercentage ?? (enrollment?.status === "completed" ? 100 : 45);
  const nextLesson = useMemo(() => {
    for (const milestone of structure?.milestones ?? []) {
      for (const moduleItem of milestone.modules ?? []) {
        const lesson = moduleItem.lessons?.[0];
        if (lesson) return lesson;
      }
    }
    return undefined;
  }, [structure]);

  const handleCancel = async () => {
    try {
      await cancelEnrollment(params.enrollmentId).unwrap();
      toast.success("Enrollment cancelled.");
      setConfirmOpen(false);
      router.push("/student/enrollments");
    } catch {
      toast.error("Could not cancel enrollment.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <main className="mx-auto max-w-7xl px-5 py-10">
          {isLoading ? <PageLoader /> : null}
          {isError || !enrollment ? <ErrorState message="Enrollment details are unavailable." /> : null}
          {enrollment ? (
            <div className="space-y-8">
              <section className="rounded-[2rem] bg-sky-700 p-8 text-white shadow-lg">
                <Badge variant="yellow">{enrollment.status ?? "active"}</Badge>
                <h1 className="mt-5 text-5xl font-black">{enrollment.course?.title ?? "Learning Adventure"}</h1>
                <p className="mt-4 max-w-3xl text-xl text-sky-50">Follow the milestones in order, complete lessons, submit assignments, and unlock your certificate.</p>
                <div className="mt-8 max-w-xl">
                  <div className="mb-2 flex justify-between font-bold">
                    <span>Adventure Progress</span>
                    <span>{completion}%</span>
                  </div>
                  <Progress className="bg-white/30" indicatorClassName="bg-yellow-300" value={completion} />
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button
                    className="h-13 rounded-full bg-yellow-300 px-8 text-lg text-yellow-950"
                    disabled={!nextLesson}
                    onClick={() => nextLesson && router.push(`/student/lessons/${getId(nextLesson)}`)}
                  >
                    Continue Learning
                  </Button>
                  {enrollment.status === "active" ? (
                    <Button className="h-13 rounded-full bg-white/15 px-8 text-lg text-white" onClick={() => setConfirmOpen(true)}>
                      Cancel Enrollment
                    </Button>
                  ) : null}
                </div>
              </section>

              <Card className="rounded-[2rem] bg-white p-6">
                <CardContent>
                  <h2 className="mb-6 flex items-center gap-3 text-3xl font-black text-sky-700">
                    <Map />
                    Course Structure
                  </h2>
                  <StructurePreview progress={progress} structure={structure} studentMode />
                </CardContent>
              </Card>
            </div>
          ) : null}
        </main>

        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent onClose={() => setConfirmOpen(false)}>
            <DialogHeader>
              <div className="grid size-14 place-items-center rounded-full bg-yellow-100 text-yellow-700">
                <AlertTriangle />
              </div>
              <DialogTitle>Cancel this enrollment?</DialogTitle>
              <DialogDescription>
                Your course status will change to cancelled. You can enroll again later if the course stays published.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>Keep Learning</Button>
              <Button type="button" variant="destructive" disabled={isCancelling} onClick={handleCancel}>
                {isCancelling ? "Cancelling..." : "Cancel Enrollment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </StudentLayout>
    </ProtectedRoute>
  );
}
