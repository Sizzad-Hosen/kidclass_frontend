import * as React from "react";

import { cn } from "@/lib/utils";

function Progress({
  value = 0,
  className,
  indicatorClassName,
  ...props
}: React.ComponentProps<"div"> & {
  value?: number;
  indicatorClassName?: string;
}) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn("h-3 overflow-hidden rounded-full bg-slate-200", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full bg-sky-600 transition-all",
          indicatorClassName,
        )}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export { Progress };
