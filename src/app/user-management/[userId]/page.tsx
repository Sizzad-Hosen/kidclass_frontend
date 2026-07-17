"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BookOpen,
  Edit3,
  FileText,
  Mail,
  Phone,
  RotateCcw,
  Send,
  UserRound,
  UserX,
} from "lucide-react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminCard, AdminShell } from "@/components/kidclass/admin-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  type ManagedUser,
  useGetUserQuery,
} from "@/redux/features/user-management/userManagementApi";

const tabs = ["Overview", "Courses", "Quiz Scores", "Assignments", "Activity Log"];

export default function UserDetailsPage() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const { data: user, isError } = useGetUserQuery(userId, { skip: !userId });
  const profile = user ?? {
    _id: userId,
    name: "User Profile",
    email: "No email available",
    classLevel: "-",
    status: "active",
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminShell>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xl text-slate-600">
              <Link href="/user-management">Users</Link>
              <span>&gt;</span>
              <span>User Profile</span>
              <span>&gt;</span>
              <span className="font-bold text-[#0d6386]">{profile.name}</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-7">
              <h1 className="text-5xl font-bold tracking-normal">{profile.name}</h1>
              <span className="rounded-xl bg-slate-200 px-5 py-2 font-mono text-sm font-bold tracking-widest">
                ID: {userId}
              </span>
            </div>
          </div>
          <Button className="h-14 rounded-2xl border-2 border-[#14698d] bg-transparent px-8 text-xl font-bold text-[#14698d] hover:bg-[#d9edf8]">
            <Edit3 className="size-5" />
            Edit Profile
          </Button>
        </div>

        {isError ? (
          <AdminCard className="mt-8 p-6 text-red-700">
            Could not load this user from the API.
          </AdminCard>
        ) : null}

        <div className="mt-14 grid gap-8 xl:grid-cols-[1fr_380px]">
          <div>
            <AdminCard className="grid gap-8 p-8 md:grid-cols-[180px_1fr_1fr]">
              <div className="relative mx-auto size-40">
                <Avatar user={profile} />
                <span className="absolute bottom-4 right-2 size-6 rounded-full border-4 border-white bg-[#237a63]" />
              </div>
              <div>
                <p className="text-xl uppercase tracking-widest text-slate-700">Student Name</p>
                <p className="mt-4 text-3xl font-bold text-[#0d6386]">{profile.name}</p>
                <p className="mt-4 text-xl text-slate-700">{profile.email}</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                <InfoBlock label="Class" value={`Grade ${profile.classLevel ?? profile.grade ?? "-"}`} />
                <div>
                  <p className="text-xl uppercase tracking-widest text-slate-700">Status</p>
                  <span className="mt-4 inline-flex rounded-full bg-[#a9ebd2] px-5 py-2 font-bold text-[#207055]">
                    {normalizeStatus(profile)}
                  </span>
                </div>
                <InfoBlock
                  label="Enrollment Date"
                  value={formatDate(profile.enrollmentDate ?? profile.createdAt)}
                />
              </div>
            </AdminCard>

            <div className="mt-8 flex flex-wrap gap-10 border-b border-slate-300">
              {tabs.map((tab, index) => (
                <button
                  className={`pb-5 text-xl font-semibold ${
                    index === 0
                      ? "border-b-2 border-[#14698d] text-[#14698d]"
                      : "text-slate-700"
                  }`}
                  key={tab}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <AdminCard className="p-8">
                <h2 className="text-3xl font-bold">Subject Performance</h2>
                <div className="mt-10 grid grid-cols-3 gap-6">
                  <Ring label="Bangla" value={80} color="#1f7199" />
                  <Ring label="Math" value={65} color="#8d6343" />
                  <Ring label="English" value={90} color="#237a63" />
                </div>
              </AdminCard>

              <AdminCard className="p-8">
                <h2 className="text-3xl font-bold">Recent Performance</h2>
                <div className="mt-10 flex h-44 items-end justify-between gap-4">
                  {[62, 78, 94, 46, 86].map((value, index) => (
                    <div className="flex flex-1 flex-col items-center gap-3" key={value}>
                      <div
                        className={`w-full rounded-t-xl ${
                          index === 2 ? "bg-[#6fb7e8]" : "bg-[#d8ebf7]"
                        }`}
                        style={{ height: `${value}%` }}
                      />
                      <span className="text-xs font-bold">WEEK {index + 1}</span>
                    </div>
                  ))}
                </div>
              </AdminCard>
            </div>

            <AdminCard className="mt-8 p-8">
              <h2 className="text-3xl font-bold">Enrolled Courses</h2>
              <div className="mt-8 space-y-8">
                <CourseProgress
                  color="bg-[#1f7199]"
                  icon={<BookOpen />}
                  title="Introduction to Creative Arts"
                  value={78}
                />
                <CourseProgress
                  color="bg-[#237a63]"
                  icon={<FileText />}
                  title="Basic Number Theory"
                  value={42}
                />
              </div>
            </AdminCard>
          </div>

          <aside className="space-y-8">
            <AdminCard className="p-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Parent Info</h2>
                <FileText className="size-5 text-[#14698d]" />
              </div>
              <div className="mt-8 space-y-6">
                <ContactRow
                  icon={<UserRound />}
                  label="Father's Name"
                  value={String(profile.parentName ?? "Not provided")}
                />
                <ContactRow
                  icon={<Phone />}
                  label="Phone"
                  value={String(profile.parentPhone ?? profile.phone ?? "Not provided")}
                />
                <ContactRow
                  icon={<Mail />}
                  label="Email"
                  value={String(profile.parentEmail ?? "Not provided")}
                />
              </div>
              <div className="mt-8 border-t border-slate-300 pt-8">
                <Button className="h-14 w-full rounded-xl bg-[#6fb7e8] text-lg font-bold text-[#0d4f6d] hover:bg-[#5aa9df]">
                  View Full History
                </Button>
              </div>
            </AdminCard>

            <AdminCard className="p-8">
              <h2 className="text-3xl font-bold">Quick Actions</h2>
              <div className="mt-8 space-y-4">
                <ActionButton icon={<Send />} label="Send Message" />
                <ActionButton icon={<RotateCcw />} label="Reset Password" />
                <ActionButton danger icon={<UserX />} label="Deactivate Account" />
              </div>
            </AdminCard>

            <div className="rounded-2xl bg-slate-200 p-8">
              <p className="text-sm font-bold uppercase tracking-widest">Medical Notes</p>
              <p className="mt-2 text-lg">
                {String(profile.medicalNotes ?? "No medical notes provided.")}
              </p>
            </div>
          </aside>
        </div>
      </AdminShell>
    </ProtectedRoute>
  );
}

function Avatar({ user }: { user: ManagedUser }) {
  if (user.avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={user.name ?? "User"} className="size-40 rounded-full border-4 border-[#6fb7e8] object-cover" src={user.avatar} />;
  }

  return (
    <span className="grid size-40 place-items-center rounded-full border-4 border-[#6fb7e8] bg-[#d9edf8] text-5xl font-bold text-[#14698d]">
      {(user.name ?? "U").slice(0, 2).toUpperCase()}
    </span>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xl uppercase tracking-widest text-slate-700">{label}</p>
      <p className="mt-4 text-xl font-bold">{value}</p>
    </div>
  );
}

function Ring({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="text-center">
      <div
        className="mx-auto grid size-28 place-items-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${value * 3.6}deg, #edf0f2 0deg)`,
        }}
      >
        <div className="grid size-20 place-items-center rounded-full bg-white text-xl font-bold">
          {value}%
        </div>
      </div>
      <p className="mt-4 font-bold uppercase tracking-widest">{label}</p>
    </div>
  );
}

