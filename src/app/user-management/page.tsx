"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Edit3, Search, Trash2, UsersRound } from "lucide-react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminCard, AdminShell } from "@/components/kidclass/admin-shell";
import { Button } from "@/components/ui/button";
import {
  type ManagedUser,
  useDeleteUserMutation,
  useGetUsersQuery,
} from "@/redux/features/user-management/userManagementApi";

const PAGE_SIZE = 10;

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetUsersQuery({
    search: deferredSearch || undefined,
    role: role || undefined,
    status: status || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE));

  useEffect(() => setPage(1), [deferredSearch, role, status]);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const handleDelete = async (user: ManagedUser) => {
    const userId = getUserId(user);
    if (!userId) return toast.error("Missing user id.");
    if (!window.confirm(`Delete ${user.name ?? "this user"}?`)) return;

    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully.");
    } catch {
      toast.error("Could not delete user.");
    }
  };

  const firstResult = total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const lastResult = total ? Math.min(page * PAGE_SIZE, total) : 0;

  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <AdminShell>
        <div>
          <h1 className="text-4xl font-bold text-[#0d6386]">User Management</h1>
          <p className="mt-2 text-lg text-slate-600">View and manage existing Kidclass accounts.</p>
        </div>

        <AdminCard className="mt-8 overflow-hidden">
          <div className="grid gap-4 border-b border-slate-200 p-5 md:grid-cols-[1fr_220px_220px]">
            <label>
              <span className="mb-2 block text-sm font-bold">Search users</span>
              <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-300 px-4">
                <Search className="size-5 text-slate-400" />
                <input className="h-full min-w-0 flex-1 bg-transparent outline-none" onChange={(event) => setSearch(event.target.value)} placeholder="Name or email..." value={search} />
              </div>
            </label>
            <FilterSelect label="Role" onChange={setRole} value={role}>
              <option value="">All roles</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super admin</option>
            </FilterSelect>
            <FilterSelect label="Status" onChange={setStatus} value={status}>
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </FilterSelect>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const userId = getUserId(user);
                  return (
                    <tr className="border-t border-slate-100" key={userId || user.email}>
                      <td className="px-6 py-4">
                        <Link className="flex items-center gap-3 font-semibold hover:text-[#14698d]" href={`/user-management/${userId}`}>
                          <Avatar user={user} />
                          <span>{user.name ?? "Unnamed User"}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{user.email ?? "—"}</td>
                      <td className="px-6 py-4"><span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-bold capitalize text-sky-700">{String(user.role ?? "unknown").replace("_", " ")}</span></td>
                      <td className="px-6 py-4 text-slate-600">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                      <td className="px-6 py-4"><StatusBadge active={user.isActive !== false} /></td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3 text-slate-600">
                          <Link aria-label="Edit user" href={`/user-management/${userId}`}><Edit3 className="size-5" /></Link>
                          <button aria-label="Delete user" disabled={isDeleting} onClick={() => handleDelete(user)} type="button"><Trash2 className="size-5" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {isLoading ? <div className="p-10 text-center text-slate-500">Loading users...</div> : null}
          {!isLoading && (isError || !users.length) ? (
            <div className="grid min-h-48 place-items-center p-8 text-center text-slate-500">
              <div><UsersRound className="mx-auto size-10 text-slate-300" /><p className="mt-3">{isError ? "Could not load users from the API." : "No users match these filters."}</p></div>
            </div>
          ) : null}

          {!isError && total > 0 ? (
            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">Showing {firstResult}–{lastResult} of {total} users · 10 per page</p>
              <div className="flex items-center gap-2">
                <Button disabled={page <= 1 || isLoading} onClick={() => setPage((value) => value - 1)} size="sm" variant="outline"><ChevronLeft /> Previous</Button>
                <span className="px-3 text-sm font-bold">Page {page} of {totalPages}</span>
                <Button disabled={page >= totalPages || isLoading} onClick={() => setPage((value) => value + 1)} size="sm" variant="outline">Next <ChevronRight /></Button>
              </div>
            </div>
          ) : null}
        </AdminCard>
      </AdminShell>
    </ProtectedRoute>
  );
}

function FilterSelect({ children, label, onChange, value }: { children: React.ReactNode; label: string; onChange: (value: string) => void; value: string }) {
  return <label><span className="mb-2 block text-sm font-bold">{label}</span><select className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 outline-none" onChange={(event) => onChange(event.target.value)} value={value}>{children}</select></label>;
}

function Avatar({ user }: { user: ManagedUser }) {
  if (user.avatar) return <img alt={user.name ?? "User"} className="size-10 rounded-full object-cover" src={user.avatar} />; // eslint-disable-line @next/next/no-img-element
  return <span className="grid size-10 place-items-center rounded-full bg-sky-100 font-bold text-sky-700">{(user.name ?? "U").slice(0, 2).toUpperCase()}</span>;
}

function StatusBadge({ active }: { active: boolean }) {
  return <span className={active ? "rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700" : "rounded-full bg-slate-200 px-3 py-1 text-sm font-bold text-slate-600"}>{active ? "Active" : "Inactive"}</span>;
}

function getUserId(user: ManagedUser) {
  return user._id ?? user.id ?? "";
}
