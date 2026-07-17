"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lightbulb, Map } from "lucide-react";

import {
  CertificateBadge,
  CoachTip,
  ErrorState,
  PageLoader,
  PageShell,
  StructurePreview,
  mascotImage,
} from "@/components/kidclass/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicCoursePlayer } from "@/components/course-management/public-course-player";
import { Progress } from "@/components/ui/progress";
import {
  getId,
  useCreateEnrollmentMutation,
  useGetCourseStructureQuery,
  useGetMyEnrollmentsQuery,
} from "@/redux/features/learning/learningApi";
import { useAppSelector } from "@/redux/hooks";

export default function CourseDetailsPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const { data: structure, isLoading, isError } = useGetCourseStructureQuery(params.courseId);
  const { data: enrollments } = useGetMyEnrollmentsQuery(undefined, {
    skip: user?.role !== "student",
  });
  const [enroll, { isLoading: isEnrolling }] = useCreateEnrollmentMutation();
  const course = structure?.course;
  const existingEnrollment = enrollments?.find(
    (item) => getId(item.course) === params.courseId && item.status !== "cancelled",
  );

  const handleEnroll = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/courses/${params.courseId}`)}`);
      return;
    }

    if (user.role !== "student") {
      toast.error("Please sign in as a student to enroll.");
      return;
    }

    if (existingEnrollment) {
      toast.info(`Already enrolled. Enrollment ID: ${getId(existingEnrollment)}`);
      router.push(`/student/enrollments/${getId(existingEnrollment)}`);
      return;
    }

    try {
      const created = await enroll({ course: params.courseId }).unwrap();
      toast.success(`Enrolled successfully. Enrollment ID: ${getId(created)}`);
      router.push(`/student/enrollments/${getId(created)}`);
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message ?? "Could not enroll right now.");
    }
  };

  if (isLoading) {
    return <PageShell><PageLoader /></PageShell>;
  }

  if (isError || !course) {
    return <PageShell><section className="mx-auto max-w-5xl px-5 py-12"><ErrorState message="Course details are unavailable." /></section></PageShell>;
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid items-center gap-10 rounded-[2.5rem] bg-sky-700 p-8 text-white md:grid-cols-[1fr_0.9fr] md:p-12">
          <div>
            <Badge variant="yellow">{course.category ?? "Class Adventure"}</Badge>
            <h1 className="mt-6 text-5xl font-black leading-tight">{course.title}</h1>
            <p className="mt-5 max-w-2xl text-xl leading-8 text-sky-50">{course.description}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button className="h-14 rounded-full bg-yellow-300 px-8 text-lg text-yellow-950 shadow-md" disabled={isEnrolling} onClick={handleEnroll}>
                {isEnrolling ? "Enrolling..." : existingEnrollment ? "Continue Class" : "Enroll Now"}
              </Button>
              <Button asChild className="h-14 rounded-full border-white/40 bg-white/10 px-8 text-lg text-white hover:bg-white/20">
                <Link href="/courses">Try Another Course</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-sm bg-yellow-100">
            <Image alt={course.title} className="object-cover" fill src={mascotImage(course)} unoptimized />
          </div>
        </div>

        <div className="mt-10">
          <PublicCoursePlayer structure={structure} />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <Card className="rounded-[2rem] border-sky-100 bg-white p-6">
              <CardContent>
                <h2 className="flex items-center gap-3 text-3xl font-black text-sky-700">
                  <Lightbulb className="text-yellow-700" />
                  What You Will Learn
                </h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {["Guided lessons", "Practice activities", "Milestone quizzes", "Certificate path"].map((item) => (
                    <div className="rounded-3xl bg-slate-100 p-5 font-bold" key={item}>{item}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-sky-100 bg-white p-6">
              <CardContent>
                <h2 className="mb-6 flex items-center gap-3 text-3xl font-black text-sky-700">
                  <Map className="text-yellow-700" />
                  Learning Milestones
                </h2>
                <StructurePreview structure={structure} />
              </CardContent>
            </Card>
            <CoachTip>
              Start with the first lesson, complete each step, and the next adventure unlocks.
            </CoachTip>
          </div>
          <aside className="space-y-6">
            <Card className="rounded-[2rem] border-sky-100 bg-white p-6">
              <CardContent>
                <h3 className="text-2xl font-bold">My Journey</h3>
                <div className="mt-4 flex justify-between text-sm font-bold">
                  <span>Structure Ready</span>
                  <span className="text-sky-700">{structure.milestones.length} milestones</span>
                </div>
                <Progress className="mt-3" indicatorClassName="bg-emerald-400" value={65} />
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Badge className="justify-center py-3" variant="muted">{structure.milestones.length} Badges</Badge>
                  <Badge className="justify-center py-3" variant="pink">{structure.milestones.length * 150} Stars</Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-[2rem] border-sky-200 bg-sky-50 p-6 text-center shadow-lg">
              <CardContent>
                <p className="text-sky-800">{existingEnrollment ? "Your class is ready" : "Unlock the full learning journey"}</p>
                <p className="my-4 text-2xl font-black text-sky-950">
                  {existingEnrollment ? "Continue where you left off" : "Enroll once and learn anytime"}
                </p>
                <Button className="h-12 w-full rounded-full bg-sky-700 text-base" onClick={handleEnroll}>
                  {existingEnrollment ? "Continue Class" : "Enroll Now"}
                </Button>
              </CardContent>
            </Card>
            <CertificateBadge />
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
