"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { roleRedirectPath } from "@/lib/auth-types";
import { useAppSelector } from "@/lib/hooks";

export function RoleRedirect() {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    router.replace(roleRedirectPath(user?.role));
  }, [router, user?.role]);

  return (
    <main className="grid min-h-screen place-items-center bg-sky-50">
      <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-sky-700 shadow-lg">
        <Loader2 className="size-4 animate-spin" />
        Opening KidClass
      </div>
    </main>
  );
}
