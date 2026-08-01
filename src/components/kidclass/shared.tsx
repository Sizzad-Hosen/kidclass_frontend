"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  Award,
  BadgeCheck,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Circle,
  FileQuestion,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Loader2,
  LogOut,
  Lock,
  MapIcon,
  Menu,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/redux/hooks";
import { useLogout } from "@/redux/features/auth/useLogout";
import type {
  Assignment,
  Course,
  CourseProgress,
  CourseStructure,
  Enrollment,
  Lesson,
  LessonProgressStatus,
  Milestone,
} from "@/redux/features/learning/learningApi";
import { getId } from "@/redux/features/learning/learningApi";

export const brandName = "Kidclass";

export const kidColors = {
  blue: "#006DB3",
  yellow: "#FFD83D",
  olive: "#817000",
  pink: "#B03D68",
};

export function mascotImage(course?: Course) {
  return (
    course?.thumbnailImage ||
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80"
  );
}

export function PublicNavbar() {
  const user = useAppSelector((state) => state.auth.user);
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const isStudent = mounted && user?.role === "student";

  return (
    <header className="border-b border-[#c7d8e8] bg-[#f7f8fc]/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
        <Link className="flex items-center gap-2 text-xl font-bold text-[#0059a8]" href="/">
          <GraduationCap className="size-6 text-[#ffd83d]" />
          {brandName}
        </Link>
        <nav className="hidden items-center gap-9 text-xs font-bold text-slate-800 md:flex">
          <Link className="border-b-2 border-[#817000] pb-1 text-[#0059a8]" href="/courses">
            Lessons
          </Link>
          <Link href="/games">Games</Link>
        </nav>
        <Button asChild className="h-9 rounded-full bg-[#006db3] px-6 text-xs font-bold shadow-md hover:bg-[#005b97]">
          <Link href={isStudent ? "/student/dashboard" : "/login"}>
            {isStudent ? "Dashboard" : "Sign In"}
          </Link>
        </Button>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-300 bg-[#e1e3ec]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-9 text-slate-600 md:flex-row md:items-center md:justify-between lg:px-10">
        <div className="[&>p:last-child]:hidden">
          <p className="flex items-center gap-2 text-sm font-bold text-[#0059a8]">
            <GraduationCap className="size-4 text-[#ffd83d]" />
            {brandName}
          </p>
          <p className="mt-4 text-xs">
            (c) 2024 EduAdventure Playground. Safe & Secure for Kids.
          </p>
          <p className="mt-2">© 2024 EduAdventure Playground. Safe & Secure for Kids.</p>
        </div>
        <div className="flex flex-wrap gap-6 text-xs underline">
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Safety Center</Link>
          <Link href="#">For Teachers</Link>
          <Link href="#">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <PublicNavbar />
      {children}
      <PublicFooter />
    </main>
  );
}

export function CourseCard({
  course,
  href,
  action = "View Course",
  progress,
  onAction,
  actionDisabled = false,
}: {
  course: Course;
  href: string;
  action?: string;
  progress?: number;
  onAction?: () => void;
  actionDisabled?: boolean;
}) {
  return (
    <Card className="min-w-0 rounded-[2rem] border-sky-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100 sm:aspect-[4/3] sm:rounded-3xl">
        <Image
          alt={course.title}
          className="object-contain"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={mascotImage(course)}
          unoptimized
        />
        <Badge className="absolute right-3 top-3" variant="yellow">
          {course.category ?? "Adventure"}
        </Badge>
      </div>
      <CardContent className="space-y-4 px-2 pt-4">
        <div>
          <h3 className="text-2xl font-black leading-tight text-sky-700">{course.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {course.description ?? "A playful learning adventure with guided lessons."}
          </p>
        </div>
        {typeof progress === "number" ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span>Progress</span>
              <span className="text-sky-700">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        ) : null}
        {onAction ? (
          <div className="grid grid-cols-2 gap-3">
            <Button asChild className="h-11 rounded-full border-sky-200 bg-white text-sky-700 shadow-sm hover:bg-sky-50">
              <Link href={href}>View Details</Link>
            </Button>
            <Button className="h-11 rounded-full bg-sky-700 text-base shadow-md" disabled={actionDisabled} onClick={onAction}>
              {action}
            </Button>
          </div>
        ) : (
          <Button asChild className="h-11 w-full rounded-full bg-sky-700 text-base shadow-md">
            <Link href={href}>{action}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function StructurePreview({
  structure,
  progress,
  studentMode = false,
}: {
  structure?: CourseStructure;
  progress?: CourseProgress;
  studentMode?: boolean;
}) {
  const progressMap = new Map(
    progress?.lessons?.progress?.map((item) => [getId(item.lesson), item.status]) ?? [],
  );

  return (
    <div className="space-y-4">
      {(structure?.milestones ?? []).map((milestone, index) => (
        <MilestonePanel
          key={getId(milestone) || milestone.title}
          milestone={milestone}
          number={index + 1}
          progressMap={progressMap}
          studentMode={studentMode}
        />
      ))}
      {!structure?.milestones?.length ? (
        <EmptyState
          icon={<MapIcon className="size-8" />}
          title="No milestones yet"
          message="This adventure is getting its map ready."
        />
      ) : null}
    </div>
  );
}

function MilestonePanel({
  milestone,
  number,
  progressMap,
  studentMode,
}: {
  milestone: Milestone;
  number: number;
  progressMap: Map<string, LessonProgressStatus | undefined>;
  studentMode: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <div className="flex items-center gap-3 bg-slate-100 px-5 py-4">
        <span className="grid size-9 place-items-center rounded-full bg-sky-700 font-bold text-white">
          {number}
        </span>
        <h3 className="text-xl font-bold">{milestone.title}</h3>
      </div>
      <div className="space-y-5 p-5">
        {milestone.modules?.map((moduleItem) => (
          <div key={getId(moduleItem) || moduleItem.title}>
            <p className="mb-3 font-bold text-slate-600">{moduleItem.title}</p>
            <div className="space-y-3">
              {moduleItem.lessons?.map((lesson, lessonIndex) => {
                const status = progressMap.get(getId(lesson));
                const locked = studentMode && lessonIndex > 0 && !status;
                return (
                  <LessonRow
                    key={getId(lesson) || lesson.title}
                    lesson={lesson}
                    locked={locked}
                    status={status}
                  />
                );
              })}
              {moduleItem.quizzes?.map((quiz) => (
                <div
                  className="flex items-center justify-between rounded-2xl bg-yellow-50 px-4 py-3 text-sm"
                  key={getId(quiz) || quiz.title}
                >
                  <span className="flex items-center gap-3 font-semibold">
                    <FileQuestion className="size-5 text-yellow-700" />
                    {quiz.title ?? "Quick Quiz"}
                  </span>
                  <Badge variant="yellow">Quiz</Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
        {milestone.assignments?.map((assignment) => (
          <AssignmentRow assignment={assignment} key={getId(assignment) || assignment.title} />
        ))}
      </div>
    </div>
  );
}

function LessonRow({
  lesson,
  status,
  locked,
}: {
  lesson: Lesson;
  status?: LessonProgressStatus;
  locked?: boolean;
}) {
  const icon = locked ? (
    <Lock className="size-5 text-slate-400" />
  ) : status === "completed" ? (
    <CheckCircle2 className="size-5 text-emerald-600" />
  ) : status === "in-progress" ? (
    <Circle className="size-5 fill-yellow-300 text-yellow-600" />
  ) : (
    <Play className="size-5 text-sky-700" />
  );

  return (
    <Link
      className={cn(
        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition",
        locked ? "bg-slate-100 text-slate-400" : "bg-sky-50 hover:bg-sky-100",
      )}
      href={locked ? "#" : `/student/lessons/${getId(lesson)}`}
    >
      <span className="flex items-center gap-3 font-semibold">
        {icon}
        {lesson.title}
      </span>
      <span>{lesson.duration ? `${lesson.duration} mins` : status ?? "Preview"}</span>
    </Link>
  );
}

function AssignmentRow({ assignment }: { assignment: Assignment }) {
  return (
    <Link
      className="flex items-center justify-between rounded-2xl bg-pink-50 px-4 py-3 text-sm"
      href={`/student/assignments/${getId(assignment)}`}
    >
      <span className="flex items-center gap-3 font-semibold">
        <CalendarCheck className="size-5 text-pink-700" />
        {assignment.title}
      </span>
      <Badge variant="pink">{assignment.points ?? 0} pts</Badge>
    </Link>
  );
}

export function EmptyState({
  icon,
  title,
  message,
}: {
  icon: React.ReactNode;
  title: string;
  message: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-sky-200 bg-white p-10 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-full bg-sky-100 text-sky-700">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{message}</p>
    </div>
  );
}

export function ErrorState({ message = "Something went wrong." }: { message?: string }) {
  return (
    <EmptyState
      icon={<HelpCircle className="size-8" />}
      title="Oops, try again"
      message={message}
    />
  );
}

export function CourseGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card className="rounded-[2rem] p-3" key={index}>
          <Skeleton className="aspect-[4/3] rounded-3xl" />
          <CardContent className="space-y-3 px-2 pt-4">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-11 w-full rounded-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function StudentSidebar() {
  const pathname = usePathname();
  const { logout, isLoading } = useLogout();
  const links = [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/courses", label: "Courses", icon: BookOpen },
    { href: "/student/assignments", label: "Assignments", icon: CalendarCheck },
    { href: "/student/certificates", label: "Certificates", icon: Award },
    { href: "/games", label: "Games", icon: Sparkles },
    { href: "/student/settings", label: "Settings", icon: UserRound },
  ];

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-slate-100/80 px-5 py-8 lg:block">
      <Link className="mb-14 flex flex-col items-center gap-4 text-sky-700" href="/">
        <GraduationCap className="size-16 text-yellow-400" />
        <span className="text-2xl font-black">{brandName}</span>
      </Link>
      <nav className="space-y-3">
        {links.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              className={cn(
                "flex items-center gap-4 rounded-full px-5 py-4 text-lg font-bold text-slate-600",
                active && "bg-yellow-300 text-yellow-900 shadow-sm",
              )}
              href={link.href}
              key={link.label}
            >
              <Icon className="size-6" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <Button className="mt-20 h-14 w-full rounded-full bg-red-600 text-lg shadow-md hover:bg-red-700" disabled={isLoading} onClick={logout}>
        <LogOut className="size-5" />
        {isLoading ? "Signing Out..." : "Logout"}
      </Button>
    </aside>
  );
}

export function DashboardHeader() {
  const { logout, isLoading } = useLogout();
  return (
    <header className="sticky top-0 z-20 border-b-4 border-sky-100 bg-slate-50/95 px-5 py-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <Link className="text-2xl font-black text-sky-700 lg:hidden" href="/">
          {brandName}
        </Link>
        <nav className="hidden flex-1 justify-center gap-10 text-2xl font-semibold md:flex">
          <Link className="border-b-4 border-yellow-700 text-sky-700" href="/student/courses">
            Lessons
          </Link>
          <Link href="/games">Games</Link>
        </nav>
        <Button className="h-11 rounded-full bg-sky-700 px-6 text-base shadow-md" disabled={isLoading} onClick={logout}>
          <LogOut className="size-4" /> {isLoading ? "Signing Out..." : "Logout"}
        </Button>
        <Button className="lg:hidden" size="icon" variant="ghost" aria-label="Open menu">
          <Menu />
        </Button>
      </div>
    </header>
  );
}

export function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#eefdf2] text-slate-900">
      <div className="flex">
        <StudentSidebar />
        <div className="min-w-0 flex-1">
          <DashboardHeader />
          {children}
        </div>
      </div>
    </div>
  );
}

export function ProgressSummary({
  enrollments,
  certificates,
}: {
  enrollments?: Enrollment[];
  certificates?: unknown[];
}) {
  const active = enrollments?.filter((item) => item.status === "active").length ?? 0;
  const completed = enrollments?.filter((item) => item.status === "completed").length ?? 0;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <StatCard icon={<BookOpen />} label="Enrolled Courses" value={active} tone="blue" />
      <StatCard icon={<BadgeCheck />} label="Completed Lessons" value={completed * 4 || 8} tone="yellow" />
      <StatCard icon={<Award />} label="Certificates" value={certificates?.length ?? 0} tone="pink" />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  tone: "blue" | "yellow" | "pink";
}) {
  const tones = {
    blue: "bg-blue-100 text-sky-700",
    yellow: "bg-yellow-200 text-yellow-800",
    pink: "bg-pink-100 text-pink-700",
  };

  return (
    <Card className="rounded-[2rem] border-sky-100 bg-white p-8 text-center shadow-sm">
      <div className={cn("mx-auto grid size-20 place-items-center rounded-full", tones[tone])}>
        {icon}
      </div>
      <p className="mt-5 text-lg font-bold text-slate-600">{label}</p>
      <p className="text-4xl font-black text-sky-700">{value}</p>
    </Card>
  );
}

export function PageLoader({ label = "Loading adventure" }: { label?: string }) {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 font-bold text-sky-700 shadow">
        <Loader2 className="size-5 animate-spin" />
        {label}
      </div>
    </div>
  );
}

export function CertificateBadge() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 text-center">
      <p className="mb-4 text-sm text-slate-600">Earn Your Certificate!</p>
      <div className="mx-auto grid aspect-[4/3] max-w-64 place-items-center rounded-3xl border-4 border-dashed border-slate-300 bg-slate-100 text-slate-500">
        <ShieldCheck className="size-16" />
        <span className="font-bold">Complete to Unlock</span>
      </div>
    </div>
  );
}

export function CoachTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <Image
        alt="Coach"
        className="rounded-xl"
        height={72}
        src="/kidclass-mascot.png"
        width={72}
      />
      <div className="rounded-[2rem] border-2 border-sky-100 bg-white px-8 py-5 text-lg shadow-sm">
        {children}
      </div>
    </div>
  );
}

export { Award, BookOpen, CalendarCheck, CheckCircle2, Play, Rocket, Star, Trophy };
