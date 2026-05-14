import type { ReactNode } from "react";
import Link from "next/link";

export default function CandidateLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* Breadcrumb nav */}
      <div className="flex items-center gap-2 text-sm text-[#6b6670] mb-6">
        <Link href="/candidate" className="hover:text-[#f2eae3] transition">
          Candidate Portal
        </Link>
        <span>/</span>
        <span className="text-[#a8a29e]">Current Page</span>
      </div>
      {children}
    </div>
  );
}
