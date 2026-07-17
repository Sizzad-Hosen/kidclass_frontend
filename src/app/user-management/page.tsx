"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Download,
  Edit3,
  Search,
  Trash2,
  UserPlus,
  UsersRound,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminCard, AdminShell } from "@/components/kidclass/admin-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  type ManagedUser,
  useDeleteUserMutation,
  useGetUsersQuery,
} from "@/redux/features/user-management/userManagementApi";

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [status, setStatus] = useState("");
  const { data, isLoading, isError } = useGetUsersQuery({
    search: search || undefined,
    classLevel: classLevel || undefined,
    status: status || undefined,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const users = useMemo(() => data?.users ?? [], [data?.users]);

  const stats = useMemo(() => {
    const active = users.filter((user) => normalizeStatus(user) === "Active").length;
    const averageProgress = users.length
      ? Math.round(
          users.reduce((total, user) => total + getProgress(user), 0) / users.length,
        )
      : 0;

    return {
      total: data?.total ?? users.length,
      active,
      newEnrollments: users.filter((user) => user.createdAt).slice(0, 15).length,
      averageProgress,
    };
  }, [data?.total, users]);

  const handleDelete = async (user: ManagedUser) => {
    const userId = getUserId(user);

    if (!userId) {
      toast.error("Missing user id.");
      return;
    }

    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully.");
    } catch {
      toast.error("Could not delete user.");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminShell>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <h1 className="text-5xl font-bold tracking-normal text-[#0d6386]">
              User Management
            </h1>
            <p className="mt-3 text-xl text-slate-600">
              Manage students, admins, and user account activity.
            </p>
          </div>
          <Button className="h-16 rounded-2xl bg-[#1f7199] px-8 text-xl font-bold shadow-lg shadow-sky-900/10 hover:bg-[#155f84]">
            <UserPlus className="size-6" />
            Add User
          </Button>
        </div>

        <div className="mt-8 grid gap-7 md:grid-cols-4">
          <MetricCard icon={<UsersRound />} label="Total Users" value={stats.total} />
          <MetricCard icon={<Zap />} label="Active Now" meta="Active" value={stats.active} tone="green" />
          <MetricCard
            icon={<CalendarDays />}
            label="New Enrollments"
            meta="This Month"
            value={stats.newEnrollments}
            tone="warm"
          />
          <MetricCard
            icon={<BarChart3 />}
            label="Avg. Progress"
            value={`${stats.averageProgress || 72}%`}
          />
        </div>

        <AdminCard className="mt-8 overflow-hidden">
          <div className="grid gap-5 border-b border-slate-300 p-8 lg:grid-cols-[1.5fr_0.9fr_0.9fr_1.2fr_auto]">
            <label>
              <span className="mb-2 block font-semibold">Search Users</span>
              <div className="flex h-14 items-center gap-3 rounded-xl border border-slate-300 px-4">
                <Search className="size-5 text-slate-500" />
                <input
                  className="h-full flex-1 bg-transparent text-lg outline-none"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name or email..."
                  value={search}
                />
              </div>
            </label>
            <FilterSelect label="Class" onChange={setClassLevel} value={classLevel}>
              <option value="">All Classes</option>
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3">Class 3</option>
            </FilterSelect>
            <FilterSelect label="Status" onChange={setStatus} value={status}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="enrolled">Enrolled</option>
            </FilterSelect>
            <label>
              <span className="mb-2 block font-semibold">Date Range</span>
              <div className="flex h-14 items-center justify-between rounded-xl border border-slate-300 px-4 text-lg">
                Aug 2023 - May 2024
                <CalendarDays className="size-5 text-slate-500" />
              </div>
            </label>
            <button className="mt-8 grid size-14 place-items-center text-slate-700" type="button">
              <Download className="size-6" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left">
              <thead className="bg-slate-50 text-sm uppercase tracking-widest text-slate-700">
                <tr>
                  <th className="px-8 py-5">User Name</th>
                  <th className="px-8 py-5">Email Address</th>
                  <th className="px-8 py-5">Class</th>
                  <th className="px-8 py-5">Courses</th>
                  <th className="px-8 py-5">Progress</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const userId = getUserId(user);
                  const progress = getProgress(user);

                  return (
                    <tr className="border-t border-slate-100" key={userId || user.email}>
                      <td className="px-8 py-6">
                        <Link
                          className="flex items-center gap-4 font-semibold hover:text-[#14698d]"
                          href={`/user-management/${userId}`}
                        >
                          <Avatar user={user} />
                          <span>
                            <span className="block text-lg">{user.name ?? "Unnamed User"}</span>
                            <span className="text-sm font-normal text-slate-500">
                              ID: {userId || "N/A"}
                            </span>
                          </span>
                        </Link>
                      </td>
                      <td className="px-8 py-6 text-lg text-slate-700">{user.email ?? "N/A"}</td>
                      <td className="px-8 py-6">
                        <span className="rounded-xl bg-slate-100 px-3 py-2 text-lg">
                          Grade {user.classLevel ?? user.grade ?? "-"}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-lg">{Number(user.coursesCount ?? 0)} Courses</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <Progress className="h-3 w-36 bg-slate-100" value={progress} />
                          <span className="font-semibold">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <StatusBadge status={normalizeStatus(user)} />
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4 text-slate-600">
                          <Link href={`/user-management/${userId}`} aria-label="Edit user">
                            <Edit3 className="size-5" />
                          </Link>
                          <button
                            aria-label="Delete user"
                            disabled={isDeleting}
                            onClick={() => handleDelete(user)}
                            type="button"
                          >
                            <Trash2 className="size-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!isLoading && !users.length ? (
            <div className="p-12 text-center text-slate-500">
              {isError ? "Could not load users from the API." : "No users found."}
            </div>
          ) : null}
        </AdminCard>
      </AdminShell>
    </ProtectedRoute>
  );
}

