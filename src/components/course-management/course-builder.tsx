"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  Archive,
  Blocks,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Edit3,
  FileVideo,
  FolderPlus,
  Layers3,
  Loader2,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  emptyQuestion,
  QuizQuestionEditor,
} from "@/components/course-management/quiz-question-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthErrorMessage } from "@/redux/features/auth/auth-errors";
import {
  useArchiveCourseMutation,
  useCreateLessonMutation,
  useCreateMilestoneMutation,
  useCreateModuleMutation,
  useCreateQuizMutation,
  useDeleteLessonMutation,
  useDeleteMilestoneMutation,
  useDeleteModuleMutation,
  useDeleteQuizMutation,
  useGetManagedCourseStructureQuery,
  usePublishCourseMutation,
  useUpdateLessonMutation,
  useUpdateMilestoneMutation,
  useUpdateModuleMutation,
  useUpdateQuizMutation,
} from "@/redux/features/course-management/courseManagementApi";
import type {
  CourseModule,
  Lesson,
  Milestone,
  Quiz,
  QuizQuestion,
} from "@/types/course-management";

type AddTarget =
  | {
      type: "milestone";
      parentId: string;
      parentName: string;
      nextOrder: number;
    }
  | {
      type: "module";
      parentId: string;
      parentName: string;
      nextOrder: number;
    }
  | {
      type: "lesson" | "quiz";
      parentId: string;
      parentName: string;
      nextOrder: number;
    }
  | null;
type EditTarget =
  | { type: "milestone"; entity: Milestone }
  | { type: "module"; entity: CourseModule }
  | { type: "lesson"; entity: Lesson }
  | { type: "quiz"; entity: Quiz }
  | null;

const nextOrder = (items: Array<{ order: number }> | undefined) =>
  Math.max(0, ...(items?.map((item) => item.order) ?? [])) + 1;

const validVideoFile = (file: File | undefined) => {
  if (!file) return null;
  if (!file.type.startsWith("video/")) {
    toast.error("Choose a valid video file.");
    return null;
  }
  return file;
};

