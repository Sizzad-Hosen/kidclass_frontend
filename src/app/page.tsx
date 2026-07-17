"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CircleDot,
  Dice5,
  GraduationCap,
  Palette,
  Puzzle,
  Rocket,
  Smile,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageShell } from "@/components/kidclass/shared";
import {
  getId,
  type Course,
  useGetCoursesQuery,
} from "@/redux/features/learning/learningApi";

const classCards = [
  {
    title: "Class 1",
    text: "Begin your journey with the magic of letters and numbers!",
    icon: Smile,
    color: "bg-[#0b74b8] text-white",
    button: "bg-[#0b74b8] hover:bg-[#075c94]",
  },
  {
    title: "Class 2",
    text: "Build stronger foundations in reading and problem solving.",
    icon: BookOpen,
    color: "bg-[#ffd83d] text-[#6c5c00]",
    button: "bg-[#7d6a00] hover:bg-[#665600]",
  },
  {
    title: "Class 3",
    text: "Take off into complex math and exciting stories!",
    icon: Rocket,
    color: "bg-[#b03d68] text-white",
    button: "bg-[#a53660] hover:bg-[#862a4e]",
  },
];

const fallbackCourses: Course[] = [
  {
    id: "class-1-english",
    title: "Class 1 English ABC Learning",
    description: "24 Lessons",
    category: "Free",
    thumbnailImage:
      "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "class-1-bangla",
    title: "Class 1 Bangla Fun Learning",
    description: "18 Lessons",
    category: "Free",
    thumbnailImage:
      "https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "class-2-math",
    title: "Class 2 Math Adventure",
    description: "32 Lessons",
    category: "Free",
    thumbnailImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80",
  },
];

const steps = [
  ["Create Profile", "Pick your favorite animal avatar!"],
  ["Watch Lessons", "Fun animated videos teach you skills."],
  ["Play & Practice", "Try quizzes and games to learn."],
  ["Earn Badges", "Collect shiny stars and balloons!"],
];

const gameItems = [
  { label: "Word Match", icon: CircleDot },
  { label: "Math Dice", icon: Dice5 },
  { label: "Puzzle Fun", icon: Puzzle },
  { label: "Color Fill", icon: Palette },
];

