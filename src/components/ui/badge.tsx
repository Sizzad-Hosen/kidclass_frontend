import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "border-sky-200 bg-sky-100 text-sky-800",
        yellow: "border-yellow-300 bg-yellow-200 text-yellow-900",
        pink: "border-pink-200 bg-pink-100 text-pink-700",
        green: "border-emerald-200 bg-emerald-100 text-emerald-700",
        outline: "border-slate-200 bg-white text-slate-600",
        muted: "border-slate-200 bg-slate-100 text-slate-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
