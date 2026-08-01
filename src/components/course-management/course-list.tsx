"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Archive, Blocks, BookOpen, Edit3, Eye, Loader2, Plus, Search, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAuthErrorMessage } from "@/redux/features/auth/auth-errors";
import { useArchiveCourseMutation, useDeleteCourseMutation, useGetManagedCoursesQuery, usePublishCourseMutation } from "@/redux/features/course-management/courseManagementApi";
import type { Course } from "@/types/course-management";

type Pending = { action: "publish" | "archive" | "delete"; course: Course } | null;

export function CourseList() {
  const { data = [], isLoading, isError, refetch } = useGetManagedCoursesQuery();
  const [publish, publishState] = usePublishCourseMutation();
  const [archive, archiveState] = useArchiveCourseMutation();
  const [remove, removeState] = useDeleteCourseMutation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [pending, setPending] = useState<Pending>(null);
  const busy = publishState.isLoading || archiveState.isLoading || removeState.isLoading;
  const filtered = useMemo(() => data.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || course.category === category;
    const matchesStatus = status === "all" || (status === "published" ? course.isPublished : !course.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  }), [category, data, search, status]);

  const confirm = async () => {
    if (!pending) return;
    try {
      if (pending.action === "publish") await publish(pending.course._id).unwrap();
      if (pending.action === "archive") await archive(pending.course._id).unwrap();
      if (pending.action === "delete") await remove(pending.course._id).unwrap();
      toast.success(`Course ${pending.action === "delete" ? "deleted" : pending.action === "publish" ? "published" : "archived"} successfully.`);
      setPending(null);
    } catch (error) { toast.error(getAuthErrorMessage(error, `Unable to ${pending.action} course.`)); }
  };

  return <>
    <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div><p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">Learning catalog</p><h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">Course Management</h1><p className="mt-2 text-slate-500">Create, structure, review, and publish learning experiences.</p></div>
      <Button asChild className="h-12 rounded-xl bg-[#14698d] px-6 font-bold"><Link href="/course-management/courses/create"><Plus />Create Course</Link></Button>
    </div>
    <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_190px_190px]">
      <div className="relative"><Search className="absolute left-4 top-3.5 size-5 text-slate-400" /><Input className="h-12 rounded-xl pl-12" onChange={(e) => setSearch(e.target.value)} placeholder="Search course title..." value={search} /></div>
      <select className="h-12 rounded-xl border border-slate-200 bg-white px-4" onChange={(e) => setCategory(e.target.value)} value={category}><option value="all">All categories</option>{["english","bangla","math","science","art","coding","general"].map(v => <option key={v}>{v}</option>)}</select>
      <select className="h-12 rounded-xl border border-slate-200 bg-white px-4" onChange={(e) => setStatus(e.target.value)} value={status}><option value="all">All statuses</option><option value="draft">Draft</option><option value="published">Published</option></select>
    </div>
    {isLoading ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1,2,3].map(i => <Skeleton className="h-80 rounded-3xl" key={i} />)}</div> : isError ? <State title="Could not load courses" text="Check that the API is running on localhost:8000, then retry." action={<Button onClick={() => refetch()}>Retry</Button>} /> : filtered.length === 0 ? <State title="No courses found" text={data.length ? "Try changing the search or filters." : "Create your first course and start with a milestone."} action={<Button asChild><Link href="/course-management/courses/create"><Plus />Create Course</Link></Button>} /> :
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map(course => <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl" key={course._id}>
        <div className="relative aspect-video bg-gradient-to-br from-sky-100 via-cyan-50 to-amber-100">{course.thumbnailImage ? <Image alt={`${course.title} thumbnail`} className="object-contain" fill sizes="(max-width: 768px) 100vw, 33vw" src={course.thumbnailImage} unoptimized /> : <div className="grid size-full place-items-center"><BookOpen className="size-14 text-sky-300" /></div>}<span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-black ${course.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{course.isPublished ? "Published" : "Draft"}</span></div>
        <div className="p-5"><div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400"><span>{course.category}</span><span>{course.price ? `৳${course.price}` : "Free"}</span></div><h2 className="mt-2 line-clamp-2 text-xl font-black text-slate-900">{course.title}</h2><p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-500">{course.description || "No description added yet."}</p>
          <div className="mt-5 grid grid-cols-2 gap-2"><Button asChild className="rounded-xl bg-[#14698d]"><Link href={`/course-management/courses/${course._id}/builder`}><Blocks />Builder</Link></Button><Button asChild className="rounded-xl" variant="outline"><Link href={`/course-management/courses/${course._id}/edit`}><Edit3 />Edit</Link></Button></div>
          <div className="mt-2 flex justify-between border-t border-slate-100 pt-3"><Button asChild size="icon-sm" variant="ghost"><Link aria-label="View public course" href={`/courses/${course._id}`}><Eye /></Link></Button><div className="flex"><Button aria-label={course.isPublished ? "Archive" : "Publish"} onClick={() => setPending({ action: course.isPublished ? "archive" : "publish", course })} size="icon-sm" variant="ghost">{course.isPublished ? <Archive /> : <Send />}</Button><Button aria-label="Delete" className="text-red-600" onClick={() => setPending({ action: "delete", course })} size="icon-sm" variant="ghost"><Trash2 /></Button></div></div>
        </div></article>)}</div>}
    <Dialog onOpenChange={(open) => !open && setPending(null)} open={Boolean(pending)}><DialogContent onClose={() => setPending(null)}><DialogHeader><DialogTitle className="capitalize">{pending?.action} course?</DialogTitle><DialogDescription>{pending?.action === "delete" ? `This permanently deletes “${pending?.course.title}” and its nested content.` : pending?.action === "archive" ? "Archived courses will no longer appear in the public catalog." : "Publish this course to make it visible to students."}</DialogDescription></DialogHeader><DialogFooter><Button onClick={() => setPending(null)} variant="outline">Cancel</Button><Button className={pending?.action === "delete" ? "bg-red-600" : "bg-[#14698d]"} disabled={busy} onClick={confirm}>{busy && <Loader2 className="animate-spin" />}Confirm</Button></DialogFooter></DialogContent></Dialog>
  </>;
}

function State({ title, text, action }: { title: string; text: string; action: React.ReactNode }) { return <div className="grid min-h-80 place-items-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center"><div><BookOpen className="mx-auto size-12 text-sky-300" /><h2 className="mt-4 text-xl font-black">{title}</h2><p className="mb-5 mt-2 text-slate-500">{text}</p>{action}</div></div>; }
