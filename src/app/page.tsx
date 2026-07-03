"use client";

import Link from "next/link";
import Image from "next/image";
import { Lightbulb, PlayCircle, Stars } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CoachTip,
  CourseCard,
  CourseGridSkeleton,
  EmptyState,
  ErrorState,
  PageShell,
  Rocket,
  Star,
} from "@/components/kidclass/shared";
import { useGetCoursesQuery } from "@/redux/features/learning/learningApi";

export default function Home() {
  const { data: courses, isLoading, isError } = useGetCoursesQuery();
  const featured = courses?.[0];

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid items-center gap-10 rounded-[2.5rem] bg-sky-700 p-8 text-white shadow-xl md:grid-cols-[1fr_0.9fr] md:p-12">
          <div>
            <Badge variant="yellow">Class 1 • Fun Learning</Badge>
            <h1 className="mt-8 max-w-xl text-5xl font-black leading-tight">
              {featured?.title ?? "Bangla Fun Learning Adventure!"}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-sky-50">
              {featured?.description ??
                "Join a magical journey through letters, poems, stories, and friendly challenges. Learning has never been this much fun!"}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild className="h-14 rounded-full bg-yellow-300 px-8 text-lg text-yellow-950 shadow-md hover:bg-yellow-200">
                <Link href={featured ? `/courses/${featured._id ?? featured.id}` : "/courses"}>
                  <PlayCircle className="size-5" />
                  Start Learning
                </Link>
              </Button>
              <Button asChild className="h-14 rounded-full border-white/40 bg-white/10 px-8 text-lg text-white hover:bg-white/20">
                <Link href="/courses">Explore Classes</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-sm bg-yellow-100 shadow-2xl">
            <Image
              alt="Kids learning adventure"
              className="object-cover"
              fill
              src={featured?.thumbnailImage || "/kidclass-mascot.png"}
              unoptimized
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 lg:grid-cols-[1fr_360px]">
        <Card className="rounded-[2rem] border-sky-100 bg-white p-6 shadow-sm">
          <CardContent>
            <h2 className="flex items-center gap-3 text-3xl font-black text-sky-700">
              <Lightbulb className="size-7 text-yellow-700" />
              What You Will Learn
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {[
                ["ABC", "Letters & Sounds", "Master foundations with songs and playful practice."],
                ["Book", "Fun Poems", "Rhyme along with classic and new poems for kids."],
                ["Write", "First Words", "Learn to write and recognize simple everyday words."],
                ["Speak", "Pronunciation Pro", "Interactive games help perfect sounds."],
              ].map(([icon, title, text]) => (
                <div className="rounded-3xl bg-slate-100 p-5" key={title}>
                  <Badge variant="outline">{icon}</Badge>
                  <h3 className="mt-3 font-bold">{title}</h3>
                  <p className="mt-1 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] border-sky-100 bg-white p-6">
            <CardContent>
              <h3 className="text-2xl font-bold">My Journey</h3>
              <div className="mt-4 flex justify-between text-sm font-bold">
                <span>Chapter 1 Completion</span>
                <span className="text-sky-700">65%</span>
              </div>
              <Progress className="mt-3" indicatorClassName="bg-emerald-400" value={65} />
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Badge className="justify-center py-3" variant="muted">12 Badges</Badge>
                <Badge className="justify-center py-3" variant="pink">450 Stars</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-yellow-700 bg-yellow-300 p-6 text-center shadow-lg">
            <CardContent>
              <p className="text-yellow-800">Unlock the Full Adventure!</p>
              <p className="my-4 text-4xl font-black text-yellow-950">$19.99</p>
              <Button asChild className="h-12 w-full rounded-full bg-sky-700 text-base">
                <Link href="/courses">Enroll Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black">Adventure Lessons</h2>
              <p className="text-slate-600">Start learning today with published KidClass courses.</p>
            </div>
            <Link className="font-bold text-sky-700" href="/courses">
              See all lessons →
            </Link>
          </div>
          {isLoading ? <CourseGridSkeleton /> : null}
          {isError ? <ErrorState message="Could not load published courses." /> : null}
          {!isLoading && !isError && !courses?.length ? (
            <EmptyState icon={<Stars />} title="No courses published" message="New adventures will appear here soon." />
          ) : null}
          {courses?.length ? (
            <div className="grid gap-6 md:grid-cols-3">
              {courses.slice(0, 3).map((course) => (
                <CourseCard course={course} href={`/courses/${course._id ?? course.id}`} key={course._id ?? course.id} action="Enroll Free" />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-sky-700 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-black">Games Make Brains Strong!</h2>
            <p className="mt-5 text-lg text-sky-50">
              Mini-games reinforce classroom concepts through play, stars, badges, and safe challenges.
            </p>
            <div className="mt-6 space-y-3 font-bold">
              <p><Star className="mr-2 inline size-5 text-yellow-300" />Earn stars for every correct answer</p>
              <p><Rocket className="mr-2 inline size-5 text-yellow-300" />Unlock new outfits for your avatar</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-[2rem] border border-white/20 bg-white/10 p-6">
            {["Word Match", "Math Dice", "Puzzle Fun", "Color Fill"].map((item) => (
              <div className="rounded-2xl bg-white/20 p-6 text-center font-bold" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <h2 className="text-center text-3xl font-black">4 Steps to Stardom</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {["Create Profile", "Watch Lessons", "Play & Practice", "Earn Badges"].map((step, index) => (
            <div className="text-center" key={step}>
              <div className="mx-auto grid size-12 place-items-center rounded-full border-2 border-sky-700 font-black text-sky-700">
                {index + 1}
              </div>
              <p className="mt-4 font-bold">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <CoachTip>
            <span>
              <strong>Psst!</strong> Parents, learning with poems helps children develop rhythm and memory skills faster.
            </span>
          </CoachTip>
        </div>
      </section>
    </PageShell>
  );
}
