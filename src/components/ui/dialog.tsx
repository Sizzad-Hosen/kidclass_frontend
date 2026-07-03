"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <div className="absolute inset-0" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}

function DialogContent({
  className,
  children,
  onClose,
}: React.ComponentProps<"div"> & { onClose?: () => void }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/20",
        className,
      )}
    >
      {onClose ? (
        <Button
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-full"
          onClick={onClose}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <X className="size-4" />
        </Button>
      ) : null}
      {children}
    </div>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-2xl font-bold tracking-tight text-slate-900", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-slate-600", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-6 flex justify-end gap-3", className)} {...props} />;
}

export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle };
