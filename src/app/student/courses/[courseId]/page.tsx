"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Map } from "lucide-react";

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
  useCreateEnrollmentMutation,
  useGetCourseStructureQuery,
} from "@/redux/features/learning/learningApi";

export default function StudentCourseDetailsPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const { data: structure, isLoading, isError } = useGetCourseStructureQuery(params.courseId);
  const [enroll, { isLoading: isEnrolling }] = useCreateEnrollmentMutation();
  const course = structure?.course;

  const handleEnroll = async () => {
    try {
      await enroll({ course: params.courseId }).unwrap();
      toast.success("You enrolled successfully!");
      router.push("/student/enrollments");
    } catch {
      toast.error("Enrollment failed. Please try again.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <main className="mx-auto max-w-6xl px-5 py-10">
          {isLoading ? <PageLoader /> : null}
          {isError || !course ? <ErrorState message="Course details are unavailable." /> : null}
          {course ? (
            <div className="space-y-8">
              <section className="rounded-[2rem] bg-sky-700 p-8 text-white shadow-lg">
                <Badge variant="yellow">{course.category ?? "Adventure"}</Badge>
                <h1 className="mt-5 text-5xl font-black">{course.title}</h1>
                <p className="mt-4 max-w-3xl text-xl text-sky-50">{course.description}</p>
                <div className="mt-8 flex gap-4">
                  <Button className="h-13 rounded-full bg-yellow-300 px-8 text-lg text-yellow-950" disabled={isEnrolling} onClick={handleEnroll}>
                    {isEnrolling ? "Enrolling..." : "Enroll Now"}
                  </Button>
                  <Button asChild className="h-13 rounded-full bg-white/15 px-8 text-lg text-white">
                    <Link href="/student/courses">Back to Courses</Link>
                  </Button>
                </div>
              </section>
              <Card className="rounded-[2rem] bg-white p-6">
                <CardContent>
                  <h2 className="mb-6 flex items-center gap-3 text-3xl font-black text-sky-700">
                    <Map />
                    Course Structure
                  </h2>
                  <StructurePreview structure={structure} studentMode />
                </CardContent>
              </Card>
            </div>
          ) : null}
        </main>
      </StudentLayout>
    </ProtectedRoute>
  );
}
