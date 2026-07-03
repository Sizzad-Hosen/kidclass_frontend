"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Bell,
  BookOpen,
  CalendarCheck,
  Medal,
  PlayCircle,
  Trophy,
  UserRound,
} from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import {
  CoachTip,
  CourseCard,
  EmptyState,
  ErrorState,
  ProgressSummary,
  StudentLayout,
} from "@/components/kidclass/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useGetCertificatesQuery,
  useGetMyEnrollmentsQuery,
} from "@/redux/features/learning/learningApi";
import { useAppSelector } from "@/redux/hooks";

export default function StudentDashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: enrollments, isLoading, isError } = useGetMyEnrollmentsQuery();
  const { data: certificates } = useGetCertificatesQuery();
  const activeEnrollment = enrollments?.find((item) => item.status === "active");
  const rewardBadges = [
    { label: "Super Star", tone: "bg-yellow-300 text-yellow-950", Icon: Award },
    { label: "Quiz Champ", tone: "bg-blue-100 text-sky-700", Icon: Trophy },
    { label: "Book Worm", tone: "bg-pink-100 text-pink-700", Icon: BookOpen },
    { label: "Math Wizard", tone: "bg-slate-100 text-slate-400", Icon: CalendarCheck },
    { label: "Fast Learner", tone: "bg-yellow-300 text-yellow-950", Icon: PlayCircle },
    { label: "Nature Scout", tone: "bg-emerald-100 text-emerald-700", Icon: Award },
  ];

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <StudentLayout>
        <main className="mx-auto max-w-7xl space-y-10 px-5 py-10">
          <section className="grid items-center gap-8 rounded-[2rem] bg-white p-8 shadow-sm md:grid-cols-[1fr_260px]">
            <div>
              <h1 className="text-5xl font-black text-sky-700">
                Hi {user?.name ?? "Explorer"}!
              </h1>
              <p className="mt-4 text-2xl text-slate-600">Ready to learn something fun today?</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Badge className="px-5 py-3 text-base" variant="pink">Class 1 Level</Badge>
                <Badge className="px-5 py-3 text-base" variant="yellow">128 Stars Earned</Badge>
              </div>
            </div>
            <Image
              alt="Good job mascot"
              className="mx-auto rounded-sm shadow-lg"
              height={220}
              src="/kidclass-mascot.png"
              width={220}
            />
          </section>

          <ProgressSummary certificates={certificates} enrollments={enrollments} />

          {isError ? <ErrorState message="Could not load your dashboard data." /> : null}

          <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              <div>
                <h2 className="mb-5 flex items-center gap-3 text-3xl font-black">
                  <PlayCircle className="text-sky-700" />
                  Continue Learning
                </h2>
                {activeEnrollment?.course ? (
                  <CourseCard
                    action="Continue Adventure"
                    course={activeEnrollment.course}
                    href={`/student/enrollments/${activeEnrollment._id ?? activeEnrollment.id}`}
                    progress={45}
                  />
                ) : (
                  <EmptyState
                    icon={<BookOpen />}
                    title={isLoading ? "Finding your courses" : "No active enrollment"}
                    message="Enroll in a published course to start your guided learning flow."
                  />
                )}
              </div>

              <Card className="rounded-[2rem] border-sky-100 bg-white p-7">
                <CardContent>
                  <h2 className="text-3xl font-black">Weekly Learning Journey</h2>
                  <div className="mt-6 rounded-[2rem] bg-slate-100 p-6">
                    <div className="grid grid-cols-7 items-end gap-3">
                      {[40, 65, 35, 75, 55, 20, 45].map((value, index) => (
                        <div className="flex flex-col items-center gap-3" key={index}>
                          <div className="w-full rounded-full bg-sky-200" style={{ height: 160 }}>
                            <div className="mt-auto rounded-full bg-sky-600" style={{ height: `${value}%` }} />
                          </div>
                          <span className="text-sm text-slate-500">
                            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <aside className="space-y-6">
              <Card className="rounded-[2rem] border-sky-100 bg-transparent p-0 shadow-none ring-0">
                <CardContent className="px-0">
                  <h2 className="mb-5 flex items-center gap-3 text-3xl font-black">
                    <Bell className="text-yellow-700" />
                    What&apos;s New?
                  </h2>
                  <div className="space-y-4">
                    {[
                      ["Math Challenge Ready!", "New subtraction quiz added.", "2 hours ago", "blue"],
                      ["Badge Earned!", "You unlocked Early Bird.", "Yesterday", "yellow"],
                      ["Live Session", "Art class starts in 15 mins.", "Just now", "pink"],
                    ].map(([title, text, time, tone]) => (
                      <div
                        className="rounded-full border border-sky-100 bg-white p-5 shadow-sm"
                        key={title}
                      >
                        <p className="text-lg font-black">{title}</p>
                        <p className="text-slate-600">{text}</p>
                        <p
                          className={
                            tone === "pink"
                              ? "mt-1 font-bold text-pink-700"
                              : tone === "yellow"
                                ? "mt-1 font-bold text-yellow-700"
                                : "mt-1 font-bold text-sky-700"
                          }
                        >
                          {time}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] bg-slate-200 p-6">
                <CardContent>
                  <h2 className="text-3xl font-black">Pending Assignments</h2>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-3xl border-l-4 border-sky-700 bg-white p-5">
                      <p className="text-slate-500">Bangla Writing</p>
                      <p className="text-3xl font-black text-sky-700">Ready</p>
                      <p className="font-semibold text-slate-600">Submit when your final milestone unlocks.</p>
                    </div>
                    <div className="rounded-3xl bg-white p-5 text-slate-500">
                      <p>Math Counting</p>
                      <p className="text-2xl font-black">Waiting...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] bg-yellow-300 p-6">
                <CardContent>
                  <p className="font-bold">Edu-Bot Says:</p>
                  <p className="mt-2 text-xl text-yellow-950">
                    Finish your next lesson to get a surprise sticker!
                  </p>
                </CardContent>
              </Card>
            </aside>
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-3 text-3xl font-black">
                <Medal className="text-pink-700" />
                Reward Badges
              </h2>
              <Link className="font-bold text-sky-700" href="/student/enrollments">
                See all my rewards
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-6">
              {rewardBadges.map(({ label, tone, Icon }) => (
                <div className="text-center" key={label}>
                  <div className={`mx-auto grid size-24 place-items-center rounded-full shadow-sm ${tone}`}>
                    <Icon className="size-10" />
                  </div>
                  <p className="mt-3 text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-3xl font-black">Quick Links</h2>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                ["/student/courses", "My Courses", BookOpen],
                ["/student/enrollments", "My Enrollments", CalendarCheck],
                ["/certificates/verify/demo", "Certificates", Award],
                ["/profile/me", "Profile", UserRound],
              ].map(([href, label, Icon]) => (
                <Button asChild className="h-16 rounded-2xl bg-sky-700 text-base" key={String(label)}>
                  <Link href={href as string}>
                    <Icon className="size-5" />
                    {String(label)}
                  </Link>
                </Button>
              ))}
            </div>
          </section>

          <CoachTip>
            Enroll, continue lessons, submit assignments, track progress, and earn your certificate.
          </CoachTip>
        </main>
      </StudentLayout>
    </ProtectedRoute>
  );
}
