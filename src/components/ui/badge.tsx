import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-medium tracking-[0.02em] whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default: "border-[#e4002b33] bg-[#e4002b0d] text-[#ff6568]",
        secondary: "border-[#ffffff12] bg-[#111113] text-[#a8a29e]",
        outline: "border-[#ffffff14] bg-transparent text-[#f2eae3]",
        success: "border-[#00bb7f26] bg-[#00bb7f14] text-[#7ef0c8]",
        neutral: "border-[#ffffff12] bg-[#ffffff08] text-[#f2eae3]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type BadgeProps = React.ComponentPropsWithoutRef<"span"> & VariantProps<typeof badgeVariants>;

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
export type { BadgeProps, BadgeVariant };