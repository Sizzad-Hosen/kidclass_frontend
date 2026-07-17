"use client";

import { useMemo, useState } from "react";
import { Award, Edit3, Mail, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminCard, AdminShell } from "@/components/kidclass/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAuthErrorMessage } from "@/redux/features/auth/auth-errors";
import {
  type CertificateTemplate,
  type CertificateTemplatePayload,
  useCreateCertificateTemplateMutation,
  useDeleteCertificateTemplateMutation,
  useGetCertificateTemplatesQuery,
  usePublishCertificateTemplateMutation,
  useUpdateCertificateTemplateMutation,
} from "@/redux/features/certificates/certificateApi";
import { useGetManagedCoursesQuery } from "@/redux/features/course-management/courseManagementApi";
import type { Course } from "@/types/course-management";

const emptyForm: CertificateTemplatePayload = {
  title: "Course Completion Certificate",
  course: "",
  className: "",
  subject: "",
  issuerName: "",
  issuerEmail: "",
};

const courseOf = (template: CertificateTemplate) =>
  typeof template.course === "string" ? undefined : template.course;

export default function CertificatePage() {
  const { data: courses = [] } = useGetManagedCoursesQuery();
  const { data: templates = [], isLoading } = useGetCertificateTemplatesQuery();
  const [createTemplate, { isLoading: isCreating }] = useCreateCertificateTemplateMutation();
  const [updateTemplate, { isLoading: isUpdating }] = useUpdateCertificateTemplateMutation();
  const [deleteTemplate] = useDeleteCertificateTemplateMutation();
  const [publishTemplate, { isLoading: isPublishing }] = usePublishCertificateTemplateMutation();
  const [editingId, setEditingId] = useState<string>();
  const [form, setForm] = useState(emptyForm);

  const selectedCourse = useMemo(
    () => courses.find((course) => course._id === form.course),
    [courses, form.course],
  );

  const setField = (field: keyof CertificateTemplatePayload, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const reset = () => {
    setEditingId(undefined);
    setForm(emptyForm);
  };

  const edit = (template: CertificateTemplate) => {
    const course = courseOf(template);
    setEditingId(template._id);
    setForm({
      title: template.title,
      course: course?._id ?? (typeof template.course === "string" ? template.course : ""),
      className: template.className,
      subject: template.subject,
      issuerName: template.issuerName,
      issuerEmail: template.issuerEmail,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (editingId) {
        await updateTemplate({ id: editingId, body: form }).unwrap();
        toast.success("Certificate template updated.");
      } else {
        await createTemplate(form).unwrap();
        toast.success("Certificate template created.");
      }
      reset();
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Unable to save certificate template."));
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this certificate template?")) return;
    try {
      await deleteTemplate(id).unwrap();
      if (editingId === id) reset();
      toast.success("Certificate template deleted.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Unable to delete certificate template."));
    }
  };

  const publish = async (template: CertificateTemplate) => {
    const course = courseOf(template);
    if (!window.confirm(`Publish certificates to every 100% eligible student in ${course?.title ?? "this course"}?`)) return;
    try {
      const result = await publishTemplate(template._id).unwrap();
      toast.success(
        `${result.published} certificate${result.published === 1 ? "" : "s"} published. ${result.alreadyPublished} already issued.`,
      );
    } catch (error) {
      toast.error(getAuthErrorMessage(error, "Unable to publish certificates."));
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminShell>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0d6386]">Certificate Templates</h1>
          <p className="mt-2 text-slate-600">Create a class and subject certificate, then publish it only to students who completed 100% of the selected course.</p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(420px,.8fr)]">
          <AdminCard className="p-7">
            <h2 className="text-2xl font-bold">{editingId ? "Edit template" : "Create template"}</h2>
            <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={save}>
              <Field className="sm:col-span-2" label="Template name"><Input required value={form.title} onChange={(e) => setField("title", e.target.value)} /></Field>
              <Field className="sm:col-span-2" label="Course / class subject">
                <select className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3" required value={form.course} onChange={(e) => {
                  const course = courses.find((item) => item._id === e.target.value);
                  setForm((current) => ({ ...current, course: e.target.value, subject: course?.category ?? current.subject }));
                }}>
                  <option value="">Select a course</option>
                  {courses.map((course) => <option key={course._id} value={course._id}>{course.title} — {course.category}{course.isPublished ? "" : " (draft)"}</option>)}
                </select>
              </Field>
              <Field label="Class"><Input placeholder="e.g. Grade 5" required value={form.className} onChange={(e) => setField("className", e.target.value)} /></Field>
              <Field label="Subject"><Input placeholder="e.g. Mathematics" required value={form.subject} onChange={(e) => setField("subject", e.target.value)} /></Field>
              <Field label="Name"><Input placeholder="Issuer name" required value={form.issuerName} onChange={(e) => setField("issuerName", e.target.value)} /></Field>
              <Field label="Email"><Input placeholder="issuer@school.com" required type="email" value={form.issuerEmail} onChange={(e) => setField("issuerEmail", e.target.value)} /></Field>
              <div className="flex gap-3 sm:col-span-2">
                <Button className="h-11 bg-[#1f7199] px-6" disabled={isCreating || isUpdating} type="submit">{editingId ? "Save Changes" : "Create Template"}</Button>
                {editingId ? <Button className="h-11" onClick={reset} type="button" variant="outline">Cancel</Button> : null}
              </div>
            </form>
          </AdminCard>

          <CertificatePreview form={form} course={selectedCourse} />
        </div>

        <section className="mt-10">
          <div className="flex items-center justify-between"><h2 className="text-2xl font-bold">Saved templates</h2><span className="text-sm text-slate-500">{templates.length} total</span></div>
          {isLoading ? <p className="mt-5 text-slate-500">Loading templates...</p> : null}
          {!isLoading && !templates.length ? <AdminCard className="mt-5 p-8 text-center text-slate-500">No certificate templates created yet.</AdminCard> : null}
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {templates.map((template) => {
              const course = courseOf(template);
              return <AdminCard className="p-6" key={template._id}>
                <div className="flex items-start justify-between gap-4">
                  <div><Award className="size-9 text-amber-500" /><h3 className="mt-3 text-xl font-bold">{template.title}</h3><p className="mt-1 text-sm text-slate-500">{course?.title ?? "Course"} · {template.className} · {template.subject}</p></div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${course?.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{course?.isPublished ? "Course published" : "Course draft"}</span>
                </div>
                <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm"><p className="font-bold">{template.issuerName}</p><p className="mt-1 flex items-center gap-2 text-slate-500"><Mail className="size-4" />{template.issuerEmail}</p></div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button className="bg-emerald-700" disabled={!course?.isPublished || isPublishing} onClick={() => publish(template)}><Send /> Publish to 100% complete</Button>
                  <Button onClick={() => edit(template)} variant="outline"><Edit3 /> Edit</Button>
                  <Button className="text-red-700" onClick={() => remove(template._id)} variant="outline"><Trash2 /> Delete</Button>
                </div>
              </AdminCard>;
            })}
          </div>
        </section>
      </AdminShell>
    </ProtectedRoute>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return <label className={className}><span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>{children}</label>;
}

function CertificatePreview({ form, course }: { form: CertificateTemplatePayload; course?: Course }) {
  return <AdminCard className="overflow-hidden border-8 border-double border-amber-300 bg-gradient-to-br from-white via-amber-50 to-sky-50 p-8 text-center">
    <Award className="mx-auto size-14 text-amber-500" />
    <p className="mt-3 text-sm font-bold uppercase tracking-[.3em] text-[#0d6386]">KidClass</p>
    <h2 className="mt-4 font-serif text-3xl font-bold">{form.title || "Certificate of Completion"}</h2>
    <p className="mt-7 text-slate-500">This certificate is proudly presented to</p>
    <p className="mt-2 border-b border-slate-400 pb-2 font-serif text-3xl font-bold text-[#0d6386]">Student Name</p>
    <p className="mt-5 text-slate-600">for completing 100% of <strong>{course?.title || "Selected Course"}</strong></p>
    <p className="mt-2 font-bold">{form.className || "Class"} · {form.subject || "Subject"}</p>
    <div className="mx-auto mt-10 max-w-xs border-t border-slate-400 pt-3"><p className="font-bold">{form.issuerName || "Issuer Name"}</p><p className="text-xs text-slate-400">{form.issuerEmail || "Email"}</p></div>
  </AdminCard>;
}