function CourseProgress({
  color,
  icon,
  title,
  value,
}: {
  color: string;
  icon: React.ReactNode;
  title: string;
  value: number;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-[72px_1fr]">
      <div className="grid size-16 place-items-center rounded-2xl bg-[#d9edf8] text-[#14698d]">
        {icon}
      </div>
      <div>
        <div className="flex justify-between gap-5 text-xl font-bold">
          <span>{title}</span>
          <span className="text-[#14698d]">{value}% Complete</span>
        </div>
        <Progress className="mt-4 h-3 bg-slate-100" indicatorClassName={color} value={value} />
      </div>
    </div>
  );
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-5">
      <div className="grid size-14 place-items-center rounded-full bg-slate-200 text-slate-700">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold uppercase tracking-widest">{label}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function ActionButton({
  danger,
  icon,
  label,
}: {
  danger?: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      className={`flex h-16 w-full items-center gap-5 rounded-xl border px-6 text-xl font-bold ${
        danger ? "text-red-600" : "text-slate-900"
      }`}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function normalizeStatus(user: ManagedUser) {
  const status = String(user.status ?? "active").toLowerCase();

  if (status === "enrolled") return "Enrolled";
  if (status === "inactive") return "Inactive";

  return "Enrolled";
}

function formatDate(value?: string) {
  if (!value) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date(value));
}