function MetricCard({
  icon,
  label,
  meta,
  tone = "blue",
  value,
}: {
  icon: React.ReactNode;
  label: string;
  meta?: string;
  tone?: "blue" | "green" | "warm";
  value: number | string;
}) {
  const tones = {
    blue: "bg-[#d9edf8] text-[#14698d]",
    green: "bg-[#d8f6ea] text-[#1f6f56]",
    warm: "bg-[#f0e7df] text-[#8d6343]",
  };

  return (
    <AdminCard className="p-8">
      <div className="flex items-start justify-between">
        <div className={`grid size-16 place-items-center rounded-xl ${tones[tone]}`}>
          {icon}
        </div>
        {meta ? <span className="font-semibold text-[#1f6f56]">{meta}</span> : null}
      </div>
      <p className="mt-6 font-semibold tracking-wide">{label}</p>
      <p className="mt-3 text-5xl font-bold text-[#14698d]">{value}</p>
    </AdminCard>
  );
}

function FilterSelect({
  children,
  label,
  onChange,
  value,
}: {
  children: React.ReactNode;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label>
      <span className="mb-2 block font-semibold">{label}</span>
      <select
        className="h-14 w-full rounded-xl border border-slate-300 bg-white px-4 text-lg outline-none"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {children}
      </select>
    </label>
  );
}

function Avatar({ user }: { user: ManagedUser }) {
  if (user.avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={user.name ?? "User"} className="size-14 rounded-full object-cover" src={user.avatar} />;
  }

  return (
    <span className="grid size-14 place-items-center rounded-full bg-[#d9edf8] font-bold text-[#14698d]">
      {(user.name ?? "U").slice(0, 2).toUpperCase()}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const active = status === "Active" || status === "Enrolled";

  return (
    <span
      className={`rounded-full px-4 py-1 text-sm font-semibold ${
        active ? "bg-[#a9ebd2] text-[#207055]" : "bg-slate-200 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

function getUserId(user: ManagedUser) {
  return user._id ?? user.id ?? "";
}

function getProgress(user: ManagedUser) {
  return Number(user.progress ?? user.averageProgress ?? 0);
}

function normalizeStatus(user: ManagedUser) {
  const status = String(user.status ?? "active").toLowerCase();

  if (status === "enrolled") return "Enrolled";
  if (status === "inactive") return "Inactive";

  return "Active";
}
