import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-[28px] border border-[#ffffff12] bg-[#101013]/88 text-card-foreground shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-2 p-6", className)} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-xl font-semibold tracking-tight text-[#f2eae3]", className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm leading-6 text-[#a8a29e]", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="card-content" className={cn("p-6 pt-0", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="card-footer" className={cn("flex items-center p-6 pt-0", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };