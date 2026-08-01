"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  BookOpenText,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileImage,
  FileText,
  Film,
  Layers3,
  ListVideo,
  LockKeyhole,
  Play,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PublicQuizDialog } from "@/components/course-management/public-quiz-dialog";
import { getVideoEmbedUrl, VideoPlayer } from "@/components/kidclass/video-player";
import type {
  CourseModule,
  CourseProgress,
  CourseStructure,
  Lesson,
  Milestone,
} from "@/redux/features/learning/learningApi";
import { getId, useUpdateLessonProgressMutation } from "@/redux/features/learning/learningApi";

type LessonEntry = {
  lesson: Lesson;
  module: CourseModule;
  milestone: Milestone;
};

const lessonIcon = (contentType?: string) => {
  if (contentType === "video") return Film;
  if (contentType === "image") return FileImage;
  return FileText;
};

const formatDuration = (seconds?: number) => {
  if (!seconds) return "Self paced";
  const minutes = Math.max(1, Math.ceil(seconds / 60));
  return `${minutes} min`;
};

export function PublicCoursePlayer({
  structure,
  progress,
  studentMode = false,
}: {
  structure: CourseStructure;
  progress?: CourseProgress;
  studentMode?: boolean;
}) {
  const lessonEntries = useMemo(
    () =>
      structure.milestones.flatMap((milestone) =>
        (milestone.modules ?? []).flatMap((moduleItem) =>
          (moduleItem.lessons ?? []).map((lesson) => ({
            lesson,
            module: moduleItem,
            milestone,
          })),
        ),
      ),
    [structure.milestones],
  );
  const firstLessonId = getId(lessonEntries[0]?.lesson);
  const [selectedLessonId, setSelectedLessonId] = useState(firstLessonId);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [openMilestones, setOpenMilestones] = useState<Record<string, boolean>>(
    () => ({ [getId(structure.milestones[0])]: true }),
  );
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() => ({
    [getId(structure.milestones[0]?.modules?.[0])]: true,
  }));
  const [updateLessonProgress, updateState] = useUpdateLessonProgressMutation();
  const progressMap = useMemo(
    () =>
      new Map(
        progress?.lessons?.progress?.map((item) => [getId(item.lesson), item.status]) ?? [],
      ),
    [progress?.lessons?.progress],
  );

  const activeIndex = Math.max(
    0,
    lessonEntries.findIndex((entry) => getId(entry.lesson) === selectedLessonId),
  );
  const activeEntry = lessonEntries[activeIndex];
  const totalModules = structure.milestones.reduce(
    (sum, milestone) => sum + (milestone.modules?.length ?? 0),
    0,
  );
  const totalQuizzes = structure.milestones.reduce(
    (sum, milestone) =>
      sum +
      (milestone.modules?.reduce(
        (moduleSum, moduleItem) => moduleSum + (moduleItem.quizzes?.length ?? 0),
        0,
      ) ?? 0),
    0,
  );

  const lessonLocked = (entry: LessonEntry) => {
    if (!studentMode) return false;
    const lessons = entry.module.lessons ?? [];
    const index = lessons.findIndex((lesson) => getId(lesson) === getId(entry.lesson));
    if (index <= 0) return false;
    return progressMap.get(getId(lessons[index - 1])) !== "completed";
  };

  const selectLesson = (entry: LessonEntry) => {
    if (lessonLocked(entry)) {
      toast.error("Complete the previous lesson to unlock this one.");
      return;
    }
    setSelectedLessonId(getId(entry.lesson));
    setOpenMilestones((value) => ({ ...value, [getId(entry.milestone)]: true }));
    setOpenModules((value) => ({ ...value, [getId(entry.module)]: true }));
  };

  const markActiveLesson = async (status: "in-progress" | "completed") => {
    if (!activeEntry) return;
    try {
      await updateLessonProgress({
        lessonId: getId(activeEntry.lesson),
        status,
        watchedSeconds: status === "completed" ? activeEntry.lesson.duration ?? 0 : 1,
      }).unwrap();
      toast.success(status === "completed" ? "Lesson completed!" : "Lesson started.");
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      toast.error(message ?? "Could not update this lesson.");
    }
  };

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_-35px_rgba(15,23,42,0.35)] sm:rounded-[2rem]">
      <header className="flex flex-col gap-5 border-b border-slate-200 bg-gradient-to-r from-white via-sky-50 to-indigo-50 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#14698d] text-white shadow-lg shadow-sky-900/15">
            <Sparkles className="size-7" />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
              Interactive course preview
            </p>
            <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
              {structure.course.title}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Choose a lesson from the curriculum and start learning.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:flex">
          <Stat value={structure.milestones.length} label="Milestones" />
          <Stat value={totalModules} label="Modules" />
          <Stat value={lessonEntries.length} label="Lessons" />
        </div>
      </header>

      <div className="grid lg:grid-cols-[390px_minmax(0,1fr)]">
        <aside className="order-2 border-t border-slate-200 bg-slate-50/80 lg:order-1 lg:max-h-[760px] lg:overflow-y-auto lg:border-r lg:border-t-0">
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
                  Course structure
                </p>
                <h3 className="mt-1 text-lg font-black text-slate-900">Your learning path</h3>
              </div>
              <ListVideo className="size-6 text-sky-600" />
            </div>
          </div>
          <div className="space-y-3 p-3 sm:p-4">
            {structure.milestones.map((milestone, milestoneIndex) => {
              const milestoneId = getId(milestone);
              const milestoneOpen = openMilestones[milestoneId] ?? false;
              return (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white" key={milestoneId}>
                  <button
                    className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-violet-50"
                    onClick={() =>
                      setOpenMilestones((value) => ({
                        ...value,
                        [milestoneId]: !milestoneOpen,
                      }))
                    }
                    type="button"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-violet-100 text-sm font-black text-violet-700">
                      {milestoneIndex + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-bold uppercase tracking-wider text-violet-600">
                        Milestone {milestoneIndex + 1}
                      </span>
                      <span className="mt-0.5 block font-black text-slate-800">{milestone.title}</span>
                    </span>
                    <ChevronDown className={`size-5 shrink-0 text-slate-400 transition ${milestoneOpen ? "rotate-180" : ""}`} />
                  </button>

                  {milestoneOpen ? (
                    <div className="border-t border-slate-100 bg-slate-50/60 p-2">
                      {(milestone.modules ?? []).map((moduleItem, moduleIndex) => {
                        const moduleId = getId(moduleItem);
                        const moduleOpen = openModules[moduleId] ?? false;
                        return (
                          <div className="mb-2 overflow-hidden rounded-xl bg-white last:mb-0" key={moduleId}>
                            <button
                              className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-sky-50"
                              onClick={() =>
                                setOpenModules((value) => ({
                                  ...value,
                                  [moduleId]: !moduleOpen,
                                }))
                              }
                              type="button"
                            >
                              <Layers3 className="size-4 shrink-0 text-sky-600" />
                              <span className="min-w-0 flex-1 text-sm font-bold text-slate-700">
                                Module {moduleIndex + 1}: {moduleItem.title}
                              </span>
                              <ChevronDown className={`size-4 text-slate-400 transition ${moduleOpen ? "rotate-180" : ""}`} />
                            </button>
                            {moduleOpen ? (
                              <div className="space-y-1 border-t border-slate-100 p-2">
                                {(moduleItem.lessons ?? []).map((lesson, lessonIndex) => {
                                  const lessonId = getId(lesson);
                                  const entry = { lesson, module: moduleItem, milestone };
                                  const active = activeEntry && lessonId === getId(activeEntry.lesson);
                                  const status = progressMap.get(lessonId);
                                  const locked = lessonLocked(entry);
                                  const Icon = lessonIcon(lesson.contentType);
                                  return (
                                    <button
                                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${active ? "bg-[#14698d] text-white shadow-md" : "text-slate-600 hover:bg-sky-50 hover:text-sky-800"}`}
                                      key={lessonId}
                                      onClick={() => selectLesson(entry)}
                                      type="button"
                                    >
                                      <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${active ? "bg-white/15" : "bg-slate-100"}`}>
                                        {locked ? <LockKeyhole className="size-4" /> : status === "completed" ? <CheckCircle2 className="size-4" /> : <Icon className="size-4" />}
                                      </span>
                                      <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-bold">
                                          {lessonIndex + 1}. {lesson.title}
                                        </span>
                                        <span className={`mt-1 flex items-center gap-1 text-xs ${active ? "text-sky-100" : "text-slate-400"}`}>
                                          <Clock3 className="size-3" /> {formatDuration(lesson.duration)}
                                          <span>·</span>
                                          <span className="capitalize">{lesson.contentType ?? "lesson"}</span>
                                        </span>
                                      </span>
                                      {active ? <Play className="size-4 fill-current" /> : locked ? <LockKeyhole className="size-4" /> : <ChevronRight className="size-4" />}
                                    </button>
                                  );
                                })}
                                {(moduleItem.quizzes ?? []).map((quiz) => (
                                  <button
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-slate-600 transition hover:bg-amber-50 hover:text-amber-800"
                                    key={getId(quiz)}
                                    onClick={() => setSelectedQuizId(getId(quiz))}
                                    type="button"
                                  >
                                    <span className="grid size-9 place-items-center rounded-lg bg-amber-100 text-amber-700">
                                      <CircleHelp className="size-4" />
                                    </span>
                                    <span className="min-w-0 flex-1 truncate text-sm font-bold">{quiz.title ?? "Module quiz"}</span>
                                    <span className="text-xs font-black uppercase text-amber-700">Start</span>
                                    <ChevronRight className="size-4" />
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                      {(milestone.assignments ?? []).map((assignment) => (
                        <Link
                          className="mb-2 flex items-center gap-3 rounded-xl border border-pink-100 bg-pink-50 px-3 py-3 text-pink-800 last:mb-0"
                          href={studentMode ? `/student/assignments/${getId(assignment)}` : "/login"}
                          key={getId(assignment)}
                        >
                          <FileText className="size-4" />
                          <span className="min-w-0 flex-1 truncate text-sm font-bold">{assignment.title}</span>
                          <span className="text-xs font-black">{assignment.points ?? 0} pts</span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </aside>

        <main className="order-1 min-w-0 bg-white lg:order-2">
          {activeEntry ? (
            <LessonViewer
              entry={activeEntry}
              hasNext={activeIndex < lessonEntries.length - 1}
              hasPrevious={activeIndex > 0}
              next={() => selectLesson(lessonEntries[activeIndex + 1])}
              previous={() => selectLesson(lessonEntries[activeIndex - 1])}
              progressStatus={progressMap.get(getId(activeEntry.lesson))}
              studentMode={studentMode}
              marking={updateState.isLoading}
              markLesson={markActiveLesson}
            />
          ) : (
            <div className="grid min-h-[520px] place-items-center p-8 text-center">
              <div>
                <BookOpenText className="mx-auto size-16 text-sky-200" />
                <h3 className="mt-5 text-2xl font-black text-slate-800">Curriculum is being prepared</h3>
                <p className="mt-2 text-slate-500">Lessons will appear here as soon as they are added.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-500 sm:px-8">
        <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-emerald-500" /> {studentMode ? `${progress?.lessons?.completed ?? 0} lessons completed` : "Public course preview is ready"}</span>
        <span>{totalQuizzes} quizzes available to try</span>
      </footer>
      {selectedQuizId ? (
        <PublicQuizDialog
          key={selectedQuizId}
          onClose={() => setSelectedQuizId("")}
          quizId={selectedQuizId}
        />
      ) : null}
    </section>
  );
}

function LessonViewer({
  entry,
  hasNext,
  hasPrevious,
  next,
  previous,
  progressStatus,
  studentMode,
  marking,
  markLesson,
}: {
  entry: LessonEntry;
  hasNext: boolean;
  hasPrevious: boolean;
  next: () => void;
  previous: () => void;
  progressStatus?: string;
  studentMode: boolean;
  marking: boolean;
  markLesson: (status: "in-progress" | "completed") => void;
}) {
  const { lesson, milestone, module } = entry;

  return (
    <div className="flex flex-col lg:min-h-[640px]">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-8">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-700">
          <span>{milestone.title}</span>
          <ChevronRight className="size-3" />
          <span>{module.title}</span>
        </div>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">{lesson.title}</h3>
            <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <Clock3 className="size-4" /> {formatDuration(lesson.duration)}
              <span className="rounded-full bg-sky-50 px-2 py-1 font-bold capitalize text-sky-700">
                {lesson.contentType ?? "lesson"}
              </span>
            </p>
          </div>
          <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            Preview available
          </span>
        </div>
      </div>

      <div className="flex-1 bg-slate-950/95">
        <LessonContent lesson={lesson} />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-8">
        <Button disabled={!hasPrevious} onClick={previous} variant="outline">
          <ChevronLeft /> Previous
        </Button>
        <div className="flex flex-wrap justify-end gap-2">
          {studentMode && progressStatus !== "completed" ? (
            <>
              <Button disabled={marking} onClick={() => markLesson("in-progress")} variant="outline">Start Lesson</Button>
              <Button className="bg-emerald-600 hover:bg-emerald-700" disabled={marking} onClick={() => markLesson("completed")}>Complete Lesson</Button>
            </>
          ) : null}
          <Button className="bg-[#14698d]" disabled={!hasNext} onClick={next}>
            Next lesson <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

function LessonContent({ lesson }: { lesson: Lesson }) {
  if (lesson.contentType === "video") {
    const embedUrl = getVideoEmbedUrl(lesson.videoUrl);
    if (embedUrl) {
      return (
        <div className="relative aspect-video w-full">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full border-0"
            src={embedUrl}
            title={lesson.title}
          />
        </div>
      );
    }
    if (lesson.videoUrl) {
      return (
        <div className="w-full">
          <VideoPlayer src={lesson.videoUrl} title={lesson.title} />
        </div>
      );
    }
    return <ContentUnavailable icon={<Film className="size-14" />} message="The video for this lesson will be added soon." />;
  }

  if (lesson.contentType === "image" && lesson.videoUrl) {
    return (
      <div className="grid min-h-[420px] place-items-center p-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={lesson.title} className="max-h-[620px] max-w-full rounded-2xl object-contain" src={lesson.videoUrl} />
      </div>
    );
  }

  if (lesson.contentType === "pdf" && lesson.videoUrl) {
    return <iframe className="min-h-[580px] w-full bg-white" src={lesson.videoUrl} title={lesson.title} />;
  }

  return (
    <article className="min-h-[480px] bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 text-slate-800 sm:p-10 lg:p-14">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-sky-100 bg-white p-6 shadow-sm sm:p-10">
        <span className="grid size-12 place-items-center rounded-2xl bg-sky-100 text-sky-700">
          <BookOpenText className="size-6" />
        </span>
        <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-700 sm:text-lg">
          {lesson.contentNotes || "Lesson notes will be available soon."}
        </p>
      </div>
    </article>
  );
}

function ContentUnavailable({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="grid min-h-[420px] place-items-center p-8 text-center text-white lg:min-h-[480px]">
      <div>
        <span className="mx-auto grid size-24 place-items-center rounded-full bg-white/10 text-sky-200">{icon}</span>
        <h4 className="mt-6 text-2xl font-black">Content coming soon</h4>
        <p className="mt-2 text-slate-300">{message}</p>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-white bg-white/80 px-4 py-3 text-center shadow-sm">
      <strong className="block text-xl font-black text-[#14698d]">{value}</strong>
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</span>
    </div>
  );
}
