"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type CallbackPreviewActionsProps = {
  alternateHref: string;
  alternateLabel: string;
  primaryHref: string;
  primaryLabel: string;
};

export function CallbackPreviewActions({
  alternateHref,
  alternateLabel,
  primaryHref,
  primaryLabel,
}: CallbackPreviewActionsProps) {
  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg" className="h-12 rounded-xl px-6">
        <Link href={primaryHref}>
          {primaryLabel}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
      <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-[#ffffff12] bg-[#111113] px-6 text-[#f2eae3] hover:bg-[#17171a] hover:text-[#f2eae3]">
        <Link href={alternateHref}>{alternateLabel}</Link>
      </Button>
    </div>
  );
}