"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ArrowLeft, Image as ImageIcon, Link2, Loader2, Save, Upload } from "lucide-react";
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
  const [thumbnailMode, setThumbnailMode] = useState<"url" | "upload">("url");
  const [thumbnailFile, setThumbnailFile] = useState<File>();
  const [thumbnailPreview, setThumbnailPreview] = useState(course?.thumbnailImage ?? "");
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title ?? "", description: course?.description ?? "",
      thumbnailImage: course?.thumbnailImage ?? "", price: course?.price ?? 0,
      category: course?.category ?? "general", isPublished: course?.isPublished ?? false,
    },
  });
  const busy = createState.isLoading || updateState.isLoading;
  const thumbnailUrl = form.watch("thumbnailImage");

  useEffect(() => {
    if (thumbnailMode === "url") {
      setThumbnailPreview(thumbnailUrl || "");
      return;
    }

    if (!thumbnailFile) {
      setThumbnailPreview(course?.thumbnailImage ?? "");
      return;
    }

    const previewUrl = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [course?.thumbnailImage, thumbnailFile, thumbnailMode, thumbnailUrl]);

  const selectThumbnail = (file?: File) => {
    if (!file) {
      setThumbnailFile(undefined);
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Thumbnail image must be 10 MB or smaller.");
      return;
    }
    setThumbnailFile(file);
  };

  const submit = async (values: CourseFormValues) => {
    try {
      let payload: CourseFormValues | FormData = {
        ...values,
        thumbnailImage: values.thumbnailImage || undefined,
      };

      if (thumbnailMode === "upload" && thumbnailFile) {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description ?? "");
        formData.append("price", String(values.price));
        formData.append("category", values.category);
        formData.append("isPublished", String(values.isPublished));
        formData.append("thumbnail", thumbnailFile);
        payload = formData;
      }

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
        <div className="space-y-3 md:col-span-2">
          <div>
            <span className="text-sm font-bold text-slate-700">Course thumbnail</span>
            <p className="mt-1 text-sm text-slate-500">Use an image URL or choose a picture from your PC.</p>
          </div>
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${thumbnailMode === "url" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"}`}
              onClick={() => setThumbnailMode("url")}
              type="button"
            >
              <Link2 className="size-4" /> Image URL
            </button>
            <button
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${thumbnailMode === "upload" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"}`}
              onClick={() => {
                setThumbnailMode("upload");
                form.setValue("thumbnailImage", "");
                form.clearErrors("thumbnailImage");
              }}
              type="button"
            >
              <Upload className="size-4" /> Upload from PC
            </button>
          </div>
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_180px]">
            <div>
              {thumbnailMode === "url" ? (
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-3.5 size-5 text-slate-400" />
                  <Input className="h-12 rounded-xl bg-white pl-12" placeholder="https://example.com/course-image.jpg" {...form.register("thumbnailImage")} />
                </div>
              ) : (
                <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-200 bg-white px-5 text-center hover:bg-sky-50">
                  <Upload className="size-7 text-sky-600" />
                  <span className="mt-2 font-bold text-sky-700">Choose thumbnail picture</span>
                  <span className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP or GIF · max 10 MB</span>
                  <input
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => selectThumbnail(event.target.files?.[0])}
                    type="file"
                  />
                </label>
              )}
              {thumbnailMode === "upload" && thumbnailFile ? (
                <p className="mt-2 truncate text-sm font-semibold text-slate-600">Selected: {thumbnailFile.name}</p>
              ) : null}
              {thumbnailMode === "url" && form.formState.errors.thumbnailImage?.message ? (
                <span className="mt-2 block text-sm font-medium text-red-600">{form.formState.errors.thumbnailImage.message}</span>
              ) : null}
            </div>
            <div className="relative grid min-h-28 place-items-center overflow-hidden rounded-xl border border-slate-200 bg-white">
              {thumbnailPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="Course thumbnail preview" className="size-full object-cover" src={thumbnailPreview} />
              ) : (
                <div className="text-center text-slate-400"><ImageIcon className="mx-auto size-8" /><span className="mt-1 block text-xs font-semibold">Preview</span></div>
              )}
            </div>
          </div>
        </div>
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
