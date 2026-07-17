"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Image as ImageIcon, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getAuthErrorMessage } from "@/redux/features/auth/auth-errors";
import { useCreateCourseMutation, useUpdateCourseMutation } from "@/redux/features/course-management/courseManagementApi";
import { courseSchema, type CourseFormValues } from "@/schemas/course-management";
import type { Course } from "@/types/course-management";

const categories = ["english", "bangla", "math", "science", "art", "coding", "general"] as const;

export function CourseForm({ course, onSuccess }: { course?: Course; onSuccess: (course: Course) => void }) {
  const [createCourse, createState] = useCreateCourseMutation();
  const [updateCourse, updateState] = useUpdateCourseMutation();
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title ?? "", description: course?.description ?? "",
      thumbnailImage: course?.thumbnailImage ?? "", price: course?.price ?? 0,
      category: course?.category ?? "general", isPublished: course?.isPublished ?? false,
    },
  });
  const busy = createState.isLoading || updateState.isLoading;

  const submit = async (values: CourseFormValues) => {
    try {
      const payload = { ...values, thumbnailImage: values.thumbnailImage || undefined };
      const result = course
        ? await updateCourse({ id: course._id, body: payload }).unwrap()
        : await createCourse(payload).unwrap();
      toast.success(course ? "Course updated successfully." : "Course created. Add your first milestone next.");
      onSuccess(result);
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Unable to save the course."));
    }
  };

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Course title" error={form.formState.errors.title?.message} className="md:col-span-2">
          <Input className="h-12 rounded-xl" placeholder="Class 1 English Basics" {...form.register("title")} />
        </Field>
        <Field label="Description" error={form.formState.errors.description?.message} className="md:col-span-2">
          <Textarea className="min-h-32 rounded-xl" placeholder="What will children learn in this course?" {...form.register("description")} />
        </Field>
        <Field label="Thumbnail image URL" error={form.formState.errors.thumbnailImage?.message} className="md:col-span-2">
          <div className="relative"><ImageIcon className="absolute left-4 top-3.5 size-5 text-slate-400" /><Input className="h-12 rounded-xl pl-12" placeholder="https://..." {...form.register("thumbnailImage")} /></div>
        </Field>
        <Field label="Category" error={form.formState.errors.category?.message}>
          <select className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-sky-500" {...form.register("category")}>
            {categories.map((category) => <option key={category} value={category}>{category[0].toUpperCase() + category.slice(1)}</option>)}
          </select>
        </Field>
        <Field label="Price (BDT)" error={form.formState.errors.price?.message}>
          <Input className="h-12 rounded-xl" min={0} step="0.01" type="number" {...form.register("price", { valueAsNumber: true })} />
        </Field>
      </div>
      <Controller control={form.control} name="isPublished" render={({ field }) => (
        <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <span><span className="block font-bold text-slate-800">Publish immediately</span><span className="text-sm text-slate-500">You can keep it as a draft and publish after building the structure.</span></span>
          <input checked={field.value} className="size-5 accent-sky-700" onChange={field.onChange} type="checkbox" />
        </label>
      )} />
      <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
        <Button asChild className="h-11 rounded-xl" variant="outline"><Link href="/course-management/courses"><ArrowLeft />Cancel</Link></Button>
        <Button className="h-11 rounded-xl bg-[#14698d] px-6 hover:bg-[#0d5878]" disabled={busy} type="submit">
          {busy ? <Loader2 className="animate-spin" /> : <Save />}{busy ? "Saving..." : course ? "Save Changes" : "Create Course"}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return <label className={`space-y-2 ${className ?? ""}`}><span className="text-sm font-bold text-slate-700">{label}</span>{children}{error ? <span className="block text-sm font-medium text-red-600">{error}</span> : null}</label>;
}
