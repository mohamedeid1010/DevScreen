import * as React from "react";

import { cn } from "@/lib/utils";

type ProgressProps = React.ComponentPropsWithoutRef<"div"> & {
  indicatorClassName?: string;
  indicatorStyle?: React.CSSProperties;
  value: number;
};

function Progress({ className, indicatorClassName, indicatorStyle, value, ...props }: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={clampedValue}
      className={cn("relative h-2 overflow-hidden rounded-full bg-[#ffffff0a]", className)}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-[#e4002b] via-[#ff6568] to-[#f2eae3] transition-[width] duration-700 ease-out",
          indicatorClassName
        )}
        style={{ width: `${clampedValue}%`, ...indicatorStyle }}
      />
    </div>
  );
}

export { Progress };