"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Bell,
  BookOpen,
  ChevronDown,
  ClipboardList,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MenuSquare,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLogout } from "@/redux/features/auth/useLogout";
import { useAppSelector } from "@/redux/hooks";

type AdminShellProps = {
  children: React.ReactNode;
};

const courseChildren = [
  { label: "All Courses", href: "/course-management/courses" },
  { label: "Create Course", href: "/course-management/courses/create" },
  { label: "Milestones", href: "/course-management/milestones" },
  { label: "Modules", href: "/course-management/modules" },
  { label: "Lessons", href: "/course-management/lessons" },
  { label: "Quizzes", href: "/course-management/quizzes" },
];

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "User Management", href: "/user-management", icon: UsersRound },
  {
    label: "Course Management",
    href: "/course-management",
    icon: BookOpen,
    children: courseChildren,
  },
  { label: "Certificate", href: "/certificate", icon: Award },
  { label: "Assignment", href: "/assignment", icon: ClipboardList },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const user = useAppSelector((state) => state.auth.user);
  const { logout, isLoading: isLoggingOut } = useLogout();

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-[#101820]">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-80 flex-col border-r border-slate-200 bg-[#f1f3f6] px-6 py-8 lg:flex">
        <Link className="flex items-center gap-4" href="/dashboard">
          <span className="grid size-14 place-items-center rounded-2xl bg-[#1f7199] text-white shadow-md">
            <GraduationCap className="size-7" />
          </span>
          <span>
            <span className="block text-3xl font-bold leading-8 text-[#0d6386]">
              KidClass
            </span>
            <span className="text-base text-slate-600">Admin Console</span>
          </span>
        </Link>

        <nav className="mt-14 space-y-2">
          {menuItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <div key={item.label}>
                <Link
                  className={cn(
                    "flex min-h-14 items-center gap-4 rounded-r-2xl rounded-l-md px-5 text-lg font-semibold text-slate-700 transition",
                    active &&
                      "bg-[#e5e7eb] text-[#14698d] shadow-[inset_-5px_0_0_#14698d]",
                  )}
                  href={item.href}
                >
                  <Icon className="size-6" />
                  <span className="flex-1">{item.label}</span>
                  {item.children ? <ChevronDown className="size-4" /> : null}
                </Link>
                {item.children && active ? (
                  <div className="ml-10 mt-2 space-y-1 border-l border-slate-300 pl-5">
                    {item.children.map((child) => (
                      <Link
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-white hover:text-[#14698d]",
                          pathname === child.href && "bg-white text-[#14698d]",
                        )}
                        href={child.href}
                        key={child.href}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-300 pt-8">
          <Button
            asChild
            className="h-14 w-full rounded-2xl bg-[#1f7199] text-lg font-bold shadow-lg shadow-sky-900/10 hover:bg-[#155f84]"
          >
            <Link href="/course-management/courses/create">
              <Plus className="size-5" />
              New Course
            </Link>
          </Button>
          <button className="mt-8 flex items-center gap-4 px-4 py-3 text-base font-semibold text-slate-700">
            <HelpCircle className="size-6" />
            Help Center
          </button>
          <button
            className="flex items-center gap-4 px-4 py-3 text-base font-semibold text-red-700"
            disabled={isLoggingOut}
            onClick={logout}
            type="button"
          >
            <LogOut className="size-6" />
            Log Out
          </button>
        </div>
      </aside>

      <div className="lg:pl-80">
        <header className="sticky top-0 z-20 border-b border-slate-300 bg-[#f6f8fb]/95 px-5 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-5">
            <div className="flex h-12 w-full max-w-2xl items-center gap-3 rounded-full bg-[#e8eaed] px-5 text-slate-500 ring-1 ring-transparent focus-within:ring-[#8eb7cb]">
              <Search className="size-5" />
              <input
                className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-slate-500"
                placeholder="Search students, courses, or IDs..."
              />
            </div>

            <div className="flex shrink-0 items-center gap-5">
              <button
                className="relative text-slate-700"
                type="button"
                aria-label="Notifications"
              >
                <Bell className="size-6" />
                <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-red-600" />
              </button>
              <Link
                className="text-slate-700"
                aria-label="Settings"
                href="/settings"
              >
                <Settings className="size-7" />
              </Link>
              <span className="hidden h-11 w-px bg-slate-300 md:block" />
              <div className="hidden text-right md:block">
                <p className="font-bold">{user?.name ?? "Admin User"}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {user?.role?.replace("_", " ") ?? "Super Admin"}
                </p>
              </div>
              <div className="grid size-12 place-items-center rounded-full border-4 border-[#9fcbe2] bg-white text-[#14698d]">
                {user?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={user.name ?? "Admin user"}
                    className="size-full rounded-full object-cover"
                    src={user.avatar}
                  />
                ) : (
                  <UserRound className="size-6" />
                )}
              </div>
            </div>
          </div>
        </header>

        <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          {menuItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-slate-600",
                  active && "bg-[#14698d] text-white",
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mx-auto max-w-[1500px] px-5 py-8">{children}</div>
      </div>
    </main>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl bg-white shadow-sm shadow-slate-200",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function AdminComingSoon({ title }: { title: string }) {
  return (
    <AdminShell>
      <div className="grid min-h-[65vh] place-items-center">
        <AdminCard className="max-w-xl p-10 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#d9edf8] text-[#14698d]">
            <MenuSquare className="size-8" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-[#0d6386]">{title}</h1>
          <p className="mt-3 text-slate-500">
            This menu is ready in the admin navigation. The CRUD screen can be
            connected here next.
          </p>
          <Button asChild className="mt-6 rounded-xl bg-[#1f7199] px-6">
            <Link href="/dashboard">
              <ShieldCheck className="size-4" />
              Back to Dashboard
            </Link>
          </Button>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