export default function Home() {
  const { data: courses } = useGetCoursesQuery();
  const lessonCards = courses?.length ? courses.slice(0, 3) : fallbackCourses;
  const firstCourse = courses?.[0];

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-[#f7f8fc]">
        <div className="mx-auto grid min-h-[510px] max-w-7xl items-center gap-10 px-6 py-14 md:grid-cols-[1fr_1.05fr] lg:px-10">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex rounded-full bg-[#ffd83d] px-4 py-1.5 text-xs font-bold text-[#695800]">
              Level Up Your Brain!
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-normal text-[#0059a8] sm:text-5xl">
              Learn Bangla, English & Math with Fun
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
              A playful learning platform for Class 1, Class 2 and Class 3
              students. Every lesson is an adventure!
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                className="h-12 rounded-full bg-[#006db3] px-8 text-sm font-bold shadow-lg shadow-sky-800/20 hover:bg-[#005b97]"
              >
                <Link href={firstCourse ? `/courses/${getId(firstCourse)}` : "/courses"}>
                  Start Learning
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 rounded-full border border-[#b9d4e8] bg-white px-8 text-sm font-bold text-[#006db3] shadow-sm hover:bg-sky-50"
              >
                <Link href="/courses">Explore Classes</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute left-1/2 top-1/2 h-[410px] w-[410px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e8f0ff]" />
            <span className="absolute -left-2 top-2 text-5xl font-black text-[#7bb0d6]">অ</span>
            <span className="absolute -right-2 top-24 text-5xl font-black text-[#b9b16b]">A</span>
            <span className="absolute bottom-3 right-8 text-5xl font-black text-[#d58aa1]">আ</span>
            <div className="relative mx-auto aspect-[1.23/1] w-full max-w-[470px] overflow-hidden rounded-sm bg-[#ffd991] shadow-xl">
              <Image
                alt="Children reading together"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 768px) 92vw, 470px"
                src="/kidclass-mascot.png"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f0f1f8] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-950">Pick Your Class</h2>
            <p className="mt-3 text-sm text-slate-500">
              Every grade has its own special world of discovery!
            </p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {classCards.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  className="rounded-[2rem] border border-slate-300 bg-white px-8 py-8 text-center shadow-sm"
                  key={item.title}
                >
                  <div className={`mx-auto grid size-16 place-items-center rounded-full ${item.color}`}>
                    <Icon className="size-8" />
                  </div>
                  <h3 className="mt-6 text-lg font-bold text-[#006db3]">{item.title}</h3>
                  <p className="mx-auto mt-4 min-h-12 max-w-56 text-sm leading-5 text-slate-500">
                    {item.text}
                  </p>
                  <Button
                    asChild
                    className={`mt-6 h-10 w-full rounded-full text-xs font-bold text-white shadow-sm ${item.button}`}
                  >
                    <Link href="/courses">View Courses</Link>
                  </Button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fd] py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Adventure Lessons</h2>
              <p className="mt-3 text-sm text-slate-500">
                Start learning today for absolutely zero gold coins!
              </p>
            </div>
            <Link
              className="hidden items-center gap-2 text-sm font-bold text-[#006db3] sm:flex"
              href="/courses"
            >
              See all lessons <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-7 md:grid-cols-3">
            {lessonCards.map((course) => (
              <LessonCard course={course} key={getId(course) || course.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#006db3] py-16 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[1fr_1fr] lg:px-10">
          <div>
            <h2 className="max-w-md text-4xl font-black leading-tight">
              Games Make Brains Strong!
            </h2>
            <p className="mt-6 max-w-lg text-sm leading-6 text-sky-50">
              We believe children learn best when they do not even know they are
              studying! Our mini-games are designed by educators to reinforce
              classroom concepts through play.
            </p>
            <div className="mt-7 space-y-4 text-sm font-bold">
              <p>
                <Star className="mr-2 inline size-5 fill-[#ffd83d] text-[#ffd83d]" />
                Earn stars for every correct answer
              </p>
              <p>
                <Trophy className="mr-2 inline size-5 fill-[#ffd83d] text-[#ffd83d]" />
                Challenge friends in a safe environment
              </p>
              <p>
                <Sparkles className="mr-2 inline size-5 text-[#ffd83d]" />
                Unlock new outfits for your avatar
              </p>
            </div>
            <Button
              asChild
              className="mt-9 h-11 rounded-full bg-[#817000] px-7 text-xs font-bold text-white hover:bg-[#6d5f00]"
            >
              <Link href="/games">Go to Game Zone</Link>
            </Button>
          </div>

          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-5 shadow-inner">
            <div className="grid gap-4 sm:grid-cols-2">
              {gameItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    className="grid min-h-24 place-items-center rounded-2xl bg-white/20 p-5 text-center font-bold"
                    key={item.label}
                  >
                    <Icon className="mb-2 size-7" />
                    <span className="text-sm">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fd] py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-950">4 Steps to Stardom</h2>
            <p className="mt-3 text-sm text-slate-500">
              Your journey to becoming a Super Explorer!
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {steps.map(([title, text], index) => (
              <div className="text-center" key={title}>
                <div className="mx-auto grid size-14 place-items-center rounded-full border-4 border-[#006db3] bg-white text-lg font-bold text-[#006db3]">
                  {index + 1}
                </div>
                <h3 className="mt-5 text-sm font-bold text-slate-950">{title}</h3>
                <p className="mx-auto mt-2 max-w-44 text-xs leading-5 text-slate-500">
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="relative mx-auto mt-14 max-w-4xl rounded-[2rem] border border-sky-100 bg-white px-8 py-8 shadow-xl shadow-slate-200">
            <Image
              alt="Progress coach"
              className="absolute -top-16 right-8 rounded-sm border border-slate-200 bg-[#ffc679] object-cover"
              height={80}
              src="/kidclass-mascot.png"
              width={80}
            />
            <h3 className="text-lg font-bold text-[#006db3]">Track Your Wins!</h3>
            <p className="mt-4 text-sm text-slate-500">
              See how many stars you have earned today. Keep going, Explorer!
            </p>
            <div className="mt-7 space-y-6">
              <ProgressRow color="bg-[#66dacb]" label="Bangla Vocabulary" value={80} />
              <ProgressRow color="bg-[#f4d743]" label="Math Wizardry" value={45} />
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <span className="inline-flex items-center rounded-full bg-[#ffe278] px-5 py-2 text-xs font-bold text-[#655700]">
                <Star className="mr-2 size-4 fill-current" /> 128 Stars
              </span>
              <span className="inline-flex items-center rounded-full bg-[#ffd4e0] px-5 py-2 text-xs font-bold text-[#9b3158]">
                5 Badges
              </span>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function LessonCard({ course }: { course: Course }) {
  const href = getId(course).startsWith("class-") ? "/courses" : `/courses/${getId(course)}`;

  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-300 bg-white shadow-sm">
      <div className="relative aspect-[1.88/1] bg-[#ffd991]">
        <Image
          alt={course.title}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 92vw, 31vw"
          src={course.thumbnailImage || "/kidclass-mascot.png"}
          unoptimized={Boolean(course.thumbnailImage?.startsWith("http"))}
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#ffd83d] px-3 py-1 text-xs font-bold text-[#6c5c00]">
          {course.category ?? "Free"}
        </span>
      </div>
      <div className="p-5">
        <h3 className="min-h-12 text-lg font-semibold leading-6 text-slate-950">
          {course.title}
        </h3>
        <p className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <GraduationCap className="size-4" />
          {course.description || "24 Lessons"}
        </p>
        <Button
          asChild
          className="mt-6 h-10 w-full rounded-full bg-[#006db3] text-xs font-bold text-white hover:bg-[#005b97]"
        >
          <Link href={href}>View Course</Link>
        </Button>
      </div>
    </article>
  );
}

function ProgressRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs font-bold text-slate-700">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <Progress
        className="h-3 bg-[#dce8fb]"
        indicatorClassName={color}
        value={value}
      />
    </div>
  );
}
