"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Edit3,
  FileText,
  FileVideo,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminShell } from "@/components/kidclass/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getAuthErrorMessage } from "@/redux/features/auth/auth-errors";
import {
  useCreateLessonMutation,
  useDeleteLessonMutation,
  useGetLessonsQuery,
  useGetManagedCoursesQuery,
  useGetMilestonesQuery,
  useGetModulesQuery,
  useUpdateLessonMutation,
} from "@/redux/features/course-management/courseManagementApi";
import type {
  EntityRef,
  Lesson,
  LessonContentType,
} from "@/types/course-management";

const referenceId = (reference: EntityRef | string) =>
  typeof reference === "string" ? reference : reference._id;
const MAX_VIDEO_SIZE = 25 * 1024 * 1024;

const lessonTypeIcon = {
  video: FileVideo,
  text: FileText,
  pdf: FileText,
  image: ImageIcon,
};

export function LessonManagement() {
  const coursesQuery = useGetManagedCoursesQuery();
  const milestonesQuery = useGetMilestonesQuery();
  const modulesQuery = useGetModulesQuery();
  const lessonsQuery = useGetLessonsQuery();
  const courses = coursesQuery.data ?? [];
  const milestones = milestonesQuery.data ?? [];
  const modules = modulesQuery.data ?? [];
  const lessons = lessonsQuery.data ?? [];
  const [createLesson, createState] = useCreateLessonMutation();
  const [updateLesson, updateState] = useUpdateLessonMutation();
  const [deleteLesson, deleteState] = useDeleteLessonMutation();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState("");
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [contentType, setContentType] =
    useState<LessonContentType>("text");
  const [duration, setDuration] = useState(0);
  const [contentNotes, setContentNotes] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [video, setVideo] = useState<File | null>(null);

  const activeCourseId = selectedCourseId || courses[0]?._id || "";
  const courseMilestones = milestones
    .filter((milestone) => referenceId(milestone.course) === activeCourseId)
    .sort((a, b) => a.order - b.order);
  const activeMilestoneId =
    (selectedMilestoneId &&
      courseMilestones.some((item) => item._id === selectedMilestoneId)
      ? selectedMilestoneId
      : courseMilestones[0]?._id) ?? "";
  const milestoneModules = modules
    .filter((moduleItem) => referenceId(moduleItem.milestone) === activeMilestoneId)
    .sort((a, b) => a.order - b.order);
  const activeModuleId =
    (selectedModuleId &&
      milestoneModules.some((item) => item._id === selectedModuleId)
      ? selectedModuleId
      : milestoneModules[0]?._id) ?? "";
  const moduleLessons = lessons
    .filter((lesson) => referenceId(lesson.module) === activeModuleId)
    .sort((a, b) => a.order - b.order);
  const selectedCourse = courses.find((course) => course._id === activeCourseId);
  const selectedMilestone = courseMilestones.find(
    (milestone) => milestone._id === activeMilestoneId,
  );
  const selectedModule = milestoneModules.find(
    (moduleItem) => moduleItem._id === activeModuleId,
  );
  const nextOrder =
    Math.max(0, ...moduleLessons.map((lesson) => lesson.order)) + 1;
  const busy =
    createState.isLoading || updateState.isLoading || deleteState.isLoading;

  const resetForm = (suggestedOrder = nextOrder) => {
    setEditing(null);
    setTitle("");
    setOrder(suggestedOrder);
    setContentType("text");
    setDuration(0);
    setContentNotes("");
    setVideoUrl("");
    setVideo(null);
  };

  const changeCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedMilestoneId("");
    setSelectedModuleId("");
    resetForm(1);
  };

  const changeMilestone = (milestoneId: string) => {
    setSelectedMilestoneId(milestoneId);
    setSelectedModuleId("");
    resetForm(1);
  };

  const changeModule = (moduleId: string) => {
    setSelectedModuleId(moduleId);
    const items = lessons.filter(
      (lesson) => referenceId(lesson.module) === moduleId,
    );
    resetForm(Math.max(0, ...items.map((lesson) => lesson.order)) + 1);
  };

  const selectVideo = (file?: File) => {
    if (!file) {
      setVideo(null);
      return;
    }
    if (!file.type.startsWith("video/")) {
      toast.error("Choose a valid video file.");
      return;
    }
    if (file.size > MAX_VIDEO_SIZE) {
      toast.error("Video files must be 25 MB or smaller.");
      return;
    }
    setVideo(file);
  };

  const beginEdit = (lesson: Lesson) => {
    setEditing(lesson);
    setTitle(lesson.title);
    setOrder(lesson.order);
    setContentType(lesson.contentType);
    setDuration(lesson.duration ?? 0);
    setContentNotes(lesson.contentNotes);
    setVideoUrl(lesson.videoUrl ?? "");
    setVideo(null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeModuleId) {
      toast.error("Create or select a module before adding a lesson.");
      return;
    }

    try {
      if (editing) {
        if (video) {
          const body = new FormData();
          body.append("title", title.trim());
          body.append("order", String(order));
          body.append("contentType", contentType);
          body.append("duration", String(duration));
          body.append("contentNotes", contentNotes.trim());
          body.append("video", video);
          await updateLesson({ id: editing._id, body }).unwrap();
        } else {
          await updateLesson({
            id: editing._id,
            body: {
              title: title.trim(),
              order,
              contentType,
              duration,
              contentNotes: contentNotes.trim(),
              videoUrl:
                contentType === "video" && videoUrl ? videoUrl : undefined,
            },
          }).unwrap();
        }
        toast.success("Lesson updated successfully.");
      } else if (video) {
        const body = new FormData();
        body.append("module", activeModuleId);
        body.append("title", title.trim());
        body.append("order", String(order));
        body.append("contentType", contentType);
        body.append("duration", String(duration));
        body.append("contentNotes", contentNotes.trim());
        body.append("video", video);
        await createLesson(body).unwrap();
        toast.success("Lesson created with uploaded video.");
      } else {
        await createLesson({
          module: activeModuleId,
          title: title.trim(),
          order,
          contentType,
          duration,
          contentNotes: contentNotes.trim(),
          videoUrl: contentType === "video" && videoUrl ? videoUrl : undefined,
        }).unwrap();
        toast.success("Lesson created under the selected module.");
      }
      resetForm(editing ? nextOrder : Math.max(nextOrder, order + 1));
    } catch (error) {
      toast.error(
        getAuthErrorMessage(
          error,
          editing ? "Unable to update lesson." : "Unable to create lesson.",
        ),
      );
    }
  };

  const remove = async (lesson: Lesson) => {
    if (!window.confirm(`Delete “${lesson.title}”?`)) return;
    try {
      await deleteLesson(lesson._id).unwrap();
      if (editing?._id === lesson._id) resetForm();
      toast.success("Lesson deleted successfully.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Unable to delete lesson."));
    }
  };

  const loading =
    coursesQuery.isLoading ||
    milestonesQuery.isLoading ||
    modulesQuery.isLoading ||
    lessonsQuery.isLoading;
  const failed =
    coursesQuery.isError ||
    milestonesQuery.isError ||
    modulesQuery.isError ||
    lessonsQuery.isError;

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminShell>
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">
              Course Management
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-900">Lessons</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Create lesson content inside the correct course, milestone, and
              module.
            </p>
          </div>
          <Button asChild className="h-11 rounded-xl bg-[#14698d]">
            <Link href="/course-management/modules">
              <BookOpen /> Manage Modules
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-5 xl:grid-cols-[430px_1fr]">
            <Skeleton className="h-[700px] rounded-3xl" />
            <Skeleton className="h-[700px] rounded-3xl" />
          </div>
        ) : failed ? (
          <div className="rounded-3xl border border-red-100 bg-white p-10 text-center">
            <h2 className="text-xl font-black">Unable to load lesson data</h2>
            <p className="mt-2 text-slate-500">
              The API returned an error. Check the backend and retry.
            </p>
            <Button
              className="mt-5"
              onClick={() => {
                coursesQuery.refetch();
                milestonesQuery.refetch();
                modulesQuery.refetch();
                lessonsQuery.refetch();
              }}
            >
              Retry
            </Button>
          </div>
        ) : !activeModuleId ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BookOpen className="mx-auto size-12 text-sky-300" />
            <h2 className="mt-4 text-xl font-black">Create a module first</h2>
            <p className="mt-2 text-slate-500">
              Lessons must belong to a module inside a milestone.
            </p>
            <Button asChild className="mt-5 bg-[#14698d]">
              <Link href="/course-management/modules">
                <Plus /> Create Module
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[440px_minmax(0,1fr)]">
            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <span className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  {editing ? <Edit3 /> : <Plus />}
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
                    Lesson data entry
                  </p>
                  <h2 className="text-xl font-black">
                    {editing ? "Edit lesson" : "Create lesson"}
                  </h2>
                </div>
              </div>

              <form className="mt-5 space-y-4" onSubmit={submit}>
                <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                  <SelectField
                    disabled={Boolean(editing)}
                    label="Course"
                    onChange={changeCourse}
                    options={courses.map((course) => ({
                      id: course._id,
                      label: course.title,
                    }))}
                    value={activeCourseId}
                  />
                  <SelectField
                    disabled={Boolean(editing)}
                    label="Milestone"
                    onChange={changeMilestone}
                    options={courseMilestones.map((milestone) => ({
                      id: milestone._id,
                      label: `${milestone.order}. ${milestone.title}`,
                    }))}
                    value={activeMilestoneId}
                  />
                  <SelectField
                    disabled={Boolean(editing)}
                    label="Parent module"
                    onChange={changeModule}
                    options={milestoneModules.map((moduleItem) => ({
                      id: moduleItem._id,
                      label: `${moduleItem.order}. ${moduleItem.title}`,
                    }))}
                    value={activeModuleId}
                  />
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-bold">Lesson title</span>
                  <Input
                    maxLength={150}
                    minLength={1}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Example: Introduction to Vowels"
                    required
                    value={title}
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block space-y-2">
                    <span className="text-sm font-bold">Order</span>
                    <Input
                      min={1}
                      onChange={(event) => setOrder(Number(event.target.value))}
                      required
                      type="number"
                      value={order}
                    />
                  </label>
                  <label className="block space-y-2">
                    <span className="text-sm font-bold">Duration (seconds)</span>
                    <Input
                      min={0}
                      onChange={(event) => setDuration(Number(event.target.value))}
                      type="number"
                      value={duration}
                    />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-bold">Content type</span>
                  <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    onChange={(event) => {
                      const value = event.target.value as LessonContentType;
                      setContentType(value);
                      if (value !== "video") {
                        setVideo(null);
                        setVideoUrl("");
                      }
                    }}
                    value={contentType}
                  >
                    <option value="text">Text</option>
                    <option value="video">Video</option>
                    <option value="pdf">PDF</option>
                    <option value="image">Image</option>
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-bold">Content notes</span>
                  <Textarea
                    className="min-h-28"
                    onChange={(event) => setContentNotes(event.target.value)}
                    placeholder="Enter the lesson explanation or instructions..."
                    required
                    value={contentNotes}
                  />
                </label>

                {contentType === "video" ? (
                  <div className="space-y-3 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-4">
                    <label className="block space-y-2">
                      <span className="text-sm font-bold">Video URL</span>
                      <Input
                        onChange={(event) => setVideoUrl(event.target.value)}
                        placeholder="https://..."
                        type="url"
                        value={videoUrl}
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="flex items-center gap-2 font-bold">
                        <Upload className="size-4" /> Or upload video (max 25 MB)
                      </span>
                      <Input
                        accept="video/*"
                        className="mt-2"
                        onChange={(event) => {
                          selectVideo(event.target.files?.[0]);
                          if (
                            event.target.files?.[0] &&
                            event.target.files[0].size > MAX_VIDEO_SIZE
                          )
                            event.target.value = "";
                        }}
                        type="file"
                      />
                      {video ? (
                        <span className="mt-2 block text-xs text-slate-500">
                          {video.name} · {(video.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                      ) : null}
                    </label>
                  </div>
                ) : null}

                <div className="flex gap-3 border-t border-slate-100 pt-5">
                  {editing ? (
                    <Button
                      className="flex-1"
                      onClick={() => resetForm()}
                      type="button"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  ) : null}
                  <Button
                    className="flex-1 bg-[#14698d]"
                    disabled={busy || !title.trim() || !contentNotes.trim()}
                    type="submit"
                  >
                    {(createState.isLoading || updateState.isLoading) && (
                      <Loader2 className="animate-spin" />
                    )}
                    {editing ? "Save Changes" : "Create Lesson"}
                  </Button>
                </div>
              </form>
            </aside>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
                    {selectedCourse?.title} · {selectedMilestone?.title}
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    {selectedModule?.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {moduleLessons.length} lesson
                    {moduleLessons.length === 1 ? "" : "s"} configured
                  </p>
                </div>
                {selectedCourse ? (
                  <Button asChild variant="outline">
                    <Link
                      href={`/course-management/courses/${selectedCourse._id}/builder`}
                    >
                      Full Builder <ArrowRight />
                    </Link>
                  </Button>
                ) : null}
              </div>

              <div className="mt-5 space-y-3">
                {moduleLessons.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-10 text-center">
                    <FileVideo className="mx-auto size-11 text-emerald-400" />
                    <h3 className="mt-3 font-black">No lessons yet</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Use the form to add the first lesson to this module.
                    </p>
                  </div>
                ) : (
                  moduleLessons.map((lesson) => {
                    const Icon = lessonTypeIcon[lesson.contentType];
                    return (
                      <article
                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:shadow-md sm:flex-row sm:items-center"
                        key={lesson._id}
                      >
                        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                          <Icon />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-lg font-black">
                              {lesson.order}. {lesson.title}
                            </h3>
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-600">
                              {lesson.contentType}
                            </span>
                          </div>
                          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <CheckCircle2 className="size-3 text-emerald-600" />
                            {lesson.duration ?? 0} seconds · Saved to {selectedModule?.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => beginEdit(lesson)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit3 /> Edit
                          </Button>
                          <Button
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            disabled={deleteState.isLoading}
                            onClick={() => remove(lesson)}
                            size="sm"
                            variant="ghost"
                          >
                            <Trash2 /> Delete
                          </Button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        )}
      </AdminShell>
    </ProtectedRoute>
  );
}

function SelectField({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ id: string; label: string }>;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold">{label}</span>
      <select
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