export function CourseBuilder({ courseId }: { courseId: string }) {
  const { data, isLoading, isError, refetch } =
    useGetManagedCourseStructureQuery(courseId);
  const [publish, publishState] = usePublishCourseMutation();
  const [archive, archiveState] = useArchiveCourseMutation();
  const [deleteMilestone] = useDeleteMilestoneMutation();
  const [deleteModule] = useDeleteModuleMutation();
  const [deleteLesson] = useDeleteLessonMutation();
  const [deleteQuiz] = useDeleteQuizMutation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [addTarget, setAddTarget] = useState<AddTarget>(null);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const toggle = (id: string) =>
    setExpanded((value) => ({ ...value, [id]: !value[id] }));

  const remove = async (
    kind: "milestone" | "module" | "lesson" | "quiz",
    id: string,
    title: string,
  ) => {
    if (
      !window.confirm(`Delete “${title}”? Nested content may also be deleted.`)
    )
      return;
    try {
      if (kind === "milestone") await deleteMilestone(id).unwrap();
      if (kind === "module") await deleteModule(id).unwrap();
      if (kind === "lesson") await deleteLesson(id).unwrap();
      if (kind === "quiz") await deleteQuiz(id).unwrap();
      toast.success(`${kind[0].toUpperCase() + kind.slice(1)} deleted.`);
    } catch (error) {
      toast.error(getAuthErrorMessage(error, `Unable to delete ${kind}.`));
    }
  };

  const changeStatus = async () => {
    if (!data) return;
    try {
      if (data.course.isPublished) await archive(courseId).unwrap();
      else await publish(courseId).unwrap();
      toast.success(
        data.course.isPublished ? "Course archived." : "Course published.",
      );
    } catch (error) {
      toast.error(
        getAuthErrorMessage(error, "Unable to update course status."),
      );
    }
  };

  if (isLoading)
    return (
      <div className="space-y-5">
        <Skeleton className="h-28 rounded-3xl" />
        <Skeleton className="h-[520px] rounded-3xl" />
      </div>
    );
  if (isError || !data)
    return (
      <div className="grid min-h-96 place-items-center rounded-3xl bg-white text-center">
        <div>
          <BookOpen className="mx-auto size-12 text-sky-300" />
          <h1 className="mt-4 text-2xl font-black">
            Course structure unavailable
          </h1>
          <p className="mt-2 text-slate-500">
            The API could not load this draft structure.
          </p>
          <Button className="mt-5" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  const totalModules = data.milestones.reduce(
    (sum, item) => sum + (item.modules?.length ?? 0),
    0,
  );
  const totalLessons = data.milestones.reduce(
    (sum, item) =>
      sum +
      (item.modules?.reduce((n, mod) => n + (mod.lessons?.length ?? 0), 0) ??
        0),
    0,
  );
  const totalQuizzes = data.milestones.reduce(
    (sum, item) =>
      sum +
      (item.modules?.reduce(
        (count, moduleItem) => count + (moduleItem.quizzes?.length ?? 0),
        0,
      ) ?? 0),
    0,
  );

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-[#0e5f82] to-[#2380a6] p-6 text-white shadow-lg sm:p-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-sky-100">
            <Link href="/course-management/courses">Courses</Link>
            <ChevronRight className="size-4" />
            <span>Builder</span>
          </div>
          <h1 className="mt-3 text-3xl font-black">{data.course.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white/15 px-3 py-1">
              {data.milestones.length} milestones
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1">
              {totalModules} modules
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1">
              {totalLessons} lessons
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1">
              {totalQuizzes} quizzes
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            className="rounded-xl bg-white text-[#14698d] hover:bg-sky-50"
          >
            <Link href={`/course-management/courses/${courseId}/edit`}>
              Edit Details
            </Link>
          </Button>
          <Button
            className="rounded-xl bg-amber-400 font-bold text-amber-950 hover:bg-amber-300"
            disabled={publishState.isLoading || archiveState.isLoading}
            onClick={changeStatus}
          >
            {data.course.isPublished ? <Archive /> : <Send />}
            {data.course.isPublished ? "Archive" : "Publish Course"}
          </Button>
        </div>
      </div>
      <StepIndicator
        milestones={data.milestones.length}
        modules={totalModules}
        lessons={totalLessons}
        quizzes={totalQuizzes}
        published={data.course.isPublished}
      />
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
                Curriculum builder
              </p>
              <h2 className="mt-1 text-2xl font-black">Course structure</h2>
              <p className="mt-1 text-sm text-slate-500">
                Course → Milestones → Modules → Lessons and quizzes
              </p>
            </div>
          <Button
            className="h-11 rounded-xl bg-[#14698d] px-5"
            onClick={() =>
              setAddTarget({
                type: "milestone",
                parentId: courseId,
                parentName: data.course.title,
                nextOrder: nextOrder(data.milestones),
              })
            }
          >
            <FolderPlus />
            Add Milestone
          </Button>
          </div>
          <div className="mt-5 space-y-4">
            {data.milestones.length ? (
              data.milestones.map((milestone, milestoneIndex) => (
                <TreeMilestone
                  isFinalMilestone={milestoneIndex === data.milestones.length - 1}
                  key={milestone._id}
                  milestone={milestone}
                  expanded={expanded}
                  toggle={toggle}
                  add={setAddTarget}
                  edit={setEditTarget}
                  remove={remove}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/60 p-8 text-center">
                <Layers3 className="mx-auto size-10 text-sky-400" />
                <h3 className="mt-3 font-black text-slate-800">No milestones yet</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add the first milestone to start organizing this course.
                </p>
              </div>
            )}
          </div>
        </section>
        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">
                Review & readiness
              </p>
              <h2 className="mt-1 text-2xl font-black">Course checklist</h2>
            </div>
            <Blocks className="size-9 text-sky-200" />
          </div>
          <div className="mt-6 grid gap-3">
            {[
              [Boolean(data.course.title), "Course title added"],
              [Boolean(data.course.description), "Description added"],
              [data.milestones.length > 0, "At least one milestone"],
              [
                data.milestones.every((m) => (m.modules?.length ?? 0) > 0),
                "Every milestone has a module",
              ],
              [totalLessons > 0, "At least one lesson"],
              [Boolean(data.course.thumbnailImage), "Thumbnail image added"],
            ].map(([ready, label]) => (
              <div
                className={`flex items-center gap-3 rounded-2xl border p-4 ${ready ? "border-emerald-100 bg-emerald-50" : "border-amber-100 bg-amber-50"}`}
                key={String(label)}
              >
                <CheckCircle2
                  className={`size-5 ${ready ? "text-emerald-600" : "text-amber-400"}`}
                />
                <span className="font-semibold text-slate-700">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-sky-50 p-5">
            <h3 className="font-black text-sky-900">Recommended workflow</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Create a milestone, add its modules, then add lessons and quizzes.
              The backend remains the final authority when publishing.
            </p>
          </div>
        </aside>
      </div>
      <AddEntityDialog
        key={addTarget ? `add-${addTarget.type}-${addTarget.parentId}` : "add-closed"}
        onClose={() => setAddTarget(null)}
        open={addTarget}
        onCreated={(id) => {
          setExpanded((v) => ({
            ...v,
            [addTarget?.parentId ?? id]: true,
            [id]: true,
          }));
          setAddTarget(null);
        }}
      />
      <EditEntityDialog
        key={editTarget ? `edit-${editTarget.type}-${editTarget.entity._id}` : "edit-closed"}
        onClose={() => setEditTarget(null)}
        open={editTarget}
      />
    </>
  );
}

function TreeMilestone({
  milestone,
  isFinalMilestone,
  expanded,
  toggle,
  add,
  edit,
  remove,
}: {
  milestone: Milestone;
  isFinalMilestone: boolean;
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  add: (v: AddTarget) => void;
  edit: (v: EditTarget) => void;
  remove: (
    k: "milestone" | "module" | "lesson" | "quiz",
    id: string,
    t: string,
  ) => void;
}) {
  const open = expanded[milestone._id] ?? true;
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 bg-violet-50/60 p-3 sm:flex-row sm:items-center">
        <button
          className="flex min-w-0 flex-1 items-center gap-2 p-2 text-left font-bold text-slate-800"
          onClick={() => toggle(milestone._id)}
        >
          {open ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
          <Layers3 className="size-4 text-violet-600" />
          <span className="truncate">
            {milestone.order}. {milestone.title}
          </span>
          {isFinalMilestone ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700">
              Final
            </span>
          ) : null}
        </button>
        <div className="flex flex-wrap items-center gap-1">
          <Button
            onClick={() =>
              add({
                type: "module",
                parentId: milestone._id,
                parentName: milestone.title,
                nextOrder: nextOrder(milestone.modules),
              })
            }
            size="sm"
            variant="outline"
          >
            <Plus /> Add Module
          </Button>
          <Button
            onClick={() => edit({ type: "milestone", entity: milestone })}
            size="sm"
            variant="ghost"
          >
            <Edit3 /> Edit
          </Button>
          <Button
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => remove("milestone", milestone._id, milestone.title)}
            size="sm"
            variant="ghost"
          >
            <Trash2 /> Delete
          </Button>
        </div>
      </div>
      {open ? (
        <div className="space-y-3 border-t border-slate-100 p-3 sm:p-4 sm:pl-8">
          {milestone.modules?.length ? (
            milestone.modules.map((mod) => (
              <TreeModule
                add={add}
                edit={edit}
                expanded={expanded}
                key={mod._id}
                moduleItem={mod}
                remove={remove}
                toggle={toggle}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
              No modules yet. Use <strong>Add Module</strong> above.
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
}
function TreeModule({
  moduleItem,
  expanded,
  toggle,
  add,
  edit,
  remove,
}: {
  moduleItem: CourseModule;
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  add: (v: AddTarget) => void;
  edit: (v: EditTarget) => void;
  remove: (
    k: "milestone" | "module" | "lesson" | "quiz",
    id: string,
    t: string,
  ) => void;
}) {
  const open = expanded[moduleItem._id] ?? true;
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <div className="flex flex-col gap-2 p-2 sm:flex-row sm:items-center">
        <button
          className="flex min-w-0 flex-1 items-center gap-2 p-2 text-left text-sm font-bold text-slate-800"
          onClick={() => toggle(moduleItem._id)}
        >
          {open ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronRight className="size-3" />
          )}
          <Blocks className="size-4 text-sky-600" />
          <span className="truncate">
            {moduleItem.order}. {moduleItem.title}
          </span>
        </button>
        <div className="flex flex-wrap items-center gap-1">
          <Button
            onClick={() =>
              add({
                type: "lesson",
                parentId: moduleItem._id,
                parentName: moduleItem.title,
                nextOrder: nextOrder(moduleItem.lessons),
              })
            }
            size="sm"
            variant="outline"
          >
            <FileVideo /> Add Lesson
          </Button>
          <Button
            onClick={() =>
              add({
                type: "quiz",
                parentId: moduleItem._id,
                parentName: moduleItem.title,
                nextOrder: 1,
              })
            }
            size="sm"
            variant="outline"
          >
            <CircleHelp /> Add Quiz
          </Button>
          <Button
            onClick={() => edit({ type: "module", entity: moduleItem })}
            size="sm"
            variant="ghost"
          >
            <Edit3 /> Edit
          </Button>
          <Button
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => remove("module", moduleItem._id, moduleItem.title)}
            size="sm"
            variant="ghost"
          >
            <Trash2 /> Delete
          </Button>
        </div>
      </div>
      {open ? (
        <div className="space-y-2 border-t border-slate-200 bg-white px-3 py-3 text-sm sm:pl-8">
          {moduleItem.lessons?.map((lesson) => (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-100 px-3 py-2" key={lesson._id}>
              <FileVideo className="size-4 text-emerald-600" />
              <span className="min-w-0 flex-1 truncate">
                {lesson.order}. {lesson.title}
              </span>
              <Button
                onClick={() => edit({ type: "lesson", entity: lesson })}
                size="sm"
                variant="ghost"
              >
                <Edit3 /> Edit
              </Button>
              <Button
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => remove("lesson", lesson._id, lesson.title)}
                size="sm"
                variant="ghost"
              >
                <Trash2 /> Delete
              </Button>
            </div>
          ))}
          {moduleItem.quizzes?.map((quiz) => (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-100 px-3 py-2" key={quiz._id}>
              <CircleHelp className="size-4 text-amber-600" />
              <span className="min-w-0 flex-1 truncate">{quiz.title}</span>
              <Button
                onClick={() => edit({ type: "quiz", entity: quiz })}
                size="sm"
                variant="ghost"
              >
                <Edit3 /> Edit
              </Button>
              <Button
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => remove("quiz", quiz._id, quiz.title)}
                size="sm"
                variant="ghost"
              >
                <Trash2 /> Delete
              </Button>
            </div>
          ))}
          {!moduleItem.lessons?.length && !moduleItem.quizzes?.length ? (
            <p className="rounded-lg border border-dashed border-slate-200 p-3 text-center text-xs text-slate-400">
              Add a lesson or quiz to this module.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function AddEntityDialog({
  open,
  onClose,
  onCreated,
}: {
  open: AddTarget;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const [createMilestone, m1] = useCreateMilestoneMutation();
  const [createModule, m2] = useCreateModuleMutation();
  const [createLesson, m3] = useCreateLessonMutation();
  const [createQuiz, m4] = useCreateQuizMutation();
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(0);
  const [contentType, setContentType] = useState("video");
  const [duration, setDuration] = useState(0);
  const [notes, setNotes] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQuestion()]);
  const busy = m1.isLoading || m2.isLoading || m3.isLoading || m4.isLoading;
  const parentType =
    open?.type === "milestone"
      ? "Course"
      : open?.type === "module"
        ? "Milestone"
        : "Module";
  const EntityIcon =
    open?.type === "milestone"
      ? Layers3
      : open?.type === "module"
        ? Blocks
        : open?.type === "lesson"
          ? FileVideo
          : CircleHelp;
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!open) return;
    const entityOrder = order || open.nextOrder;
    try {
      let result: { _id: string };
      if (open.type === "milestone")
        result = await createMilestone({
          course: open.parentId,
          title: title.trim(),
          order: entityOrder,
        }).unwrap();
      else if (open.type === "module")
        result = await createModule({
          milestone: open.parentId,
          title: title.trim(),
          order: entityOrder,
        }).unwrap();
      else if (open.type === "quiz")
        result = await createQuiz({
          module: open.parentId,
          title: title.trim(),
          passingScore,
          questions,
        }).unwrap();
      else if (video) {
        const body = new FormData();
        body.append("module", open.parentId);
        body.append("title", title.trim());
        body.append("order", String(entityOrder));
        body.append("contentType", contentType);
        body.append("duration", String(duration));
        body.append("contentNotes", notes.trim());
        body.append("video", video);
        result = await createLesson(body).unwrap();
      } else
        result = await createLesson({
          module: open.parentId,
          title: title.trim(),
          order: entityOrder,
          contentType: contentType as "video" | "text" | "pdf" | "image",
          duration,
          contentNotes: notes.trim(),
          videoUrl: videoUrl || undefined,
        }).unwrap();
      toast.success(`${open.type} created successfully.`);
      onCreated(result._id);
    } catch (error) {
      toast.error(getAuthErrorMessage(error, `Unable to create ${open.type}.`));
    }
  };
  return (
    <Dialog onOpenChange={(value) => !value && onClose()} open={Boolean(open)}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl overflow-y-auto p-0"
        onClose={onClose}
      >
        <DialogHeader className="border-b border-slate-100 bg-slate-50 px-6 py-5 pr-14">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-sky-100 text-sky-700">
              <EntityIcon className="size-5" />
            </span>
            <div>
              <DialogTitle className="capitalize">Create {open?.type}</DialogTitle>
              <DialogDescription>
                Complete the details below and save it to the curriculum.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form className="space-y-5 p-6" onSubmit={submit}>
          <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3">
            <p className="text-xs font-black uppercase tracking-wider text-sky-700">
              Parent {parentType}
            </p>
            <p className="mt-1 font-bold text-slate-800">{open?.parentName}</p>
          </div>
          <label className="space-y-2">
            <span className="text-sm font-bold capitalize">{open?.type} title</span>
            <Input
              minLength={1}
              onChange={(e) => setTitle(e.target.value)}
              required
              value={title}
            />
          </label>
          {open?.type !== "quiz" ? (
            <label className="space-y-2">
              <span className="text-sm font-bold">Order</span>
              <Input
                min={1}
                onChange={(e) => setOrder(Number(e.target.value))}
                required
                type="number"
                value={order || open?.nextOrder}
              />
              <span className="block text-xs font-normal text-slate-500">
                Controls where this {open?.type} appears inside its parent.
              </span>
            </label>
          ) : null}
          {open?.type === "lesson" ? (
            <>
              <label className="space-y-2">
                <span className="text-sm font-bold">Content type</span>
                <select
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  onChange={(event) => {
                    setContentType(event.target.value);
                    if (event.target.value !== "video") {
                      setVideo(null);
                      setVideoUrl("");
                    }
                  }}
                  value={contentType}
                >
                  {["video", "text", "pdf", "image"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold">Duration in seconds</span>
                <Input
                  min={0}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  type="number"
                  value={duration}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold">Content notes</span>
                <Textarea
                  onChange={(e) => setNotes(e.target.value)}
                  required
                  value={notes}
                />
              </label>
              {contentType === "video" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-bold">Video URL (optional)</span>
                    <Input
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://..."
                      type="url"
                      value={videoUrl}
                    />
                  </label>
                  <label className="block rounded-xl border border-dashed border-sky-200 bg-sky-50/40 p-4 text-sm">
                    <span className="font-bold">Or upload a video file</span>
                    <Input
                      accept="video/*"
                      className="mt-2"
                      onChange={(event) => {
                        const file = validVideoFile(event.target.files?.[0]);
                        setVideo(file);
                        if (!file) event.target.value = "";
                      }}
                      type="file"
                    />
                    {video ? (
                      <span className="mt-2 block text-slate-500">
                        {video.name} · {(video.size / 1024 / 1024).toFixed(1)} MB
                      </span>
                    ) : null}
                  </label>
                </div>
              ) : null}
            </>
          ) : null}
          {open?.type === "quiz" ? (
            <>
              <label className="space-y-2">
                <span className="text-sm font-bold">Passing score (%)</span>
                <Input
                  max={100}
                  min={0}
                  onChange={(event) => setPassingScore(Number(event.target.value))}
                  required
                  type="number"
                  value={passingScore}
                />
              </label>
              <QuizQuestionEditor onChange={setQuestions} questions={questions} />
            </>
          ) : null}
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <Button onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button className="bg-[#14698d]" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />}
              Create <span className="capitalize">{open?.type}</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditEntityDialog({
  open,
  onClose,
}: {
  open: EditTarget;
  onClose: () => void;
}) {
  const [updateMilestone, milestoneState] = useUpdateMilestoneMutation();
  const [updateModule, moduleState] = useUpdateModuleMutation();
  const [updateLesson, lessonState] = useUpdateLessonMutation();
  const [updateQuiz, quizState] = useUpdateQuizMutation();
  const [title, setTitle] = useState(open?.entity.title ?? "");
  const [order, setOrder] = useState(
    open && open.type !== "quiz" ? open.entity.order : 1,
  );
  const [contentType, setContentType] = useState(
    open?.type === "lesson" ? open.entity.contentType : "video",
  );
  const [duration, setDuration] = useState(
    open?.type === "lesson" ? (open.entity.duration ?? 0) : 0,
  );
  const [notes, setNotes] = useState(
    open?.type === "lesson" ? open.entity.contentNotes : "",
  );
  const [videoUrl, setVideoUrl] = useState(
    open?.type === "lesson" ? (open.entity.videoUrl ?? "") : "",
  );
  const [video, setVideo] = useState<File | null>(null);
  const [passingScore, setPassingScore] = useState(
    open?.type === "quiz" ? open.entity.passingScore : 70,
  );
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    open?.type === "quiz" ? open.entity.questions : [emptyQuestion()],
  );
  const busy =
    milestoneState.isLoading ||
    moduleState.isLoading ||
    lessonState.isLoading ||
    quizState.isLoading;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!open) return;
    try {
      if (open.type === "milestone")
        await updateMilestone({
          id: open.entity._id,
          body: { title: title.trim(), order },
        }).unwrap();
      if (open.type === "module")
        await updateModule({
          id: open.entity._id,
          body: { title: title.trim(), order },
        }).unwrap();
      if (open.type === "lesson") {
        if (video) {
          const body = new FormData();
          body.append("title", title.trim());
          body.append("order", String(order));
          body.append("contentType", contentType);
          body.append("duration", String(duration));
          body.append("contentNotes", notes.trim());
          body.append("video", video);
          await updateLesson({ id: open.entity._id, body }).unwrap();
        } else {
          await updateLesson({
            id: open.entity._id,
            body: {
              title: title.trim(),
              order,
              contentType,
              duration,
              contentNotes: notes.trim(),
              videoUrl: videoUrl || undefined,
            },
          }).unwrap();
        }
      }
      if (open.type === "quiz")
        await updateQuiz({
          id: open.entity._id,
          body: { title: title.trim(), passingScore, questions },
        }).unwrap();
      toast.success(
        `${open.type[0].toUpperCase() + open.type.slice(1)} updated successfully.`,
      );
      onClose();
    } catch (error) {
      toast.error(getAuthErrorMessage(error, `Unable to update ${open.type}.`));
    }
  };

  return (
    <Dialog onOpenChange={(value) => !value && onClose()} open={Boolean(open)}>
      <DialogContent
        className="max-h-[90vh] max-w-xl overflow-y-auto"
        onClose={onClose}
      >
        <DialogHeader>
          <DialogTitle className="capitalize">Edit {open?.type}</DialogTitle>
          <DialogDescription>
            Update this item without leaving the selected course.
          </DialogDescription>
        </DialogHeader>
        <form className="mt-5 space-y-4" onSubmit={submit}>
          <label className="space-y-2">
            <span className="text-sm font-bold">Title</span>
            <Input
              minLength={1}
              onChange={(event) => setTitle(event.target.value)}
              required
              value={title}
            />
          </label>
          {open?.type !== "quiz" ? (
            <label className="space-y-2">
              <span className="text-sm font-bold">Order</span>
              <Input
                min={1}
                onChange={(event) => setOrder(Number(event.target.value))}
                required
                type="number"
                value={order}
              />
            </label>
          ) : null}
          {open?.type === "lesson" ? (
            <>
              <label className="space-y-2">
                <span className="text-sm font-bold">Content type</span>
                <select
                  className="h-10 w-full rounded-lg border px-3"
                  onChange={(event) =>
                    setContentType(event.target.value as Lesson["contentType"])
                  }
                  value={contentType}
                >
                  {["video", "text", "pdf", "image"].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold">Duration in seconds</span>
                <Input
                  min={0}
                  onChange={(event) => setDuration(Number(event.target.value))}
                  type="number"
                  value={duration}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold">Content notes</span>
                <Textarea
                  onChange={(event) => setNotes(event.target.value)}
                  required
                  value={notes}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-bold">Video URL</span>
                <Input
                  onChange={(event) => setVideoUrl(event.target.value)}
                  type="url"
                  value={videoUrl}
                />
              </label>
              <label className="block rounded-xl border border-dashed p-4 text-sm">
                <span className="font-bold">
                  Replace video (optional)
                </span>
                <Input
                  accept="video/*"
                  className="mt-2"
                  onChange={(event) => {
                    const file = validVideoFile(event.target.files?.[0]);
                    setVideo(file);
                    if (!file) event.target.value = "";
                  }}
                  type="file"
                />
                {video ? (
                  <span className="mt-2 block text-slate-500">
                    {video.name} · {(video.size / 1024 / 1024).toFixed(1)} MB
                  </span>
                ) : null}
              </label>
            </>
          ) : null}
          {open?.type === "quiz" ? (
            <>
              <label className="space-y-2">
                <span className="text-sm font-bold">Passing score (%)</span>
                <Input
                  max={100}
                  min={0}
                  onChange={(event) => setPassingScore(Number(event.target.value))}
                  required
                  type="number"
                  value={passingScore}
                />
              </label>
              <QuizQuestionEditor onChange={setQuestions} questions={questions} />
            </>
          ) : null}
          <div className="flex justify-end gap-3 pt-3">
            <Button onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button className="bg-[#14698d]" disabled={busy}>
              {busy && <Loader2 className="animate-spin" />}Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function StepIndicator({
  milestones,
  modules,
  lessons,
  quizzes,
  published,
}: {
  milestones: number;
  modules: number;
  lessons: number;
  quizzes: number;
  published: boolean;
}) {
  const steps = [
    [true, "Course details"],
    [milestones > 0, "Milestones"],
    [modules > 0, "Modules"],
    [lessons > 0, "Lessons"],
    [quizzes > 0, "Quizzes"],
    [published, "Review & publish"],
  ] as const;
  return (
    <div className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-3 xl:grid-cols-6">
      {steps.map(([done, label], i) => (
        <div
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${done ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"}`}
          key={label}
        >
          <span
            className={`grid size-6 place-items-center rounded-full ${done ? "bg-emerald-600 text-white" : "bg-slate-200"}`}
          >
            {i + 1}
          </span>
          {label}
        </div>
      ))}
    </div>
  );
}
