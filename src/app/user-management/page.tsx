"use client";

import { useDeferredValue, useState, type FormEvent } from "react";
import { ChevronLeft, ChevronRight, Edit3, Loader2, Search, Trash2, UsersRound } from "lucide-react";
import { toast } from "sonner";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminCard, AdminShell } from "@/components/kidclass/admin-shell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  type ManagedUser,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@/redux/features/user-management/userManagementApi";

const PAGE_SIZE = 10;

export default function UserManagementPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<ManagedUser | null>(null);
  const { data, isLoading, isError } = useGetUsersQuery({
    search: deferredSearch || undefined,
    role: role || undefined,
    status: status || undefined,
    page,
    limit: PAGE_SIZE,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingUser) return;

    const userId = getUserId(editingUser);
    if (!userId) return toast.error("Missing user id.");

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const role = String(form.get("role") ?? "student");
    const isActive = form.get("status") === "active";

    if (!name || !email) {
      toast.error("Name and email are required.");
      return;
    }

    try {
      await updateUser({ userId, body: { name, email, role, isActive } }).unwrap();
      setEditingUser(null);
      toast.success("User updated successfully.");
    } catch {
      toast.error("Could not update user.");
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    const userId = getUserId(deletingUser);
    if (!userId) return toast.error("Missing user id.");

    try {
      await deleteUser(userId).unwrap();
      if (users.length === 1 && page > 1) setPage((current) => current - 1);
      setDeletingUser(null);
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
                <input className="h-full min-w-0 flex-1 bg-transparent outline-none" onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name or email..." value={search} />
              </div>
            </label>
            <FilterSelect label="Role" onChange={(value) => { setRole(value); setPage(1); }} value={role}>
              <option value="">All roles</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super admin</option>
            </FilterSelect>
            <FilterSelect label="Status" onChange={(value) => { setStatus(value); setPage(1); }} value={status}>
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
                        <div className="flex items-center gap-3 font-semibold">
                          <Avatar user={user} />
                          <span>{user.name ?? "Unnamed User"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{user.email ?? "—"}</td>
                      <td className="px-6 py-4"><span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-bold capitalize text-sky-700">{String(user.role ?? "unknown").replace("_", " ")}</span></td>
                      <td className="px-6 py-4 text-slate-600">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</td>
                      <td className="px-6 py-4"><StatusBadge active={user.isActive !== false} /></td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3 text-slate-600">
                          <button aria-label={`Edit ${user.name ?? "user"}`} className="rounded-md p-1 transition hover:bg-sky-50 hover:text-[#14698d]" onClick={() => setEditingUser(user)} type="button"><Edit3 className="size-5" /></button>
                          <button aria-label={`Delete ${user.name ?? "user"}`} className="rounded-md p-1 transition hover:bg-red-50 hover:text-red-600" onClick={() => setDeletingUser(user)} type="button"><Trash2 className="size-5" /></button>
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

        <Dialog open={Boolean(editingUser)} onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent className="max-w-lg" onClose={() => setEditingUser(null)}>
            <form key={getUserId(editingUser ?? {})} onSubmit={handleEdit}>
              <DialogHeader>
                <DialogTitle>Edit user</DialogTitle>
                <DialogDescription>Update this user&apos;s account details and access.</DialogDescription>
              </DialogHeader>

              <div className="mt-6 grid gap-4">
                <ModalField label="Name">
                  <Input className="h-11" defaultValue={editingUser?.name ?? ""} name="name" placeholder="Full name" required />
                </ModalField>
                <ModalField label="Email">
                  <Input className="h-11" defaultValue={editingUser?.email ?? ""} name="email" placeholder="Email address" required type="email" />
                </ModalField>
                <ModalField label="Role">
                  <select className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-[#14698d]" defaultValue={String(editingUser?.role ?? "student")} name="role">
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super admin</option>
                  </select>
                </ModalField>
                <ModalField label="Status">
                  <select className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 outline-none focus:border-[#14698d]" defaultValue={editingUser?.isActive === false ? "inactive" : "active"} name="status">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </ModalField>
              </div>

              <DialogFooter>
                <Button disabled={isUpdating} onClick={() => setEditingUser(null)} type="button" variant="outline">Cancel</Button>
                <Button className="bg-[#14698d] hover:bg-[#0d5877]" disabled={isUpdating} type="submit">
                  {isUpdating ? <Loader2 className="animate-spin" /> : null}
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={Boolean(deletingUser)} onOpenChange={(open) => !open && setDeletingUser(null)}>
          <DialogContent onClose={() => setDeletingUser(null)}>
            <DialogHeader>
              <DialogTitle>Delete user?</DialogTitle>
              <DialogDescription>
                This will permanently delete <strong>{deletingUser?.name ?? "this user"}</strong> and cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button disabled={isDeleting} onClick={() => setDeletingUser(null)} type="button" variant="outline">Cancel</Button>
              <Button className="bg-red-600 text-white hover:bg-red-700" disabled={isDeleting} onClick={handleDelete} type="button">
                {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
                Delete user
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminShell>
    </ProtectedRoute>
  );
}

function ModalField({ children, label }: { children: React.ReactNode; label: string }) {
  return <label><span className="mb-2 block text-sm font-bold text-slate-700">{label}</span>{children}</label>;
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
