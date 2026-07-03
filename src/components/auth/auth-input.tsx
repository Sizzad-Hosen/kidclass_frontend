"use client";

import * as React from "react";
import { Eye, EyeOff, Lock, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type AuthInputProps = React.ComponentProps<typeof Input> & {
  icon: LucideIcon;
};

export function AuthInput({ className, icon: Icon, ...props }: AuthInputProps) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" />
      <Input
        className={cn(
          "h-14 rounded-full border-2 border-slate-200 bg-slate-100/80 pl-12 pr-4 text-base shadow-inner focus-visible:border-sky-400 focus-visible:ring-sky-200",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function PasswordInput({
  className,
  icon = Lock,
  ...props
}: Omit<AuthInputProps, "type"> & { icon?: LucideIcon }) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <AuthInput
        className={cn("pr-12", className)}
        icon={icon}
        type={visible ? "text" : "password"}
        {...props}
      />
      <Button
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-sky-700"
        size="icon"
        type="button"
        variant="ghost"
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
