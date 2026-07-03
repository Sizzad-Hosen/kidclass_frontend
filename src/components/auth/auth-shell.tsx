import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  sideTitle?: string;
  sideSubtitle?: string;
  tone?: "blue" | "pink" | "violet" | "mint";
  compact?: boolean;
};

const toneClass = {
  blue: "bg-sky-50 text-sky-700",
  pink: "bg-rose-50 text-sky-700",
  violet: "bg-violet-50 text-sky-700",
  mint: "bg-emerald-50 text-sky-700",
};

export function AuthShell({
  children,
  title,
  subtitle,
  sideTitle = "EduAdventure",
  sideSubtitle = "Ready for your next learning quest?",
  tone = "blue",
  compact = false,
}: AuthShellProps) {
  return (
    <main
      className={cn(
        "relative flex min-h-screen flex-col overflow-hidden",
        toneClass[tone],
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(#94a3b8_1.2px,transparent_1.2px)] [background-size:42px_42px]" />
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8">
        <Link className="text-3xl font-bold text-sky-700" href="/login">
          KidClass
        </Link>
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <span>Safety First!</span>
          <ShieldCheck className="size-5 text-sky-700" />
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-6 pb-10">
        <Card
          className={cn(
            "grid w-full overflow-hidden rounded-[2rem] border border-sky-100 bg-white/95 p-0 shadow-2xl shadow-sky-900/10",
            compact ? "max-w-xl" : "max-w-6xl lg:grid-cols-2",
          )}
        >
          {!compact && (
            <aside className="relative hidden min-h-[560px] flex-col items-center justify-center bg-sky-600 p-10 text-center text-white lg:flex">
              <span className="absolute left-0 top-0 size-28 rounded-br-full bg-white/20" />
              <span className="absolute bottom-0 right-0 size-36 rounded-tl-full bg-indigo-300/30" />
              <div className="relative grid size-80 place-items-center rounded-3xl bg-white/10 shadow-inner">
                <div className="relative size-64 overflow-hidden rounded-3xl bg-white shadow-2xl">
                  <Image
                    alt="KidClass cartoon learning mascot"
                    className="object-cover"
                    fill
                    priority
                    sizes="256px"
                    src="/kidclass-mascot.png"
                  />
                </div>
                <Sparkles className="absolute right-9 top-8 size-7 text-yellow-300" />
                <Sparkles className="absolute bottom-14 left-8 size-6 text-yellow-300" />
              </div>
              <h2 className="mt-9 text-4xl font-bold">{sideTitle}</h2>
              <p className="mt-4 max-w-sm text-xl leading-8 text-sky-50">
                {sideSubtitle}
              </p>
            </aside>
          )}

          <div className="flex min-h-[560px] flex-col justify-center px-6 py-10 sm:px-10 lg:px-16">
            {compact && (
              <div className="relative mx-auto mb-6 size-32 overflow-hidden rounded-3xl bg-sky-100 shadow-lg ring-4 ring-white">
                <Image
                  alt="KidClass cartoon learning mascot"
                  className="object-cover"
                  fill
                  priority
                  sizes="128px"
                  src="/kidclass-mascot.png"
                />
              </div>
            )}
            <div className="mb-8 text-center lg:text-left">
              <h1 className="text-4xl font-bold text-sky-700">{title}</h1>
              <p className="mt-2 text-lg text-slate-500">{subtitle}</p>
            </div>
            {children}
          </div>
        </Card>
      </section>

      <footer className="relative z-10 pb-8 text-center text-sm text-slate-500">
        <p className="font-semibold text-sky-700">EduAdventure</p>
        <p className="mt-2">2024 EduAdventure - Safe & Fun Learning</p>
      </footer>
    </main>
  );
}
