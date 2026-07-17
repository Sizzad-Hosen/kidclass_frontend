"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Edit3,
  Flag,
  Loader2,
  Milestone as MilestoneIcon,
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
  useCreateMilestoneMutation,
  useDeleteMilestoneMutation,
  useGetManagedCoursesQuery,
  useGetMilestonesQuery,
  useUpdateMilestoneMutation,
} from "@/redux/features/course-management/courseManagementApi";
import type { EntityRef, Milestone } from "@/types/course-management";

const referenceId = (reference: EntityRef | string) =>
  typeof reference === "string" ? reference : reference._id;

export function MilestoneManagement() {
  const {
    data: courses = [],
    isLoading: coursesLoading,
    isError: coursesError,
    refetch: refetchCourses,
  } = useGetManagedCoursesQuery();
  const {
    data: milestones = [],
    isLoading: milestonesLoading,
    isError: milestonesError,
    refetch: refetchMilestones,
  } = useGetMilestonesQuery();
  const [createMilestone, createState] = useCreateMilestoneMutation();
  const [updateMilestone, updateState] = useUpdateMilestoneMutation();
  const [deleteMilestone, deleteState] = useDeleteMilestoneMutation();
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState(1);
  const [editing, setEditing] = useState<Milestone | null>(null);

  const activeCourseId = selectedCourseId || courses[0]?._id || "";
  const selectedCourse = courses.find(
    (course) => course._id === activeCourseId,
  );
  const courseMilestones = useMemo(
    () =>
      milestones
        .filter((milestone) => referenceId(milestone.course) === activeCourseId)
        .sort((a, b) => a.order - b.order),
    [milestones, activeCourseId],
  );
  const nextOrder = Math.max(
    0,
    ...courseMilestones.map((milestone) => milestone.order),
  ) + 1;
  const busy =
    createState.isLoading || updateState.isLoading || deleteState.isLoading;

  const resetForm = (suggestedOrder = nextOrder) => {
    setEditing(null);
    setTitle("");
    setOrder(suggestedOrder);
  };

  const changeCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setEditing(null);
    setTitle("");
    const items = milestones.filter(
      (milestone) => referenceId(milestone.course) === courseId,
    );
    setOrder(Math.max(0, ...items.map((milestone) => milestone.order)) + 1);
  };

  const beginEdit = (milestone: Milestone) => {
    setEditing(milestone);
    setTitle(milestone.title);
    setOrder(milestone.order);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!activeCourseId) {
      toast.error("Select a course before creating a milestone.");
      return;
    }

    try {
      if (editing) {
        await updateMilestone({
          id: editing._id,
          body: { title: title.trim(), order },
        }).unwrap();
        toast.success("Milestone updated successfully.");
      } else {
        await createMilestone({
          course: activeCourseId,
          title: title.trim(),
          order,
        }).unwrap();
        toast.success("Milestone created successfully.");
      }
      resetForm(editing ? nextOrder : Math.max(nextOrder, order + 1));
    } catch (error) {
      toast.error(
        getAuthErrorMessage(
          error,
          editing ? "Unable to update milestone." : "Unable to create milestone.",
        ),
      );
    }
  };

  const remove = async (milestone: Milestone) => {
    if (
      !window.confirm(
        `Delete “${milestone.title}”? Its modules, lessons, and quizzes will also be deleted.`,
      )
    )
      return;
    try {
      await deleteMilestone(milestone._id).unwrap();
      if (editing?._id === milestone._id) resetForm();
      toast.success("Milestone deleted successfully.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Unable to delete milestone."));
    }
  };

  const loading = coursesLoading || milestonesLoading;
  const failed = coursesError || milestonesError;

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminShell>
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-sky-700">
              Course Management
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-900">
              Milestones
            </h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Select a course, create its milestones, and manage their learning
              order from one place.
            </p>
          </div>
          <Button asChild className="h-11 rounded-xl bg-[#14698d]">
            <Link href="/course-management/courses">
              <BookOpen /> View Courses
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
            <Skeleton className="h-[480px] rounded-3xl" />
            <Skeleton className="h-[480px] rounded-3xl" />
          </div>
        ) : failed ? (
          <div className="rounded-3xl border border-red-100 bg-white p-10 text-center">
            <h2 className="text-xl font-black">Unable to load milestones</h2>
            <p className="mt-2 text-slate-500">
              Check the backend connection and try again.
            </p>
            <Button
              className="mt-5"
              onClick={() => {
                refetchCourses();
                refetchMilestones();
              }}
            >
              Retry
            </Button>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <BookOpen className="mx-auto size-12 text-sky-300" />
            <h2 className="mt-4 text-xl font-black">Create a course first</h2>
            <p className="mt-2 text-slate-500">
              Every milestone must belong to a course.
            </p>
            <Button asChild className="mt-5 bg-[#14698d]">
              <Link href="/course-management/courses/create">
                <Plus /> Create Course
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <span className="grid size-11 place-items-center rounded-xl bg-violet-100 text-violet-700">
                  {editing ? <Edit3 /> : <Plus />}
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-violet-700">
                    Real data entry
                  </p>
                  <h2 className="text-xl font-black">
                    {editing ? "Edit milestone" : "Create milestone"}
                  </h2>
                </div>
              </div>

              <form className="mt-5 space-y-5" onSubmit={submit}>
                <label className="block space-y-2">
                  <span className="text-sm font-bold">Parent course</span>
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
                  <span className="block text-xs text-slate-500">
                    The course ID is added automatically to the API payload.
                  </span>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-bold">Milestone title</span>
                  <Input
                    autoFocus
                    maxLength={150}
                    minLength={1}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Example: Reading Foundations"
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
                    Order must be unique inside the selected course.
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
                    disabled={busy || !title.trim()}
                    type="submit"
                  >
                    {(createState.isLoading || updateState.isLoading) && (
                      <Loader2 className="animate-spin" />
                    )}
                    {editing ? "Save Changes" : "Create Milestone"}
                  </Button>
                </div>
              </form>
            </aside>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-sky-700">
                    Selected course
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    {selectedCourse?.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {courseMilestones.length} milestone
                    {courseMilestones.length === 1 ? "" : "s"} configured
                  </p>
                </div>
                {selectedCourse ? (
                  <Button asChild variant="outline">
                    <Link
                      href={`/course-management/courses/${selectedCourse._id}/builder`}
                    >
                      Open Full Builder <ArrowRight />
                    </Link>
                  </Button>
                ) : null}
              </div>

              <div className="mt-5 space-y-3">
                {courseMilestones.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-10 text-center">
                    <MilestoneIcon className="mx-auto size-11 text-violet-400" />
                    <h3 className="mt-3 font-black">No milestones yet</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Use the form to create this course&apos;s first milestone.
                    </p>
                  </div>
                ) : (
                  courseMilestones.map((milestone, index) => (
                    <article
                      className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-sky-200 hover:shadow-md sm:flex-row sm:items-center"
                      key={milestone._id}
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-violet-100 font-black text-violet-700">
                        {milestone.order}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-lg font-black">
                            {milestone.title}
                          </h3>
                          {index === courseMilestones.length - 1 ? (
                            <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-black uppercase text-amber-700">
                              Final
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                          <CheckCircle2 className="size-3 text-emerald-600" />
                          Saved to {selectedCourse?.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => beginEdit(milestone)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit3 /> Edit
                        </Button>
                        <Button
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={deleteState.isLoading}
                          onClick={() => remove(milestone)}
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

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-sky-50 p-4 text-sm text-sky-900">
                <Flag className="mt-0.5 size-5 shrink-0" />
                <p>
                  After creating milestones, open the full builder to add modules,
                  lessons, and quizzes beneath each milestone.
                </p>
              </div>
            </section>
          </div>
        )}
      </AdminShell>
    </ProtectedRoute>
  );
}
