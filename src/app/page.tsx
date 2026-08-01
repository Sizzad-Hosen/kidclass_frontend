"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Dice5,
  Gamepad2,
  GraduationCap,
  Languages,
  Palette,
  Play,
  Puzzle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UsersRound,
} from "lucide-react";

import { PageShell } from "@/components/kidclass/shared";
import { Button } from "@/components/ui/button";
import {
  getId,
  type Course,
  useGetCoursesQuery,
} from "@/redux/features/learning/learningApi";

const classCards = [
  {
    title: "Class 1",
    eyebrow: "Little explorers",
    text: "Letters, sounds and friendly numbers for a confident first step.",
    icon: Languages,
    gradient: "from-sky-500 to-cyan-400",
    soft: "bg-sky-50 text-sky-700",
    accent: "text-sky-600",
    number: "1",
  },
  {
    title: "Class 2",
    eyebrow: "Bright thinkers",
    text: "Reading, problem-solving and playful practice that builds strong skills.",
    icon: Brain,
    gradient: "from-amber-400 to-orange-400",
    soft: "bg-amber-50 text-amber-800",
    accent: "text-amber-600",
    number: "2",
  },
  {
    title: "Class 3",
    eyebrow: "Young champions",
    text: "Bigger ideas, creative challenges and exciting learning adventures.",
    icon: Rocket,
    gradient: "from-fuchsia-500 to-rose-400",
    soft: "bg-rose-50 text-rose-700",
    accent: "text-rose-600",
    number: "3",
  },
];

const fallbackCourses: Course[] = [
  {
    id: "class-1-english",
    title: "Class 1 English ABC Learning",
    description: "24 playful lessons",
    category: "English",
    thumbnailImage:
      "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "class-1-bangla",
    title: "Class 1 Bangla Fun Learning",
    description: "18 joyful lessons",
    category: "Bangla",
    thumbnailImage:
      "https://images.unsplash.com/photo-1604881991720-f91add269bed?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "class-2-math",
    title: "Class 2 Math Adventure",
    description: "32 exciting lessons",
    category: "Math",
    thumbnailImage:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80",
  },
];

const steps = [
  { title: "Choose a quest", text: "Pick a class and a subject you love.", icon: BookOpen },
  { title: "Learn with joy", text: "Watch, listen and explore each lesson.", icon: Play },
  { title: "Play & practice", text: "Try quizzes and games to grow your skills.", icon: Gamepad2 },
  { title: "Celebrate wins", text: "Earn stars, badges and certificates.", icon: Trophy },
];

const games = [
  { label: "Word Match", icon: Languages, color: "bg-violet-100 text-violet-700" },
  { label: "Math Dice", icon: Dice5, color: "bg-amber-100 text-amber-700" },
  { label: "Puzzle Fun", icon: Puzzle, color: "bg-cyan-100 text-cyan-700" },
  { label: "Color Fill", icon: Palette, color: "bg-rose-100 text-rose-700" },
];

