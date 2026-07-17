"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Blocks,
  BookOpen,
  CheckCircle2,
  Edit3,
  Layers3,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminShell } from "@/components/kidclass/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthErrorMessage } from "@/redux/features/auth/auth-errors";
import {
  useCreateModuleMutation,
  useDeleteModuleMutation,
  useGetManagedCoursesQuery,
  useGetMilestonesQuery,
  useGetModulesQuery,
  useUpdateModuleMutation,
} from "@/redux/features/course-management/courseManagementApi";
import type {
  CourseModule,
  EntityRef,
} from "@/types/course-management";

const referenceId = (reference: EntityRef | string) =>
  typeof reference === "string" ? reference : reference._id;

export function ModuleManagement() {
  const coursesQuery = useGetManagedCoursesQuery();
  const milestonesQuery = useGetMilestonesQuery();
  const modulesQuery = useGetModulesQuery();
  const courses = coursesQuery.data ?? [];
  const milestones = milestonesQuery.data ?? [];
  const modules = modulesQuery.data ?? [];
  const [createModule, createState] = useCreateModuleMutation();
  const [updateModule, updateState] = useUpdateModuleMutation();
  const [deleteModule, deleteState] = useDeleteModuleMutation();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedMilestoneId, setSelectedMilestoneId] = useState("");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [editing, setEditing] = useState<CourseModule | null>(null);

  const activeCourseId = selectedCourseId || courses[0]?._id || "";
  const courseMilestones = milestones
    .filter((milestone) => referenceId(milestone.course) === activeCourseId)
    .sort((a, b) => a.order - b.order);
  const activeMilestoneId =
    (selectedMilestoneId &&
      courseMilestones.some((item) => item._id === selectedMilestoneId)
      ? selectedMilestoneId
      : courseMilestones[0]?._id) ?? "";
  const selectedCourse = courses.find((course) => course._id === activeCourseId);
  const selectedMilestone = courseMilestones.find(
    (milestone) => milestone._id === activeMilestoneId,
  );
  const milestoneModules = modules
    .filter((moduleItem) => referenceId(moduleItem.milestone) === activeMilestoneId)
    .sort((a, b) => a.order - b.order);
  const nextOrder =
    Math.max(0, ...milestoneModules.map((moduleItem) => moduleItem.order)) + 1;
  const busy =
    createState.isLoading || updateState.isLoading || deleteState.isLoading;

  const resetForm = (suggestedOrder = nextOrder) => {
    setEditing(null);
    setTitle("");
    setOrder(suggestedOrder);
  };

  const changeCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedMilestoneId("");
    setEditing(null);
    setTitle("");
    setOrder(1);
  };

  const changeMilestone = (milestoneId: string) => {
    setSelectedMilestoneId(milestoneId);
    setEditing(null);
    setTitle("");
    const items = modules.filter(
      (moduleItem) => referenceId(moduleItem.milestone) === milestoneId,
    );
    setOrder(Math.max(0, ...items.map((moduleItem) => moduleItem.order)) + 1);
  };

  const beginEdit = (moduleItem: CourseModule) => {
    setEditing(moduleItem);
    setTitle(moduleItem.title);
    setOrder(moduleItem.order);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeMilestoneId) {
      toast.error("Create or select a milestone before adding a module.");
      return;
    }

    try {
      if (editing) {
        await updateModule({
          id: editing._id,
          body: { title: title.trim(), order },
        }).unwrap();
        toast.success("Module updated successfully.");
      } else {
        await createModule({
          milestone: activeMilestoneId,
          title: title.trim(),
          order,
        }).unwrap();
        toast.success("Module created under the selected milestone.");
      }
      resetForm(editing ? nextOrder : Math.max(nextOrder, order + 1));
    } catch (error) {
      toast.error(
        getAuthErrorMessage(
          error,
          editing ? "Unable to update module." : "Unable to create module.",
        ),
      );
    }
  };

  const remove = async (moduleItem: CourseModule) => {
    if (
      !window.confirm(
        `Delete “${moduleItem.title}”? Its lessons and quizzes will also be deleted.`,
      )
    )
      return;
    try {
      await deleteModule(moduleItem._id).unwrap();
      if (editing?._id === moduleItem._id) resetForm();
      toast.success("Module deleted successfully.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Unable to delete module."));
    }
  };

  const loading =
    coursesQuery.isLoading || milestonesQuery.isLoading || modulesQuery.isLoading;
  const failed =
    coursesQuery.isError || milestonesQuery.isError || modulesQuery.isError;

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminShell>
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">
              Course Management
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-900">Modules</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Select a course and milestone, then create the modules that contain
              lessons and quizzes.
            </p>
          </div>
          <Button asChild className="h-11 rounded-xl bg-[#14698d]">
            <Link href="/course-management/milestones">
              <Layers3 /> Manage Milestones
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-5 xl:grid-cols-[390px_1fr]">
            <Skeleton className="h-[560px] rounded-3xl" />
            <Skeleton className="h-[560px] rounded-3xl" />
          </div>
        ) : failed ? (
          <div className="rounded-3xl border border-red-100 bg-white p-10 text-center">
            <h2 className="text-xl font-black">Unable to load module data</h2>
            <p className="mt-2 text-slate-500">
              The API returned an error. Check the backend and retry.
            </p>
            <Button
              className="mt-5"
              onClick={() => {
                coursesQuery.refetch();
                milestonesQuery.refetch();
                modulesQuery.refetch();
              }}
            >
              Retry
            </Button>
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            description="Modules require a course and milestone first."
            href="/course-management/courses/create"
            label="Create Course"
            title="Create a course first"
          />
        ) : courseMilestones.length === 0 ? (
          <EmptyState
            description={`“${selectedCourse?.title}” has no milestones yet.`}
            href="/course-management/milestones"
            label="Create Milestone"
            title="Create a milestone first"
          />
        ) : (
          <div className="grid gap-5 xl:grid-cols-[400px_minmax(0,1fr)]">
            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <span className="grid size-11 place-items-center rounded-xl bg-sky-100 text-sky-700">
                  {editing ? <Edit3 /> : <Plus />}
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-sky-700">
                    Module data entry
                  </p>
                  <h2 className="text-xl font-black">
                    {editing ? "Edit module" : "Create module"}
                  </h2>
                </div>
              </div>

              <form className="mt-5 space-y-5" onSubmit={submit}>
                <label className="block space-y-2">
                  <span className="text-sm font-bold">Course</span>
                  <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    disabled={Boolean(editing)}
                    onChange={(event) => changeCourse(event.target.value)}
                    value={activeCourseId}
                  >
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-bold">Parent milestone</span>
                  <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    disabled={Boolean(editing)}
                    onChange={(event) => changeMilestone(event.target.value)}
                    value={activeMilestoneId}
                  >
                    {courseMilestones.map((milestone) => (
                      <option key={milestone._id} value={milestone._id}>
                        {milestone.order}. {milestone.title}
                      </option>
                    ))}
                  </select>
                  <span className="block text-xs text-slate-500">
                    The milestone ID is submitted automatically.
                  </span>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-bold">Module title</span>
                  <Input
                    maxLength={150}
                    minLength={1}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Example: Letter Sounds"
                    required
                    value={title}
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-bold">Display order</span>
                  <Input
                    min={1}
                    onChange={(event) => setOrder(Number(event.target.value))}
                    required
                    type="number"
                    value={order}
                  />
                  <span className="block text-xs text-slate-500">
                    Order must be unique within this milestone.
                  </span>
                </label>

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
                    disabled={busy || !title.trim() || !activeMilestoneId}
                    type="submit"
                  >
                    {(createState.isLoading || updateState.isLoading) && (
                      <Loader2 className="animate-spin" />
                    )}
                    {editing ? "Save Changes" : "Create Module"}
                  </Button>
                </div>
              </form>
            </aside>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-sky-700">
                    {selectedCourse?.title}
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    {selectedMilestone?.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {milestoneModules.length} module
                    {milestoneModules.length === 1 ? "" : "s"} configured
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
                {milestoneModules.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50/50 p-10 text-center">
                    <Blocks className="mx-auto size-11 text-sky-400" />
                    <h3 className="mt-3 font-black">No modules yet</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Use the form to add the first module to this milestone.
                    </p>
                  </div>
                ) : (
                  milestoneModules.map((moduleItem) => (
                    <article
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-sky-200 hover:shadow-md sm:flex-row sm:items-center"
                      key={moduleItem._id}
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sky-100 font-black text-sky-700">
                        {moduleItem.order}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-black">
                          {moduleItem.title}
                        </h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          Saved under {selectedMilestone?.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => beginEdit(moduleItem)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit3 /> Edit
                        </Button>
                        <Button
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={deleteState.isLoading}
                          onClick={() => remove(moduleItem)}
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 /> Delete
                        </Button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </AdminShell>
    </ProtectedRoute>
  );
}

function EmptyState({
  title,
  description,
  href,
  label,
}: {
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <BookOpen className="mx-auto size-12 text-sky-300" />
      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <p className="mt-2 text-slate-500">{description}</p>
      <Button asChild className="mt-5 bg-[#14698d]">
        <Link href={href}>
          <Plus /> {label}
        </Link>
      </Button>
    </div>
  );
}