export default function Home() {
  const { data: courses } = useGetCoursesQuery();
  const lessonCards = courses?.length ? courses.slice(0, 3) : fallbackCourses;
  const firstCourse = courses?.[0];

  return (
    <PageShell>
      <section className="relative overflow-hidden bg-[#f5fbff]">
        <div className="absolute -left-28 top-24 size-72 rounded-full bg-cyan-200/35 blur-3xl" />
        <div className="absolute -right-24 -top-20 size-96 rounded-full bg-amber-200/45 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-72 rounded-full bg-fuchsia-200/20 blur-3xl" />

        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-20">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-100 px-4 py-2 text-sm font-black text-amber-800 shadow-sm">
              <Sparkles className="size-4" />
              Learning feels like play
            </span>
            <h1 className="mt-7 max-w-2xl text-5xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
              Big dreams start with{" "}
              <span className="relative inline-block text-sky-600">
                one fun lesson
                <svg
                  aria-hidden="true"
                  className="absolute -bottom-3 left-0 w-full text-amber-400"
                  viewBox="0 0 300 18"
                >
                  <path d="M4 12C65 2 210 2 296 10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="8" />
                </svg>
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg font-medium leading-8 text-slate-600">
              Joyful Bangla, English and Math adventures made for curious learners
              in Classes 1–3.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button
                asChild
                className="h-14 rounded-2xl bg-sky-600 px-7 text-base font-black text-white shadow-xl shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-sky-700"
              >
                <Link href={firstCourse ? `/courses/${getId(firstCourse)}` : "/courses"}>
                  <Play className="fill-current" />
                  Start learning
                </Link>
              </Button>
              <Button
                asChild
                className="h-14 rounded-2xl border-2 border-slate-200 bg-white px-7 text-base font-black text-slate-700 shadow-sm hover:border-sky-200 hover:bg-sky-50"
              >
                <Link href="/courses">
                  Explore courses <ArrowRight />
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-bold text-slate-600">
              <span className="flex items-center gap-2"><CheckCircle2 className="size-5 text-emerald-500" /> Kid-safe space</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="size-5 text-emerald-500" /> Learn at your pace</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="size-5 text-emerald-500" /> Certificates included</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute inset-8 rotate-3 rounded-[4rem] bg-gradient-to-br from-sky-300 via-cyan-200 to-amber-200 shadow-2xl shadow-sky-900/10" />
            <div className="absolute -left-3 top-16 z-20 kid-float rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-600"><Star className="size-5 fill-current" /></span>
                <span><strong className="block text-sm text-slate-900">128 stars</strong><small className="text-slate-500">Amazing work!</small></span>
              </div>
            </div>
            <div className="absolute -right-3 bottom-16 z-20 kid-float-delayed rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600"><Trophy className="size-5" /></span>
                <span><strong className="block text-sm text-slate-900">New badge!</strong><small className="text-slate-500">Math Explorer</small></span>
              </div>
            </div>
            <div className="relative mx-auto aspect-square w-[88%] overflow-hidden rounded-[3.5rem] border-8 border-white bg-sky-200 shadow-2xl shadow-sky-900/15">
              <Image
                alt="KidClass owl mascot reading a book"
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 88vw, 500px"
                src="/kidclass-mascot.png"
              />
            </div>
            <span className="absolute right-6 top-0 grid size-14 rotate-12 place-items-center rounded-2xl bg-fuchsia-500 text-2xl font-black text-white shadow-lg">A</span>
            <span className="absolute bottom-3 left-12 grid size-14 -rotate-12 place-items-center rounded-full bg-amber-400 text-2xl font-black text-amber-950 shadow-lg">১</span>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pb-10 lg:px-10">
          <div className="grid overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl shadow-sky-900/5 sm:grid-cols-3">
            <TrustItem icon={ShieldCheck} title="Safe for children" text="A focused, friendly learning space" />
            <TrustItem icon={UsersRound} title="Made for Classes 1–3" text="Age-friendly lessons and activities" />
            <TrustItem icon={Sparkles} title="Learn by doing" text="Videos, quizzes, games and rewards" />
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <SectionHeading
          eyebrow="Pick your path"
          title="A colorful world for every class"
          text="Each level grows with your child—simple beginnings, stronger skills and bigger adventures."
        />
        <div className="mx-auto mt-12 grid max-w-7xl gap-6 px-6 md:grid-cols-3 lg:px-10">
          {classCards.map((item) => {
            const Icon = item.icon;
            return (
              <article
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200/70"
                key={item.title}
              >
                <span className="absolute -right-3 -top-12 text-[11rem] font-black leading-none text-slate-100 transition group-hover:scale-105">
                  {item.number}
                </span>
                <div className={`relative grid size-14 place-items-center rounded-2xl ${item.soft}`}>
                  <Icon className="size-7" />
                </div>
                <p className={`relative mt-7 text-xs font-black uppercase tracking-[.18em] ${item.accent}`}>{item.eyebrow}</p>
                <h3 className="relative mt-2 text-3xl font-black text-slate-900">{item.title}</h3>
                <p className="relative mt-4 min-h-20 leading-7 text-slate-600">{item.text}</p>
                <Button
                  asChild
                  className={`relative mt-6 h-12 w-full rounded-xl bg-gradient-to-r font-black text-white shadow-lg ${item.gradient}`}
                >
                  <Link href="/courses">Explore {item.title} <ArrowRight /></Link>
                </Button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              align="left"
              eyebrow="Popular adventures"
              title="Lessons children love to open"
              text="Friendly teachers, bite-sized activities and lots of chances to celebrate progress."
            />
            <Link className="flex shrink-0 items-center gap-2 font-black text-sky-700 hover:text-sky-900" href="/courses">
              See every course <ArrowRight />
            </Link>
          </div>
          <div className="mt-12 grid gap-7 md:grid-cols-3">
            {lessonCards.map((course, index) => (
              <LessonCard course={course} index={index} key={getId(course) || course.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#092f49] py-20 text-white sm:py-24">
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[.9fr_1.1fr] lg:px-10">
          <div className="absolute -left-32 top-0 size-80 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-cyan-200">
              <Gamepad2 className="size-4" /> Game zone
            </span>
            <h2 className="mt-6 text-4xl font-black leading-tight sm:text-5xl">
              Practice feels better when it feels like play
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-sky-100/80">
              Every game turns a classroom skill into a small, exciting challenge.
              Children learn, retry and grow without pressure.
            </p>
            <ul className="mt-8 space-y-4 font-bold text-sky-50">
              <li className="flex items-center gap-3"><Star className="size-5 fill-amber-300 text-amber-300" /> Earn stars for smart answers</li>
              <li className="flex items-center gap-3"><Trophy className="size-5 text-amber-300" /> Unlock badges and celebrate progress</li>
              <li className="flex items-center gap-3"><ShieldCheck className="size-5 text-emerald-300" /> Enjoy a safe, focused experience</li>
            </ul>
            <Button asChild className="mt-9 h-13 rounded-2xl bg-amber-400 px-7 font-black text-amber-950 hover:bg-amber-300">
              <Link href="/games">Enter the game zone <Rocket /></Link>
            </Button>
          </div>

          <div className="relative grid grid-cols-2 gap-4 rounded-[2.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
            {games.map((game, index) => {
              const Icon = game.icon;
              return (
                <div
                  className={`group rounded-3xl bg-white p-5 text-slate-900 shadow-xl transition hover:-translate-y-1 ${index % 2 ? "translate-y-5" : ""}`}
                  key={game.label}
                >
                  <span className={`grid size-12 place-items-center rounded-2xl ${game.color}`}><Icon /></span>
                  <h3 className="mt-7 text-lg font-black">{game.label}</h3>
                  <p className="mt-1 text-sm text-slate-500">Quick, joyful brain training</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-black text-sky-700">Play now <ArrowRight className="size-4" /></span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="Four little steps. So many big wins."
          text="A simple learning rhythm children can understand and parents can trust."
        />
        <div className="relative mx-auto mt-14 grid max-w-7xl gap-6 px-6 md:grid-cols-4 lg:px-10">
          <div className="absolute left-[13%] right-[13%] top-9 hidden border-t-2 border-dashed border-sky-200 md:block" />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article className="relative text-center" key={step.title}>
                <div className="relative z-10 mx-auto grid size-20 place-items-center rounded-3xl border-4 border-white bg-sky-100 text-sky-700 shadow-lg">
                  <Icon className="size-8" />
                  <span className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-amber-400 text-xs font-black text-amber-950">{index + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-black text-slate-900">{step.title}</h3>
                <p className="mx-auto mt-2 max-w-52 text-sm leading-6 text-slate-500">{step.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#f5fbff] px-6 py-20 lg:px-10 sm:py-24">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[3rem] bg-gradient-to-br from-sky-600 via-blue-600 to-violet-600 px-7 py-12 text-center text-white shadow-2xl shadow-sky-900/20 sm:px-12 sm:py-16">
          <div className="absolute -left-16 -top-16 size-48 rounded-full border-[28px] border-white/10" />
          <div className="absolute -bottom-20 -right-10 size-64 rounded-full bg-amber-300/20" />
          <Star className="absolute left-[15%] top-10 size-8 rotate-12 fill-amber-300 text-amber-300" />
          <Sparkles className="absolute right-[14%] top-12 size-9 text-cyan-200" />
          <div className="relative">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black">Ready for an adventure?</span>
            <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">Let’s make today’s screen time count</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-sky-100">Choose a course, meet the KidClass owl and turn curiosity into confidence—one joyful lesson at a time.</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button asChild className="h-14 rounded-2xl bg-amber-400 px-8 text-base font-black text-amber-950 hover:bg-amber-300">
                <Link href="/register">Create a free profile <ArrowRight /></Link>
              </Button>
              <Button asChild className="h-14 rounded-2xl border border-white/30 bg-white/10 px-8 text-base font-black text-white hover:bg-white/20">
                <Link href="/courses">Browse courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function TrustItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof ShieldCheck;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 p-5 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-600"><Icon /></span>
      <span><strong className="block text-sm text-slate-900">{title}</strong><small className="mt-1 block text-slate-500">{text}</small></span>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  text: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl px-6 text-center" : "max-w-2xl"}>
      <p className="text-sm font-black uppercase tracking-[.2em] text-sky-600">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">{text}</p>
    </div>
  );
}

function LessonCard({ course, index }: { course: Course; index: number }) {
  const href = getId(course).startsWith("class-") ? "/courses" : `/courses/${getId(course)}`;
  const tones = [
    "bg-sky-100 text-sky-700",
    "bg-amber-100 text-amber-800",
    "bg-rose-100 text-rose-700",
  ];

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-200">
      <div className="relative aspect-video overflow-hidden bg-sky-100 sm:aspect-[1.45/1]">
        <Image
          alt={course.title}
          className="object-contain transition duration-500 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 92vw, 31vw"
          src={course.thumbnailImage || "/kidclass-mascot.png"}
          unoptimized={Boolean(course.thumbnailImage?.startsWith("http"))}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-black shadow-sm ${tones[index % tones.length]}`}>
          {course.category ?? "Adventure"}
        </span>
        <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-slate-700 backdrop-blur">
          <Play className="size-3 fill-sky-600 text-sky-600" /> Learn & play
        </span>
      </div>
      <div className="p-6">
        <h3 className="line-clamp-2 min-h-14 text-xl font-black leading-7 text-slate-900">{course.title}</h3>
        <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">{course.description || "A joyful course packed with playful lessons."}</p>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
          <span className="flex items-center gap-2 text-xs font-bold text-slate-500"><GraduationCap className="size-4 text-sky-600" /> KidClass course</span>
          <Link className="flex items-center gap-1 text-sm font-black text-sky-700 hover:text-sky-900" href={href}>Open <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </article>
  );
}
